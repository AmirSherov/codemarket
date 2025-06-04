'use client'
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import './footer.scss';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="homepage-footer">
      <div className="homepage-footer__container">
        <div className="homepage-footer__main">
          <div className="homepage-footer__brand">
            <Link href="/">
              <Image src="/images/logo.png" alt="CodeMarket Logo" width={150} height={40} />
            </Link>
            <p className="homepage-footer__description">
              CodeMarket - площадка, соединяющая талантливых разработчиков 
              и инновационные компании для создания лучших продуктов.
            </p>
            <div className="homepage-footer__social">
              <a href="#" className="homepage-footer__social-link">
                <span className="homepage-footer__social-icon">fb</span>
              </a>
              <a href="#" className="homepage-footer__social-link">
                <span className="homepage-footer__social-icon">tw</span>
              </a>
              <a href="#" className="homepage-footer__social-link">
                <span className="homepage-footer__social-icon">ig</span>
              </a>
              <a href="#" className="homepage-footer__social-link">
                <span className="homepage-footer__social-icon">in</span>
              </a>
            </div>
          </div>
          
          <div className="homepage-footer__links-grid">
            <div className="homepage-footer__links-column">
              <h4 className="homepage-footer__column-title">Для компаний</h4>
              <ul className="homepage-footer__links">
                <li><Link href="/post-job" className="homepage-footer__link">Разместить вакансию</Link></li>
                <li><Link href="/pricing" className="homepage-footer__link">Тарифы</Link></li>
                <li><Link href="/search-developers" className="homepage-footer__link">Найти разработчика</Link></li>
                <li><Link href="/for-employers" className="homepage-footer__link">Для работодателей</Link></li>
              </ul>
            </div>
            
            <div className="homepage-footer__links-column">
              <h4 className="homepage-footer__column-title">Для разработчиков</h4>
              <ul className="homepage-footer__links">
                <li><Link href="/jobs" className="homepage-footer__link">Найти работу</Link></li>
                <li><Link href="/remote-jobs" className="homepage-footer__link">Удаленная работа</Link></li>
                <li><Link href="/create-profile" className="homepage-footer__link">Создать портфолио</Link></li>
                <li><Link href="/skills-test" className="homepage-footer__link">Проверка навыков</Link></li>
              </ul>
            </div>
            
            <div className="homepage-footer__links-column">
              <h4 className="homepage-footer__column-title">CodeMarket</h4>
              <ul className="homepage-footer__links">
                <li><Link href="/about" className="homepage-footer__link">О нас</Link></li>
                <li><Link href="/contact" className="homepage-footer__link">Связаться с нами</Link></li>
                <li><Link href="/blog" className="homepage-footer__link">Блог</Link></li>
                <li><Link href="/careers" className="homepage-footer__link">Карьера у нас</Link></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="homepage-footer__bottom">
          <div className="homepage-footer__copyright">
            &copy; {currentYear} CodeMarket. Все права защищены.
          </div>
          <div className="homepage-footer__legal">
            <Link href="/terms" className="homepage-footer__legal-link">Условия использования</Link>
            <Link href="/privacy" className="homepage-footer__legal-link">Политика конфиденциальности</Link>
            <Link href="/cookies" className="homepage-footer__legal-link">Политика использования cookie</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 