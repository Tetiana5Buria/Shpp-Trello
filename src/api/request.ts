// src/api/request.ts
import axios from 'axios';
import { api } from '../common/constants'; // об'єкт із baseURL
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
  await new Promise((res) => setTimeout(res, 200));
  return config;
});

instance.interceptors.response.use(
  (response) => {
    NProgress.done();
    return response;
  },
  (error) => {
    NProgress.done();
    return Promise.reject(error);
  }
);

instance.interceptors.response.use((res) => res.data);

export default instance;
