import React, { Component } from 'react';
import '../containers/App.css';
import BlogPosts from "./BlogPosts";

export default class LandingPage extends Component {

  render() {

    return (
      <div className="grid index-grid">
          <div className="jumbotron-grid jumbotron">
              <h1>MegaminerAI</h1>
              <p>Some sample text to see how this looks.</p>
          </div>
          <div className="blog-posts-grid">
              <h3>Visit our Blog at <a href="https://medium.com/siggame">Medium</a>.</h3>

              < BlogPosts/>
          </div>
          <div className="status-embed-grid">
              <h3>View current server status <a href="http://status.megaminerai.com">here</a>.</h3>
          </div>

      </div>
    );
  }
}
