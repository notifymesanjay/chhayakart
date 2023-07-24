import React, { useEffect, useState } from "react";
import Category from "../category/Category";
import Slider from "../sliders/Slider";
import "./homecontainer.css";
import styles from "./home-container.module.scss";
import { useSelector } from "react-redux";
import { useResponsive } from "../shared/use-responsive";

const HomeContainer = ({ setSelectedFilter = () => {} }) => {
  const {isSmScreen} = useResponsive();
  const shop = useSelector((state) => state.shop);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (shop.shop.category.length > 0) {
      const categoryList = shop.shop.category;
      let finalCategoryList = [];
      categoryList.map((category) => {
        if (category.has_child) {
          finalCategoryList.push(category);
        }
      });
      finalCategoryList.sort((a,b) => a.id-b.id);
      setCategories(finalCategoryList);
    }
  }, [shop.shop]);

  return (
    <section id="home" className="home-section container home-element section">
      {!isSmScreen && (
        <div className="home-container">
        <div className={styles.sliderWrapper}>
          <Slider />
        </div>
      </div>
      )}
      <div className="category_section">
        {categories.length > 0 && (
          <Category
            categories={categories}
            setSelectedFilter={setSelectedFilter}
          />
        )}
      </div>
    </section>
  );
};

export default HomeContainer;
