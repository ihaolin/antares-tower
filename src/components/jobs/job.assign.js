import { Button, message, Modal, Table } from 'antd'
import { Ajax } from '../common/ajax'
import t from '../../i18n'
import React from 'react'

class JobAssign extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      loading: false,
      submitting: false,
      assigns: [],
      assignIps: []
    }
  }

  componentDidMount () {

    const job = this.props.job

    const self = this

    self.setState({loading: true})

    Ajax.get('/api/jobs/' + job.id + '/assigns', {}, function (assignDatas) {

      var tmpAssignIps = []
      if (assignDatas) {
        assignDatas.forEach(function (assignData) {
          if (assignData.assign) {
            tmpAssignIps.push(assignData.ip)
          }
        })
      }

      console.log(tmpAssignIps)

      self.setState({
        loading: false,
        assigns: assignDatas,
        assignIps: tmpAssignIps
      })
    })
  }

  handleCancel () {
    this.props.onCanceled && this.props.onCanceled()
  }

  handleSubmit () {

    const self = this

    // start submiting
    self.setState({submitting: true})

    var assignIpsStr = self.state.assignIps.length > 0 ? self.state.assignIps.join(',') : '-1'

    // submit 
    Ajax.post('/api/jobs/' + self.props.job.id + '/assigns', {'assignIps': assignIpsStr}, function (jsonData) {

      // stop submiting when post finished
      self.setState({submitting: false})

      // success tip
      message.success(t('operate.success'))

    }, function (err) {
      message.error(err)
    })
  }

  renderAssignProc (record) {
    if (!record.processes) {
      return null
    }

    var processes = []
    for (var i = 0; i < record.processes.length; i++) {
      processes.push(<li>{record.processes[i]}</li>)
    }

    return (
      <ul style={{marginLeft: 60}}>{processes}</ul>
    )
  }

  render () {

    const self = this
    const job = this.props.job
    const assigns = this.state.assigns

    const title = t('jobs.assign', job.clazz)

    return (
      <Modal
        title={title}
        wrapClassName="vertical-center-modal"
        visible={true}
        onCancel={() => this.handleCancel()}
        closable={true}
        footer={[
          <Button key="back" type="ghost" size="large" onClick={() => this.handleCancel()}>{t('cancel')}</Button>,
          <Button key="submit" type="primary" size="large" loading={this.state.submitting} onClick={() => this.handleSubmit()}>
            {t('submit')}
          </Button>
        ]}>

        <Table
          columns={[
            {title: t('ip'), dataIndex: 'ip', key: 'ip', width: '40%'},
            {title: t('jobs.assign.inst'), render: (text, record) => <span>{record.processes.length}</span>}
          ]}
          rowSelection={{
            onChange: function (selectedRowKeys, selectedRows) {
              self.setState({
                assignIps: selectedRowKeys
              })
            },
            getCheckboxProps: function (record) {
              return {
                defaultChecked: record.assign
              }
            }
          }}
          expandedRowRender={(record) => self.renderAssignProc(record)}
          dataSource={assigns}
          pagination={false}
          loading={this.state.loading}

          rowKey="ip"
          size="middle"
        />

      </Modal>
    )
  }
}

export default JobAssign