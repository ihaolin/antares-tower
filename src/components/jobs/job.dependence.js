import { Button, Input, Modal, Popconfirm, Table } from 'antd'
import React from 'react'
import JobOperate from './job.operate'
import { Ajax } from '../common/ajax'
import t from '../../i18n'

class JobDependence extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      loading: false,
      jobs: [],
      pageSize: 10,
      pagination: {},
      addingJobIds: null,
      operatingJob: null,
      deletingJobId: null
    }
  }

  loadNextJobs (pageNo) {

    const job = this.props.job

    const self = this

    self.setState({loading: true})

    const pageSize = this.state.pageSize
    Ajax.get('/api/jobs/' + job.id + '/next', {pageNo, pageSize}, function (jsonData) {
      var d = jsonData
      self.setState({
        loading: false,
        jobs: d.data,
        pagination: {
          current: pageNo,
          total: d.total,
          pageSize: pageSize,
          showTotal: (total) => t('total', total)
        }
      })
    })
  }

  componentDidMount () {
    this.loadNextJobs(1)
  }

  onRefreshNextJobs () {
    this.loadNextJobs(this.state.pagination.current)
  }

  handleCancel () {
    this.props.onCanceled && this.props.onCanceled()
  }

  onPageChange (p) {
    this.loadNextJobs(p.current)
  }

  nextJobIdsChange (e) {
    this.setState({
      addingJobIds: e.target.value
    })
  }

  onAdd () {

    const self = this
    const jobId = this.props.job.id
    const addingJobIds = this.state.addingJobIds

    Ajax.post('/api/jobs/' + jobId + '/next', {nextJobId: addingJobIds}, function (addResp) {
      if (addResp) {
        self.setState({
          addingJobIds: null
        })
        self.onRefreshNextJobs()
      }
    })
  }

  onDelete (nextJob) {

    const curJob = this.props.job

    this.setState({
      operatingJob: curJob,
      deletingJobId: nextJob.id
    })

  }

  onDeleteSubmitted () {
    this.setState({operatingJob: null, deletingJobId: null})
    this.onRefreshNextJobs()
  }

  onDeleteCanceled () {
    this.setState({operatingJob: null, deletingJobId: null})
  }

  onDeleteFailed () {
    this.setState({operatingJob: null, deletingJobId: null})
    this.onRefreshNextJobs()
  }

  render () {

    const self = this
    const job = this.props.job
    const title = t('jobs.dependence', job.clazz)

    // next job ids tip
    const addingJobIds = this.state.addingJobIds
    // the deleting next job
    const operatingJob = this.state.operatingJob
    const deletingJobId = this.state.deletingJobId

    return (
      <Modal
        title={title}
        wrapClassName="vertical-center-modal"
        visible={true}
        onCancel={() => this.handleCancel()}
        closable={true}
        width={680}
        footer={
          <Button key="back" type="ghost" size="large" onClick={() => this.handleCancel()}>{t('close')}</Button>
        }>

        <div className="oplist">

          <Input.Search
            placeholder={t('input') + t('jobs.next.ids')}
            enterButton={t('add')}
            style={{width: 250}}
            onChange={(e) => this.nextJobIdsChange(e)}
            onSearch={() => this.onAdd()}
            value={addingJobIds}/>

        </div>
        <Table
          className="mt-3"
          columns={[
            {title: t('id'), dataIndex: 'id', key: 'id', width: '12%'},
            {title: t('apps.name'), dataIndex: 'appName', key: 'appName', width: '18%'},
            {
              title: t('jobs.class'), dataIndex: 'jobClass', key: 'jobClass', width: '55%',
              render: text => <code>{text}</code>
            },
            {
              title: t('operation'), key: 'operation', render (text, record) {
                return (
                  <a onClick={() => self.onDelete(record)}>{t('delete')}</a>
                )
              }
            }
          ]}
          pagination={this.state.pagination}
          dataSource={this.state.jobs}
          loading={this.state.loading}
          onChange={(p) => this.onPageChange(p)}
          rowKey="id"
          size="middle"
        />

        {operatingJob === null ? null :
          <JobOperate
            job={operatingJob}
            operate="del_next"
            suffix={deletingJobId}
            onSubmitted={() => this.onDeleteSubmitted()}
            onCanceled={() => this.onDeleteCanceled()}
            onFailed={() => this.onDeleteFailed()}/>
        }
      </Modal>
    )
  }
}

export default JobDependence