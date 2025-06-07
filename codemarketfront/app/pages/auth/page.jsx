'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Loader from '../../components/loader/index';
import { login, register, isAuthenticated, verifyEmail, resendVerificationCode } from '../../utilits/api';
import { useEnhancedRouteGuard } from '../../utilits/enhancedRouteGuard';
import VerifyEmail from '../../components/verify-email/VerifyEmail';
import EmailVerificationModal from '../../components/modal/EmailVerificationModal';
import UserTypeSelector from '../../components/user-type-selector/UserTypeSelector';
import ProfessionSelector from '../../components/profession-selector/ProfessionSelector';
import TechnologySelector from '../../components/technology-selector/TechnologySelector';
import EmployerForm from '../../components/employer-form/EmployerForm';
import './auth.scss';

const AuthPage = () => {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [registrationStep, setRegistrationStep] = useState(1);
  const [selectedProfessionId, setSelectedProfessionId] = useState(null);
  
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });
  
  const [registerData, setRegisterData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    birth_date: '',
    password: '',
    password2: '',
    user_type: '',
    company_name: '',
    company_position: '',
    profession_ids: [],
    technology_ids: []
  });
  
  const { loading: authCheckLoading } = useEnhancedRouteGuard({
    requireAuth: false,
    isAuthPage: true
  });
  
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };
  
  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData({ ...registerData, [name]: value });
  };

  const handleUserTypeChange = (userType) => {
    setRegisterData({ ...registerData, user_type: userType });
  };

  const handleProfessionChange = (professionId) => {
    setSelectedProfessionId(professionId);
    setRegisterData({ 
      ...registerData, 
      profession_ids: [professionId],
      technology_ids: [] 
    });
  };

  const handleTechnologiesChange = (selectedTechIds) => {
    setRegisterData({ ...registerData, technology_ids: selectedTechIds });
  };

  const handleEmployerDataChange = (employerData) => {
    setRegisterData({ ...registerData, ...employerData });
  };

  const nextStep = () => {
    setRegistrationStep(registrationStep + 1);
  };

  const prevStep = () => {
    setRegistrationStep(registrationStep - 1);
  };
  
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const result = await login(loginData.username, loginData.password);
    
    if (result.success) {
      router.push('/pages/dashboard');
    } else if (result.requireEmailVerification) {
      const emailValue = Array.isArray(result.email) ? result.email[0] : result.email;
      setRegisteredEmail(emailValue || '');
      setShowVerificationModal(true);
      setError('');
    } else if (result.error) {
      setError(result.error);
    }
    
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };
  
  const handleRegisterSubmit = async (e) => {
    if (e) e.preventDefault();
    if (registerData.user_type === 'job_seeker' && registerData.profession_ids.length === 0) {
      setError('Пожалуйста, выберите хотя бы одну профессию');
      return;
    }
    
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
    
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };
  
  const handleVerificationConfirm = async () => {
    setLoading(true);
    setError('');
    
    try {
      const result = await resendVerificationCode(registeredEmail);
      if (result.success) {
        setShowVerificationModal(false);
        setShowVerification(true);
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('Произошла ошибка при отправке кода. Пожалуйста, попробуйте позже.');
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };
  
  const handleVerificationCancel = () => {
    setShowVerificationModal(false);
  };
  if (authCheckLoading || loading) {
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
  
  const renderRegistrationStep = () => {
    switch (registrationStep) {
      case 1:
        return (
          <form className="auth-form" onSubmit={(e) => { e.preventDefault(); nextStep(); }}>
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
              <label htmlFor="birth_date">Дата рождения</label>
              <input
                type="date"
                id="birth_date"
                name="birth_date"
                value={registerData.birth_date}
                onChange={handleRegisterChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Пароль</label>
              <input
                type="password"
                id="password"
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
            
            <button type="submit" className="auth-button next-button">
              Далее
            </button>
          </form>
        );
      case 2:
        return (
          <div className="auth-form">
            <UserTypeSelector
              selectedType={registerData.user_type}
              onSelect={handleUserTypeChange}
            />
            
            <div className="form-buttons">
              <button 
                type="button" 
                className="auth-button back-button" 
                onClick={prevStep}
              >
                Назад
              </button>
              
              <button 
                type="button" 
                className="auth-button next-button"
                onClick={nextStep}
                disabled={!registerData.user_type}
              >
                Далее
              </button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="auth-form">
            {registerData.user_type === 'job_seeker' ? (
              <>
                <ProfessionSelector
                  selectedProfessions={registerData.profession_ids}
                  onSelect={handleProfessionChange}
                />
                
                <TechnologySelector
                  selectedTechnologies={registerData.technology_ids}
                  onSelect={handleTechnologiesChange}
                  selectedProfessionId={selectedProfessionId}
                />
              </>
            ) : (
              <EmployerForm
                formData={registerData}
                onChange={(field, value) => {
                  setRegisterData({
                    ...registerData,
                    [field]: value
                  });
                }}
              />
            )}
            
            <div className="form-buttons">
              <button 
                type="button" 
                className="auth-button back-button" 
                onClick={prevStep}
              >
                Назад
              </button>
              
              <button 
                type="button" 
                className="auth-button register-button"
                onClick={handleRegisterSubmit}
                disabled={registerData.user_type === 'job_seeker' && registerData.profession_ids.length === 0}
              >
                Зарегистрироваться
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };
  
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
          
          {error && <div className="auth-error">{error}</div>}
          
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
                    setRegistrationStep(1);
                  }}
                >
                  Зарегистрироваться
                </a>
              </div>
            </>
          ) : (
            <>
              {renderRegistrationStep()}
              
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
