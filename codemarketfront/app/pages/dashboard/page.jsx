'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRouteGuard } from '../../utilits/routeGuard';
import { getUserData, logout } from '../../utilits/auth';
import Loader from '../../components/loader/index';
import './dashboard.scss';

const Dashboard = () => {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  useRouteGuard(true, (user) => {
    setUserData(user);
    setLoading(false);
  });

  const handleLogout = () => {
    logout();
    router.push('/pages/auth');
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Панель управления</h1>
        <button onClick={handleLogout} className="logout-button">Выйти</button>
      </div>
      
      <div className="dashboard-content">
        <div className="user-profile">
          <h2>Профиль пользователя</h2>
          {userData ? (
            <div className="user-info">
              <div className="user-avatar">
                <div className="avatar-placeholder">
                  {userData.first_name && userData.last_name ? 
                    `${userData.first_name[0]}${userData.last_name[0]}` : 
                    userData.username[0]}
                </div>
              </div>
              <div className="user-details">
                <p><span>Имя пользователя:</span> {userData.username}</p>
                <p><span>Полное имя:</span> {userData.first_name} {userData.last_name}</p>
                <p><span>Email:</span> {userData.email}</p>
                <p><span>Никнейм:</span> {userData.nickname}</p>
                <p><span>Возраст:</span> {userData.age}</p>
              </div>
            </div>
          ) : (
            <p className="no-data">Данные пользователя не доступны</p>
          )}
        </div>
        
        <div className="dashboard-stats">
          <h2>Статистика</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Посещения</h3>
              <p className="stat-value">12</p>
            </div>
            <div className="stat-card">
              <h3>Активность</h3>
              <p className="stat-value">Высокая</p>
            </div>
            <div className="stat-card">
              <h3>Последний вход</h3>
              <p className="stat-value">{new Date().toLocaleDateString()}</p>
            </div>
            <div className="stat-card">
              <h3>Статус</h3>
              <p className="stat-value">Активен</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
