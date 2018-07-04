import React from 'react'
import PropTypes from 'prop-types'
import { Button, message, Modal } from 'antd'
import t from '../../i18n'

import { Ajax } from '../common/ajax'

class JobOperate extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      confirming: false
    }
  }

  handleSubmit () {

    const self = this

    const jobId = this.props.job.id

    const operate = this.props.operate

    const suffix = this.props.suffix || ''

    const uri = '/api/jobs/' + jobId + '/' + operate + (suffix ? '/' + suffix : '')

    // start submiting
    self.setState({confirming: true})

    Ajax.post(uri, {}, function (jsonData) {

      // stop submiting when post finished
      self.setState({confirming: false})

      message.success(t('operate.success'));

      // callback parent submit
      (self.props.onSubmitted && self.props.onSubmitted())
    }, function (err) {
      // callback parent failed
      (self.props.onFailed && self.props.onFailed())
    })
  }

  handleCancel () {
    // callback parent
    this.props.onCanceled && this.props.onCanceled()
  }

  render () {

    const job = this.props.job
    const operate = this.props.operate

    return (

      <Modal
        title={t('jobs.' + operate)}
        wrapClassName="vertical-center-modal"
        visible={true}
        onOk={() => this.handleSubmit()}
        onCancel={() => this.handleCancel()}
        okText={t('confirm')}
        cancelText={t('cancel')}
        closable={true}
        footer={[
          <Button key="back" type="ghost" size="large" onClick={() => this.handleCancel()}>{t('cancel')}</Button>,
          <Button key="submit" type="primary" size="large" loading={this.state.confirming} onClick={() => this.handleSubmit()}>
            {t('confirm')}
          </Button>
        ]}>
        {t('jobs.' + operate + '.confirm')}
      </Modal>
    )
  }
}

JobOperate.propTypes = {
  operate: PropTypes.string.isRequired,
  job: PropTypes.object.isRequired
}

export default JobOperate