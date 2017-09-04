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
    axios.get('/api/test')
        .then((res) => {
        console.log(res);
            this.setState(res.data);
        })
        .catch(function (err) {
            console.log(err);
        });
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
          <p>
              test: {this.state.test}
          </p>
      </div>
    );
  }
}

export default App;
