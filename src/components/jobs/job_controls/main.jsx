import React, {PropTypes } from 'react';
import { Table, Button } from 'antd';

import styles from './main.less';
import {I18n} from '../../common/i18n/main';
import I18nText from '../../common/i18n_text/main';
import {Ajax} from '../../common/ajax/main';
import SearchInput from '../../common/search_input/main';
import BreadTitle from '../../common/bread_title/main';
import AppSelect from '../../apps/app_select/main'; 
import JobOperate from '../job_operate/main';
import JobInstanceDetail from '../job_instance_detail/main';


const JobControls = React.createClass({
  
  getInitialState() {
    return {
      loading: false,
      jobs: [],
      pagination: false,
      pageSize: 10,
      appId: null, 
      searchJobClass: '',
      operatingJob: null,
      monitoringJob: null,
      operate: '',
    };
  },

  loadJobs(appId, pageNo, jobClass){

    jobClass = jobClass || '';
  
    const self = this;
    self.setState({ loading: true });

    const pageSize = this.state.pageSize;

    Ajax.get('/api/jobs/controls', {appId: appId, jobClass: jobClass, pageNo: pageNo, pageSize: pageSize}, function(jsonData){
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


  onRefresh(){
    const {appId, pagination, searchJobClass} = this.state;
    this.loadJobs(appId, pagination.current, searchJobClass);
  },

  onEnable(job){
    this.setState({operatingJob: job, operate: 'enable'});
  },

  onTrigger(job){
    this.setState({operatingJob: job, operate: 'trigger'});
  },

  onPause(job){
    this.setState({operatingJob: job, operate: 'pause'});
  },

  onResume(job){
    this.setState({operatingJob: job, operate: 'resume'});
  },

  onSchedule(job){
    this.setState({operatingJob: job, operate: 'schedule'});
  },

  onStopJob(job){
    this.setState({operatingJob: job, operate: 'stop'});
  },

  onTerminateJob(job){
    this.setState({operatingJob: job, operate: 'terminate'});
  },

  onMonitor(job){
    this.setState({monitoringJob : job});
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

  onMonitorCanceled(){
    this.setState({monitoringJob: null});
    this.onRefresh();
  },

  onMonitorFailed(){
    this.setState({monitoringJob: null});
    this.onRefresh();
  },

  onSearch(jobClass){
    this.loadJobs(this.state.appId, 1, jobClass);
  },

  onAppChange(appId){
    this.loadJobs(appId, 1, this.state.searchJobClass);
  },

  renderJobExtra(record){
    let extra = `(${record.cron}) : ${record.desc}`;
    return (
      <p>{extra}</p>
    );
  },

  render() {

    const self = this;

    const appId = this.state.appId;
    const operatingJob = this.state.operatingJob;
    const operate = this.state.operate;
    const monitoringJob = this.state.monitoringJob;

    return (
      <div>

        <BreadTitle firstCode="jobs.mgr" secondCode="jobs.controls" />

        <div className="oplist" >
          
          <AppSelect onChange={this.onAppChange} />

          <SearchInput style={{width: 220, marginLeft: 5}}
                       placeholder={I18n.getText('input.classname')} 
                       onSearch={this.onSearch} disabled={appId === null}/>

          <Button className="opbtn" type="primary" onClick={this.onRefresh}>
            <I18nText code="refresh" />
          </Button>

        </div>
        <Table
          columns={[
            { title: I18n.getText('id'), dataIndex: 'id', key: 'id', width: '5%'}, 
            { title: I18n.getText('jobs.class'), dataIndex: 'clazz', key: 'clazz', width: '20%'}, 
            { title: I18n.getText('jobs.fire.time.prev'), dataIndex: 'prevFireTime', key: 'prevFireTime', width: '13%'},
            { title: I18n.getText('jobs.fire.time'), dataIndex: 'fireTime', key: 'fireTime', width: '13%'},
            { title: I18n.getText('jobs.fire.time.next'), dataIndex: 'nextFireTime', key: 'nextFireTime', width: '13%'},
            { title: I18n.getText('jobs.scheduler'), dataIndex: 'scheduler', key: 'scheduler', width: '12%'},
            { title: I18n.getText('status'), width: '6%', 
              render(text, record){
                return (
                    <span className={"state-" + record.state}>
                      {record.stateDesc}
                    </span>
                );
            }},
            { title: I18n.getText('operation'), 
              render(text, record) {
                const state = record.state;

                return (
                  <span>

                    {state === 2 ? 
                      <a href="#" onClick={() => self.onMonitor(record)}><I18nText code="monitor" /></a> : null}
                    
                    {state === 0 ? 
                      <a href="#" onClick={() => self.onEnable(record)}><I18nText code="enable" /></a> : null}

                    {state === 1 ? 
                      <a href="#" onClick={() => self.onTrigger(record)}><I18nText code="trigger" /></a> : null}

                    {state === 1 || state === 2 || state === 4 ? 
                      <a href="#" onClick={() => self.onPause(record)}><I18nText code="pause" /></a> : null}

                    {state === 1 || state === 2 || state === 4 || state === 5? 
                      <a href="#" onClick={() => self.onStopJob(record)}><I18nText code="stop" /></a> : null}
                    
                    {state === 5 ? 
                      <a href="#" onClick={() => self.onResume(record)}><I18nText code="resume" /></a> : null}

                    {state === 3 ? 
                      <a href="#" onClick={() => self.onSchedule(record)}><I18nText code="schedule" /></a> : null}

                    {state === 2 ? 
                      <a href="#" onClick={() => self.onTerminateJob(record)}><I18nText code="terminate" /></a> : null}

                  </span>
                );
              }
            }
          ]} 
          dataSource={this.state.jobs} 
          loading={this.state.loading}
          pagination={this.state.pagination}
          expandedRowRender={(record) => self.renderJobExtra(record)}
          scroll={{ y: 470 }} 
          rowKey="id"
          onChange={this.onPageChange}/>

          { operatingJob === null ? null : 
            <JobOperate job={operatingJob} 
                        operate={operate} 
                        onSubmitted={this.onOperateSubmitted} 
                        onCanceled={this.onOperateCanceled} 
                        onFailed={this.onOperateFailed}/> }
          
          { monitoringJob === null ? null : 
            <JobInstanceDetail uri={`/api/jobs/${monitoringJob.id}/monitor`} 
                               onCanceled={this.onMonitorCanceled} 
                               onFailed={this.onMonitorFailed}/> }

      </div>
    );
  },
});

JobControls.propTypes = {
};

export default JobControls;