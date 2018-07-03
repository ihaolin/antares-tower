import { BrowserRouter, Route, Switch } from 'react-router-dom'
import DefaultLayout from './layouts/layout'
import NotFound from './components/common/404'
import React, { Component } from 'react'

import './app.less'

export default class App extends Component {
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
