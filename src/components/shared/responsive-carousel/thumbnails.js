import React from 'react';
import styles from './thumbnails.module.scss';

export const getThumbnails = (images) => {
  const Thumbnails = ({ onClick, ...props }) => {
    const { index, active } = props;
    return (
      <li
        className={`${styles.thumbnail} ${active ? styles.active : ''}`}
        onClick={onClick}>
        <img
          src={images[index] ? images[index].imageSrc : ''}
          alt={'img'}
          className={`${styles.img} lazyload`}
        />
      </li>
    );
  };

  return { Thumbnails };
};
