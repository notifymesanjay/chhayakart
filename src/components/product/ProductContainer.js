import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import api from "../../api/api";
import { ActionTypes } from "../../model/action-type";
import Offers from "../offer/Offers";
import LoginUser from "../login/login-user";
import ProductHeader from "./product-header";
import "./product.css";
import ResponsiveCarousel from "../shared/responsive-carousel/responsive-carousel";
import ProductCard from "../shared/card/product-card";

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

  useEffect(() => {
    if (sizes.sizes === null || sizes.status === "loading") {
      if (city.city !== null) {
        console.log("productContainer");
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
                    <ResponsiveCarousel
                      items={5}
                      itemsInTablet={3}
                      itemsInMobile={1}
                      infinite={true}
                      autoPlay={false}
                      autoPlaySpeed={4000}
                      showArrows={false}
                      showDots={false}
                      // className={styles.carousel}
                    >
                      {section.products.map((product, index) => (
                        <ProductCard
                          productTriggered={productTriggered}
                          setProductTriggered={setProductTriggered}
                          product={product}
                        />
                      ))}
                    </ResponsiveCarousel>
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
