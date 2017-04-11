import React, {PropTypes } from 'react';
import { Table, Button, Modal, Tabs, Progress, Form } from 'antd';
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;

import styles from './main.less';
import {I18n} from '../../common/i18n/main';
import I18nText from '../../common/i18n_text/main';
import {Ajax} from '../../common/ajax/main';
import SearchInput from '../../common/search_input/main';
import AppSelect from '../../apps/app_select/main'; 
import JobOperate from '../job_operate/main';


const JobInstanceDetail = React.createClass({
  
  getInitialState() {
    return {
      detail: {},
      loadingShards: false,
      shards: [],
      pageSize: 10,
      firstLoad: false,
      intervalId: null,
      pagination: {}
    };
  },

  loadDetail(){
  
    // const jobId = this.props.job.id;
    
    const requestUri = this.props.uri;
    const firstLoad = this.state.firstLoad;
    const self = this;

    Ajax.get(requestUri, {}, function(instanceDetail){

        self.setState({
          detail: instanceDetail,
          firstLoad: true
        });


        if(!firstLoad){
          
          // first load the shards
          self.loadShards(1);

          if (instanceDetail.finishPercent < 100){
            // load detail interval
            const interId = setInterval(self.loadDetail, 5000);
            self.setState({
              intervalId: interId
            });
          }
        }

        // clear interval if finished
        if(instanceDetail.finishPercent == 100){
          // clearInterval(self.state.intervalId);
          self.stopLoadDetail();
        }

    }, function(err){

        // stop load detail
        self.stopLoadDetail();

        // callback parent failed
        (self.props.onFailed && self.props.onFailed());
    });
  },

  stopLoadDetail(){
    if(this.state.intervalId){
      clearInterval(this.state.intervalId);
    }
  },

  loadShards(pageNo){

    const instanceId = this.state.detail.instanceId;
    if(!instanceId){
      return;
    }

    const self = this;

    self.setState({ loadingShards: true });

    const pageSize = this.state.pageSize;
    Ajax.get('/api/jobs/instances/' + instanceId + '/shards', {pageNo: pageNo, pageSize: pageSize}, function(jsonData){
        var d = jsonData;
        self.setState({
          loadingShards: false,
          shards: d.data,
          pagination: {
            current: pageNo,
            total: d.total,
            pageSize: pageSize,
            showTotal: (total) => I18n.formatText('total', total)
          },
        });
    });
  },

  componentDidMount() {
    this.loadDetail();
  },

  onRefreshShards(){
    const curPage = this.state.pagination.current || 1;
    if (curPage){
      this.loadShards(curPage);
    }
  },

  handleCancel(){
    
    if(this.state.intervalId){
      clearInterval(this.state.intervalId);
    }

    this.props.onCanceled && this.props.onCanceled();
  },

  onShardsPageChange(p){
    this.loadShards(p.current);
  },

  renderShardExtra(shard){
    
    return (
      <table className="shard-extra-table">
        <tbody>
          <tr>
            <td className="item-name">
              <I18nText code="jobs.instance.shard.pull.client" />
            </td>
            <td>
              {shard.pullClient}
            </td>
          </tr>
          <tr>
            <td className="item-name">
              <I18nText code="jobs.instance.shard.finish.client" />
            </td>
            <td>
              {shard.finishClient}
            </td>
          </tr>
          <tr>
            <td className="item-name">
              <I18nText code="jobs.instance.shard.pull.count" />
            </td>
            <td>
              {shard.pullCount}
            </td>
          </tr>
          <tr>
            <td className="item-name">
              <I18nText code="jobs.instance.shard.pull.time" />
            </td>
            <td>
              {shard.pullTime}
            </td>
          </tr>
          <tr>
            <td className="item-name">
              <I18nText code="start.time" />
            </td>
            <td>
              {shard.startTime}
            </td>
          </tr>
          <tr>
            <td className="item-name">
              <I18nText code="end.time" />
            </td>
            <td>
              {shard.endTime}
            </td>
          </tr>
          {

          shard.status === 3 ? (

            <tr>
              <td className="item-name">
                <I18nText code="error.info" />
              </td>
              <td>
                {shard.cause}
              </td>
            </tr>

          ) : null
        }
        </tbody>
      </table>
    );
  },

  render() {

    const self = this;
    const detail = this.state.detail;

    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };

    return (
      <Modal 
          title={I18n.getText('jobs.instance.detail')}
          wrapClassName="vertical-center-modal"
          visible={true}
          onCancel={this.handleCancel}
          closable={true}
          footer={[
            <Button key="back" 
                    type="ghost" 
                    size="large" 
                    onClick={this.handleCancel}>
              <I18nText code="close" />
            </Button>,
          ]}>

          <Tabs defaultActiveKey="1" type="card" style={{height: '330px'}} animated={false}>
            <TabPane tab={I18n.getText('jobs.instance.running.info')} key="1">
              <Form horizontal>
                <FormItem className="monitor-item" {...formItemLayout} label={I18n.getText('jobs.instance.finish.percent')}>
                    <Progress width={80} 
                              status={detail.finishPercent < 100 ? 'active' : 'normal'} 
                              percent={detail.finishPercent} />
                </FormItem>

                <FormItem className="monitor-item" {...formItemLayout} label={I18n.getText('status')}>
                    <span>{detail.statusDesc} </span>
                </FormItem>

                <FormItem className="monitor-item" {...formItemLayout} label={I18n.getText('start.time')}>
                    <span>{detail.startTime} </span>
                </FormItem>

                <FormItem className="monitor-item" {...formItemLayout} label={I18n.getText('end.time')}>
                    <span>{detail.endTime} </span>
                </FormItem>

                <FormItem className="monitor-item" {...formItemLayout} label={I18n.getText('jobs.instance.total.shard.count')}>
                    <span>{detail.totalShardCount} </span>
                </FormItem>

                <FormItem className="monitor-item" {...formItemLayout} label={I18n.getText('jobs.instance.wait.shard.count')}>
                    <span>{detail.waitShardCount} </span>
                </FormItem>

                <FormItem className="monitor-item" {...formItemLayout} label={I18n.getText('jobs.instance.running.shard.count')}>
                    <span>{detail.runningShardCount} </span>
                </FormItem>

                <FormItem className="monitor-item" {...formItemLayout} label={I18n.getText('jobs.instance.success.shard.count')}>
                    <span>{detail.successShardCount} </span>
                </FormItem>

                <FormItem className="monitor-item" {...formItemLayout} label={I18n.getText('jobs.instance.failed.shard.count')}>
                    <span>{detail.failedShardCount} </span>
                </FormItem>

              </Form>
            </TabPane>
            <TabPane tab={I18n.getText('jobs.instance.shards.info')} key="2">
                <div className="oplist" >
                  <Button className="opbtn" type="primary" onClick={this.onRefreshShards} size="small">
                    <I18nText code="refresh" />
                  </Button>
                </div>
                <Table
                  columns={[
                    { title: I18n.getText('id'), dataIndex: 'id', key: 'id', width: '15%'},
                    { title: I18n.getText('jobs.instance.shard.item'), dataIndex: 'item', key: 'item', width: '15%'}, 
                    { title: I18n.getText('jobs.instance.shard.param'), dataIndex: 'param', key: 'param', width: '45%'}, 
                    { title: I18n.getText('status'), dataIndex: 'statusDesc', key: 'statusDesc'}, 
                  ]} 
                  dataSource={this.state.shards}
                  rowKey="id"
                  loading={this.state.loadingShards}
                  pagination={this.state.pagination}
                  scroll={{ y: 170 }} 
                  expandedRowRender={(record) => self.renderShardExtra(record)}
                  onChange={this.onShardsPageChange} 
                  size="middle" />
            </TabPane>
          </Tabs>

      </Modal>  
    );
  },
});

JobInstanceDetail.propTypes = {
};

export default JobInstanceDetail;