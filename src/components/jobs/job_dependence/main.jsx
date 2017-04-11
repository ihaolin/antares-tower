import React, {PropTypes } from 'react';
import { Table, Button, Modal, Input } from 'antd';

import {I18n} from '../../common/i18n/main';
import I18nText from '../../common/i18n_text/main';
import {Ajax} from '../../common/ajax/main';
import JobOperate from '../job_operate/main';


const JobDependence = React.createClass({
  
  getInitialState() {
    return {
      loading: false,
      jobs: [],
      pageSize: 10,
      pagination: {},
      addingJobIds: null,
      operatingJob: null,
      deletingJobId: null
    };
  },

  loadNextJobs(pageNo){

    const job = this.props.job;

    const self = this;

    self.setState({ loading: true });

    const pageSize = this.state.pageSize;
    Ajax.get('/api/jobs/' + job.id + '/next', {pageNo: pageNo, pageSize: pageSize}, function(jsonData){
        var d = jsonData;
        self.setState({
          loading: false,
          jobs: d.data,
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
    this.loadNextJobs(1);
  },

  onRefreshNextJobs(){
    this.loadNextJobs(this.state.pagination.current);
  },

  handleCancel(){
    this.props.onCanceled && this.props.onCanceled();
  },

  onPageChange(p){
    this.loadNextJobs(p.current);
  },

  nextJobIdsChange(e){
    const newValue = e.target.value;
    this.setState({
      addingJobIds: newValue,
    });
  },

  onAdd(){
    
    const self = this;
    const jobId = this.props.job.id;
    const addingJobIds = this.state.addingJobIds;
    
    Ajax.post('/api/jobs/' + jobId + '/next', {nextJobId: addingJobIds}, function(addResp){
        if (addResp){
          self.setState({
            addingJobIds: null
          });
          self.onRefreshNextJobs();
        }
    });

  },

  onDelete(nextJob){
    
    const curJob = this.props.job;

    this.setState({
      operatingJob: curJob, 
      deletingJobId: nextJob.id
    });

  },

  onDeleteSubmitted(){
    this.setState({operatingJob: null, deletingJobId: null});
    this.onRefreshNextJobs();
  },

  onDeleteCanceled(){
    this.setState({operatingJob: null, deletingJobId: null});
  },

  onDeleteFailed(){
    this.setState({operatingJob: null, deletingJobId: null});
    this.onRefreshNextJobs();
  },


  render() {

    const self = this;
    const job = this.props.job;

    const title = I18n.formatText('jobs.dependence', job.clazz);

    // next job ids tip
    const addingJobIds = this.state.addingJobIds;
    const nextJobIdsInputTip = I18n.getText('input') + I18n.getText('jobs.next.ids');

    const disabledAdd = addingJobIds ? false : true;

    // the deleting next job
    const operatingJob = this.state.operatingJob;
    const deletingJobId = this.state.deletingJobId;

    return (
      <Modal 
          title={title}
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

          <div className="oplist" >
            
            <Input placeholder={nextJobIdsInputTip} 
                   style={{width: 220}} 
                   onChange={this.nextJobIdsChange} 
                   value={addingJobIds} /> 
            
            <Button className="opbtn" type="primary" onClick={this.onAdd} disabled={disabledAdd}>
              <I18nText code="add" />
            </Button>

          </div>
          <Table
            columns={[
              { title: I18n.getText('id'), dataIndex: 'id', key: 'id', width: '12%'},
              { title: I18n.getText('apps.name'), dataIndex: 'appName', key: 'appName', width: '18%'}, 
              { title: I18n.getText('jobs.class'), dataIndex: 'jobClass', key: 'jobClass', width: '55%'}, 
              { title: I18n.getText('operation'), key: 'operation',
              render(text, record) {
                return (
                  <span>
                    <a href="#" onClick={() => self.onDelete(record)}>
                      <I18nText code="delete" />
                    </a>
                  </span>
                );
              }
            }
            ]} 
            dataSource={this.state.jobs}
            rowKey="id"
            loading={this.state.loading}
            pagination={this.state.pagination}
            scroll={{ y: 170 }} 
            onChange={this.onPageChange} 
            size="middle" />

            { operatingJob === null ? null : 
            <JobOperate job={operatingJob} 
                        operate="del_next"
                        suffix={deletingJobId}
                        onSubmitted={this.onDeleteSubmitted} 
                        onCanceled={this.onDeleteCanceled} 
                        onFailed={this.onDeleteFailed}/> }

      </Modal>  
    );
  },
});

JobDependence.propTypes = {
};

export default JobDependence;