import { NextResponse } from 'next/server';

/**
 * Middleware для проверки авторизации на уровне сервера
 * Проверяет наличие токена в cookie и перенаправляет неавторизованных пользователей
 * с защищенных маршрутов на страницу авторизации
 */
export function middleware(request) {
  const token = request.cookies.get('access_token');
  const { pathname } = request.nextUrl;

  // Список защищенных путей
  const protectedPaths = ['/pages/dashboard', '/pages/profile'];
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));
  if (!token && isProtectedPath) {
    const url = request.nextUrl.clone();
    url.pathname = '/pages/auth';
    return NextResponse.redirect(url);
  }
  if (token && pathname.startsWith('/pages/auth')) {
    const url = request.nextUrl.clone();
    url.pathname = '/pages/dashboard';
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  // Применяем middleware к указанным путям.
  matcher: ['/pages/dashboard', '/pages/profile', '/pages/auth'],
}; 