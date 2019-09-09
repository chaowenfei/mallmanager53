import axios from 'axios'
// 插件导入的模块
const MyHttpServer = {}

MyHttpServer.install = function (Vue) {
  axios.defaults.baseURL = 'http://api.xiaomadagege.cn:8808/api/private/v1/'
  Vue.prototype.$http = axios
}

export default MyHttpServer
