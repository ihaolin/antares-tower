import queryString from 'query-string';
import { message } from 'antd';
import {I18n} from '../i18n/main';

/**
 * Ajax with fetch API
 */
const Ajax = {
	
	doAjax: function(url, method, params, okCallback, errCallback) {
		var fetchInit = {
			//pass cookies, for authentication
			credentials: 'include'
		};
		fetchInit.method = method;

		if (!this.isEmptyObj(params)){
			if (fetchInit.method === 'GET'){
	            var queryParams = '?' + queryString.stringify(params);
				url += queryParams;
			} else if(fetchInit.method === 'POST'){
				// headers
				var headers = new Headers();
				headers.append("Content-Type", "application/json");
				fetchInit.headers = headers;
				fetchInit.body = JSON.stringify(params);
			}
		}
 
		var okCallback = okCallback || function(){};
		var errCallback = errCallback || function(err){};

		fetch(url, fetchInit)
		.then(
			function(resp){
				if (resp.ok){
					resp.json().then(function(jsonResp){
						if (jsonResp.status === 200){
							okCallback(jsonResp.data);
						} else {
							message.error(jsonResp.err || I18n.getText('ajax.failed')); 
							errCallback(jsonResp.err)
						}
					});
				} else {
					message.error(resp); 
					errCallback(resp);
				}				
			},
			function(err){
				message.error(err); 
				errCallback(err);
			}
	    );
	}, 

	get: function(url, params, okCallback, errCallback){
		this.doAjax(url, 'GET', params, okCallback, errCallback);
	},

	post: function(url, params, okCallback, errCallback){
		this.doAjax(url, 'POST', params, okCallback, errCallback);
	},

	isEmptyObj: function(obj){
		for (var key in obj) {
			return false;
		}
		return true;
	}
};

export { Ajax };

