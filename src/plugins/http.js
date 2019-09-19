import axios from 'axios'
// 插件导入的模块
const MyHttpServer = {}

MyHttpServer.install = function (Vue) {
  axios.defaults.baseURL = 'http://api.xiaomadagege.cn:3001/api/private/v1/'
  // 请求发起之前，设置头部
  axios.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    if (config.url !== 'login') {
      const AUTH_TOKEN = localStorage.getItem('token')
      config.headers['Authorization'] = AUTH_TOKEN
    }
    return config
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  })

  // 添加响应拦截器
  axios.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    return response
  }, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error)
  })
  // 添加实例方法
  Vue.prototype.$http = axios
}

export default MyHttpServer
