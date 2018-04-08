import React from 'react'
import { Formik } from 'formik'
import { Loader } from 'react-overlay-loader'
import each from 'lodash/each'
import { inject, observer } from 'mobx-react'
import Yup from 'yup'

/**
 * Check if two Yup fields match (Yup doesn't currently have a native way to do this nicely)
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

@inject('authStore')
@observer
export default class EditProfile extends React.Component {
  state = {
    type: '',
    message: '',
    showMessage: false
  }

  handleMessageClose = () => {
    this.setState({
      message: '',
      type: '',
      showMessage: false
    })
  }
  render () {
    const { authStore } = this.props
    const { user } = authStore
    const { message, type, showMessage } = this.state

    return (
      <Formik
        initialValues={{
          name: user.contactName,
          email: user.contactEmail,
          password: '',
          newPassword: '',
          confirmPassword: ''
        }}
        validateOnBlur={false}
        validateOnChange={false}
        validationSchema={Yup.object().shape({
          name: Yup.string().required('Required'),
          email: Yup.string().email('Invalid email').required('Required'),
          password: Yup.string().required('Required'),
          // New password is only validated when the user inputs something. If it's blank, assume the user doesn't want to change their password which is okay.
          newPassword: Yup.string().notRequired().min(6, 'Password must be at least 6 characters').matches(
            /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9!@#$%^&*]*$/,
            'Invalid password'
          ),
          // Confirm password only validated if there is something in newPassword
          confirmPassword: Yup.string().when('newPassword', (newPassword, schema) => (
            newPassword ? schema.equalTo(Yup.ref('newPassword'), 'Passwords do not match').required('Required') : schema.notRequired()
          ))
        })}
        onSubmit={async (values, { setSubmitting, setErrors, resetForm }) => {
          await authStore.updateUser(values.password, values.email, values.name, values.newPassword)
          if (authStore.errors) {
            this.setState({
              type: 'danger',
              message: authStore.errors.message,
              showMessage: true
            })
          } else {
            this.setState({
              type: 'success',
              message: 'Updated user profile succesfully!',
              showMessage: true
            })
            resetForm({
              ...values,
              password: '',
              newPassword: '',
              confirmPassword: ''
            })
          }

          authStore.clearErrors()
          setSubmitting(false)
        }}
      >
        {({ values, touched, errors, handleChange, handleBlur, handleSubmit, isSubmitting, setFieldValue }) => {
          const formattedErrors = {}

          each(errors, (value, key) => {
            formattedErrors[key] = <span className='help-block'>{touched[key] && errors[key] && value}</span>
          })

          return (
            <div className='row'>
              <Loader loading={isSubmitting} fullPage />
              <div className='row'>
                <div className='col-md-4 col-md-offset-4'>
                  <div className='page-header'>
                    <h1>{this.props.authStore.username}'s Profile</h1>
                  </div>
                </div>
              </div>
              <div className='row'>
                <div className='col-md-6 col-md-offset-3'>
                  {
                    showMessage && <div className={`alert alert-${type} alert-dismissible`} role='alert'>
                      <button type='button' className='close' onClick={this.handleMessageClose} aria-label='Close'><span aria-hidden='true'>&times;</span></button>
                      {message}
                    </div>
                  }
                  <form onSubmit={handleSubmit}>
                    <div className={`form-group${touched.email && errors.email ? ' has-error' : ''}`}>
                      <label htmlFor='email'>Primary Contact Email*</label>
                      <input type='text' className='form-control' name='email' placeholder='Primary Contact Email' autoComplete='off' value={values.email} onChange={handleChange} onBlur={handleBlur} />
                      {formattedErrors.email}
                    </div>
                    <div className={`form-group${touched.name && errors.name ? ' has-error' : ''}`}>
                      <label htmlFor='name'>Primary Contact Name*</label>
                      <input type='text' className='form-control' name='name' placeholder='Primary Contact Name' autoComplete='off' value={values.name} onChange={handleChange} onBlur={handleBlur} />
                      {formattedErrors.name}
                    </div>
                    <div className={`form-group${touched.password && errors.password ? ' has-error' : ''}`}>
                      <label htmlFor='name'>Current Password*</label>
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
