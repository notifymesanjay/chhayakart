import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleUp } from '@fortawesome/free-solid-svg-icons';
import styles from './custom-arrow.module.scss';

const CustomLeftArrow = ({ className, onClick }) => (
  <button
    className={`${styles.customArrow} ${className} ${styles.left}`}
    onClick={onClick}>
    <FontAwesomeIcon icon={faAngleUp} />
  </button>
);

const CustomRightArrow = ({ className, onClick }) => (
  <button
    className={`${styles.customArrow} ${className} ${styles.right}`}
    onClick={onClick}>
    <FontAwesomeIcon icon={faAngleUp} />
  </button>
);

export { CustomLeftArrow, CustomRightArrow };
