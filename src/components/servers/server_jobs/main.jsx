import React, {PropTypes } from 'react';
import { Table, Button, Modal } from 'antd';

import {I18n} from '../../common/i18n/main';
import I18nText from '../../common/i18n_text/main';
import {Ajax} from '../../common/ajax/main';


const ServerJobs = React.createClass({
  
  getInitialState() {
    return {
      loading: false,
      jobs: [],
    };
  },

  loadJobs(){

    const server = this.props.server;
  
    const self = this;
    self.setState({ loading: true });

    Ajax.get('/api/servers/jobs', {server: server}, function(jobs){
        self.setState({
          loading: false,
          jobs: jobs
        });
    });
  },

  componentDidMount() {
      this.loadJobs();
  },

  onRefresh(){
    this.loadJobs();
  },

  handleCancel(){
    this.props.onCanceled && this.props.onCanceled();
  },

  render() {

    const self = this;
    const server = this.props.server;

    return (
      <Modal 
          title={I18n.formatText('clusters.servers.jobs', server)}
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

        <Table
          columns={[
            { title: I18n.getText('id'), dataIndex: 'id', key: 'id', width: '10%'}, 
            { title: I18n.getText('jobs.class'), dataIndex: 'clazz', key: 'clazz', width: '50%'}, 
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
          ]} 
          dataSource={this.state.jobs} 
          loading={this.state.loading}
          pagination={false}
          scroll={{ y: 250 }} 
          rowKey="id" 
          size="middle" />
          
      </Modal>
    );
  },
});

ServerJobs.propTypes = {
};

export default ServerJobs;