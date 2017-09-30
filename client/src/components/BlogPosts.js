import React from 'react'

export default class BlogPosts extends React.Component {
    render () {
        let posts = []
        this.props.data.forEach((post) => {
            posts.push(
                <h1>
                    {post.title}
                </h1>
            )
        })
        return (

            <div>
                {posts}
            </div>
        )
    }
}