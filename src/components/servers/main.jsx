import React, {PropTypes } from 'react';
import { Table, Button, Icon, Tooltip } from 'antd';
import styles from './main.less';
import {I18n} from '../common/i18n/main';
import I18nText from '../common/i18n_text/main';
import {Ajax} from '../common/ajax/main';
import BreadTitle from '../common/bread_title/main';
import ServerJobs from './server_jobs/main';

const Servers = React.createClass({
  getInitialState() {
    return {
      loading: true,
      servers: [],
      jobsServer: null,
    };
  },

  componentDidMount() {
    this.loadServers();
  },

  loadServers(){

    const self = this;
    self.setState({ loading: true });

    Ajax.get('/api/servers', {}, function(jsonData){
        self.setState({
          loading: false,
          servers: jsonData
        });
    });

  },

  onShutdown(server){
    this.setState({shutdowningServer: server});
  },

  onShutdownSubmitted(){
    this.setState({shutdowningServer: null});
    this.loadServers();
  },

  onShutdownCanceled(){
    this.setState({shutdowningServer: null});
  },

  onListServerJobs(serverInfo){
    this.setState({
      jobsServer: serverInfo.server
    });
  },

  onListServerJobsCanceled(){
    this.setState({
      jobsServer: null
    });
  },

  onRefresh(){
    this.loadServers();
  },

  render() {

    const self = this;
    const jobsServer = this.state.jobsServer;

    return (
      <div>

        <BreadTitle firstCode="clusters.mgr" secondCode="clusters.servers" />

        <div className="oplist" >
          <Button className="opbtn" type="primary" onClick={this.onRefresh}>
            <I18nText code="refresh" />
          </Button>
        </div>

        <Table
          columns={[
            { title: '', key: 'leader', width: '3%', 
              render(text, record) {
                return (
                  <Tooltip title={record.leader === true ? 'Leader' : 'Follower'}>
                     <Icon type={record.leader === true ? 'star' : 'star-o'} />
                  </Tooltip>
                );
              }
            },
            { title: I18n.getText('host'), dataIndex: 'server', key: 'server', width: '20%'}, 
            { title: I18n.getText('jobs.count'), key: 'jobCount', width: '20%', 
              render(text, record) {
                var jobCount = record.jobCount === null ? 'N/A' : record.jobCount;
                return (
                  <span>
                    {jobCount}
                  </span>
                );
              }
            },
            { title: I18n.getText('operation'), key: 'operation',
              render(text, record) {
                return (
                  <span>
                    <a href="#" onClick={() => self.onListServerJobs(record)}><I18nText code="servers.jobs.list" /></a>
                  </span>
                );
              }
            }
          ]} 
          dataSource={this.state.servers} 
          loading={this.state.loading}
          pagination={false}
          rowKey="server"
          scroll={{ y: 470 }} />

          { jobsServer === null ? null : 
            <ServerJobs server={jobsServer} 
                        onCanceled={this.onListServerJobsCanceled} /> }

      </div>
    );
  },
});

Servers.propTypes = {
};

export default Servers;