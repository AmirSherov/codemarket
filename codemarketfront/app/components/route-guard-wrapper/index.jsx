'use client';
import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAuthStatusCheck } from '../../utilits/enhancedRouteGuard';

/**
 * Компонент-обертка для защиты маршрутов на уровне макета
 * Выполняет периодическую проверку статуса авторизации
 */
const RouteGuardWrapper = ({ children }) => {
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  
  // Используем хук для периодической проверки статуса авторизации
  useAuthStatusCheck((userData) => {
    setUser(userData);
  });
  
  return (
    <>
      {children}
    </>
  );
};

export default RouteGuardWrapper; 