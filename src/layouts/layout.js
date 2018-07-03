import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import { Layout } from 'antd'
import LayoutHeader from './layout-header'
import LayoutFooter from './layout-footer'
import Servers from '../components/servers/servers'
import Clients from '../components/clients/clients'
import JobInstances from '../components/jobs/job.instances'
import JobControls from '../components/jobs/job.controls'
import JobConfigs from '../components/jobs/job.configs'
import Apps from '../components/apps/apps'

const Content = Layout

export default class DefaultLayout extends Component {
  render () {
    return (
      <Layout style={{height: '100%'}}>
        <LayoutHeader/>
        <Content style={{padding: '0 50px'}}>
          <Switch>
            <Route path="/job-instances" component={JobInstances} />
            <Route path="/job-controls" component={JobControls} />
            <Route path="/job-configs" component={JobConfigs} />
            <Route path="/servers" component={Servers}/>
            <Route path="/clients" component={Clients}/>
            <Route component={Apps}/>
          </Switch>
        </Content>
        <LayoutFooter/>
      </Layout>
    )
  }
}
