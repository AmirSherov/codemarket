'use client';

import { useEffect, useRef } from 'react';
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
  const callbackRef = useRef(onAuthStateChanged);
  
  useEffect(() => {
    callbackRef.current = onAuthStateChanged;
  }, [onAuthStateChanged]);
  
  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = isAuthenticated();
      
      if (requireAuth && !isAuth) {
        if(pathname === '/'){
          return;
        }
        router.push('/pages/auth');
        return;
      }
      
      if (isAuth && pathname === '/pages/auth') {
        router.push('/pages/dashboard');
        return;
      }
      
      if (isAuth) {
        const userData = await getUserData();
        if (!userData && requireAuth) {
          router.push('/pages/auth');
          return;
        }
        
        if (callbackRef.current) {
          callbackRef.current(userData);
        }
      }
    };
    
    checkAuth();
  }, [pathname, requireAuth, router]);
};

/**
 * Хук для проверки авторизации при каждом изменении URL
 * @param {Function} onUserDataChange - Колбэк, вызываемый при получении данных пользователя
 */
export const useAuthCheck = (onUserDataChange = null) => {
  const pathname = usePathname();
  const lastCheckedRef = useRef(0);
  const callbackRef = useRef(onUserDataChange);
  useEffect(() => {
    callbackRef.current = onUserDataChange;
  }, [onUserDataChange]);
  
  useEffect(() => {
    const checkAuthStatus = async () => {
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
  }, [pathname])
}; 