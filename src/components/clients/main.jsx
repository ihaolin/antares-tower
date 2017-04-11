import React, {PropTypes } from 'react';
import { Table, Button, Icon, Tooltip } from 'antd';
import styles from './main.less';
import {I18n} from '../common/i18n/main';
import I18nText from '../common/i18n_text/main';
import {Ajax} from '../common/ajax/main';
import AppSelect from '../apps/app_select/main'; 
import BreadTitle from '../common/bread_title/main';

const Clients = React.createClass({
  getInitialState() {
    return {
      loading: false,
      clients: [],
      appId: null, 
    };
  },

  loadClients(appId){

    const self = this;
    self.setState({ loading: true });

    Ajax.get('/api/clients', {appId: appId}, function(clientsData){
        self.setState({
          loading: false,
          clients: clientsData,
          appId: appId
        });
    });

  },

  onRefresh(){
    this.loadClients(this.state.appId);
  },

  onAppChange(appId){
    this.loadClients(appId);
  },

  render() {

    const self = this;

    return (
      <div>

        <BreadTitle firstCode="clusters.mgr" secondCode="clusters.clients" />

        <div className="oplist" >
          <AppSelect onChange={this.onAppChange} />
          <Button className="opbtn" type="primary" onClick={this.onRefresh}>
            <I18nText code="refresh" />
          </Button>
        </div>

        <Table
          columns={[
            { title: I18n.getText('clients.addr'), dataIndex: 'addr', key: 'addr'},
            { title: I18n.getText('operation'), key: 'operation',
              render(text, record) {
                return (
                  <span>
                    
                  </span>
                );
              }
            }
          ]} 
          dataSource={this.state.clients} 
          loading={this.state.loading}
          pagination={false}
          rowKey="addr"
          scroll={{ y: 470 }} />
      </div>
    );
  },
});

Clients.propTypes = {
};

export default Clients;