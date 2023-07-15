import React from "react";
import Category from "../category/Category";
import Slider from "../sliders/Slider";
import "./homecontainer.css";
import styles from './home-container.module.scss';

const HomeContainer = () => {
  return (
    <section id="home" className="home-section container home-element section">
      <div className="home-container">
        <div className={styles.sliderWrapper}>
          <Slider />
        </div>
      </div>
      <div className="category_section">
        <div className="container">
          <Category />
        </div>
      </div>
    </section>
  );
};

export default HomeContainer;
