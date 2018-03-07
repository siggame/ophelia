import React from 'react'
import { Formik } from 'formik'
import PropTypes from 'prop-types'
import { Loader } from 'react-overlay-loader'
import each from 'lodash/each'
import axios from 'axios'
import { inject, observer } from 'mobx-react'
import Yup from 'yup'

import UploadImage from './UploadImage'

const MAX_BIO_LENGTH = 512

/**
 * Check if two Yup fields match because Yup doesn't support this natively support this nicely
 * @param {*} ref Reference to the field that is being compared
 * @param {string} msg Custom error message to display
 */
function equalTo (ref, msg) {
  return this.test({
    name: 'equalTo',
    exclusive: false,
    message: msg || `${ref.path} must be the same as ${ref}`,
    params: {
      reference: ref.path
    },
    test: function (value) {
      return value === this.resolve(ref)
    }
  })
}

Yup.addMethod(Yup.string, 'equalTo', equalTo)

/*
 * Note:
 * Formik doesn't do anything with the image. Only using Formik has a convenient way to
 * update the image source attribute for the profile image.
*/
@inject('authStore')
@observer
export default class EditProfile extends React.Component {
  static propTypes = {
    username: PropTypes.string.isRequired,
    bio: PropTypes.string,
    email: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    image: PropTypes.string,
    teamName: PropTypes.string
  }

  static defaultProps = {
    bio: '',
    image: '',
    teamName: ''
  }

  render () {
    const { username, teamName, image, email, bio, name, authStore } = this.props

    return (
      <Formik
        initialValues={{
          username,
          name,
          email,
          bio,
          image,
          password: '',
          newPassword: '',
          confirmPassword: ''
        }}
        validationSchema={Yup.object().shape({
          name: Yup.string().required('Required'),
          email: Yup.string().email('Invalid email').required('Required'),
          username: Yup.string().required('Required'),
          bio: Yup.string().trim(),
          password: Yup.string().required('Required'),
          // New password is only validated when the user inputs something. If it's blank, assume the user doesn't want to change their password which is okay.
          newPassword: Yup.string().notRequired().min(6, 'Password must be at least 6 characters').matches(
            /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9!@#$%^&*]*$/,
            'Invalid password'
          ),
          // Confirm password only validated if there is something in newPassword
          confirmPassword: Yup.string().when('newPassword', (newPassword, schema) => (
            newPassword && newPassword
              ? schema.equalTo(Yup.ref('newPassword'), 'Passwords do not match').required('Required')
              : schema.notRequired()
          ))
        })}
        onSubmit={async (values, { setSubmitting, setErrors, resetForm }) => {
          try {
            await axios.put(`${process.env.REACT_APP_API_URL}/users/${teamName}/`, {
              oldPassword: values.password,
              editData: {
                email: values.email,
                name: values.name,
                password: values.newPassword
              }
            }, {
              headers: {
                Authorization: `Bearer ${authStore.token}`
              }
            })
            resetForm()
          } catch (err) {
            // TODO: Set any errors in the form
            console.error(err)
          }
          setSubmitting(false)
        }}
      >
        {({ values, touched, errors, handleChange, handleBlur, handleSubmit, isSubmitting, setFieldValue }) => {
          const formattedErrors = {}

          // TODO: Move this into its own file
          each(errors, (value, key) => {
            formattedErrors[key] = <span className='help-block'>{touched[key] && errors[key] && value}</span>
          })

          return (
            <div className='container'>
              <Loader loading={isSubmitting} fullPage />
              <div className='row'>
                <div className='col-md-4 col-md-offset-4'>
                  <div className='page-header'>
                    <h1>Profile</h1>
                  </div>
                </div>
              </div>
              <div className='row'>
                <div className='col-md-4'>
                  <div className='thumbnail'>
                    <img src={values.image} alt='...' />
                  </div>
                  <UploadImage onChange={setFieldValue} name='image' />
                </div>
                <div className='col-md-8'>
                  <form onSubmit={handleSubmit}>
                    <div className={`form-group${touched.username && errors.username ? ' has-error' : ''}`}>
                      <label htmlFor='username'>Username</label>
                      <input type='text' className='form-control' name='username' placeholder='Username' autoComplete='off' value={values.username} onChange={handleChange} onBlur={handleBlur} />
                      {formattedErrors.username}
                    </div>
                    <div className={`form-group${touched.email && errors.email ? ' has-error' : ''}`}>
                      <label htmlFor='email'>Primary Contact Email</label>
                      <input type='text' className='form-control' name='email' placeholder='Primary Contact Email' autoComplete='off' value={values.email} onChange={handleChange} onBlur={handleBlur} />
                      {formattedErrors.email}
                    </div>
                    <div className={`form-group${touched.name && errors.name ? ' has-error' : ''}`}>
                      <label htmlFor='name'>Primary Contact Name</label>
                      <input type='text' className='form-control' name='name' placeholder='Primary Contact Name' autoComplete='off' value={values.name} onChange={handleChange} onBlur={handleBlur} />
                      {formattedErrors.name}
                    </div>
                    <div className={`form-group${touched.bio && errors.bio ? ' has-error' : ''}`}>
                      <label htmlFor='bio'>{`Bio (${values.bio.length}/${MAX_BIO_LENGTH})`}</label>
                      <textarea
                        className='form-control'
                        name='bio'
                        placeholder='Tell other competitors why they should fear you...'
                        rows='5'
                        maxLength={MAX_BIO_LENGTH}
                        value={values.bio}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      {formattedErrors.bio}
                    </div>
                    <div className={`form-group${touched.password && errors.password ? ' has-error' : ''}`}>
                      <label htmlFor='name'>Current Password</label>
                      <input type='password' className='form-control' name='password' placeholder='Current Password' value={values.password} onChange={handleChange} onBlur={handleBlur} />
                      {formattedErrors.password}
                    </div>
                    <div className={`form-group${touched.newPassword && errors.newPassword ? ' has-error' : ''}`}>
                      <label htmlFor='name'>New Password</label>
                      <input type='password' className='form-control' name='newPassword' placeholder='New Password' value={values.newPassword} onChange={handleChange} onBlur={handleBlur} />
                      {formattedErrors.newPassword}
                    </div>
                    <div className={`form-group${touched.confirmPassword && errors.confirmPassword ? ' has-error' : ''}`}>
                      <label htmlFor='name'>Confirm New Password</label>
                      <input type='password' className='form-control' name='confirmPassword' placeholder='Confirm New Password' value={values.confirmPassword} onChange={handleChange} onBlur={handleBlur} />
                      {formattedErrors.confirmPassword}
                    </div>
                    <div className='form-group'>
                      <button type='submit' className='btn btn-default btn-block btn-lg' disabled={values.oldPassword === '' || isSubmitting}>
                        Save
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )
        }}
      </Formik>
    )
  }
}
