import axios from 'axios'

// 修改默认配置
axios.defaults.headers.post['Content-Type'] = 'application/json'
axios.defaults.headers.get['Content-Type'] = 'application/json'
// axios.defaults.withCredentials = true // 表示是否跨域访问请求

const CancelToken = axios.CancelToken
const httpPending = [] // 用于存储每个ajax请求的取消函数和ajax标识

// 取消请求方法
const cancelHttp = (name, config = {}) => {
  httpPending.forEach((e, i) => {
    if (e.n === name || e.n === config.xhrName) { // 当前请求在数组中存在时执行函数体
      e.f() // 执行取消操作
      httpPending.splice(i, 1) // 把这条记录从数组中移除
    }
  })
}

// 请求拦截器
axios.interceptors.request.use(config => {
  // 取消上一次未完成的相同请求，注意项目中是否存在风险
  cancelHttp(null, config)

  config.cancelToken = new CancelToken(c => {
    if (config.xhrName) {
      httpPending.push({
        n: config.xhrName,
        u: `${config.url}&${config.method}`,
        f: c
      })
    }
  })

  return config
}, error => Promise.reject(error))

// 响应拦截器
axios.interceptors.response.use(res => {
  cancelHttp(null, res.config) // 响应成功把已经完成的请求从 httpPending 中移除

  const response = res.data

  return Promise.resolve(response)
}, error => Promise.reject(error))

export default axios
