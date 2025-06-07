'use client';

import axios from 'axios';
import Cookies from 'js-cookie';

const isClient = typeof window !== 'undefined';

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'

let isRefreshing = false;
let lastFetchTime = 0;

/**
 * Получение токена из localStorage и cookie
 */
export const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('access_token') || Cookies.get('access_token');
  }
  return null;
};

/**
 * Получение refresh токена из localStorage
 */
export const getRefreshToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('refresh_token') || Cookies.get('refresh_token');
  }
  return null;
};

/**
 * Сохранение токенов в localStorage и cookie
 */
export const setTokens = (accessToken, refreshToken) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
    const secure = window.location.protocol === 'https:';
    Cookies.set('access_token', accessToken, { 
      expires: 1,
      path: '/',
      secure: secure,
      sameSite: 'Lax'
    });
    
    Cookies.set('refresh_token', refreshToken, { 
      expires: 7,
      path: '/',
      secure: secure,
      sameSite: 'Lax'
    });
  }
};

/**
 * Удаление токенов из localStorage и cookie
 */
export const removeTokens = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    
    Cookies.remove('access_token', { path: '/' });
    Cookies.remove('refresh_token', { path: '/' });
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
export async function getUserData() {
  if (!isClient) return null;
  
  const token = localStorage.getItem('access_token');
  if (!token) return null;
  
  try {
    const response = await fetch(`${API_URL}/api/auth/me/`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.ok) {
      const userData = await response.json();
      localStorage.setItem('user', JSON.stringify(userData));
      return userData;
    } else {
      logout();
      return null;
    }
  } catch (error) {
    console.error('Ошибка при получении данных пользователя:', error);
    return null;
  }
}

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
export async function login(username, password) {
  try {
    const response = await fetch(`${API_URL}/api/auth/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok) {
      if (isClient) {
        setTokens(data.access, data.refresh);
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }
      }
      return { success: true };
    } else {
      const emailVerified = Array.isArray(data.email_verified) 
        ? data.email_verified[0] === "True"
        : data.email_verified === true || data.email_verified === "True";

      if (!emailVerified) {
        return {
          success: false,
          requireEmailVerification: true,
          email: data.email,
          username: data.username,
        };
      } else {
        return {
          success: false,
          error: data.detail || 'Неверное имя пользователя или пароль',
        };
      }
    }
  } catch (error) {
    console.error('Ошибка при входе:', error);
    return {
      success: false,
      error: 'Произошла ошибка при входе. Пожалуйста, попробуйте позже.',
    };
  }
}

/**
 * Регистрация пользователя
 */
export async function register(userData) {
  try {
    const formattedData = { ...userData };
    
    const response = await fetch(`${API_URL}/api/auth/register/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formattedData),
    });

    const data = await response.json();

    if (response.ok) {
      return { success: true, user: data.user };
    } else {
      const errorMessage = data.detail || 
        Object.values(data).flat().join(', ') || 
        'Ошибка при регистрации';
      
      return { success: false, error: errorMessage };
    }
  } catch (error) {
    console.error('Ошибка при регистрации:', error);
    return {
      success: false,
      error: 'Произошла ошибка при регистрации. Пожалуйста, попробуйте позже.',
    };
  }
}

/**
 * Выход пользователя
 */
export function logout() {
  if (isClient) {
    removeTokens();
  }
}

/**
 * Получение текущего пользователя
 */
export function getCurrentUser() {
  if (!isClient) return null;
  
  const userJson = localStorage.getItem('user');
  if (!userJson) return null;
  
  try {
    return JSON.parse(userJson);
  } catch (error) {
    console.error('Ошибка при парсинге данных пользователя:', error);
    return null;
  }
}

/**
 * Проверка email
 */
export async function verifyEmail(email, code) {
  try {
    const response = await fetch(`${API_URL}/api/auth/verify-email/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, code }),
    });

    const data = await response.json();

    if (response.ok) {
      if (isClient) {
        setTokens(data.access, data.refresh);
        localStorage.setItem('user', JSON.stringify(data.user || {}));
      }
      return { success: true, message: data.message };
    } else {
      return { success: false, error: data.error || 'Ошибка при верификации email' };
    }
  } catch (error) {
    console.error('Ошибка при верификации email:', error);
    return {
      success: false,
      error: 'Произошла ошибка при верификации email. Пожалуйста, попробуйте позже.',
    };
  }
}

/**
 * Повторная отправка кода подтверждения
 */
export async function resendVerificationCode(email) {
  try {
    const response = await fetch(`${API_URL}/api/auth/resend-verification/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (response.ok) {
      return { success: true, message: data.message };
    } else {
      return { success: false, error: data.error || 'Ошибка при отправке кода' };
    }
  } catch (error) {
    console.error('Ошибка при отправке кода:', error);
    return {
      success: false,
      error: 'Произошла ошибка при отправке кода. Пожалуйста, попробуйте позже.',
    };
  }
}

/**
 * Получение токена доступа
 */
export function getAccessToken() {
  if (!isClient) return null;
  return localStorage.getItem('access_token');
}

/**
 * Обновление профиля пользователя
 */
export async function updateUserProfile(formData) {
  try {
    const token = getAccessToken();
    if (!token) {
      return { success: false, error: 'Пользователь не авторизован' };
    }
    
    const response = await fetch(`${API_URL}/api/auth/me/`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData,
    });

    if (response.ok) {
      const updatedUserData = await getUserData();
      return { success: true, user: updatedUserData };
    } else {
      const data = await response.json();
      return { 
        success: false, 
        error: data.detail || Object.values(data).flat().join(', ') || 'Ошибка при обновлении профиля' 
      };
    }
  } catch (error) {
    console.error('Ошибка при обновлении профиля:', error);
    return {
      success: false,
      error: 'Произошла ошибка при обновлении профиля. Пожалуйста, попробуйте позже.',
    };
  }
}

/**
 * Получение профессий
 */
export async function getProfessions() {
  try {
    console.log('Fetching professions...');
    const response = await fetch(`${API_URL}/api/auth/professions/`);
    
    if (!response.ok) {
      throw new Error('Не удалось загрузить профессии');
    }
    
    const data = await response.json();
    console.log('Received professions:', data);
    return { success: true, professions: data };
  } catch (error) {
    console.error('Ошибка при загрузке профессий:', error);
    return {
      success: false,
      error: 'Произошла ошибка при загрузке профессий. Пожалуйста, попробуйте позже.',
    };
  }
}

/**
 * Получение технологий по ID профессии
 */
export async function getTechnologiesByProfession(professionId) {
  try {
    console.log('Fetching technologies for profession:', professionId);
    const response = await fetch(`${API_URL}/api/auth/technologies/?profession_id=${professionId}`);
    
    if (!response.ok) {
      throw new Error('Не удалось загрузить технологии');
    }
    
    const data = await response.json();
    console.log('Received technologies:', data);
    return { success: true, technologies: data };
  } catch (error) {
    console.error('Ошибка при загрузке технологий:', error);
    return {
      success: false,
      error: 'Произошла ошибка при загрузке технологий. Пожалуйста, попробуйте позже.',
    };
  }
}