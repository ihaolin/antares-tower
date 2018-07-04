import { Button, Divider, Dropdown, Icon, Input, Menu, Switch, Table } from 'antd'
import React from 'react'
import { Ajax } from '../common/ajax'
import BreadTitle from '../common/bread-title'
import AppSelect from '.././apps/app-select'
import JobEdit from './job.edit'
import JobOperate from './job.operate'
import JobDependence from './job.dependence'
import JobAssign from './job.assign'
import t from '../../i18n'

const Search = Input.Search

export default class JobConfigs extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      dependencingJob: null,
      operatingJob: null,
      assigningJob: null,
      editingJob: null,
      searchJobClass: '',
      pagination: false,
      pageSize: 10,
      loading: false,
      appId: null,
      operate: '',
      jobs: []
    }
  }

  loadJobs (appId, pageNo, jobClass) {

    jobClass = jobClass || ''

    const self = this
    self.setState({loading: true})

    const pageSize = this.state.pageSize

    Ajax.get('/api/jobs', {appId, jobClass, pageNo, pageSize}, function (jsonData) {
      var d = jsonData
      self.setState({
        loading: false,
        jobs: d.data.map(j => {
          j.operating = false
          return j
        }),
        appId: appId,
        searchJobClass: jobClass,
        pagination: {
          current: pageNo,
          total: d.total,
          pageSize: pageSize,
          showTotal: (total) => t('total', total)
        }
      })
    })
  }

  onPageChange (p) {
    this.loadJobs(this.state.appId, p.current)
  }

  onAdd () {
    this.setState({editingJob: {appId: this.state.appId}})
  }

  onRefresh () {
    const {appId, pagination, searchJobClass} = this.state
    this.loadJobs(appId, pagination.current, searchJobClass)
  }

  onUpdate (job) {
    this.setState({editingJob: job})
  }

  onEditSubmitted () {
    this.setState({editingJob: null})
    this.onRefresh()
  }

  onEditCanceled () {
    this.setState({editingJob: null})
  }

  onEditFailed () {
    this.setState({editingJob: null})
    this.onRefresh()
  }

  onDelete (job) {
    this.setState({operatingJob: job, operate: 'delete'})
  }

  onEnable (job) {
    this.setState({operatingJob: job, operate: 'enable'})
  }

  onDisable (job) {
    this.setState({operatingJob: job, operate: 'disable'})
  }

  onOperateSubmitted () {
    this.setState({operatingJob: null, operate: ''})
    this.onRefresh()
  }

  onOperateCanceled () {
    this.setState({operatingJob: null, operate: ''})
  }

  onOperateFailed () {
    this.setState({operatingJob: null, operate: ''})
    this.onRefresh()
  }

  onSearch (jobClass) {
    this.loadJobs(this.state.appId, 1, jobClass)
  }

  onAppChange (appId) {
    this.loadJobs(appId, 1, this.state.searchJobClass)
  }

  onDependenceConfig (job) {
    this.setState({dependencingJob: job})
  }

  onDependenceSubmitted () {
    this.setState({dependencingJob: null})
  }

  onDependenceCanceled () {
    this.setState({dependencingJob: null})
  }

  onAssign (job) {
    this.setState({assigningJob: job})
  }

  onAssignSubmitted () {
    this.setState({assigningJob: null})
  }

  onAssignCanceled () {
    this.setState({assigningJob: null})
  }

  onStateChange (checked, job, idx) {
    var self = this
    var jobs = self.state.jobs
    job = jobs[idx]
    job.operating = true
    self.setState({jobs})
    Ajax.post('/api/jobs/' + job.id + (checked ? '/enable' : '/disable'), {}, function (response) {
      job.operating = false
      self.setState({jobs})
      if (response) {
        job.status = checked ? 1 : 0
        self.setState({jobs})
      }
    })
  }

  render () {

    const self = this

    const appId = this.state.appId
    const editingJob = this.state.editingJob
    const operatingJob = this.state.operatingJob
    const dependencingJob = this.state.dependencingJob
    const assigningJob = this.state.assigningJob
    const operate = this.state.operate

    return (
      <div>
        <BreadTitle firstCode="jobs.mgr" secondCode="jobs.configs"/>

        <div className="oplist">

          <AppSelect onChange={(val) => this.onAppChange(val)}/>

          <Search
            className="ml-3"
            style={{width: 250}}
            placeholder={t('input.classname')}
            enterButton={true}
            onSearch={(val) => this.onSearch(val)}
            disabled={appId === null}/>

          <Button className="ml-3" type="primary" onClick={() => this.onAdd()} disabled={appId === null}>
            {t('add')}
          </Button>
          <Button className="ml-3" type="primary" onClick={() => this.onRefresh()}>
            {t('refresh')}
          </Button>
        </div>

        <Table
          className="mt-3"
          columns={[
            {title: t('id'), dataIndex: 'id', key: 'id', className: 'keep-word'},
            {title: t('jobs.class'), dataIndex: 'clazz', key: 'clazz', render: (text) => <code>{text}</code>},
            {title: t('jobs.cron'), dataIndex: 'cron', key: 'cron', render: (text) => <code>{text}</code>},
            {title: t('desc'), dataIndex: 'desc', key: 'desc'},
            {
              title: t('status'), key: 'status',
              render (text, job, idx) {
                const statusDesc = job.status === 1 ? t('enable') : t('disable')
                const statusClass = job.status === 1 ? 'text-success' : 'text-danger'
                return (
                  <span>
                    <Switch
                      checkedChildren={<Icon type="check"/>}
                      unCheckedChildren={<Icon type="cross"/>}
                      checked={job.status === 1}
                      loading={job.operating}
                      title={t('switch')}
                      onClick={(c) => self.onStateChange(c, job, idx)}/>
                    <span className={'align-middle ' + statusClass}> {statusDesc}</span>
                  </span>
                )
              }
            },
            {
              title: t('operation'), key: 'operation',
              render (text, job) {

                let menu = (
                  <Menu>
                    <Menu.Item key="1" onClick={() => self.onAssign(job)}><Icon type="pushpin-o"/> {t('jobs.assigns')}</Menu.Item>
                    <Menu.Item key="2" onClick={() => self.onDependenceConfig(job)}><Icon type="share-alt"/> {t('jobs.dependence.config')}</Menu.Item>
                    <Menu.Divider/>
                    <Menu.Item key="3" onClick={() => self.onDelete(job)}><Icon type="delete"/> {t('delete')}</Menu.Item>
                  </Menu>
                )

                return (
                  <div>
                    <a onClick={() => self.onUpdate(job)}><Icon type="form"/> {t('update')}</a>
                    <Divider type="vertical"/>
                    <Dropdown overlay={menu} placement="bottomRight" trigger={['click']}>
                      <a>{t('more')} <Icon type="down"/></a>
                    </Dropdown>
                  </div>
                )
              }
            }
          ]}
          dataSource={this.state.jobs}
          loading={this.state.loading}
          pagination={this.state.pagination}
          rowKey="id"
          onChange={(p) => this.onPageChange(p)}/>

        {editingJob === null ? null :
          <JobEdit job={editingJob}
                   onSubmitted={() => this.onEditSubmitted()}
                   onCanceled={() => this.onEditCanceled()}
                   onFailed={() => this.onEditFailed()}/>}

        {operatingJob === null ? null :
          <JobOperate job={operatingJob}
                      operate={operate}
                      onSubmitted={() => this.onOperateSubmitted()}
                      onCanceled={() => this.onOperateCanceled()}
                      onFailed={() => this.onOperateFailed()}/>}

        {dependencingJob === null ? null :
          <JobDependence job={dependencingJob}
                         onSubmitted={() => this.onDependenceSubmitted()}
                         onCanceled={() => this.onDependenceCanceled()}
                         onFailed={() => this.onDependenceFailed()}/>}

        {assigningJob === null ? null :
          <JobAssign job={assigningJob}
                     onSubmitted={() => this.onAssignSubmitted()}
                     onCanceled={() => this.onAssignCanceled()}
                     onFailed={() => this.onAssignFailed()}/>}

      </div>
    )
  }
}
