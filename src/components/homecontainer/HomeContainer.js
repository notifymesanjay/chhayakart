import React from "react";
import Category from "../category/Category";
import Slider from "../sliders/Slider";
import "./homecontainer.css";

const HomeContainer = () => {
  return (
    <section id="home" className="home-section container home-element section">
      <div className="home-container row">
        <div className="col-md-12 p-0 col-12">
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
