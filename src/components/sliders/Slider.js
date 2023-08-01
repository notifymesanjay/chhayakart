import React from "react";
import { useSelector } from "react-redux";
import "swiper/css/pagination";
import "swiper/css";
import Loader from "../loader/Loader";
import styles from "./slider.module.scss";
import ResponsiveCarousel from "../shared/responsive-carousel/responsive-carousel";

const Slider = () => {
	const shop = useSelector((state) => state.shop);
	return (
		<>
			{shop.shop === null ? (
				<Loader width="100%" height="500px" screen="full" />
			) : (
				<div>
					<ResponsiveCarousel
						items={1}
						itemsInTablet={1}
						infinite={true}
						autoPlay={true}
						autoPlaySpeed={4000}
						showArrows={false}
						showDots={false}
						className={styles.carousel}
					>
						{shop.shop.sliders.map((sld, index) => (
							<section className={styles.showCaseSection} key={index}>
								<div className={styles.banner}>
									<img
										className={`${styles.bannerImg}` + "lazyload"}
										data-src={sld.image_url}
										alt={sld.type}
									/>
								</div>
							</section>
						))}
					</ResponsiveCarousel>
				</div>
			)}
		</>
	);
};

export default Slider;
