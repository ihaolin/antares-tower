import { Button, Icon, Layout, Menu, Tooltip } from 'antd'
import { Link } from 'react-router-dom'
import React, { Component } from 'react'
import t, { lang } from '../../i18n'

import './layout-header.less'

const {Header} = Layout
const SubMenu = Menu.SubMenu

export default class LayoutHeader extends Component {

  constructor (props) {
    super(props)
    this.state = {lang}
  }

  switchLang () {
    var lang = this.state.lang
    lang = lang === 'en' ? 'zh' : 'en'
    localStorage.setItem('lang', lang)
    window.location.reload()
  }

  render () {
    return (
      <Header className="header">
        <div className="logo"/>
        <Menu theme="dark" mode="horizontal" style={{'fontSize': '16px', lineHeight: '64px'}}>
          <SubMenu key="apps" title={<span><Icon type="appstore"/>{t('apps.mgr')}</span>}>
            <Menu.Item key="1">
              <Link to="/apps"><Icon type="bars"/>{t('apps.list')}</Link>
            </Menu.Item>
          </SubMenu>
          <SubMenu key="jobs" title={<span><Icon type="file-text"/>{t('jobs.mgr')}</span>}>
            <Menu.Item key="10">
              <Link to="/job-configs"><Icon type="bars"/>{t('jobs.configs')}</Link>
            </Menu.Item>
            <Menu.Item key="11">
              <Link to="/job-controls"><Icon type="line-chart"/>{t('jobs.controls')}</Link>
            </Menu.Item>
            <Menu.Item key="12">
              <Link to="/job-instances"><Icon type="copy"/>{t('jobs.instances')}</Link>
            </Menu.Item>
          </SubMenu>
          <SubMenu key="clusters" title={<span><Icon type="windows"/>{t('clusters.mgr')}</span>}>
            <Menu.Item key="20">
              <Link to="/servers"><Icon type="laptop"/>{t('clusters.servers')}</Link>
            </Menu.Item>
            <Menu.Item key="21">
              <Link to="/clients"><Icon type="desktop"/>{t('clusters.clients')}</Link>
            </Menu.Item>
          </SubMenu>
        </Menu>

        <div className="operates">
          <Button shape="circle" size="large" onClick={() => this.switchLang()}>{this.state.lang === 'en' ? 'ZH' : 'EN'}</Button>
          <a href="https://github.com/ihaolin/antares" target="_blank" rel="noopener noreferrer">
            <Button icon="github" shape="circle" size="large"/>
          </a>
          <Tooltip title={t('exit')}>
            <Button icon="poweroff" shape="circle" size="large"/>
          </Tooltip>
        </div>
      </Header>
    )
  }
}