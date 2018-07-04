import React from 'react'
import { Button, Input, Table } from 'antd'
import { Ajax } from '../common/ajax'
import BreadTitle from '../common/bread-title'
import AppSelect from '../apps/app-select'
import JobInstanceDetail from './job.instance.detail'
import t from '../../i18n'

const Search = Input.Search

class JobInstances extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      loading: false,
      instances: [],
      pagination: false,
      pageSize: 10,
      appId: null,
      jobClass: '',
      detailInstance: null
    }
  }

  loadJobInstances (appId, pageNo, jobClass) {

    jobClass = jobClass || ''

    const self = this
    self.setState({loading: true})

    const pageSize = this.state.pageSize

    Ajax.get('/api/jobs/instances', {appId, jobClass, pageNo, pageSize}, function (jsonData) {
      var d = jsonData
      self.setState({
        loading: false,
        instances: d.data,
        appId: appId,
        jobClass: jobClass,
        pagination: {
          pageSize: pageSize,
          current: pageNo,
          total: d.total,
          showTotal: total => t('total', total)
        }
      })
    }, function (err) {
      self.setState({loading: false})
    })
  }

  onPageChange (p) {
    this.loadJobInstances(this.state.appId, p.current, this.state.jobClass)
  }

  onRefresh () {
    const {appId, pagination, jobClass} = this.state
    this.loadJobInstances(appId, pagination.current, jobClass)
  }

  onDetail (instance) {
    this.setState({detailInstance: instance})
  }

  onDetailCanceled () {
    this.setState({detailInstance: null})
  }

  onDetailFailed () {
    this.setState({detailInstance: null})
  }

  onJobClassChange (e) {
    this.setState({
      jobClass: e.target.value.trim()
    })
  }

  onSearch (jobClass) {
    this.loadJobInstances(this.state.appId, 1, jobClass)
  }

  onAppChange (appId) {
    this.setState({appId: appId})
  }

  renderJobInstanceError (instance) {
    if (instance.status === 4) {
      return (
        <p>{instance.cause}</p>
      )
    }
    return null
  }

  render () {

    const self = this

    const appId = this.state.appId
    const jobClass = this.state.jobClass
    const detailInstance = this.state.detailInstance
    const disableLoad = (!appId || !jobClass)

    return (
      <div>

        <BreadTitle firstCode="jobs.mgr" secondCode="jobs.instances"/>

        <AppSelect onChange={(val) => this.onAppChange(val)}/>

        <Search className="ml-3"
                style={{width: 250}}
                enterButton={true}
                placeholder={t('input.classname')}
                onSearch={(val) => this.onSearch(val)}
                onChange={(e) => this.onJobClassChange(e)}
                disabled={!this.state.appId}/>

        <Button className="ml-3"
                type="primary"
                onClick={() => this.onRefresh()}
                disabled={disableLoad}>
          {t('refresh')}
        </Button>

        <Table
          className="mt-3"
          columns={[
            {title: t('id'), dataIndex: 'id', key: 'id', width: '10%'},
            {title: t('table.start.time'), dataIndex: 'startTime', key: 'startTime', width: '15%'},
            {title: t('table.end.time'), dataIndex: 'endTime', key: 'endTime', width: '15%'},
            {title: t('table.cost.time'), dataIndex: 'costTime', key: 'costTime', width: '15%'},
            {title: t('table.trigger.type'), dataIndex: 'triggerTypeDesc', key: 'triggerTypeDesc', width: '10%'},
            {title: t('status'), dataIndex: 'statusDesc', key: 'statusDesc', width: '10%'},
            {
              title: t('operation'), key: 'operation', render (text, record) {
                return (
                  <a onClick={() => self.onDetail(record)}>
                    {t('jobs.instance.detail')}
                  </a>
                )
              }
            }
          ]}
          dataSource={this.state.instances}
          loading={this.state.loading}
          pagination={this.state.pagination}
          expandedRowRender={(record) => self.renderJobInstanceError(record)}
          onChange={(p) => this.onPageChange(p)}
          rowKey="id"
        />

        {detailInstance === null ? null :
          <JobInstanceDetail uri={`/api/jobs/instances/${detailInstance.id}`}
                             onCanceled={() => this.onDetailCanceled()}
                             onFailed={() => this.onDetailFailed()}/>}

      </div>
    )
  }
}

JobInstances.propTypes = {}

export default JobInstances