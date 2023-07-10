import React from "react";
import { useSelector } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs, Mousewheel, Autoplay, Pagination } from "swiper";
import "swiper/css/pagination";
import "swiper/css";
import Loader from "../loader/Loader";
import "./slider.css";

const Slider = () => {
  const shop = useSelector((state) => state.shop);
  return (
    <div className="slider ">
      {shop.shop === null ? (
        <Loader width="100%" height="500px" screen="full" />
      ) : (
        <div className="slider__flex ">
          <div className="slider__images">
            <Swiper
              loop={true}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              centeredSlides={false}
              direction="horizontal"
              slidesPerView={1}
              spaceBetween={15}
              mousewheel={false}
              breakpoints={{
                0: {
                  direction: "horizontal",
                },
                768: {
                  direction: "horizontal",
                },
              }}
              className="swiper-container2"
              modules={[Navigation, Thumbs, Mousewheel, Autoplay, Pagination]}
              pagination={{
                dynamicBullets: true,
              }}
              navigation={true}
            >
              {shop.shop.sliders.map((sld, index) => {
                return (
                  <SwiperSlide key={index}>
                    <div className="slider__image">
                      <img
                        src={sld.image_url}
                        alt={sld.type}
                        id="slider-photo"
                      />
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
        </div>
      )}
    </div>
  );
};

export default Slider;
