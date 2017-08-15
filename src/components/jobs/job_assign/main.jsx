import React, {PropTypes } from 'react';
import { Table, Button, Modal, message } from 'antd';

import {I18n} from '../../common/i18n/main';
import I18nText from '../../common/i18n_text/main';
import {Ajax} from '../../common/ajax/main';

const JobAssign = React.createClass({
  
  getInitialState() {
    return {
      loading: false,
      submitting: false,
      assigns: [],
      assignIps: []
    };
  },

  componentDidMount() {
    
    const job = this.props.job;

    const self = this;

    self.setState({ loading: true });

    Ajax.get('/api/jobs/' + job.id + '/assigns', {}, function(assignDatas){
        
        var tmpAssignIps = [];
        if (assignDatas){
          assignDatas.forEach(function(assignData){
            if (assignData.assign){
              tmpAssignIps.push(assignData.ip);
            }
          });
        }

        self.setState({
          loading: false,
          assigns: assignDatas,
          assignIps: tmpAssignIps
        });
    });
  },

  handleCancel(){
    this.props.onCanceled && this.props.onCanceled();
  },

  handleSubmit(){
    
    const self = this;

    // start submiting
    self.setState({ submitting: true });

    var assignIpsStr = self.state.assignIps.length > 0 ? self.state.assignIps.join(",") : "-1";

    // submit 
    Ajax.post('/api/jobs/' + self.props.job.id + '/assigns', {"assignIps" : assignIpsStr}, function(jsonData){
      
      // stop submiting when post finished
      self.setState({ submitting: false });

      // success tip
      message.success(I18n.getText('operate.success'));

    }, function(err){
      message.error(err);
    });
  },

  renderAssignProc: function(record){
    
    if (!record.processes){
      return null;
    }

    var processes = [];
    for (var i=0; i < record.processes.length; i++) {
        processes.push(<li>{record.processes[i]}</li>);
    }

    return (
      <ul style={{marginLeft: 60}}> 
        {processes}
      </ul>
    );
  },

  render() {

    const self = this;
    const job  = this.props.job;
    const assigns = this.state.assigns;

    const title = I18n.formatText('jobs.assign', job.clazz);

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
              <I18nText code="cancel" />
            </Button>,
            <Button key="submit" 
                    type="primary" 
                    size="large" 
                    loading={this.state.submitting} 
                    onClick={this.handleSubmit}>
            <I18nText code="submit" />
          </Button>
          ]}>

          <Table
            columns={[
              { title: I18n.getText('ip'), dataIndex: 'ip', key: 'ip', width: '40%'}, 
              { title: I18n.getText('jobs.assign.inst'), render(text, record) {
                return (
                  <span>
                    {record.processes.length}
                  </span>
                );
              }}
            ]}
            rowSelection={{
              onChange: function(selectedRowKeys, selectedRows){
                  self.setState({
                    assignIps: selectedRowKeys
                  });
              },
              getCheckboxProps: function(record){
                return {
                  defaultChecked: record.assign
                };
              }
            }}
            expandedRowRender={(record) => self.renderAssignProc(record)}
            dataSource={assigns}
            rowKey="ip"
            loading={this.state.loading}
            scroll={{ y: 170 }} 
            size="middle" 
            pagination={false}/>

      </Modal>  
    );
  },
});

JobAssign.propTypes = {
};

export default JobAssign;