'use client'
import React, { useState } from 'react';
import './testimonials.scss';

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Алексей Петров',
      position: 'Senior Frontend Developer',
      company: 'Tech Solutions',
      avatar: '👨‍💻',
      text: 'CodeMarket помог мне найти идеальную удаленную работу за неделю. Платформа интуитивно понятная, а предложения от компаний действительно релевантные моему опыту и навыкам.',
      rating: 5
    },
    {
      id: 2,
      name: 'Мария Сидорова',
      position: 'CTO',
      company: 'StartupBoost',
      avatar: '👩‍💻',
      text: 'Как руководитель технического отдела, я постоянно ищу талантливых разработчиков. CodeMarket предоставил нам доступ к проверенным специалистам, что значительно сократило время найма.',
      rating: 5
    },
    {
      id: 3,
      name: 'Дмитрий Иванов',
      position: 'Backend Developer',
      company: 'DataTech',
      avatar: '👨‍💻',
      text: 'После регистрации на CodeMarket я получил три предложения о работе в первую неделю. Все они соответствовали моим навыкам и зарплатным ожиданиям. Очень доволен!',
      rating: 4
    },
    {
      id: 4,
      name: 'Елена Смирнова',
      position: 'HR Director',
      company: 'GlobalTech',
      avatar: '👩‍💼',
      text: 'CodeMarket стал нашим основным источником технических талантов. Фильтры поиска помогают быстро находить нужных специалистов, а система проверки навыков экономит время на тестовых заданиях.',
      rating: 5
    }
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  const nextSlide = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="homepage-testimonials">
      <div className="homepage-testimonials__container">
        <div className="homepage-testimonials__header">
          <h2 className="homepage-testimonials__title">
            Что говорят пользователи <span className="homepage-testimonials__highlight">CodeMarket</span>
          </h2>
          <p className="homepage-testimonials__subtitle">
            Истории успеха от разработчиков и компаний, которые уже используют нашу платформу
          </p>
        </div>
        
        <div className="homepage-testimonials__carousel">
          <button 
            className="homepage-testimonials__arrow homepage-testimonials__arrow--prev" 
            onClick={prevSlide}
          >
            &#8592;
          </button>
          
          <div className="homepage-testimonials__slides">
            {testimonials.map((testimonial, index) => (
              <div 
                key={testimonial.id}
                className={`homepage-testimonials__slide ${index === activeIndex ? 'active' : ''}`}
              >
                <div className="homepage-testimonials__content">
                  <div className="homepage-testimonials__quote">❝</div>
                  <p className="homepage-testimonials__text">{testimonial.text}</p>
                  
                  <div className="homepage-testimonials__rating">
                    {[...Array(5)].map((_, i) => (
                      <span 
                        key={i} 
                        className={`homepage-testimonials__star ${i < testimonial.rating ? 'filled' : ''}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="homepage-testimonials__author">
                  <div className="homepage-testimonials__avatar">
                    {testimonial.avatar}
                  </div>
                  <div className="homepage-testimonials__details">
                    <div className="homepage-testimonials__name">{testimonial.name}</div>
                    <div className="homepage-testimonials__position">
                      {testimonial.position} | {testimonial.company}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <button 
            className="homepage-testimonials__arrow homepage-testimonials__arrow--next" 
            onClick={nextSlide}
          >
            &#8594;
          </button>
        </div>
        
        <div className="homepage-testimonials__dots">
          {testimonials.map((_, index) => (
            <button 
              key={index} 
              className={`homepage-testimonials__dot ${index === activeIndex ? 'active' : ''}`} 
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials; 