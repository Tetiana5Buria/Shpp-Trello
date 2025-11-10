import axios from 'axios';
import { api } from '../common/constants';
import NProgress from 'nprogress';
import '../styles/nprogress.scss';

const instance = axios.create({
  baseURL: api.baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

instance.interceptors.request.use((config) => {
  NProgress.start();
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
//401
instance.interceptors.response.use(
  (response) => {
    NProgress.done();
    return response;
  },
  async (error) => {
    NProgress.done();
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const res = await instance.post('/refresh', { refreshToken });
        const { token, refreshToken: newRefresh } = res.data;

        localStorage.setItem('authToken', token);
        localStorage.setItem('refreshToken', newRefresh);

        instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        return instance(originalRequest);
      } catch (refreshError) {
        // eslint-disable-next-line no-console
        console.error('Token refresh failed:', refreshError);
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
