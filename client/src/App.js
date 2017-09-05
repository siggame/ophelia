import React, { Component } from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props) {
      super(props);

      this.state = {
          test:""
      }
  }

  componentDidMount() {
    // axios.get('/api/test')
    //     .then((res) => {
    //     console.log(res);
    //         this.setState(res.data);
    //     })
    //     .catch(function (err) {
    //         console.log(err);
    //     });
  }

  render() {
    return (
      <div className="grid index-grid">
          <div className="jumbotron-grid jumbotron">
              <h1>MegaminerAI</h1>
              <p>Some sample text to see how this looks.</p>
          </div>
          <div className="blog-posts-grid">
              <h3>Visit our Blog at <a href="https://medium.com/siggame">Medium</a>.</h3>
          </div>
          <div className="status-embed-grid">
              <h3>View current server status <a href="http://status.megaminerai.com">here</a>.</h3>
          </div>

      </div>
    );
  }
}

export default App;
