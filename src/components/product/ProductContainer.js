import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import api from "../../api/api";
import { ActionTypes } from "../../model/action-type";
import Offers from "../offer/Offers";
import LoginUser from "../login/login-user";
import ProductHeader from "./product-header";
import ProductCard from "./product-card";
import "./product.css";

const ProductContainer = ({
  productTriggered,
  setProductTriggered = () => {},
}) => {
  const dispatch = useDispatch();

  const city = useSelector((state) => state.city);
  const shop = useSelector((state) => state.shop);
  const sizes = useSelector((state) => state.productSizes);

  const [productSizes, setproductSizes] = useState(null);
  const [offerConatiner, setOfferContainer] = useState(0);
  const [isLogin, setIsLogin] = useState(false);

  const settings = {
    infinite: false,
    slidesToShow: 5.5,
    slidesPerRow: 1,
    initialSlide: 0,
    // centerMode: true,
    centerMargin: "10px",
    margin: "20px", // set the time interval between slides
    // Add custom navigation buttons using Font Awesome icons
    prevArrow: (
      <button type="button" className="slick-prev">
        <FaChevronLeft size={30} className="prev-arrow" />
      </button>
    ),
    nextArrow: (
      <button type="button" className="slick-next">
        <FaChevronRight color="#f7f7f7" size={30} className="next-arrow" />
      </button>
    ),
    responsive: [
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
          slidesToShow: 2,
        },
      },
    ],
  };

  useEffect(() => {
    if (sizes.sizes === null || sizes.status === "loading") {
      if (city.city !== null) {
        console.log('productContainer');
        api
          .getProductbyFilter(
            city.city.id,
            city.city.latitude,
            city.city.longitude
          )
          .then((response) => response.json())
          .then((result) => {
            if (result.status === 1) {
              setproductSizes(result.sizes);
              dispatch({
                type: ActionTypes.SET_PRODUCT_SIZES,
                payload: result.sizes,
              });
            }
          });
      }
    } else {
      setproductSizes(sizes.sizes);
    }
  }, [city, sizes]);

  return (
    <section id="products">
      <div className="container">
        {shop.shop === null || productSizes === null ? (
          <>
            <div className="d-flex justify-content-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          </>
        ) : (
          <>
            {shop.shop.sections.map((section, index0) => (
              <div key={index0}>
                <div
                  className="product_section row flex-column"
                  value={index0}
                  onChange={(e) => {
                    setOfferContainer(index0);
                  }}
                >
                  <ProductHeader section={section} />
                  <div className="product_section_content p-0">
                    <Slider {...settings}>
                      {section.products.map((product, index) => (
                        <ProductCard
                          index={index}
                          index0={index0}
                          product={product}
                          productTriggered={productTriggered}
                          setProductTriggered={setProductTriggered}
                        />
                      ))}
                    </Slider>
                  </div>
                </div>

                {index0 === 1 && (
                  <div className="product_section row flex-column" id="offers">
                    <Offers />
                  </div>
                )}
              </div>
            ))}
          </>
        )}
        {offerConatiner === 1 ? <Offers /> : null}
      </div>
      {isLogin && (
        <LoginUser isOpenModal={isLogin} setIsOpenModal={setIsLogin} />
      )}
    </section>
  );
};

export default ProductContainer;
