'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import './navigation.scss';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="homepage-navigation">
      <div className="homepage-navigation__container">
        <div className="homepage-navigation__logo">
        </div>
        <div className={`homepage-navigation__links ${isMenuOpen ? 'active' : ''}`}>
          <Link href="/" className="homepage-navigation__link homepage-navigation__link--active">
            Главная
          </Link>
          <Link href="/jobs" className="homepage-navigation__link">
            Вакансии
          </Link>
          <Link href="/developers" className="homepage-navigation__link">
            Разработчики
          </Link>
          <Link href="/companies" className="homepage-navigation__link">
            Компании
          </Link>
          <Link href="/about" className="homepage-navigation__link">
            О нас
          </Link>
        </div>
        
        <div className="homepage-navigation__auth">
          <Link href="/pages/auth" className="homepage-navigation__button homepage-navigation__button--login">
            Войти
          </Link>
        </div>
        
        <div 
          className={`homepage-navigation__burger ${isMenuOpen ? 'active' : ''}`} 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 