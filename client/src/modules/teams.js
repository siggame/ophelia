import axios from 'axios'
import validate from 'validate.js'

export function validateTeamCreation(teamname, id) {
    return new Promise((resolve, reject) => {
        let formData = {
            teamname: teamname,
        }
        const constraints = {
            teamname: {
                presence: true
            }
        }

        let errors = validate(formData, constraints);
        if(errors) {
            return reject(errors)
        } else {
            axios.post(process.env.REACT_APP_API_URL + '/teams', {
                name: teamname,
                teamCaptainId: id
            }).then((data) => {
                return resolve(data)
            }).catch((err) => {
                let errorMessage = err.response.data.message
                if(typeof err.response.data.message === 'undefined') {
                    var regex = /(<pre>Error:).+?(?=<br>)/
                    var message = err.response.data
                    try {
                        var found = message.match(regex)
                        errorMessage = found[0]
                    } catch(err) {
                        console.log(err, "\nDefaulting to something went wrong message!")
                    }
                }
                if(errorMessage === 'Team name is already in use.') {
                    return reject({
                        teamname: [errorMessage]
                    })
                } else if(errorMessage === 'User is already captain of a team.') {
                    return reject({
                        teamname: [errorMessage]
                    })
                } else if(errorMessage === "<pre>Error: User is already on a team.") {
                    return reject({
                        teamname: ["Error: User is already on a team!"]
                    })
                }
                else {
                    return reject({
                        teamname: ['Something went wrong! Please contact a SIG-Game dev, and try again in a little bit.']
                    })
                }
            })
        }
    })
}