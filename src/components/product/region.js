import React from "react";
import { useResponsive } from "../shared/use-responsive";
import CategoryCard from "./category-card";
import styles from './region.module.scss';

const ShopByRegion = () => {
  const { isSmScreen } = useResponsive();
  return (
    isSmScreen && (
      <div className={styles.homeCategoryWrapper}>
        <div className={styles.headerWrapper}>
          <h1 className={styles.header}>Shop By Region</h1>
        </div>
        <div className={styles.subCategoryWrapper}>
          <div className={styles.subCategoryCard}>
            <div className={styles.imageWrapper}>
              <img
                className={styles.subCategoryImg}
                src="https://admin.chhayakart.com/storage/products/1689155180_45917.jpg"
                alt=""
              />
            </div>
            <div className={styles.cardBody}>
              <p className={styles.title}>Maharastra</p>
            </div>
          </div>
          <div className={styles.subCategoryCard}>
            <div className={styles.imageWrapper}>
              <img
                className={styles.subCategoryImg}
                src="https://admin.chhayakart.com/storage/products/1689155180_45917.jpg"
                alt=""
              />
            </div>
            <div className={styles.cardBody}>
              <p className={styles.title}>Gujarat</p>
            </div>
          </div>
          <div className={styles.subCategoryCard}>
            <div className={styles.imageWrapper}>
              <img
                className={styles.subCategoryImg}
                src="https://admin.chhayakart.com/storage/products/1689155180_45917.jpg"
                alt=""
              />
            </div>
            <div className={styles.cardBody}>
              <p className={styles.title}>Rajasthan</p>
            </div>
          </div>
          <div className={styles.subCategoryCard}>
            <div className={styles.imageWrapper}>
              <img
                className={styles.subCategoryImg}
                src="https://admin.chhayakart.com/storage/products/1689155180_45917.jpg"
                alt=""
              />
            </div>
            <div className={styles.cardBody}>
              <p className={styles.title}>Madya Pradesh</p>
            </div>
          </div>
          <div className={styles.subCategoryCard}>
            <div className={styles.imageWrapper}>
              <img
                className={styles.subCategoryImg}
                src="https://admin.chhayakart.com/storage/products/1689155180_45917.jpg"
                alt=""
              />
            </div>
            <div className={styles.cardBody}>
              <p className={styles.title}>Karnataka</p>
            </div>
          </div>
          <div className={styles.subCategoryCard}>
            <div className={styles.imageWrapper}>
              <img
                className={styles.subCategoryImg}
                src="https://admin.chhayakart.com/storage/products/1689155180_45917.jpg"
                alt=""
              />
            </div>
            <div className={styles.cardBody}>
              <p className={styles.title}>Andhra Pradesh</p>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default ShopByRegion;
