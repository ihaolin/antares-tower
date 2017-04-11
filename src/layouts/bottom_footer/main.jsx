import React, { Component, PropTypes } from 'react';

import {Layout} from 'antd';
const {Footer} = Layout;

import styles from './main.less';

const BottomFooter = ({}) => {
  return (
  	<Footer className="bottom-footer">
		Copyright &nbsp;&copy;<a href="mailto:haolin.h0@gmail.com">haolin</a>, Powered by <a href="http://ant.design" target="_blank">Ant Design</a>.
	</Footer>
  );
};

BottomFooter.propTypes = {
};

export default BottomFooter;