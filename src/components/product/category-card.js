import React, { useEffect } from "react";
import styles from "./category-card.module.scss";
import { useNavigate } from "react-router-dom";
import { useResponsive } from "../shared/use-responsive";
import { useRef } from "react";

const CategoryCard = ({ subCategories = [], setSelectedFilter = () => {} }) => {
  const navigate = useNavigate();
  const { isSmScreen } = useResponsive();

  return isSmScreen ? (
    <>
      {subCategories.map((subCategory, index) => (
        <div className={styles.homeCategoryWrapper} key={index}>
          <div className={styles.headerWrapper}>
            <h1 className={styles.header}>{subCategory.category_name}</h1>
          </div>
          <div className={styles.subCategoryWrapper}>
            {subCategory.sub_category.map((sub_ctg, index1) => (
              <div
                className={styles.subCategoryCard}
                key={index1}
                onClick={() => {
                  navigate(`/subCategory/${subCategory.category_id}/${sub_ctg.title}`);
                  setSelectedFilter(sub_ctg.id);
                }}
              >
                <div className={styles.imageWrapper}>
                  <img
                    className={styles.subCategoryImg}
                    src={sub_ctg.image_url}
                    alt="Catogery"
                  />
                </div>
                <div className={styles.cardBody}>
                  <p className={styles.title}>{sub_ctg.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  ) : (
    <div className="container">
      {subCategories.map((subCategory) => (
        <div className={styles.cardWrapper}>
          <div className={styles.headerWrapper}>
            <h1 className={styles.header}>{subCategory.category_name}</h1>
          </div>
          <div className={styles.categoryWrapper}>
            <div className={styles.categoryImgWrapper}>
              <img src={subCategory.category_image} alt="category-img" />
            </div>
            <div className={styles.bodyWrapper}>
              <div className={styles.subCategoryWrapper}>
                {subCategory.sub_category.map((sub_ctg, index1) => (
                  <div
                    className={styles.subCategoryCard}
                    key={index1}
                    onClick={() => {
                      navigate(`/subCategory/${subCategory.category_id}/${sub_ctg.title}`);
                      setSelectedFilter(sub_ctg.id);
                    }}
                  >
                    <div className={styles.imageWrapper}>
                      <img
                        className={styles.subCategoryImg}
                        src={sub_ctg.image_url}
                        alt="Catogery"
                      />
                    </div>
                    <div className={styles.cardBody}>
                      <p className={styles.title}>{sub_ctg.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategoryCard;
