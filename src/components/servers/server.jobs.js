import React from 'react'
import { Button, Modal, Table } from 'antd'
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

  handleCancel () {
    this.props.onCanceled && this.props.onCanceled()
  }

  render () {

    return (
      <Modal
        title={t('clusters.servers.jobs', this.props.server)}
        wrapClassName="vertical-center-modal"
        onCancel={() => this.handleCancel()}
        closable={true}
        visible={true}
        width={680}
        footer={
          <Button type="ghost" size="large" onClick={() => this.handleCancel()}>{t('close')}</Button>
        }>

        <Table
          columns={[
            {title: t('id'), dataIndex: 'id', key: 'id'},
            {title: t('jobs.class'), dataIndex: 'clazz', key: 'clazz', render: text => <code>{text}</code>},
            {
              title: t('status'), key: 'status', render (text, record) {
                const statusDesc = record.status === 1 ? t('enable') : t('disable')
                const statusClass = record.status === 1 ? 'text-success' : 'text-danger'
                return (
                  <span className={statusClass}>{statusDesc}</span>
                )
              }
            }
          ]}
          pagination={false}
          dataSource={this.state.jobs}
          loading={this.state.loading}
          size="middle"
          rowKey="id"/>

      </Modal>
    )
  }
}

export default ServerJobs
