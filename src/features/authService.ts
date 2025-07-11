import type { AppDispatch } from '../app/reduxStore';
import { setToken } from './authSlice';

const API_URL = import.meta.env.VITE_API_URL;

const authHeaders = {
  'Content-Type': 'application/json',
};

const defaultUser = {
  email: "petro12255@gmail.com",
  name: "Petrov Petro",
  password: "super-password",
  confirmPassword: "super-password",
};

export const registerUser = async (dispatch: AppDispatch): Promise<void> => {
  const response = await fetch(`${API_URL}/users`, {
    method: "POST",
    headers: authHeaders,
    body: JSON.stringify(defaultUser),
  });

  const data = await response.json();

  if (data.status === 1 && data.token) {
    dispatch(setToken(data.token));
    return;
  }

  // Якщо користувач вже існує — спробуй логін
  if (data.error?.code === "USER_EXISTS" || data.error?.code === "EMAIL_NOT_UNIQUE") {
    return loginUser(defaultUser.email, defaultUser.password, dispatch);
  }

  console.error("❌ Auth error:", data);
  throw new Error(data?.error?.code || "Registration failed");
};


export const loginUser = async (
  email: string,
  password: string,
  dispatch: AppDispatch
): Promise<void> => {
  const response = await fetch(`${API_URL}/sessions`, {
    method: "POST",
    headers: authHeaders,
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (data.status === 1 && data.token) {
    dispatch(setToken(data.token));
    return;
  }

  console.error("❌ Login error:", data);
  throw new Error(data?.error?.code || "Login failed");
};

