import queryString from 'query-string'
import { message } from 'antd'
import t from './i18n'

/**
 * Ajax with fetch API
 */
export const Ajax = {

  get: function (url, params, okCallback, errCallback) {
    this.doAjax(url, 'GET', params, okCallback, errCallback)
  },

  post: function (url, params, okCallback, errCallback) {
    this.doAjax(url, 'POST', params, okCallback, errCallback)
  },

  isEmptyObj: function (o) {
    return Object.keys(o).length === 0
  },

  doAjax: function (url, method, params, okCallback, errCallback) {
    var fetchInit = {
      //pass cookies, for authentication
      credentials: 'include'
    }
    fetchInit.method = method

    if (!this.isEmptyObj(params)) {
      if (fetchInit.method === 'GET') {
        url += '?' + queryString.stringify(params)
      } else if (fetchInit.method === 'POST') {
        // headers
        var headers = new Headers()
        headers.append('Content-Type', 'application/json')
        fetchInit.headers = headers
        fetchInit.body = JSON.stringify(params)
      }
    }

    okCallback = okCallback || function () {}
    errCallback = errCallback || function (err) {}

    fetch(url, fetchInit).then(function (resp) {
        if (resp.ok) {
          resp.json().then(function (jsonResp) {
            if (jsonResp.status === 200) {
              okCallback(jsonResp.data)
            } else {
              message.error(jsonResp.err || t('ajax.failed'))
              errCallback(jsonResp.err)
            }
          }, errCallback)
        } else {
          message.error(resp)
          errCallback(resp)
        }
      }, function (err) {
        message.error(err)
        errCallback(err)
      }
    )
  }
}
