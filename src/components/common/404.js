import React, { Component } from 'react'
import { Button } from 'antd'
import t from './i18n'

import './404.less'

export default class NotFound extends Component {
  render () {
    return (
      <div className="normal">
        <div className="container">
          <h1 className="title">404</h1>
          <p className="desc">
            {t('404')}
          </p>
          <a href="/">
            <Button type="primary" style={{marginTop: 5}}>
              {t('back.home')}
            </Button>
          </a>
        </div>
      </div>
    )
  }
}
