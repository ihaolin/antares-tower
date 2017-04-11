import React, {PropTypes } from 'react';
import { Table, Button} from 'antd';

import {I18n} from '../../common/i18n/main';
import I18nText from '../../common/i18n_text/main';
import {Ajax} from '../../common/ajax/main';
import SearchInput from '../../common/search_input/main';
import BreadTitle from '../../common/bread_title/main';
import AppSelect from '../../apps/app_select/main'; 
import JobInstanceDetail from '../job_instance_detail/main';


const JobInstances = React.createClass({
  
  getInitialState() {
    return {
      loading: false,
      instances: [],
      pagination: false,
      pageSize: 10,
      appId: null, 
      searchJobClass: '',
      detailInstance: null,
    };
  },

  loadJobInstances(appId, pageNo, jobClass){

    jobClass = jobClass || '';
  
    const self = this;
    self.setState({ loading: true });

    const pageSize = this.state.pageSize;

    const params = {
        appId: appId, 
        jobClass: jobClass, 
        pageNo: pageNo, 
        pageSize: pageSize
    };

    Ajax.get('/api/jobs/instances', params, function(jsonData){
        var d = jsonData;
        self.setState({
          loading: false,
          instances: d.data,
          appId: appId,
          searchJobClass: jobClass,
          pagination: {
            current: pageNo,
            total: d.total,
            pageSize: pageSize,
            showTotal: (total) => I18n.formatText('total', total)
          }
        });
    }, function(err){

      self.setState({ loading: false });
    
    });
  },

  onPageChange(p){
    this.loadJobInstances(this.state.appId, p.current, this.state.searchJobClass);
  },

  onRefresh(){
    const {appId, pagination, searchJobClass} = this.state;
    this.loadJobInstances(appId, pagination.current, searchJobClass);
  },

  onDetail(instance){
    this.setState({detailInstance: instance});
  },

  onDetailCanceled(){
    this.setState({detailInstance: null});
  },

  onDetailFailed(){
    this.setState({detailInstance: null});
  },

  onSearchJobClassInput(jobClass){
    this.setState({
      searchJobClass: jobClass
    });
  },

  onSearch(jobClass){
    this.loadJobInstances(this.state.appId, 1, jobClass);
  },

  onAppChange(appId){
    this.setState({appId : appId});
  },

  renderJobInstanceError(instance){
    if(instance.status === 4){
      return (
        <p>
          {instance.cause}
        </p>
      );
    }
    return null;
  },

  render() {

    const self = this;

    const appId = this.state.appId;
    const jobClass = this.state.searchJobClass;
    const detailInstance = this.state.detailInstance;
    const disableLoad = (!appId || !jobClass);

    return (
      <div>

        <BreadTitle firstCode="jobs.mgr" secondCode="jobs.instances" />

        <div className="oplist" >
          
          <AppSelect onChange={this.onAppChange} />

          <SearchInput style={{width: 220, marginLeft: 5}}
                       placeholder={I18n.getText('input.classname')} 
                       onSearch={this.onSearch} 
                       onInputChange={this.onSearchJobClassInput}
                       disabled={ disableLoad }/>

          <Button className="opbtn" 
                  type="primary" 
                  onClick={this.onRefresh} 
                  disabled={disableLoad} >
            <I18nText code="refresh" />
          </Button>

        </div>
        <Table
          columns={[
            { title: I18n.getText('id'), dataIndex: 'id', key: 'id', width: '10%'}, 
            { title: I18n.getText('table.start.time'), dataIndex: 'startTime', key: 'startTime', width: '15%'}, 
            { title: I18n.getText('table.end.time'), dataIndex: 'endTime', key: 'endTime', width: '15%'}, 
            { title: I18n.getText('table.cost.time'), dataIndex: 'costTime', key: 'costTime', width: '15%'},
            { title: I18n.getText('table.trigger.type'), dataIndex: 'triggerTypeDesc', key: 'triggerTypeDesc', width: '10%'},
            { title: I18n.getText('status'), dataIndex: 'statusDesc', key: 'statusDesc', width: '10%'},
            { title: I18n.getText('operation'), key: 'operation',
              render(text, record) {
                return (
                  <span>
                    <a href="#" onClick={() => self.onDetail(record)}>
                      <I18nText code="jobs.instance.detail" />
                    </a>
                  </span>
                );
              }
            }
          ]} 
          dataSource={this.state.instances} 
          loading={this.state.loading}
          pagination={this.state.pagination}
          scroll={{ y: 470 }} 
          rowKey="id"
          expandedRowRender={(record) => self.renderJobInstanceError(record)}
          onChange={this.onPageChange}/>

          { detailInstance === null ? null : 
            <JobInstanceDetail uri={`/api/jobs/instances/${detailInstance.id}`} 
                               onCanceled={this.onDetailCanceled} 
                               onFailed={this.onDetailFailed}/> }
  
      </div>
    );
  },
});

JobInstances.propTypes = {
};

export default JobInstances;