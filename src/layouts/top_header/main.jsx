import React, { Component, PropTypes } from 'react';

import { Link } from 'react-router';
import { Layout, Menu, Icon, Button, Tooltip } from 'antd';
const { Header, Footer, Sider, Content } = Layout;
const SubMenu = Menu.SubMenu;

import {Storage} from '../../components/common/storage/main';
import {I18n} from '../../components/common/i18n/main';
import I18nText from '../../components/common/i18n_text/main';
import styles from './main.less';


const TopHeader = React.createClass({
	
	openKeysMap: {
		apps: ['apps'],
	    jobs: ['jobs'],
	    clusters: ['clusters'],
	},

	selectKeysMap: {
		"1": "apps.list",
		"10": "jobs.configs",
		"11": "jobs.controls",
		"12": "jobs.instances",
		"20": "clusters.servers",
		"21": "clusters.clients",
	},

	getOpenKey(key) {
	    return this.openKeysMap[key] || [];
	},

	getInitialState() {
	    return {
	         lang: I18n.lang,
	         openKeys: [Storage.sessionGet('opened_key') || "apps"],
	         selectedKey: Storage.sessionGet('selected_key') || '1',
	    };
	},

	switchLang(){
		var lang = this.state.lang;
		lang = lang === 'en' ? 'zh' : 'en';
		I18n.setLang(lang);
		window.location.reload();
	},

	onOpenKeyChange(openKeys){
		const latestOpenKey = openKeys.find(key => !(this.state.openKeys.indexOf(key) > -1));
    	this.setState({ openKeys: this.getOpenKey(latestOpenKey) });
    	Storage.sessionSet('opened_key', latestOpenKey);
	},

	handleClickMenu(e){
		const selectedKey = e.key;
		this.setState({ selectedKey: selectedKey });
    	Storage.sessionSet('selected_key', selectedKey);
	},

	render(){

		const lang = this.state.lang;

		return (
			<Header className="header">
		      <div className="logo">
		      	
		      </div>
		      <Menu 
		      	theme="dark"
		      	style={{"fontSize": "16px", "marginTop": "13px"}}
		      	mode="horizontal"
		      	onOpenChange={this.onOpenKeyChange}
		      	onSelect={this.handleClickMenu}>
		        <SubMenu key="apps" title={<span><Icon type="appstore" /><I18nText code="apps.mgr" /></span>}>
		            <Menu.Item key="1">
		            	<Link to="/apps">
		            		<Icon type="bars" /><I18nText code="apps.list" />
		            	</Link>
		            </Menu.Item>
		        </SubMenu>
		        <SubMenu key="jobs" title={<span><Icon type="file-text" /><I18nText code="jobs.mgr" /></span>}>
		            <Menu.Item key="10">
		            	<Link to="/job_configs">
		            		<Icon type="bars" /><I18nText code="jobs.configs" />
		            	</Link>
		            </Menu.Item>
		            <Menu.Item key="11">
		            	<Link to="/job_controls">
		            		<Icon type="line-chart" /><I18nText code="jobs.controls" />
		            	</Link>
		            </Menu.Item>
		            <Menu.Item key="12">
		            	<Link to="/job_instances">
		            		<Icon type="copy" /><I18nText code="jobs.instances" />
		            	</Link>
		            </Menu.Item>
		        </SubMenu>
		        <SubMenu key="clusters" title={<span><Icon type="windows" /><I18nText code="clusters.mgr" /></span>}>
		            <Menu.Item key="20">
		            	<Link to="/servers">
		            		<Icon type="laptop" /><I18nText code="clusters.servers" />
		            	</Link>
		            </Menu.Item>
		            <Menu.Item key="21">
		            	<Link to="/clients">
		            		<Icon type="desktop" /><I18nText code="clusters.clients" />
		            	</Link>
		            </Menu.Item>
		        </SubMenu>

		      </Menu>
		      <div className="operates">
		      	<Button shape="circle" size="large" onClick={this.switchLang}>
		      		{lang === 'en' ? 'ZH' : 'EN'}
		      	</Button>
		      	<a href="https://github.com/ihaolin/antares" target="_blank">
		      		<Button icon="github" shape="circle" size="large" />
		      	</a>
		      	<Tooltip title={<I18nText code="exit" />}>
		      		<Button icon="poweroff" shape="circle" size="large" />
		      	</Tooltip>
		      </div>
		    </Header>
		);
	}
});

TopHeader.propTypes = {
};

export default TopHeader;