import api from '../../api/request'; // інстанс із токеном (авторизовані запити)
import publicApi from '../../api/publicRequest'; // інстанс без токена (публічні запити)

// 🔹 Типи відповідей бекенду
export interface RegisterResponse {
  result: string; // "Created"
  id: number;
}

export interface LoginResponse {
  result: string; // "Authorized"
  token: string;
  refreshToken: string;
}

export interface UserCheckResponse {
  id: number;
  username: string;
}

export async function checkExistingUser(emailOrUsername: string): Promise<boolean> {
  const response = await publicApi.get<UserCheckResponse[]>(`/user`, {
    params: { emailOrUsername },
  });

  return Array.isArray(response.data) && response.data.length > 0;
}

export async function registerUser(email: string, password: string): Promise<RegisterResponse> {
  const response = await publicApi.post<RegisterResponse>('/user', { email, password });
  return response.data;
}

export async function loginUser(email: string, password: string): Promise<LoginResponse> {
  const response = await publicApi.post<LoginResponse>('/login', { email, password });

  const { token, refreshToken } = response.data;

  if (token && refreshToken) {
    localStorage.setItem('authToken', token);
    localStorage.setItem('refreshToken', refreshToken);
  }

  return response.data;
}

export async function refreshToken(): Promise<LoginResponse> {
  const storedRefreshToken = localStorage.getItem('refreshToken');

  if (!storedRefreshToken) {
    throw new Error('Refresh token not found');
  }

  const response = await api.post<LoginResponse>('/refresh', {
    refreshToken: storedRefreshToken,
  });

  const { token, refreshToken: newRefresh } = response.data;

  if (token && newRefresh) {
    localStorage.setItem('authToken', token);
    localStorage.setItem('refreshToken', newRefresh);
  }

  return response.data;
}
