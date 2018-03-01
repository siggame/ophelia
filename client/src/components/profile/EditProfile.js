import React from 'react'
import { Formik } from 'formik'
import PropTypes from 'prop-types'
import { Loader } from 'react-overlay-loader'
import each from 'lodash/each'

import { validateProfileUpdate } from '../../modules/users'
import UploadImage from './UploadImage'

const MAX_BIO_LENGTH = 512

/*
 * Note:
 * Formik doesn't do anything with the image. Only using Formik has a convenient way to
 * update the image source attribute for the profile image.
*/
const EditProfile = (props) => (
  <Formik
    initialValues={{
      ...props
    }}
    validate={values => validateProfileUpdate(values)}
    onSubmit={(values, { setSubmitting, setErrors }) => {
      console.log('formik submit', values)
      setSubmitting(false)
    }}
  >
    {({ values, touched, errors = {}, handleChange, handleBlur, handleSubmit, isSubmitting, setFieldValue }) => {
      const formattedErrors = {}

      // TODO: Move this into its own file
      each(errors, (values, key) => {
        formattedErrors[key] = values.map((value, i) => (
          <span key={`error-${key}-${i}`} className='help-block'>
            {touched[key] && errors[key] && value}
          </span>
        ))
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
                <div className='form-group'>
                  <button type='submit' className='btn btn-default btn-block btn-lg' disabled={isSubmitting}>
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

EditProfile.propTypes = {
  username: PropTypes.string.isRequired,
  bio: PropTypes.string,
  email: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  image: PropTypes.string
}

EditProfile.defaultProps = {
  bio: '',
  image: ''
}

export default EditProfile
