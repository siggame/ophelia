import { distanceInWords } from 'date-fns'
import { inject, observer } from 'mobx-react'
import React from 'react'
import ReactPaginate from 'react-paginate'

import ButtonRefresh from './ButtonRefresh'
import SubmissionBadge from './SubmissionBadge'

class SubmissionList extends React.Component {
  render () {
    let submissions = this.props.submissions
    let submissionsList
    if (submissions) {
      if (submissions.length === 0) {
        submissionsList = (
          <div className='text-center' style={{ paddingTop: '5vh', height: '130px', minWidth: '320px' }} >
            You haven't uploaded any submissions yet.
          </div>
        )
      } else {
        submissionsList = submissions.map((data) => {
          return <SubmissionBadge {...data} key={data.id} />
        })
      }
    }

    return (
      <div>
        {submissionsList}
      </div>
    )
  }
}

@inject('submissionStore')
@observer
export default class Submissions extends React.Component {
  constructor (props) {
    super(props)

    // TODO: Make maxPerPage a prop
    this.state = {
      currentPage: 1
    }
    this.handlePageClick = this.handlePageClick.bind(this)
    this.handleRefresh = this.handleRefresh.bind(this)
  }

  handlePageClick (data) {
    // So this library we're using (React Paginate) thinks an awesome idea to 0-index page numbers.
    // In order to combat that, we have to add one, and type out this comment so someone doesn't get confused.
    let newPage = data.selected + 1
    // Grab our submissions for the next page
    this.setState({
      currentPage: newPage
    })
    // TODO: Submissions don't have pagintation support as of yet
    this.props.submissionStore.loadSubmissions()
  }

  handleRefresh () {
    // Since refreshing always sends the page back to 1, need to handle that here.
    this.setState({
      currentPage: 1
    })
    this.props.submissionStore.makeDataStale()
  }


  render() {
    let paginateSection
    if (this.props.submissionStore.submissions.length > 0) {
      paginateSection = (
        <div>
        <div className='col-xs-2' />
        <div className='text-center col-xs-8'>
          <ReactPaginate
            containerClassName='pagination text-center'
            subContainerClassName='pagination pages'
            activeClassName='active'
            breakClassName='break'
            breakLabel={<a>...</a>}
            previousLabel='<<'
            nextLabel='>>'
            pageCount = {5}
            pageRangeDisplayed={2}
            marginPagesDisplayed={1}
            forcePage={this.state.currentPage-1}
            onPageChange={this.handlePageClick}
          />
        </div>
        <div className='col-xs-2' />
      </div>
      )
    }
    return (
      <div>
        <div className='row' style={{ margin: '0 10px 0 10px', display: 'flex' }} >
          <div className='col-xs-4'><h2>Submissions</h2></div>
          <div className='col-xs-6' />
          <div className='col-xs-2' style={{ padding: '3vh 0 4px 0'}}><ButtonRefresh buttonOnClick={this.handleRefresh} /></div>
        </div>
        <div className='row' style={{ margin: '0 10px 0 10px' }}>
          <div className='col-xs-2 text-center' >Version</div>
          <div className='col-xs-8 text-center' >Status</div>
          <div className='col-xs-2 text-center' >Build Log</div>
        </div>
        <SubmissionList submissions={this.props.submissionStore.submissions}/>
        {paginateSection}
      </div>
    )
  }
}
