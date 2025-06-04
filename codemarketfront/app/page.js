'use client'
import React from 'react';
import './styles/home.scss';

// Импортируем компоненты
import Navigation from './components/homepage/navigation';
import Hero from './components/homepage/hero';
import Features from './components/homepage/features';
import Testimonials from './components/homepage/testimonials';
import Footer from './components/homepage/footer';

export default function Home() {
  return (
    <div className="homepage">
      <div className="homepage__main">
        <Navigation />
        
        <div className="homepage__content">
          <Hero />
          <Features />
          <Testimonials />
        </div>
        
        <Footer />
      </div>
    </div>
  );
}
