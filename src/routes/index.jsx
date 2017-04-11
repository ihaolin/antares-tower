import React, { PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'react-router';
import NotFound from '../components/common/not_found/main';
import DefaultLayout from '../layouts/default/main';
import Apps from '../components/apps/main';
import Servers from '../components/servers/main';
import Clients from '../components/clients/main';
import JobConfigs from '../components/jobs/job_configs/main';
import JobControls from '../components/jobs/job_controls/main';
import JobInstances from '../components/jobs/job_instances/main';

const Routes = ({ history }) =>
  <Router history={history}>
  	<Route path="/" component={DefaultLayout}>
  		<IndexRoute component={Apps} />
    	<Route path="/apps" component={Apps} />
      <Route path="/job_configs" component={JobConfigs} />
      <Route path="/job_controls" component={JobControls} />
      <Route path="/job_instances" component={JobInstances} />
    	<Route path="/servers" component={Servers} />
      <Route path="/clients" component={Clients} />
  	</Route>
    <Route path="*" component={NotFound}/>
  </Router>;

Routes.propTypes = {
  history: PropTypes.any,
};

export default Routes;
