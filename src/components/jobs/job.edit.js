import { Button, Form, Input, InputNumber, Modal, Switch, Tabs } from 'antd'
import React from 'react'
import PropTypes from 'prop-types'
import { Ajax } from '../common/ajax'
import t from '../common/i18n'

const TextArea = Input.TextArea
const FormItem = Form.Item
const TabPane = Tabs.TabPane

class JobEdit extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      config: {
        params: '',
        shardCount: 1,
        shardParams: '',
        misfire: true,
        maxShardPullCount: 3
      },
      submitting: false
    }
  }

  handleSubmit () {

    const self = this

    // start submiting
    self.setState({submitting: true})

    // validate form
    self.props.form.validateFields((errors, values) => {
      if (!errors) {

        const job = self.props.job

        // set app id
        values.appId = job.appId

        // set job id
        if (job.id) {
          values.jobId = job.id
        }

        // submit validated pass
        Ajax.post('/api/jobs', values, function (jsonData) {

          // stop submiting when post finished
          self.setState({submitting: false});

          // callback parent
          (self.props.onSubmitted && self.props.onSubmitted())

        }, function (err) {
          // stop submiting when post finished
          self.setState({submitting: false})
          // (self.props.onFailed && self.props.onFailed());
        })

      } else {
        // stop submiting when validate failed
        self.setState({submitting: false})
      }
    })
  }

  handleCancel () {
    // callback parent
    this.props.onCanceled()
  }

  checkClassInput (rule, value, callback) {
    if (/([a-z][a-z_0-9]*\.)*[A-Z_]($[A-Z_]|[\w_])*/.test(value)) {
      callback()
    } else {
      callback(t('field.format.error', t('name.tip')))
    }
  }

  loadConfig () {

    if (!this.props.job.id) {
      return
    }

    const self = this
    const jobId = this.props.job.id

    Ajax.get('/api/jobs/' + jobId + '/config', {}, function (cfg) {
      self.setState({
        config: cfg
      })
    })

  }

  componentDidMount () {
    this.loadConfig()
  }

  render () {

    const currentJob = this.props.job
    const currentConfig = this.state.config

    const {getFieldDecorator} = this.props.form
    const formItemLayout = {
      labelCol: {span: 6},
      wrapperCol: {span: 14}
    }

    // job class tip
    const classInputTip = t('input') + t('jobs.class') + ' ' + t('jobs.class.exapmle')
    const classDisable = !(currentJob.id === null || currentJob.id === undefined)

    // job cron tip
    const cronInputTip = t('input') + t('jobs.cron')

    // job desc
    const descInputTip = t('input') + t('jobs.desc')

    // job params
    const paramsInputTip = t('input') + t('jobs.params')

    // job shard count
    const shardCountInputTip = t('input') + t('jobs.shard.count')

    // job shard params
    const shardParamsInputTip = t('input') + t('jobs.shard.params') + ', ' + t('jobs.shard.params.exapmle')

    // job max shard pull count
    const maxShardPullCountInputTip = t('input') + t('jobs.max.shard.pull.count')

    // job misfire
    const misfireChecked = currentConfig.misfire

    // job timeout
    const timeoutInputTip = t('input') + t('jobs.timeout')

    // job states
    const statusChecked = (currentJob.status !== undefined && currentJob.status === 1)

    return (
      <Modal
        title={t('jobs.edit')}
        wrapClassName="vertical-center-modal"
        cancelText={t('cancel')}
        onCancel={() => this.handleCancel()}
        okText={t('submit')}
        onOk={() => this.handleSubmit()}
        closable={true}
        visible={true}
        width={680}
        footer={[
          <Button key="back" type="ghost" size="large" onClick={() => this.handleCancel()}>{t('cancel')}</Button>,
          <Button key="submit" type="primary" size="large" loading={this.state.submitting} onClick={() => this.handleSubmit()}>
            {t('submit')}
          </Button>
        ]}>

        <Form autoComplete="off">
          <Tabs defaultActiveKey="1" type="card">
            <TabPane tab={t('jobs.basic.info')} key="1">
              <FormItem {...formItemLayout} label={t('jobs.class')} hasFeedback>
                {getFieldDecorator('clazz', {
                  initialValue: currentJob.clazz,
                  rules: [
                    {required: true, validator: this.checkClassInput, message: classInputTip}
                  ]
                })(
                  <Input disabled={classDisable} placeholder={classInputTip}/>
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label={t('jobs.cron')}
                // extra="Seconds Minutes Hours DayofMonth Month DayofWeek Year"
                hasFeedback>
                {getFieldDecorator('cron', {
                  initialValue: currentJob.cron,
                  rules: [
                    {required: true, whitespace: true, message: cronInputTip}
                  ]
                })(
                  <Input placeholder={cronInputTip}/>
                )}
              </FormItem>

              <FormItem {...formItemLayout} label={t('jobs.desc')}>
                {getFieldDecorator('desc', {
                  initialValue: currentJob.desc || '',
                  rules: [
                    {message: descInputTip}
                  ]
                })(
                  <TextArea placeholder={descInputTip} rows={4}/>
                )}
              </FormItem>

              <FormItem {...formItemLayout} label={t('enable.or.not')}>
                {getFieldDecorator('status', {
                  initialValue: statusChecked,
                  rules: [
                    {required: true}
                  ]
                })(
                  <Switch defaultChecked={statusChecked}
                          checkedChildren={t('on')}
                          unCheckedChildren={t('off')}/>
                )}
              </FormItem>

            </TabPane>
            <TabPane tab={t('jobs.config.info')} key="2">
              <FormItem {...formItemLayout} label={t('jobs.params')}>
                {getFieldDecorator('param', {
                  initialValue: currentConfig.param,
                  rules: [
                    {message: paramsInputTip}
                  ]
                })(
                  <Input placeholder={paramsInputTip}/>
                )}
              </FormItem>

              <FormItem {...formItemLayout} label={t('jobs.shard.count')}>
                {getFieldDecorator('shardCount', {
                  initialValue: currentConfig.shardCount,
                  rules: [
                    {required: true, message: shardCountInputTip}
                  ]
                })(
                  <InputNumber min={1}/>
                )}
              </FormItem>

              <FormItem {...formItemLayout} label={t('jobs.shard.params')}>
                {getFieldDecorator('shardParams', {
                  initialValue: currentConfig.shardParams,
                  rules: [
                    {message: shardParamsInputTip}
                  ]
                })(
                  <Input placeholder={shardParamsInputTip}/>
                )}
              </FormItem>

              <FormItem {...formItemLayout} label={t('jobs.max.shard.pull.count')}>
                {getFieldDecorator('maxShardPullCount', {
                  initialValue: currentConfig.maxShardPullCount,
                  rules: [
                    {required: true, message: maxShardPullCountInputTip}
                  ]
                })(
                  <InputNumber min={1}/>
                )}
              </FormItem>

              <FormItem {...formItemLayout} label={t('jobs.timeout')}>
                {getFieldDecorator('timeout', {
                  initialValue: currentConfig.timeout || 0,
                  rules: [
                    {required: true, message: timeoutInputTip}
                  ]
                })(
                  <InputNumber min={0}/>
                )}
              </FormItem>

              <FormItem {...formItemLayout} label={t('jobs.misfire')}>
                {getFieldDecorator('misfire', {
                  initialValue: misfireChecked,
                  rules: [
                    {required: true}
                  ]
                })(
                  <Switch defaultChecked={misfireChecked}
                          checkedChildren={t('on')}
                          unCheckedChildren={t('off')}/>
                )}
              </FormItem>
            </TabPane>
          </Tabs>
        </Form>
      </Modal>
    )
  }
}

// create edit form
JobEdit = Form.create()(JobEdit)

JobEdit.propTypes = {
  job: PropTypes.object.isRequired
}

export default JobEdit
