'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { isAuthenticated, getUserData } from './auth';

/**
 * Хук для защиты маршрутов, требующих авторизации
 * @param {boolean} requireAuth - Требуется ли авторизация для доступа к маршруту
 * @param {Function} onAuthStateChanged - Колбэк, вызываемый при изменении состояния авторизации
 */
export const useRouteGuard = (requireAuth = true, onAuthStateChanged = null) => {
  const router = useRouter();
  const pathname = usePathname();
  const lastCheckedRef = useRef(0);
  const callbackRef = useRef(onAuthStateChanged);
  
  // Обновляем callbackRef, когда меняется onAuthStateChanged
  useEffect(() => {
    callbackRef.current = onAuthStateChanged;
  }, [onAuthStateChanged]);
  
  useEffect(() => {
    const checkAuth = async () => {
      // Проверяем, не было ли проверки в последние 2 секунды
      const now = Date.now();
      if (now - lastCheckedRef.current < 2000) {
        return;
      }
      lastCheckedRef.current = now;
      
      const isAuth = isAuthenticated();
      
      // Если маршрут требует авторизации и пользователь не авторизован
      if (requireAuth && !isAuth) {
        if(pathname === '/'){
          return;
        }
        router.push('/pages/auth');
        return;
      }
      
      // Если пользователь авторизован и пытается получить доступ к странице авторизации
      if (isAuth && pathname === '/pages/auth') {
        router.push('/pages/dashboard');
        return;
      }
      
      // Если пользователь авторизован, проверяем валидность токена
      if (isAuth) {
        const userData = await getUserData();
        if (!userData && requireAuth) {
          // Если токен недействителен и маршрут требует авторизации
          router.push('/pages/auth');
          return;
        }
        
        // Вызываем колбэк с данными пользователя, если он предоставлен
        if (callbackRef.current) {
          callbackRef.current(userData);
        }
      }
    };
    
    checkAuth();
  }, [pathname, requireAuth, router]); // onAuthStateChanged удален из зависимостей
};

/**
 * Хук для проверки авторизации при каждом изменении URL
 * @param {Function} onUserDataChange - Колбэк, вызываемый при получении данных пользователя
 */
export const useAuthCheck = (onUserDataChange = null) => {
  const pathname = usePathname();
  const lastCheckedRef = useRef(0);
  const callbackRef = useRef(onUserDataChange);
  
  // Обновляем callbackRef, когда меняется onUserDataChange
  useEffect(() => {
    callbackRef.current = onUserDataChange;
  }, [onUserDataChange]);
  
  useEffect(() => {
    const checkAuthStatus = async () => {
      // Проверяем, не было ли проверки в последние 2 секунды
      const now = Date.now();
      if (now - lastCheckedRef.current < 2000) {
        return;
      }
      lastCheckedRef.current = now;
      
      if (isAuthenticated()) {
        const userData = await getUserData();
        if (callbackRef.current) {
          callbackRef.current(userData);
        }
      } else if (callbackRef.current) {
        callbackRef.current(null);
      }
    };
    
    checkAuthStatus();
  }, [pathname]); // onUserDataChange удален из зависимостей
}; 