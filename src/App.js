import { BrowserRouter, Route, Switch } from 'react-router-dom'
import DefaultLayout from './layouts/layout'
import NotFound from './components/common/404'
import React, { Component } from 'react'
import { hot } from 'react-hot-loader'

import './app.less'

class App extends Component {
  render () {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/" component={DefaultLayout}/>
          <Route component={NotFound}/>
        </Switch>
      </BrowserRouter>
    )
  }
}

export default hot(module)(App)
