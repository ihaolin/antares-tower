import { Button, Modal, Table } from 'antd'
import React from 'react'
import { Ajax } from '../common/ajax'
import t from '../../i18n'

class ServerJobs extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      loading: false,
      jobs: []
    }
  }

  loadJobs () {

    const server = this.props.server

    const self = this
    self.setState({loading: true})

    Ajax.get('/api/servers/jobs', {server: server}, function (jobs) {
      self.setState({
        loading: false,
        jobs: jobs
      })
    })
  }

  componentDidMount () {
    this.loadJobs()
  }

  onRefresh () {
    this.loadJobs()
  }

  handleCancel () {
    this.props.onCanceled && this.props.onCanceled()
  }

  render () {

    const self = this
    const server = this.props.server

    return (
      <Modal
        title={t('clusters.servers.jobs', server)}
        wrapClassName="vertical-center-modal"
        visible={true}
        onCancel={() => this.handleCancel()}
        closable={true}
        footer={
          <Button key="back" type="ghost" size="large"
                  onClick={() => this.handleCancel()}>{t('close')}</Button>
        }>

        <Table
          columns={[
            {title: t('id'), dataIndex: 'id', key: 'id', width: '10%'},
            {title: t('jobs.class'), dataIndex: 'clazz', key: 'clazz', width: '50%',
              render: text => <code>{text}</code>
            },
            {
              title: t('status'), key: 'status', width: '8%',
              render (text, record) {
                const statusDesc = record.status === 1 ? t('enable') : t('disable')
                const statusClass = record.status === 1 ? 'status-enbale' : 'status-disable'
                return (
                  <span className={statusClass}>{statusDesc}</span>
                )
              }
            }
          ]}
          dataSource={this.state.jobs}
          loading={this.state.loading}
          pagination={false}
          mr-2={{y: 250}}
          rowKey="id"
          size="middle"/>

      </Modal>
    )
  }
}

ServerJobs.propTypes = {}

export default ServerJobs