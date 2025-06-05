'use client';

import axios from 'axios';

// Базовый URL API
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

// Глобальная переменная для отслеживания процесса обновления токена
let isRefreshing = false;
let lastFetchTime = 0;

/**
 * Получение токена из localStorage
 */
export const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('access_token');
  }
  return null;
};

/**
 * Получение refresh токена из localStorage
 */
export const getRefreshToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('refresh_token');
  }
  return null;
};

/**
 * Сохранение токенов в localStorage
 */
export const setTokens = (accessToken, refreshToken) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
  }
};

/**
 * Удаление токенов из localStorage
 */
export const removeTokens = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }
};

/**
 * Проверка авторизации пользователя
 */
export const isAuthenticated = () => {
  if (typeof window === 'undefined') {
    return false;
  }
  
  const token = localStorage.getItem('access_token');
  return !!token;
};

/**
 * Получение данных пользователя
 */
export const getUserData = async () => {
  try {
    const token = getToken();
    if (!token) return null;
    const now = Date.now();
    if (now - lastFetchTime < 2000) {
      const cachedUser = localStorage.getItem('user');
      return cachedUser ? JSON.parse(cachedUser) : null;
    }
    
    lastFetchTime = now;

    const response = await fetch(`${API_URL}/api/auth/me/`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      if (response.status === 401 && !isRefreshing) {
        isRefreshing = true;
        try {
          const refreshed = await refreshToken();
          isRefreshing = false;
          
          if (refreshed.success) {
            const newToken = getToken();
            const newResponse = await fetch(`${API_URL}/api/auth/me/`, {
              headers: {
                'Authorization': `Bearer ${newToken}`
              }
            });
            
            if (newResponse.ok) {
              const userData = await newResponse.json();
              localStorage.setItem('user', JSON.stringify(userData));
              return userData;
            }
          } else {
            removeTokens();
            return null;
          }
        } catch (error) {
          isRefreshing = false;
          removeTokens();
          return null;
        }
      }
      throw new Error('Ошибка получения данных пользователя');
    }

    const userData = await response.json();
    localStorage.setItem('user', JSON.stringify(userData));
    return userData;
  } catch (error) {
    console.error('Ошибка получения данных пользователя:', error);
    return null;
  }
};

/**
 * Обновление токена
 */
export const refreshToken = async () => {
  try {
    const refreshToken = getRefreshToken();
    
    if (!refreshToken) {
      return { success: false };
    }
    
    const response = await axios.post(`${API_URL}/api/auth/token/refresh/`, {
      refresh: refreshToken
    });
    
    localStorage.setItem('access_token', response.data.access);
    
    return { success: true };
  } catch (error) {
    console.error('Token refresh error:', error);
    return { success: false };
  }
};

/**
 * Вход пользователя
 */
export const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/login/`, {
      username,
      password
    });
    localStorage.setItem('access_token', response.data.access);
    localStorage.setItem('refresh_token', response.data.refresh);
    const userResponse = await axios.get(`${API_URL}/api/auth/me/`, {
      headers: {
        'Authorization': `Bearer ${response.data.access}`
      }
    });
    localStorage.setItem('user', JSON.stringify(userResponse.data));
    
    return { success: true, user: userResponse.data };
  } catch (error) {
    console.error('Login error:', error);
    
    let errorMessage = 'Произошла ошибка при входе';
    
    if (error.response) {
      if (error.response.data && Array.isArray(error.response.data.email_verified) && error.response.data.email_verified[0] === 'False') {
        return { 
          success: false, 
          requireEmailVerification: true,
          email: error.response.data.email,
          username: error.response.data.username,
          first_name: error.response.data.first_name,
          last_name: error.response.data.last_name
        };
      }
      if (error.response.status === 401) {
        errorMessage = 'Неверное имя пользователя или пароль';
      } else if (error.response.data?.detail) {
        errorMessage = error.response.data.detail;
      }
    }
    
    return { success: false, error: errorMessage };
  }
};

/**
 * Регистрация пользователя
 */
export const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/register/`, userData);
    if (response.data && response.data.access_token) {
      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('refresh_token', response.data.refresh_token);
    }
    
    return { success: true, user: response.data.user };
  } catch (error) {
    console.error('Registration error:', error);
    let errorMessage = 'Произошла ошибка при регистрации';
    
    if (error.response && error.response.data) {
      if (typeof error.response.data === 'object') {
        const errorFields = Object.keys(error.response.data);
        if (errorFields.length > 0) {
          const field = errorFields[0];
          const message = error.response.data[field];
          errorMessage = Array.isArray(message) ? message[0] : message;
        }
      } else if (error.response.data.detail) {
        errorMessage = error.response.data.detail;
      }
    }
    
    return { success: false, error: errorMessage };
  }
};

/**
 * Выход пользователя
 */
export const logout = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
};

/**
 * Получение текущего пользователя
 */
export const getCurrentUser = () => {
  if (typeof window === 'undefined') {
    return null;
  }
  
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

/**
 * Проверка email
 */
export const verifyEmail = async (code, email) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/auth/verify-email/`,
      { code, email },
      { 
        headers: { 
          'Content-Type': 'application/json'
        } 
      }
    );

    if (response.data.access && response.data.refresh) {
      setTokens(response.data.access, response.data.refresh);
    }
    if (response.data && response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return { success: true, message: response.data.message };
  } catch (error) {
    console.error('Email verification error:', error);
    let errorMessage = 'Произошла ошибка при проверке кода';
    
    if (error.response && error.response.data && error.response.data.error) {
      errorMessage = error.response.data.error;
    }
    
    return { success: false, error: errorMessage };
  }
};

/**
 * Повторная отправка кода
 */
export const resendVerificationCode = async (email) => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/resend-verification/`, { email });
    
    return { success: true, message: response.data.message };
  } catch (error) {
    console.error('Resend verification code error:', error);
    let errorMessage = 'Произошла ошибка при отправке кода';
    
    if (error.response && error.response.data && error.response.data.error) {
      errorMessage = error.response.data.error;
    }
    
    return { success: false, error: errorMessage };
  }
};