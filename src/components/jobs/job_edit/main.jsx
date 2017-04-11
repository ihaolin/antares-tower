import React, {PropTypes } from 'react';

import { Modal, Button, Form, Input, InputNumber, Switch, Tabs, Icon, Tooltip } from 'antd';
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;

import {I18n} from '../../common/i18n/main';
import I18nText from '../../common/i18n_text/main';
import {Ajax} from '../../common/ajax/main';


let JobEdit = React.createClass({
  
  getInitialState() {
      return {
          config: {
            params: "",
            shardCount: 1,
            shardParams: "",
            misfire: true,
            maxShardPullCount: 3
          },
          submitting: false  
      };
  },

  handleSubmit(){

    const self = this;

    // start submiting
    self.setState({ submitting: true });


    // validate form
    self.props.form.validateFields((errors, values) => {
      if (!errors) {
        
        const job = self.props.job;

        // set app id
        values.appId = job.appId;
        
        // set job id
        if(job.id){
          values.jobId = job.id;  
        }
        
        // submit validated pass
        Ajax.post('/api/jobs', values, function(jsonData){
          
          // stop submiting when post finished
          self.setState({ submitting: false });

          // callback parent
          (self.props.onSubmitted && self.props.onSubmitted());

        }, function(err){
          // stop submiting when post finished
          self.setState({ submitting: false });
          // (self.props.onFailed && self.props.onFailed());
        });

      } else {
        // stop submiting when validate failed
        self.setState({ submitting: false });
      }
    });
  },

  handleCancel(){
    // callback parent
    this.props.onCanceled();
  },

  checkClassInput(rule, value, callback){
    if (/([a-z][a-z_0-9]*\.)*[A-Z_]($[A-Z_]|[\w_])*/.test(value)) {
      callback();   
    } else {
      callback(I18n.formatText('field.format.error', I18n.getText('name.tip')));
    }
  },

  loadConfig(){
    
    if(!this.props.job.id){
      return;
    }

    const self = this;
    const jobId = this.props.job.id;

    Ajax.get('/api/jobs/' + jobId +'/config', {}, function(cfg){
        self.setState({
          config: cfg
        });
    });

  },

  componentDidMount() {
    this.loadConfig();
  },

  render(){

    const currentJob = this.props.job;
    const currentConfig = this.state.config;

    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };

    // job class tip
    const classInputTip = I18n.getText('input') + I18n.getText('jobs.class') + " " + I18n.getText('jobs.class.exapmle');
    const classDisable = !(currentJob.id === null || currentJob.id === undefined);

    // job cron tip
    const cronInputTip = I18n.getText('input') + I18n.getText('jobs.cron');

    // job desc
    const descInputTip = I18n.getText('input') + I18n.getText('jobs.desc');

    // job params
    const paramsInputTip = I18n.getText('input') + I18n.getText('jobs.params');

    // job shard count
    const shardCountInputTip = I18n.getText('input') + I18n.getText('jobs.shard.count');

     // job shard params
    const shardParamsInputTip = I18n.getText('input') + 
                                I18n.getText('jobs.shard.params') + ", " + 
                                I18n.getText('jobs.shard.params.exapmle');

     // job max shard pull count
    const maxShardPullCountInputTip = I18n.getText('input') + I18n.getText('jobs.max.shard.pull.count');

    // job misfire
    const misfireChecked = currentConfig.misfire;

    // job timeout
    const timeoutInputTip = I18n.getText('input') + I18n.getText('jobs.timeout');

    // job status
    const statusChecked = (currentJob.status !== undefined && currentJob.status === 1);

    return (
      <Modal 
        title={I18n.getText('jobs.edit')}
        wrapClassName="vertical-center-modal"
        visible={true}
        onOk={this.handleSubmit}
        onCancel={this.handleCancel}
        okText={I18n.getText('submit')}
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
                  loading={this.state.submitting} 
                  onClick={this.handleSubmit}>
            <I18nText code="submit" />
          </Button>,
        ]}>
  
         <Form horizontal>
          <Tabs defaultActiveKey="1" type="card" style={{height: '320px'}} animated={false}>
            <TabPane tab={I18n.getText('jobs.basic.info')} key="1">
                <FormItem
                  {...formItemLayout}
                  label={I18n.getText('jobs.class')} 
                  hasFeedback>
                  {getFieldDecorator('clazz', {
                    initialValue: currentJob.clazz,
                    rules: [
                      { required: true, validator: this.checkClassInput, message: classInputTip },
                    ]
                  })(
                    <Input disabled={classDisable} placeholder={classInputTip} />
                  )}
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label={I18n.getText('jobs.cron')} 
                  hasFeedback>
                  {getFieldDecorator('cron', {
                    initialValue: currentJob.cron,
                    rules: [
                      { required: true, whitespace: true, message: cronInputTip },
                    ]
                  })(
                     <Input placeholder={cronInputTip} />
                  )}
                </FormItem>

                <FormItem
                  {...formItemLayout}
                  label={I18n.getText('jobs.desc')}>
                  {getFieldDecorator('desc', {
                    initialValue: currentJob.desc || '',
                    rules: [
                      { message: descInputTip },
                    ]
                  })(
                     <Input type="textarea" placeholder={descInputTip} rows={4} />
                  )}
                </FormItem>

                <FormItem
                  {...formItemLayout}
                  label={I18n.getText('enable.or.not')} >
                  {getFieldDecorator('status', {
                    initialValue: statusChecked,
                    rules: [
                      { required: true},
                    ]
                  })(
                  
                    <Switch defaultChecked={statusChecked} 
                            checkedChildren={I18n.getText('on')} 
                            unCheckedChildren={I18n.getText('off')} />
                  
                  )}
                </FormItem>

            </TabPane>
            <TabPane tab={I18n.getText('jobs.config.info')} key="2">
                <FormItem
                  {...formItemLayout}
                  label={I18n.getText('jobs.params')}>
                  {getFieldDecorator('param', {
                    initialValue: currentConfig.param,
                    rules: [
                      { message: paramsInputTip },
                    ]
                  })(
                     <Input placeholder={paramsInputTip} />
                  )}
                </FormItem>

                <FormItem
                  {...formItemLayout}
                  label={I18n.getText('jobs.shard.count')}>
                  {getFieldDecorator('shardCount', {
                    initialValue: currentConfig.shardCount,
                    rules: [
                      { required: true, message: shardCountInputTip },
                    ]
                  })(
                    <InputNumber min={1} /> 
                  )}
                </FormItem>

                <FormItem
                  {...formItemLayout}
                  label={I18n.getText('jobs.shard.params')}>
                  {getFieldDecorator('shardParams', {
                    initialValue: currentConfig.shardParams,
                    rules: [
                      { message: shardParamsInputTip },
                    ]
                  })(
                     <Input placeholder={shardParamsInputTip} />
                  )}
                </FormItem>

                <FormItem
                  {...formItemLayout}
                  label={I18n.getText('jobs.max.shard.pull.count')}>
                  {getFieldDecorator('maxShardPullCount', {
                    initialValue: currentConfig.maxShardPullCount,
                    rules: [
                      { required: true, message: maxShardPullCountInputTip },
                    ]
                  })(
                     <InputNumber min={1} />
                  )}
                </FormItem>

                <FormItem
                  {...formItemLayout}
                  label={I18n.getText('jobs.timeout')}>
                  {getFieldDecorator('timeout', {
                    initialValue: currentConfig.timeout || 0,
                    rules: [
                      { required: true, message: timeoutInputTip },
                    ]
                  })(
                     <InputNumber min={0} />
                  )}
                </FormItem>

                <FormItem
                  {...formItemLayout}
                  label={I18n.getText('jobs.misfire')} >
                  {getFieldDecorator('misfire', {
                    initialValue: misfireChecked,
                    rules: [
                      { required: true},
                    ]
                  })(
                  
                    <Switch defaultChecked={misfireChecked} 
                            checkedChildren={I18n.getText('on')} 
                            unCheckedChildren={I18n.getText('off')} />
                  
                  )}
                </FormItem>
            </TabPane>
          </Tabs>
        </Form>
      </Modal>
    );
  }
});

// create edit form
JobEdit = Form.create()(JobEdit);

JobEdit.propTypes = {
  job: React.PropTypes.object.isRequired
};

export default JobEdit;
