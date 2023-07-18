import React from "react";
import styles from "./category-card.module.scss";
import { useNavigate } from "react-router-dom";

const CategoryCard = ({
  title = "Home & Kitchen Essentials",
  subCategories = [],
  setSelectedFilter = () => {}
}) => {
  const navigate = useNavigate();
  return (
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
                  navigate(`/subCategory/${subCategory.category_id}`);
                  setSelectedFilter(sub_ctg.id);
                }}
              >
                <div className={styles.imageWrapper}>
                  <img
                    className={styles.subCategoryImg}
                    src={
                      sub_ctg.image_url ||
                      "https://admin.chhayakart.com/storage/categories/Papad_52.jpg"
                    }
                    alt=""
                  />
                </div>
                <div className={styles.cardBody}>
                  <p className={styles.title}>{sub_ctg.title}</p>
                  {/* <p className={styles.subCategoryOff}>UP TO 40% OFF</p> */}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
};

export default CategoryCard;
