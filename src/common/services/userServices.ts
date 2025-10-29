// src/common/services/userServices.ts
import api from '../../api/request';

export interface RegisterResponse {
  result: string;
  id: number;
}

export async function checkExistingUser(emailOrUsername: string): Promise<boolean> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const users = (await api.get(`/user`, { params: { emailOrUsername } })) as any;
  return Array.isArray(users) && users.length > 0;
}

export async function registerUser(email: string, password: string): Promise<RegisterResponse> {
  const res = (await api.post('/user', { email, password })) as RegisterResponse;
  return res;
}
