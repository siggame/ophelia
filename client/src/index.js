import React from 'react'
import ReactDOM from 'react-dom'
import { Router } from 'react-router-dom'
import createBrowserHistory from 'history/createBrowserHistory'
import { Provider } from 'mobx-react'

// import './main.css'
import App from './App'
import registerServiceWorker from './registerServiceWorker'
import stores from './stores'

export const history = createBrowserHistory()

ReactDOM.render(
  <Provider {...stores}>
    <Router history={history}>
      <App />
    </Router>
  </Provider>,
  document.getElementById('root'))
registerServiceWorker()
