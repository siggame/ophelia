import React from 'react'
import _ from 'lodash'


export default class BlogPost extends React.Component {
    render () {
        let postArray = []
        let i= 1
        const data = this.props.data

        console.log(data)

        _.forEach(data, (post) => {
            postArray.push(

                <h3 class = "postLink"key = {i}> <a href={post.link}> {post.title} </a></h3>

            )
            i++
        })

        const containerStyle = {
            width: '100%',
            textAlign: 'center',
            backgroundColor: '#E6E6E6',


        }
        const postStyle = {
            padding: '5px 5px 5px 5px'

        }



        return (

            <div style = {containerStyle}>


                <h2>Recent Blog Posts: </h2>
                <div id ="posts" style={postStyle}>
                    {postArray}

                </div>
                <h4>click to visit</h4>


            </div>

        )
    }
}