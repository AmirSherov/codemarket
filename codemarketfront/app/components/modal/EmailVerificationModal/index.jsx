'use client';
import React from 'react';
import './EmailVerificationModal.scss';

const EmailVerificationModal = ({ email, onConfirm, onCancel }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Подтверждение Email</h2>        
        <p>
          Для входа в систему необходимо подтвердить ваш email <strong>{email}</strong>.
        </p>
        <p>
          Нажмите "Подтвердить", чтобы перейти к вводу проверочного кода. 
          Мы отправим новый код подтверждения на ваш email.
        </p>
        <div className="modal-actions">
          <button onClick={onCancel} className="cancel-button">Отмена</button>
          <button onClick={onConfirm} className="confirm-button">Подтвердить</button>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationModal;