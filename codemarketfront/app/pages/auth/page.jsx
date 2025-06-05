'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Loader from '../../components/loader/index';
import { login, register, isAuthenticated, verifyEmail, resendVerificationCode } from '../../utilits/auth';
import { useRouteGuard } from '../../utilits/routeGuard';
import VerifyEmail from '../../components/verify-email/VerifyEmail';
import EmailVerificationModal from '../../components/modal/EmailVerificationModal';
import './auth.scss';

const AuthPage = () => {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });
  
  const [registerData, setRegisterData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    age: '',
    password: '',
    password2: ''
  });
  
  // Используем хук защиты маршрута с обратным требованием (requireAuth = false)
  // Это предотвратит доступ авторизованных пользователей к странице авторизации
  useRouteGuard(false);
  
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };
  
  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData({ ...registerData, [name]: value });
  };
    const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const result = await login(loginData.username, loginData.password);
    
    if (result.success) {
      router.push('/pages/dashboard');
    } else if (result.requireEmailVerification) {
      let emailValue = result.email;
      if (Array.isArray(emailValue) && emailValue.length > 0) {
        emailValue = emailValue[0];
      } else if (Array.isArray(emailValue)) {
        emailValue = '';
      }
      setRegisteredEmail(String(emailValue || ''));
  
      setShowVerificationModal(true);
      setError(''); 
    } else if (result.error) {
      setError(result.error);
    }
    
    setLoading(false);
  };
  
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const result = await register(registerData);
    if (result.success) {
      let emailValue = registerData.email; 
      if (Array.isArray(emailValue) && emailValue.length > 0) {
        emailValue = emailValue[0];
      } else if (Array.isArray(emailValue)) {
        emailValue = '';
      }
      setRegisteredEmail(String(emailValue || ''));
      
      setShowVerification(true);
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };
    const handleVerificationConfirm = async () => {
    setShowVerificationModal(false);
    setShowVerification(true); 

    try {
      if (!registeredEmail) {
        console.error('[AuthPage] Email для повторной отправки кода не найден.');
        setError('Email не найден. Попробуйте инициировать отправку с экрана верификации.');
        return;
      }

      const result = await resendVerificationCode(registeredEmail);

      if (result && result.success) {
        setError(''); 
      } else {
        const errorMessage = (result && result.error) || 'Не удалось повторно отправить код подтверждения.';
        console.error('[AuthPage] Ошибка при повторной отправке кода:', errorMessage);
        setError(errorMessage + ' Попробуйте снова с экрана верификации.');
      }
    } catch (err) {
      console.error('[AuthPage] Критическая ошибка при resendVerificationCode:', err);
      setError('Произошла критическая ошибка при повторной отправке кода. Попробуйте снова с экрана верификации.');
    }
  };
  
  const handleVerificationCancel = () => {
    setShowVerificationModal(false);
  };
  
  if (loading) {
    return <Loader />;
  }
  
  if (showVerification) {
    return (
      <VerifyEmail 
        email={registeredEmail} 
        onBack={() => setShowVerification(false)} 
      />
    );
  }
  
  
  return (
    <>
          {showVerificationModal && (
        <EmailVerificationModal 
          email={registeredEmail}
          onConfirm={handleVerificationConfirm}
          onCancel={handleVerificationCancel}
        />
      )}
    <div className="auth-container">      
      <div className="auth-card">
        <div className="auth-logo">
          <span className="logo-icon">✱</span>
          <span className="logo-text">CodeMarket</span>
        </div>
        
        <h1 className="auth-title">
          {isLogin ? 'Добро пожаловать!' : 'Создание аккаунта'}
        </h1>
        
        {/* {error && <div className="auth-error">{error}</div>} */}
        
        {isLogin ? (
          <>
            <form className="auth-form" onSubmit={handleLoginSubmit}>
              <div className="form-group">
                <label htmlFor="username">Имя пользователя</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={loginData.username}
                  onChange={handleLoginChange}
                  placeholder="Введите имя пользователя"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="password">Пароль</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  placeholder="Введите пароль"
                  required
                />
              </div>
              
              <div className="forgot-password">
                <a href="#">Забыли пароль?</a>
              </div>
              
              <button type="submit" className="auth-button login-button">
                Войти
              </button>
            </form>
            
            <div className="auth-switch">
              <p>Нет аккаунта?</p>
              <a
                className="switch-button"
                onClick={() => {
                  setIsLogin(false);
                  setError('');
                }}
              >
                Зарегистрироваться
              </a>
            </div>
          </>
        ) : (
          <>
            <form className="auth-form" onSubmit={handleRegisterSubmit}>
              <div className="form-group">
                <label htmlFor="reg-username">Имя пользователя</label>
                <input
                  type="text"
                  id="reg-username"
                  name="username"
                  value={registerData.username}
                  onChange={handleRegisterChange}
                  placeholder="Введите имя пользователя"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={registerData.email}
                  onChange={handleRegisterChange}
                  placeholder="Введите email"
                  required
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="first_name">Имя</label>
                  <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    value={registerData.first_name}
                    onChange={handleRegisterChange}
                    placeholder="Введите имя"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="last_name">Фамилия</label>
                  <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    value={registerData.last_name}
                    onChange={handleRegisterChange}
                    placeholder="Введите фамилию"
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="age">Возраст</label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={registerData.age}
                  onChange={handleRegisterChange}
                  placeholder="Введите возраст"
                  min="1"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="reg-password">Пароль</label>
                <input
                  type="password"
                  id="reg-password"
                  name="password"
                  value={registerData.password}
                  onChange={handleRegisterChange}
                  placeholder="Введите пароль"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="password2">Подтверждение пароля</label>
                <input
                  type="password"
                  id="password2"
                  name="password2"
                  value={registerData.password2}
                  onChange={handleRegisterChange}
                  placeholder="Подтвердите пароль"
                  required
                />
              </div>
              
              <button type="submit" className="auth-button register-button">
                Зарегистрироваться
              </button>
            </form>
            
            <div className="auth-switch">
              <p>Уже есть аккаунт?</p>
              <a
                className="switch-button"
                onClick={() => {
                  setIsLogin(true);
                  setError('');
                }}
              >
                Войти
              </a>
            </div>
          </>
        )}
      </div>
    </div>
    </>
  );
};

export default AuthPage;
