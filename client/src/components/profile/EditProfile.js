import React from 'react'
import { withFormik } from 'formik'
import PropTypes from 'prop-types'
import { Loader } from 'react-overlay-loader'

const MAX_BIO_LENGTH = 512

@withFormik({
  // Transform outer props into form values
  mapPropsToValues: ({ username, teamName, bio, primaryContactEmail, primaryContactName }) => ({
    username,
    teamName,
    bio,
    primaryContactEmail,
    primaryContactName
  }),
  // Add a custom validation function (this can be async too!)
  // TODO: Add function in users modules to add validation
  validate: (values, props) => {
    const errors = {}
    console.log('formik validate')
    return errors
  },
  // Submission handler
  handleSubmit: (
    values,
    {
      props,
      setSubmitting,
      setErrors
      /* setValues, setStatus, and other goodies */
    }
  ) => {
    console.log('formik submit')
    setSubmitting(false)
  }
})
export default class EditProfile extends React.Component {
  render() {
    const { values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting, imageUrl } = this.props

    return (
      <div className="container">
        <Loader loading={isSubmitting} fullPage />
        <div className="row">
          <div className="col-md-4 col-md-offset-4">
            <div className="page-header">
              <h1>Profile</h1>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-4">
            <div className="thumbnail">
              <img src={imageUrl} alt="..." />
            </div>
          </div>
          <div className="col-md-8">
            <form onSubmit={handleSubmit}>
              <div className={`form-group ${errors.username && 'has-error'}`}>
                <label htmlFor="username">Username</label>
                <input type="text" className="form-control" name="username" placeholder="Username" autoComplete="off" value={values.username} onChange={handleChange} />
                {errors.username && <span className="help-block">{errors.username}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="teamName">Team Name</label>
                <input type="text" className="form-control" name="teamName" placeholder="Team Name" autoComplete="off" value={values.teamName} onChange={handleChange} />
              </div>
              <div className={`form-group ${errors.primaryContactEmail && 'has-error'}`}>
                <label htmlFor="primaryContactEmail">Primary Contact Email</label>
                <input
                  type="text"
                  className="form-control"
                  name="primaryContactEmail"
                  placeholder="Primary Contact Email"
                  autoComplete="off"
                  value={values.primaryContactEmail}
                  onChange={handleChange}
                />
                {errors.primaryContactEmail && <span className="help-block">{errors.primaryContactEmail}</span>}
              </div>
              <div className={`form-group ${errors.primaryContactName && 'has-error'}`}>
                <label htmlFor="primaryContactName">Primary Contact Name</label>
                <input type="text" className="form-control" name="primaryContactName" placeholder="Primary Contact Name" autoComplete="off" value={values.primaryContactName} onChange={handleChange} />
                {errors.primaryContactName && <span className="help-block">{errors.primaryContactName}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="bio">{`Bio (${values.bio.length}/${MAX_BIO_LENGTH})`}</label>
                <textarea
                  className="form-control"
                  name="bio"
                  placeholder="Tell other competitors why they should fear you..."
                  rows="5"
                  maxLength={MAX_BIO_LENGTH}
                  value={values.bio}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <button type="submit" className="btn btn-default btn-block btn-lg" disabled={isSubmitting}>
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }
}
