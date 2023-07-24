import React from 'react';
import styles from './animated-dot.module.scss';

export const AnimatedDot = ({ onClick, active }) => (
  <li
    className={`${styles.backgroundBar} ${active ? styles.active : ''}`}
    onClick={onClick}>
    <div className={styles.bg}>
      <div className={styles.progressBar}></div>
    </div>
  </li>
);
