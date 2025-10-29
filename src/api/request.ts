import axios from 'axios';
import { api } from '../common/constants';
import NProgress from 'nprogress';
import '../styles/nprogress.scss';

const instance = axios.create({
  baseURL: api.baseURL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Bearer 123',
  },
});

instance.interceptors.request.use(async (config) => {
  NProgress.start();
  await new Promise((res) => setTimeout(res, 500));
  return config;
});

instance.interceptors.response.use(
  (response) => {
    NProgress.done();
    return response.data;
  },
  (error) => {
    NProgress.done();
    return Promise.reject(error);
  }
);

export default instance;
