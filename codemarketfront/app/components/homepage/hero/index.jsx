'use client';

import React from 'react';
import Link from 'next/link';
import './hero.scss';

const Hero = () => {
  return (
    <section className="homepage-hero">
      <div className="homepage-hero__container">
        <div className="homepage-hero__content">
          <h1 className="homepage-hero__title">
            Найдите лучших разработчиков и IT проекты на <span className="homepage-hero__highlight">CodeMarket</span>
          </h1>
          <p className="homepage-hero__description">
            Платформа, которая соединяет талантливых разработчиков с перспективными компаниями.
            Быстрый поиск, проверенные специалисты, выгодные условия.
          </p>
          
          <div className="homepage-hero__cta">
            <Link href="/jobs" className="homepage-hero__button homepage-hero__button--primary">
              Найти вакансию
            </Link>
            <Link href="/post-job" className="homepage-hero__button homepage-hero__button--secondary">
              Разместить вакансию
            </Link>
          </div>
          
          <div className="homepage-hero__stats">
            <div className="homepage-hero__stat">
              <span className="homepage-hero__stat-number">1,000+</span>
              <span className="homepage-hero__stat-label">Разработчиков</span>
            </div>
            <div className="homepage-hero__stat">
              <span className="homepage-hero__stat-number">2,000+</span>
              <span className="homepage-hero__stat-label">Компаний</span>
            </div>
            <div className="homepage-hero__stat">
              <span className="homepage-hero__stat-number">10,000+</span>
              <span className="homepage-hero__stat-label">Вакансий</span>
            </div>
          </div>
        </div>
        
        <div className="homepage-hero__illustration">
          <div className="homepage-hero__shape homepage-hero__shape--1"></div>
          <div className="homepage-hero__shape homepage-hero__shape--2"></div>
          <div className="homepage-hero__shape homepage-hero__shape--3"></div>
          <div className="homepage-hero__developer">
            <div className="homepage-hero__code">
              <span className="homepage-hero__code-line">function findJob() {'{'}</span>
              <span className="homepage-hero__code-line">&nbsp;&nbsp;const skills = ["React", "Node", "Python"];</span>
              <span className="homepage-hero__code-line">&nbsp;&nbsp;return CodeMarket.search(skills);</span>
              <span className="homepage-hero__code-line">{'}'}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="homepage-hero__search">
        <div className="homepage-hero__search-container">
          <div className="homepage-hero__search-input-group">
            <input 
              type="text" 
              className="homepage-hero__search-input" 
              placeholder="Поиск по ключевым словам (React, Python, UI/UX...)" 
            />
          </div>
          <div className="homepage-hero__search-input-group">
            <select className="homepage-hero__search-select">
              <option value="">Все категории</option>
              <option value="frontend">Frontend</option>
              <option value="backend">Backend</option>
              <option value="fullstack">FullStack</option>
              <option value="mobile">Mobile</option>
              <option value="devops">DevOps</option>
              <option value="qa">QA</option>
            </select>
          </div>
          <button className="homepage-hero__search-button">
            Найти
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
