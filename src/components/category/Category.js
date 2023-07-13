import React, { useState, useEffect, useRef, useMemo } from "react";
import "./category.css";
import api from "../../api/api";
import { motion } from "framer-motion";
import { BsPlusCircle, BsGrid3X3GapFill } from "react-icons/bs";
import CategoryChild from "./CategoryChild";
import { AiOutlineArrowRight, AiOutlineDown } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { ActionTypes } from "../../model/action-type";
import { Link, useNavigate } from "react-router-dom";
import { Card } from "react-bootstrap";
import Slider from "react-slick";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import SectionTitle from "../shared/section-title/section-title";
import styles from "./category.module.scss";
import ResponsiveCarousel from "../shared/responsive-carousel/responsive-carousel";
import { useResponsive } from "../shared/use-responsive";

const Category = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isSmScreen } = useResponsive();

  useEffect(() => {
    console.log("xyz", isSmScreen);
  }, [isSmScreen]);

  const sliderRef = useRef(null);

  const handlePrevClick = () => {
    sliderRef.current.slickPrev();
  };

  const handleNextClick = () => {
    sliderRef.current.slickNext();
  };

  const shop = useSelector((state) => state.shop);

  const selectCategory = (category) => {
    dispatch({ type: ActionTypes.SET_FILTER_CATEGORY, payload: category.id });
    navigate("/products");
  };
  const settings = {
    infinite: false,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: false,
    direction: "rtl",
    pauseOnDotsHover: false,
    pauseOnFocus: true,
    slidesToShow: 5,
    slidesPerRow: 1,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 4,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
        },
      },

      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 425,
        settings: {
          slidesToShow: 3,
          rows: 2,
        },
      },
    ],
  };

  useEffect(() => {
    console.log("xyz", shop.shop.category);
  }, [shop]);

  return useMemo(
    () => (
      <>
        {shop.shop === null ? (
          <></>
        ) : (
          <>
            <div className={styles.categoryWrapper}>
              <SectionTitle title={"Shop By Category"} linkText={false} />
            </div>
            {!isSmScreen && (
              <ResponsiveCarousel
                items={5}
                itemsInTablet={1}
                infinite={true}
                autoPlay={true}
                autoPlaySpeed={4000}
                showArrows={false}
                showDots={false}
                className={styles.carousel}
              >
                {shop.shop.category.map((ctg, index) => (
                  <div
                    key={index}
                    className={styles.cardWrapper}
                    onClick={() => selectCategory(ctg)}
                  >
                    <img
                      className={styles.categoryImg}
                      src={ctg.image_url}
                      alt={ctg.subtitle}
                    />
                    <p className={styles.categoryName}>{ctg.name}</p>
                  </div>
                ))}
              </ResponsiveCarousel>
            )}
          </>
        )}
      </>
    ),
    [shop]
  );
};

export default Category;
