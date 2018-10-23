import axios from 'axios'
import validate from 'validate.js'
import { rejects } from 'assert';
import { constants } from 'zlib';

export function validateInvite(teamName, username) {
    return new Promise((resolve, reject) => {
        let formData = {
            teamName: teamName,
            username: username
        }
        const constraints = {
            teamName: {
                presence: true
            },
            username: {
                presence: true
            }
        }

        let errors = validate(formData, constraints);
        if(errors) {
            console.log(errors)
            if(errors.teamName){
                return reject("You must be on a team to invite someone!")
            }
            return reject(errors.teamName)
        } else {
            axios.post(`${process.env.REACT_APP_API_URL}/invites/`, {
                teamName, username
            }).then((data) => {
                return resolve(data)
            }).catch((err) => {
                let errorMessage = err.response.data.message
                return errorMessage;
            })
        }
    })
}