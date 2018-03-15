import userApi from './user';
import q from 'jan-request';
import util from './util';
var jq = new q();

/**
 * 初始化配置
 */
jq.init({
  baseURL: '/projectmanager/',
  timeout: 30000,
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
})

/**
 * 添加路由
 */
jq.use(userApi);

/**
 * 添加拦截器
 */
jq.interceptor({
  request: function (config) {
    return config;
  },
  response: function (response) {
    var _response = response.data;
    if (_response.code == '00005') {
      util.layout();
    }
    return response;
  },
  responseError: function (error) {
    return error;
  }
});

export default jq;
