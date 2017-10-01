'use strict'

const db = require('../db/init')
const sha256 = require('js-sha256')
const validator = require('validator')
const _ = require('lodash')

function editProfile (teamId, formData) {
  return new Promise((resolve, reject) => {
    let errorObject = {}

    db.teams.getTeam(teamId).then((data) => {
      let teamData = data[0]

      if (teamData.password !== sha256(formData.currentPass)) {
        errorObject.incorrectPass = true
      } else if (teamData.contact_email === formData.primaryEmail && teamData.contact_name === formData.primaryName &&
                formData.newPass === '' && formData.newPassConfirm === '') {
        resolve('noChanges')
      }

            // TODO: Sanitizing
      if (!validator.isEmail(formData.primaryEmail)) {
        errorObject.invalidEmail = true
      }
      if (sha256(formData.newPass) !== sha256(formData.newPassConfirm)) {
        errorObject.passwordMismatch = true
      }

      if (_.size(errorObject) !== 0) {
        reject(errorObject)
      } else {
                // Using undefined here makes knex ignore that field - if we passed a blank string,
                // it would still edit the DB.
        let updateData = {
          id: teamId,
          contact_name: formData.primaryName ? formData.primaryName : undefined,
          contact_email: formData.primaryEmail ? formData.primaryEmail : undefined,
          password: formData.newPass ? sha256(formData.newPass) : undefined
        }

        db.teams.editTeam(updateData).then((res) => {
          resolve(res)
        }).catch((err) => {
          reject(err)
        })
      }
    }).catch((err) => {
      reject(err)
    })
  })
}

module.exports = {
  editProfile: editProfile
}
