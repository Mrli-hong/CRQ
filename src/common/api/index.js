import axios from "axios";
const config = {
  timeout: 100000000,
};

const instance = axios.create(config);

// 添加请求拦截器
instance.interceptors.request.use(
  (config) => config,
  (err) => Promise.reject(err)
);

// 添加响应拦截器
instance.interceptors.response.use(
  (res) => res,
  (err) => Promise.reject(err)
);

export default instance;
