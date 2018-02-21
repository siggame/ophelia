import { action, observable, reaction } from 'mobx'

import RequestLayer from '../modules/requestLayer'


export class SubmissionStore {
  @observable submissions = []
  @observable isLoading = false
  @observable isStale = false
  @observable lastUpdated = null
  @observable uploadError = ''

  constructor () {
    this.requestLayer = new RequestLayer()
    this.loadSubmissions = this.loadSubmissions.bind(this)
    this.makeDataStale = this.makeDataStale.bind(this)

    // This function is a MobX fellow that watches for whenever the 'isStale' variable changes.
    // Whenever it does, it goes ahead and sees if the data needs to be updated.
    reaction(
      () => this.isStale,
      () => {
      if (this.isStale) {
        this.loadSubmissions()
      }
    })
  }

  @action loadSubmissions () {
    this.isLoading = true
    // Actual HTTP request is abstracted to requestLayer object
    this.requestLayer.fetchSubmissions().then(action("loadSubmissions-callback", (data) => {
      this.submissions = []
      data.forEach((json) => {
        this.createSubmissionFromServer(json)
      })
      this.isLoading = false
      this.isStale = false
      this.lastUpdated = new Date()
    })).catch((err) => {
      // TODO: Actual logging
      console.log('Error loading submissions', err.message)
    })
  }

  @action uploadSubmission (file) {
    return new Promise((resolve, reject) => {
      this.uploadError = ''
      this.isLoading = true
      this.requestLayer.uploadSubmissions(file).then((response) => {
        this.isLoading = false
        this.makeDataStale()
        return resolve()
      }).catch((err) => {
        this.isLoading = false
        this.makeDataStale()
        // Give a generic error message
        this.uploadError = 'Uh oh! Something went wrong. Please wait a bit and try again. If the problem persists, contact the SIG-Game devs at siggame@mst.edu.'
      })
    })
  }

  @action makeDataStale () {
    this.isStale = true
  }

  /**
   * Used to remove all submission from the store. Mainly useful when a user logs out.
   * 
   * @memberof SubmissionStore
   */
  @action resetSubmissionData () {
    this.submissions = []
    this.lastUpdated = null
  }

  @action createSubmissionFromServer (json) {
    let submission = new Submission(json.version, json.status, json.submission_url, json.log_url, json.image_name, json.created_at,
                                    json.updated_at)
    this.submissions.push(submission)
  }
}

export class Submission {
  @observable status
  @observable logUrl
  @observable updatedAt
  
  constructor (version, status, submissionUrl, logUrl, imageName, createdAt, updatedAt) {
    this.version = version
    this.status = status
    this.submissionUrl = submissionUrl
    this.logUrl = logUrl
    this.imageName = imageName
    this.createdAt = createdAt
    this.updatedAt = updatedAt
  }
}

export default new SubmissionStore()