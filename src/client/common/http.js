import GLOBAL from '@/configs/global'
import axios from './axios'

export default class Http {
  static async request (method, url, opts = {}) {
    // 开启本地 mock 的话，不使用接口域名
    let hostName = GLOBAL.isMock ? '' : '/api'

    let uri = url.startsWith('http') ? url : hostName + url

    // 接口别名、请求方式及url
    let params = {
      xhrName: opts.name || '',
      method,
      url: uri,
      params: opts.params || {},
      data: opts.data || {}
    }

    // 设置特殊请求头
    if (opts.type === 'formData') {
      params.headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }

    return axios(params)
  }

  static get (url, opts) {
    return this.request('GET', url, opts)
  }

  static put (url, opts) {
    return this.request('PUT', url, opts)
  }

  static post (url, opts) {
    return this.request('POST', url, opts)
  }

  static patch (url, opts) {
    return this.request('PATCH', url, opts)
  }

  static delete (url, opts) {
    return this.request('DELETE', url, opts)
  }
}
