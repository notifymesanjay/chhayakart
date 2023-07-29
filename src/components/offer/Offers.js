import React, { useState, useEffect } from "react";
import api from "../../api/api";
import "./offer.css";
import { AiOutlineArrowRight } from "react-icons/ai";
import { useSelector } from "react-redux";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import ResponsiveCarousel from "../shared/responsive-carousel/responsive-carousel";
// import offer3 from '../../utils/offers/offer3.jpg'
// import offer4 from '../../utils/offers/offer4.jpg'
// import offer5 from '../../utils/offers/offer5.jpg'

function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={
        window.innerWidth > 450
          ? {
              ...style,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "var(--secondary-color)",
              borderRadius: "50%",
              width: "30px",
              height: "30px",
            }
          : { display: "none" }
      }
      onClick={onClick}
    />
  );
}

function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={
        window.innerWidth > 450
          ? {
              ...style,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "var(--secondary-color)",
              borderRadius: "50%",
              width: "30px",
              height: "30px",
            }
          : { display: "none" }
      }
      onClick={onClick}
    />
  );
}

const Offers = () => {
  const shop = useSelector((state) => state.shop);

  return (
    <>
      {shop.shop.offers.length === 0 ? null : (
        <>
          <div className="col-md-12">
            <div className="offer-container">
              <div className="row">
                <div className="col-12 d-flex flex-column offer-container-heading">
                  <div className="">
                    <span>choose your offer</span>
                    <p>one more offer for you!</p>
                  </div>
                </div>
                <div className="offer-container-content">
                  <ResponsiveCarousel
                    items={5}
                    itemsInTablet={3}
                    infinite={false}
                    autoPlay={true}
                    autoPlaySpeed={4000}
                    showArrows={false}
                    showDots={false}
                  >
                    {shop.shop.offers.map((offer, index) => (
                      <div key={index}>
                        <div className="offer-container-body p-2 col-3'">
                          <img src={offer.image_url} alt="offers" />
                          <button type="button">
                            shop now <AiOutlineArrowRight fill="#fff" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </ResponsiveCarousel>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Offers;
