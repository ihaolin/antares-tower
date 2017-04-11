import React, { Component, PropTypes } from 'react';

import { Layout } from 'antd';
const { Content } = Layout;

import styles from './main.less';
import TopHeader from '../top_header/main';
import BottomFooter from '../bottom_footer/main';
import {Storage} from '../../components/common/storage/main';
import {I18n} from '../../components/common/i18n/main';

const DefaultLayout = React.createClass({

	render(){

		return (
		    <Layout>
			    <TopHeader />
			    <Content style={{ padding: '0 50px' }}>
			      {this.props.children}
			    </Content>
			  	<BottomFooter />
		  	</Layout>
	  	);
	}
});

DefaultLayout.propTypes = {
  children: PropTypes.element.isRequired,
};

export default DefaultLayout;
