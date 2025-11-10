import axios from 'axios';
import { api } from '../common/constants';

const publicInstance = axios.create({
  baseURL: api.baseURL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Bearer 123',
  },
});

export default publicInstance;
