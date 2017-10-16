                    // function getSubmissionByTeamName (teamName) {
                    //   return new Promise((resolve, reject) => {
                    //     if (teamName === null || typeof teamName === 'undefined') {
                    //       reject(new Error('TeamName is null or undefined'))
                    //     }
                    //     knex.select('*')
                    //       .from('submissions')
                    //       .joinRaw('natural full join teams', function () {
                    //         this.on('teams.id', '=', 'submissions.team_id')
                    //           .onIn('teams.name', teamName)
                    //       })
                    //       .then((res) => {
                    //         for (let row of res) {
                    //           delete row['password']
                    //         }
                    //         return resolve(res)
                    //       }).catch((err) => {
                    //         return reject(err)
                    //       })
                    //   })
                    // }



function getGamesByTeam () {
  return new Promise((resolve, reject) => {
    if ()
  })
}
