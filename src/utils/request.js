import axios from 'axios';
import { message } from 'antd';

// 创建axios实例
const axiosInstance = axios.create({
  timeout: 30000,
  withCredentials: true
});

// 请求拦截器
axiosInstance.interceptors.request.use(
  (config) => {
    config.headers['request-ajax'] = true;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
axiosInstance.interceptors.response.use(
  (response) => {
    const res = response.data;
    if (res.code === 401 || res.code === 502) {
      message.error('登录已过期，请重新登录');
      // 这里需要在组件中使用useNavigate，所以拦截器中不直接跳转
      return Promise.reject(res);
    } else if (res.code === 500 || res.code === 501) {
      message.error(res.message || '服务器错误');
      return Promise.reject(res);
    } else {
      return Promise.resolve(res);
    }
  },
  (error) => {
    message.error(error.message || '网络错误');
    return Promise.reject(error);
  }
);

const request = (options) => {
  return axiosInstance(options);
};

const post = (url, params) => {
  return request({
    url,
    method: 'post',
    data: params,
    headers: { 'Content-Type': 'application/json' }
  });
};

const get = (url, params) => {
  return request({
    url,
    method: 'get',
    params
  });
};

const form = (url, params) => {
  return request({
    url,
    method: 'post',
    data: params,
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

export { post, get, form };