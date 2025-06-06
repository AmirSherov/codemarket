'use client';
import React, { useState, useEffect } from 'react';
import { getUserData } from '../../utilits/auth';
import Loader from '../../components/loader/index';
import './dashboard.scss';
import DashboardNavigation from '../../components/dashboard/navigation';

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPageData = async () => {
      setLoading(true);
      const user = await getUserData();
      setUserData(user);
      setLoading(false);
    };
    fetchPageData();
  }, []);

  if (loading || !userData) {
    return <Loader />;
  }
  
  function getAge(birthDateStr) {
    if (!birthDateStr) return 'Не указан';
    
    const birthDate = new Date(birthDateStr);
    const today = new Date();
  
    let age = today.getFullYear() - birthDate.getFullYear();
  
    const hasHadBirthdayThisYear =
      today.getMonth() > birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());
  
    if (!hasHadBirthdayThisYear) {
      age--;
    }
  
    return age;
  }

  const displayUserData = userData;
  
  return (
    <div className="dashboard">
      <DashboardNavigation />
     
    </div>
  );
};

export default Dashboard;
