import React, {PropTypes } from 'react';
import { Table, Button } from 'antd';

import styles from './main.less';
import {I18n} from '../../common/i18n/main';
import I18nText from '../../common/i18n_text/main';
import {Ajax} from '../../common/ajax/main';
import SearchInput from '../../common/search_input/main';
import BreadTitle from '../../common/bread_title/main';
import AppSelect from '../../apps/app_select/main'; 
import JobEdit from '../job_edit/main';
import JobOperate from '../job_operate/main';
import JobDependence from '../job_dependence/main';


const JobConfigs = React.createClass({
  
  getInitialState() {
    return {
      loading: false,
      jobs: [],
      pagination: false,
      pageSize: 10,
      appId: null, 
      searchJobClass: '',
      editingJob: null,
      operatingJob: null,
      dependencingJob: null,
      operate: '',
    };
  },

  loadJobs(appId, pageNo, jobClass){

    jobClass = jobClass || '';
  
    const self = this;
    self.setState({ loading: true });

    const pageSize = this.state.pageSize;

    Ajax.get('/api/jobs', {appId: appId, jobClass: jobClass, pageNo: pageNo, pageSize: pageSize}, function(jsonData){
        var d = jsonData;
        self.setState({
          loading: false,
          jobs: d.data,
          appId: appId,
          searchJobClass: jobClass,
          pagination: {
            current: pageNo,
            total: d.total,
            pageSize: pageSize,
            showTotal: (total) => I18n.formatText('total', total)
          }
        });
    });
  },

  onPageChange(p){
    this.loadJobs(this.state.appId, p.current);
  },

  onAdd(){
    this.setState({ editingJob: {appId: this.state.appId} });
  },

  onRefresh(){
    const {appId, pagination, searchJobClass} = this.state;
    this.loadJobs(appId, pagination.current, searchJobClass);
  },

  onUpdate(job){
    this.setState({editingJob: job});
  },

  onEditSubmitted(){
    this.setState({editingJob: null});
    this.onRefresh();
  },

  onEditCanceled(){
    this.setState({editingJob: null});
  },

  onEditFailed(){
    this.setState({editingJob: null});
    this.onRefresh();
  },

  onDelete(job){
    this.setState({operatingJob: job, operate: 'delete'});
  },

  onEnable(job){
    this.setState({operatingJob: job, operate: 'enable'});
  },

  onDisable(job){
    this.setState({operatingJob: job, operate: 'disable'});
  },

  onOperateSubmitted(){
    this.setState({operatingJob: null, operate: ''});
    this.onRefresh();
  },

  onOperateCanceled(){
    this.setState({operatingJob: null, operate: ''});
  },

  onOperateFailed(){
    this.setState({operatingJob: null, operate: ''});
    this.onRefresh();
  },

  onSearch(jobClass){
    this.loadJobs(this.state.appId, 1, jobClass);
  },

  onAppChange(appId){
    this.loadJobs(appId, 1, this.state.searchJobClass);
  },

  onDependenceConfig(job){
    this.setState({dependencingJob: job});
  },

  onDependenceSubmitted(){
    this.setState({dependencingJob: null});
  },

  onDependenceCanceled(){
    this.setState({dependencingJob: null});
  },

  onDependenceFailed(){
    
  },

  render() {

    const self = this;

    const appId = this.state.appId;
    const editingJob = this.state.editingJob;
    const operatingJob = this.state.operatingJob;
    const dependencingJob = this.state.dependencingJob;
    const operate = this.state.operate;

    return (
      <div>
        <BreadTitle firstCode="jobs.mgr" secondCode="jobs.configs" />
        
        <div className="oplist" >
          
          <AppSelect onChange={this.onAppChange} />

          <SearchInput style={{width: 220, marginLeft: 5}}
                       placeholder={I18n.getText('input.classname')} 
                       onSearch={this.onSearch} disabled={appId === null}/>

          <Button className="opbtn" type="primary" onClick={this.onAdd} disabled={appId === null}>
            <I18nText code="add" />
          </Button>
          <Button className="opbtn" type="primary" onClick={this.onRefresh}>
            <I18nText code="refresh" />
          </Button>
        </div>
        <Table
          columns={[
            { title: I18n.getText('id'), dataIndex: 'id', key: 'id', width: '5%'}, 
            { title: I18n.getText('jobs.class'), dataIndex: 'clazz', key: 'clazz', width: '25%'}, 
            { title: I18n.getText('jobs.cron'), dataIndex: 'cron', key: 'cron', width: '15%'}, 
            { title: I18n.getText('desc'), dataIndex: 'desc', key: 'desc', width: '20%'}, 
            { title: I18n.getText('status'), key: 'status', width: '8%', 
              render(text, record) {
                const statusDesc = record.status === 1 ? I18n.getText('enable') : I18n.getText('disable')
                const statusClass = record.status === 1 ? 'status-enbale' : 'status-disable';
                return (
                  <span className={statusClass}>
                    {statusDesc}
                  </span>
                );
              }
            },
            { title: I18n.getText('operation'), key: 'operation',
              render(text, record) {
                
                let disableOrEnable;
                if(record.status === 1){
                  disableOrEnable = (
                    <a href="#" onClick={() => self.onDisable(record)}>
                      <I18nText code="disable" />
                    </a>
                  )
                } else {
                  disableOrEnable = (
                    <a href="#" onClick={() => self.onEnable(record)}>
                      <I18nText code="enable" />
                    </a>
                  )
                }

                return (
                  <span>
                    <a href="#" onClick={() => self.onUpdate(record)}>
                      <I18nText code="update" />
                    </a>
                    <span className="ant-divider"></span> 
                    {disableOrEnable}
                    <span className="ant-divider"></span> 
                    <a href="#" onClick={() => self.onDependenceConfig(record)}>
                      <I18nText code="jobs.dependence.config" />
                    </a>
                    <span className="ant-divider"></span> 
                    <a href="#" onClick={() => self.onDelete(record)}>
                      <I18nText code="delete" />
                    </a>
                  </span>
                );
              }
            }
          ]} 
          dataSource={this.state.jobs} 
          loading={this.state.loading}
          pagination={this.state.pagination}
          scroll={{ y: 470 }} 
          rowKey="id"
          onChange={this.onPageChange}/>

          { editingJob === null ? null : 
            <JobEdit job={editingJob} 
                     onSubmitted={this.onEditSubmitted} 
                     onCanceled={this.onEditCanceled} 
                     onFailed={this.onEditFailed}/> }

          { operatingJob === null ? null : 
            <JobOperate job={operatingJob} 
                        operate={operate} 
                        onSubmitted={this.onOperateSubmitted} 
                        onCanceled={this.onOperateCanceled} 
                        onFailed={this.onOperateFailed}/> }

          { dependencingJob === null ? null : 
            <JobDependence job={dependencingJob} 
                           onSubmitted={this.onDependenceSubmitted} 
                           onCanceled={this.onDependenceCanceled} 
                           onFailed={this.onDependenceFailed}/> }
          
      </div>
    );
  },
});

JobConfigs.propTypes = {
};

export default JobConfigs;