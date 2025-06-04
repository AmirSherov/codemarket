'use client'
import React from 'react';
import Image from 'next/image';
import './features.scss';

const Features = () => {
  const features = [
    {
      icon: '/icons/employment.png',
      title: 'Для работодателей',
      description: 'Доступ к проверенным профессионалам со всего мира. Выбирайте разработчиков с нужными навыками и опытом для вашего проекта.',
      benefits: [
        'Быстрый поиск по навыкам и опыту',
        'Проверенные портфолио специалистов',
        'Прямое общение с кандидатами',
        'Безопасная система найма'
      ]
    },
    {
      icon: '/icons/coding.png',
      title: 'Для разработчиков',
      description: 'Находите интересные проекты и вакансии в ведущих компаниях. Развивайте карьеру и работайте над тем, что вам действительно нравится.',
      benefits: [
        'Тысячи вакансий от ведущих компаний',
        'Выбор удаленной или офисной работы',
        'Конкурентоспособные зарплаты',
        'Прозрачные условия найма'
      ]
    },
    {
      icon: '/icons/iteration.png',
      title: 'Простой процесс',
      description: 'CodeMarket упрощает процесс найма и поиска работы. Наша платформа создана для экономии вашего времени и усилий.',
      benefits: [
        'Интуитивно понятный интерфейс',
        'Быстрая регистрация и начало работы',
        'Расширенные фильтры поиска',
        'Система уведомлений о новых возможностях'
      ]
    }
  ];

  return (
    <section className="homepage-features">
      <div className="homepage-features__container">
        <div className="homepage-features__header">
          <h2 className="homepage-features__title">
            Что делает <span className="homepage-features__highlight">CodeMarket</span> особенным
          </h2>
          <p className="homepage-features__subtitle">
            Инновационная платформа для соединения талантов и возможностей в IT индустрии
          </p>
        </div>
        
        <div className="homepage-features__grid">
          {features.map((feature, index) => (
            <div className="homepage-features__card" key={index}>
              <div className="homepage-features__icon">
                <Image 
                  src={feature.icon} 
                  alt={feature.title} 
                  width={48} 
                  height={48}
                  priority={index === 0}
                />
              </div>
              <h3 className="homepage-features__card-title">{feature.title}</h3>
              <p className="homepage-features__card-description">{feature.description}</p>
              <ul className="homepage-features__benefits">
                {feature.benefits.map((benefit, benefitIndex) => (
                  <li className="homepage-features__benefit" key={benefitIndex}>
                    <span className="homepage-features__check">✓</span>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features; 