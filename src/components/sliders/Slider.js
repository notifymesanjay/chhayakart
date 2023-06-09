import React, { useEffect, useState } from 'react'
import './slider.css'
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs, Mousewheel, Autoplay, Pagination } from "swiper";
import "swiper/css/pagination";
import "swiper/css";
import { useSelector } from 'react-redux';
import Loader from '../loader/Loader';


// import slider3 from '../../utils/sliders/slider3.jpg'
// import slider4 from '../../utils/sliders/slider4.jpg'
// import slider5 from '../../utils/sliders/slider5.jpg'


const Slider = () => {

    //useselect
    const [imagesNavSlider, setImagesNavSlider] = useState(null);
    // const [slider, setslider] = useState(null)

    //fetch Slider
    // const fetchSlider = () => {
    //     api.getSlider()
    //         .then(response => response.json())
    //         .then(result => {
    //             if (result.status === 1) {
    //                 setslider(result.data);
    //             }
    //         })
    //         .catch(error => console.log("error ", error))
    // }



    //useEffect

    //get sliders from api on page load 
    useEffect(() => {
        // fetchSlider();
    }, [])

    const shop = useSelector(state => state.shop);
    return (
        <div className='slider '>
            {
                shop.shop === null 
                    ? (
                        <Loader width='100%' height='500px' screen='full'/>                        
                    )
                    : (
                        <div className="slider__flex ">
                            <div className="slider__images">
                                <Swiper

                                    loop={true}
                                    autoplay={{
                                        delay: 3000,
                                        disableOnInteraction: false,
                                    }}
                                    centeredSlides={false}
                                    // thumbs={{ swiper: imagesNavSlider && !imagesNavSlider.destroyed ? imagesNavSlider : null }}
                                    direction="horizontal"
                                    slidesPerView={1}
                                    spaceBetween={15}
                                    mousewheel={false}

                                    breakpoints={{
                                        0: {
                                            direction: "horizontal"
                                        },
                                        768: {
                                            direction: "horizontal"
                                        }
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
                                                <div className="slider__image" >
                                                    <img src={sld.image_url} alt={sld.type} id='slider-photo' />
                                                </div>
                                            </SwiperSlide>

                                        );
                                    })}
                                    
                                    
                                    

                                </Swiper>
                            </div>



                        </div>
                    )
            }
        </div>
    )
}

export default Slider
