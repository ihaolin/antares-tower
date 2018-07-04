import { Button, Form, Modal, Progress, Table, Tabs } from 'antd'
import React from 'react'
import { Ajax } from '../common/ajax'
import t from '../common/i18n'

import './job.instance.detail.less'

const TabPane = Tabs.TabPane
const FormItem = Form.Item

export default class JobInstanceDetail extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      detail: {},
      loadingShards: false,
      shards: [],
      pageSize: 10,
      firstLoad: false,
      intervalId: null,
      pagination: {}
    }
  }

  loadDetail () {

    // const jobId = this.props.job.id;

    const requestUri = this.props.uri
    const firstLoad = this.state.firstLoad
    const self = this

    Ajax.get(requestUri, {}, function (instanceDetail) {

      self.setState({
        detail: instanceDetail,
        firstLoad: true
      })

      if (!firstLoad) {

        // first load the shards
        self.loadShards(1)

        if (instanceDetail.finishPercent < 100) {
          // load detail interval
          const interId = setInterval(self.loadDetail, 5000)
          self.setState({
            intervalId: interId
          })
        }
      }

      // clear interval if finished
      if (instanceDetail.finishPercent === 100) {
        // clearInterval(self.state.intervalId);
        self.stopLoadDetail()
      }

    }, function (err) {
      // stop load detail
      self.stopLoadDetail()
      // callback parent failed
      self.props.onFailed && self.props.onFailed()
    })
  }

  stopLoadDetail () {
    if (this.state.intervalId) {
      clearInterval(this.state.intervalId)
    }
  }

  loadShards (pageNo) {

    const instanceId = this.state.detail.instanceId
    if (!instanceId) {
      return
    }

    const self = this

    self.setState({loadingShards: true})

    const pageSize = this.state.pageSize
    Ajax.get('/api/jobs/instances/' + instanceId + '/shards', {
      pageNo: pageNo,
      pageSize: pageSize
    }, function (jsonData) {
      var d = jsonData
      self.setState({
        loadingShards: false,
        shards: d.data,
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
    this.loadDetail()
  }

  onRefreshShards () {
    const curPage = this.state.pagination.current || 1
    if (curPage) {
      this.loadShards(curPage)
    }
  }

  handleCancel () {

    if (this.state.intervalId) {
      clearInterval(this.state.intervalId)
    }

    this.props.onCanceled && this.props.onCanceled()
  }

  onShardsPageChange (p) {
    this.loadShards(p.current)
  }

  renderShardExtra (shard) {

    return (
      <table className="shard-extra-table">
        <tbody>
        <tr>
          <td className="item-name">{t('jobs.instance.shard.pull.client')}</td>
          <td>{shard.pullClient}</td>
        </tr>
        <tr>
          <td className="item-name">{t('jobs.instance.shard.finish.client')}</td>
          <td>{shard.finishClient}</td>
        </tr>
        <tr>
          <td className="item-name">{t('jobs.instance.shard.pull.count')}</td>
          <td>{shard.pullCount}</td>
        </tr>
        <tr>
          <td className="item-name">{t('jobs.instance.shard.pull.time')}</td>
          <td>{shard.pullTime}</td>
        </tr>
        <tr>
          <td className="item-name">{t('start.time')}</td>
          <td>{shard.startTime}</td>
        </tr>
        <tr>
          <td className="item-name">{t('end.time')}</td>
          <td>{shard.endTime}</td>
        </tr>
        {shard.status === 3 ? (
          <tr>
            <td className="item-name">{t('error.info')}</td>
            <td>{shard.cause}</td>
          </tr>
        ) : null}
        </tbody>
      </table>
    )
  }

  render () {

    const detail = this.state.detail

    const formItemLayout = {
      wrapperCol: {span: 14},
      labelCol: {span: 6}
    }

    return (
      <Modal
        title={t('jobs.instance.detail')}
        wrapClassName="vertical-center-modal"
        onCancel={() => this.handleCancel()}
        closable={true}
        visible={true}
        width={580}
        footer={<Button key="back" type="ghost" size="large" onClick={() => this.handleCancel()}>{t('close')}</Button>}>

        <Tabs defaultActiveKey="1" type="card">
          <TabPane tab={t('jobs.instance.running.info')} key="1">
            <Form>
              <FormItem className="monitor-item" {...formItemLayout} label={t('jobs.instance.finish.percent')}>
                <Progress width={80} status={detail.finishPercent < 100 ? 'active' : 'normal'} percent={detail.finishPercent}/>
              </FormItem>

              <FormItem className="monitor-item" {...formItemLayout} label={t('status')}>
                <span>{detail.statusDesc} </span>
              </FormItem>

              <FormItem className="monitor-item" {...formItemLayout} label={t('start.time')}>
                <span>{detail.startTime} </span>
              </FormItem>

              <FormItem className="monitor-item" {...formItemLayout} label={t('end.time')}>
                <span>{detail.endTime} </span>
              </FormItem>

              <FormItem className="monitor-item" {...formItemLayout} label={t('jobs.instance.total.shard.count')}>
                <span>{detail.totalShardCount} </span>
              </FormItem>

              <FormItem className="monitor-item" {...formItemLayout} label={t('jobs.instance.wait.shard.count')}>
                <span>{detail.waitShardCount} </span>
              </FormItem>

              <FormItem className="monitor-item" {...formItemLayout} label={t('jobs.instance.running.shard.count')}>
                <span>{detail.runningShardCount} </span>
              </FormItem>

              <FormItem className="monitor-item" {...formItemLayout} label={t('jobs.instance.success.shard.count')}>
                <span>{detail.successShardCount} </span>
              </FormItem>

              <FormItem className="monitor-item" {...formItemLayout} label={t('jobs.instance.failed.shard.count')}>
                <span>{detail.failedShardCount} </span>
              </FormItem>

            </Form>
          </TabPane>
          <TabPane tab={t('jobs.instance.shards.info')} key="2">
            <Button type="primary" onClick={() => this.onRefreshShards()} size="small">{t('refresh')}</Button>
            <Table
              className="mt-2"
              columns={[
                {title: t('id'), dataIndex: 'id', key: 'id', width: '15%'},
                {title: t('jobs.instance.shard.item'), dataIndex: 'item', key: 'item', width: '15%'},
                {title: t('jobs.instance.shard.param'), dataIndex: 'param', key: 'param', width: '45%'},
                {title: t('status'), dataIndex: 'statusDesc', key: 'statusDesc'}
              ]}
              dataSource={this.state.shards}
              rowKey="id"
              loading={this.state.loadingShards}
              pagination={this.state.pagination}

              expandedRowRender={(record) => this.renderShardExtra(record)}
              onChange={() => this.onShardsPageChange()}
              size="middle"/>
          </TabPane>
        </Tabs>

      </Modal>
    )
  }
}
