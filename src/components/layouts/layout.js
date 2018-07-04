import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import { Layout } from 'antd'
import LayoutHeader from './layout-header'
import LayoutFooter from './layout-footer'
import Servers from '../servers/servers'
import Clients from '../clients/clients'
import JobInstances from '../jobs/job.instances'
import JobControls from '../jobs/job.controls'
import JobConfigs from '../jobs/job.configs'
import Apps from '../apps/apps'

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
