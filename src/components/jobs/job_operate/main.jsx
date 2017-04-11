import React, {PropTypes } from 'react';
import { Modal, Button, message} from 'antd';
import {I18n} from '../../common/i18n/main';
import I18nText from '../../common/i18n_text/main';
import {Ajax} from '../../common/ajax/main';

const JobOperate = React.createClass({
  
  getInitialState() {
      return {
          confirming: false  
      };
  },

  handleSubmit(){

    const self = this;

    const jobId = this.props.job.id;

    const operate = this.props.operate;

    const suffix = this.props.suffix || '';

    const uri = '/api/jobs/' + jobId + "/" + operate + (suffix ? '/' + suffix : '') ;

    // start submiting
    self.setState({ confirming: true });

    Ajax.post(uri, {}, function(jsonData){
      
      // stop submiting when post finished
      self.setState({ confirming: false });

      message.success(I18n.getText('operate.success'));

      // callback parent submit
      (self.props.onSubmitted && self.props.onSubmitted());
    }, function(err){
      // callback parent failed
      (self.props.onFailed && self.props.onFailed());
    });
  },

  handleCancel(){
    // callback parent
    this.props.onCanceled && this.props.onCanceled();
  },

  render(){

    const job = this.props.job;
    const operate = this.props.operate;

    return (
      <Modal 
        title={I18n.getText('jobs.' + operate)}
        wrapClassName="vertical-center-modal"
        visible={true}
        onOk={this.handleSubmit}
        onCancel={this.handleCancel}
        okText={I18n.getText('confirm')}
        cancelText={I18n.getText('cancel')}
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
                  loading={this.state.confirming} 
                  onClick={this.handleSubmit}>
            <I18nText code="confirm" />
          </Button>,
        ]}>
        <I18nText code={'jobs.' + operate + '.confirm'} />
      </Modal>
    );
  }
});

JobOperate.propTypes = {
  operate: React.PropTypes.string.isRequired,
  job: React.PropTypes.object.isRequired
};

export default JobOperate;