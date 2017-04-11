import React, { Component, PropTypes } from 'react';

import { Breadcrumb } from 'antd';

import {I18n} from '../i18n/main';

const BreadTitle = React.createClass({

	render(){

		const firstTitle = I18n.getText(this.props.firstCode);
		const secondTitle = I18n.getText(this.props.secondCode);

		return (
		    <Breadcrumb style={{fontSize: '16px', margin: '12px 0px 6px 0px' }}>
		        <Breadcrumb.Item>
		        	{firstTitle}
		        </Breadcrumb.Item>
		        <Breadcrumb.Item>
		        	{secondTitle}
		        </Breadcrumb.Item>
	      	</Breadcrumb>
	  	);
	}
});

BreadTitle.propTypes = {
  
};

export default BreadTitle;
