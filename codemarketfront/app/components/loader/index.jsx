'use client';
import React from 'react';
import styles from './AuthLoader.module.scss';

const AuthLoader = () => {
  return (
    <div className={styles.authLoaderContainer}>
      <div className={styles.loaderWrapper}>
        <div className={styles.circles}>
          <div className={styles.circle}></div>
          <div className={styles.circle}></div>
          <div className={styles.circle}></div>
        </div>
        <div className={styles.shadows}>
          <div className={styles.shadow}></div>
          <div className={styles.shadow}></div>
          <div className={styles.shadow}></div>
        </div>
        <span className={styles.text}>Соединение с сервером<span className={styles.dots}>...</span></span>
      </div>
    </div>
  );
};

export default AuthLoader;
