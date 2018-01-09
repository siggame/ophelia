import React from 'react'
import Feed from 'rss-to-json'
import BlogPost from './BlogPost'

 export default class BlogPostContainer extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            data: ''
        }
    }

    componentDidMount () {
        Feed.load('https://www.medium.com/feed/@siggame/', (err, rss) => {
            if (err) {
                console.error(err)
                this.setState({
                    data: 'error, yo'
                })
            } else {
                this.setState({
                    data: rss.items,
                })
            }
        })
    }

    render () {
        console.log(this.state.data)
        return (

            <div>

                <BlogPost data={this.state.data} />
            </div>
        )
    }
}