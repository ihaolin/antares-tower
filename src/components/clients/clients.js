import React from 'react'
import { Button, Table } from 'antd'
import AppSelect from '../apps/app-select'
import BreadTitle from '../common/bread-title'
import { Ajax } from '../common/ajax'
import t from '../../i18n'

import './clients.less'

class Clients extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: false,
      clients: [],
      appId: ''
    }
  }

  loadClients (appId) {

    const self = this
    self.setState({loading: true})

    Ajax.get('/api/clients', {appId: appId}, function (clientsData) {
      self.setState({
        loading: false,
        clients: clientsData,
        appId: appId
      })
    })

  }

  onRefresh () {
    this.loadClients(this.state.appId)
  }

  render () {

    const self = this

    return (
      <div>

        <BreadTitle firstCode="clusters.mgr" secondCode="clusters.clients"/>

        <AppSelect onChange={(value) => this.loadClients(value)}/>
        <Button type="primary" onClick={() => this.onRefresh()} className="ml-3">
          {t('refresh')}
        </Button>

        <Table
          className="mt-3"
          columns={[
            {title: t('clients.addr'), dataIndex: 'addr', key: 'addr'},
            {
              title: t('operation'), key: 'operation', render (text, record) {
                return (
                  <span></span>
                )
              }
            }
          ]}
          dataSource={this.state.clients}
          loading={this.state.loading}
          pagination={false}
          rowKey="addr"
        />
      </div>
    )
  }
}

export default Clients