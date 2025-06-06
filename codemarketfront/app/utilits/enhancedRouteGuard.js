'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { isAuthenticated, getUserData, getToken, refreshToken } from './auth';

/**
 * Улучшенный хук для защиты маршрутов с дополнительными проверками безопасности
 * @param {Object} options - Опции для настройки защиты маршрута
 * @param {boolean} options.requireAuth - Требуется ли авторизация для доступа к маршруту
 * @param {boolean} options.isAuthPage - Является ли страница страницей авторизации
 * @param {Function} options.onAuthStateChanged - Колбэк, вызываемый при изменении состояния авторизации
 * @returns {Object} - Объект с состоянием загрузки и данными пользователя
 */
export const useEnhancedRouteGuard = ({
  requireAuth = true,
  isAuthPage = false,
  onAuthStateChanged = null
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const callbackRef = useRef(onAuthStateChanged);
  const authCheckTimeoutRef = useRef(null);
  const lastCheckedRef = useRef(0);
  
  useEffect(() => {
    callbackRef.current = onAuthStateChanged;
  }, [onAuthStateChanged]);

  const isTokenValid = (token) => {
    if (!token) return false;
    
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      
      const { exp } = JSON.parse(jsonPayload);
      const currentTime = Date.now() / 1000;
      
      return exp > currentTime;
    } catch (e) {
      console.error('Ошибка при проверке токена:', e);
      return false;
    }
  };
  
  useEffect(() => {
    return () => {
      if (authCheckTimeoutRef.current) {
        clearTimeout(authCheckTimeoutRef.current);
      }
    };
  }, []);
  
  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      const now = Date.now();
      if (now - lastCheckedRef.current < 1000) {
        authCheckTimeoutRef.current = setTimeout(checkAuth, 1000);
        return;
      }
      lastCheckedRef.current = now;
      
      const isAuth = isAuthenticated();
      const token = getToken();
      const isTokenOk = isTokenValid(token);
      if (isAuth && !isTokenOk) {
        const refreshResult = await refreshToken();
        if (!refreshResult.success) {
          if (requireAuth) {
            router.push('/pages/auth');
            setLoading(false);
            return;
          }
        }
      }
      if (isAuthPage && isAuth) {
        router.push('/pages/dashboard');
        setLoading(false);
        return;
      }
      if (requireAuth && !isAuth) {
        if (pathname !== '/') {
          router.push('/pages/auth');
          setLoading(false);
          return;
        }
      }
      if (isAuth) {
        const userDataResult = await getUserData();
        setUserData(userDataResult);
        
        if (!userDataResult && requireAuth) {
          router.push('/pages/auth');
          setLoading(false);
          return;
        }
        
        if (callbackRef.current) {
          callbackRef.current(userDataResult);
        }
      }
      
      setLoading(false);
    };
    
    checkAuth();
  }, [pathname, requireAuth, router, isAuthPage]);
  
  return { loading, userData };
};

/**
 * @param {Function} onUserDataChange 
 */
export const useAuthStatusCheck = (onUserDataChange = null) => {
  const pathname = usePathname();
  const lastCheckedRef = useRef(0);
  const callbackRef = useRef(onUserDataChange);
  const intervalRef = useRef(null);
  
  useEffect(() => {
    callbackRef.current = onUserDataChange;
  }, [onUserDataChange]);
  
  useEffect(() => {
    const checkAuthStatus = async () => {
      const now = Date.now();
      if (now - lastCheckedRef.current < 30000) { 
        return;
      }
      lastCheckedRef.current = now;
      
      if (isAuthenticated()) {
        const token = getToken();
        const isTokenValid = token && (token.split('.').length === 3);
        
        if (!isTokenValid) {
          const refreshResult = await refreshToken();
          if (!refreshResult.success && callbackRef.current) {
            callbackRef.current(null);
            return;
          }
        }
        
        const userData = await getUserData();
        if (callbackRef.current) {
          callbackRef.current(userData);
        }
      } else if (callbackRef.current) {
        callbackRef.current(null);
      }
    };
    checkAuthStatus();
    intervalRef.current = setInterval(checkAuthStatus, 60000); 
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [pathname]);
}; 