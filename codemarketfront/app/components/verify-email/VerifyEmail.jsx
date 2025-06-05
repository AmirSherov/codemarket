'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import './VerifyEmail.scss';
import { API_URL, setTokens, resendVerificationCode } from '../../utilits/auth';

const VerifyEmail = ({ email, onSuccess, onBack }) => {
  const router = useRouter();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);
  
  const inputRefs = Array(6).fill(0).map(() => React.createRef());
  
  const handleChange = (index, e) => {
    const value = e.target.value;
    if (value && !/^\d*$/.test(value)) {
      return;
    }
    const newCode = [...code];
    newCode[index] = value.substring(0, 1);
    setCode(newCode);
    if (value && index < 5) {
      inputRefs[index + 1].current.focus();
    }
  };
  
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };
  
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').trim();
    if (/^\d{6}$/.test(pastedData)) {
      const newCode = pastedData.split('');
      setCode(newCode);
      inputRefs[5].current.focus();
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const verificationCode = code.join('');
    if (verificationCode.length !== 6) {
      setError('Пожалуйста, введите полный 6-значный код');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {      const response = await axios.post(
        `${API_URL}/api/auth/verify-email/`,
        { 
          code: verificationCode,
          email: email 
        },
        { 
          headers: { 
            'Content-Type': 'application/json'
          } 
        }
      );
      
      // После успешной верификации обновляем токены и данные пользователя
      if (response.data.access && response.data.refresh) {
        setTokens(response.data.access, response.data.refresh);
        if (response.data.user) {
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
      }
      
      setSuccess('Email успешно подтвержден! Выполняется вход...');
      
      if (typeof onSuccess === 'function') {
        onSuccess();
      }
      
      // Небольшая задержка для того, чтобы пользователь увидел сообщение об успехе
      setTimeout(() => {
        router.push('/pages/dashboard');
      }, 1500);
      
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.error || 'Произошла ошибка при подтверждении кода');
      } else {
        setError('Не удалось подтвердить код. Пожалуйста, попробуйте снова.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handleResendCode = async () => {
    setError('');
    setSuccess('');
    setLoading(true);
    setResendDisabled(true);
    
    try {
      const result = await resendVerificationCode(email);
      
      if (result.success) {
        setSuccess('Новый код отправлен на вашу почту');
        let timer = 60;
        setCountdown(timer);
        
        const countdownInterval = setInterval(() => {
          timer -= 1;
          setCountdown(timer);
          
          if (timer <= 0) {
            clearInterval(countdownInterval);
            setResendDisabled(false);
          }
        }, 1000);
      } else {
        setError(result.error || 'Произошла ошибка при отправке кода');
      }
    } catch (err) {
      setError('Не удалось отправить код. Пожалуйста, попробуйте снова.');
      setResendDisabled(false);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="verify-email-container">
      <div className="verify-email-card">
        <h1 className="verify-email-title">Подтверждение Email</h1>
        <p className="verify-email-description">
          Мы отправили 6-значный код подтверждения на <strong>{email}</strong>.
          Пожалуйста, введите код для завершения регистрации.
        </p>
        
        {error && <div className="verify-email-error">{error}</div>}
        {success && <div className="verify-email-success">{success}</div>}
        
        <form onSubmit={handleSubmit} className="verify-email-form">
          <div className="verify-code-inputs">
            {code.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : null}
                ref={inputRefs[index]}
                disabled={loading}
                autoFocus={index === 0}
                className="verify-code-input"
              />
            ))}
          </div>
          
          <button
            type="submit"
            disabled={loading || code.join('').length !== 6}
            className="verify-email-button"
          >
            {loading ? 'Проверка...' : 'Подтвердить'}
          </button>
        </form>
        
        <div className="verify-email-actions">
          <button
            onClick={handleResendCode}
            disabled={loading || resendDisabled}
            className="verify-resend-button"
          >
            {resendDisabled ? `Отправить снова (${countdown}с)` : 'Отправить код повторно'}
          </button>
          
          {onBack && (
            <button onClick={onBack} className="verify-back-button">
              Вернуться назад
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail; 