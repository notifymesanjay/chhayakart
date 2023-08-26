import React, { Fragment, useState, useEffect, useRef } from "react";
import ResponsiveCarousel from "../shared/responsive-carousel/responsive-carousel";
import banner1 from "../banner1.jpg";
import banner2 from "../banner2.jpg";
import banner3 from "../banner3.jpg";
import banner4 from "../banner4.jpg";
import { useResponsive } from "../shared/use-responsive";
import styles from "./bannercarousel.module.scss";
const Banner = () => {
	const bannerImg = [
		{ id: 1, image: banner1, title: "banner1" },
		{ id: 2, image: banner2, title: "banner2 " },
		{ id: 3, image: banner3, title: "banner3" },
		{ id: 4, image: banner4, title: "banner4" },
	];
	// useEffect(alert(banner1), []);
	const { isMobile } = useResponsive();
	return (
		<div>
			<ResponsiveCarousel
				items={1}
				itemsInTablet={1}
				itemsInMobile={1}
				infinite={true}
				autoPlaySpeed={1200}
				showArrows={false}
				showDots={true}
				autoPlay={false}
				partialVisibilityGutter={false}
			>
				{bannerImg.map((img) => (
					<div key={img.id}>
						<img className={styles.banner} src={img.image} alt={img.title} />
					</div>
				))}
			</ResponsiveCarousel>
		</div>
	);
};
export default Banner;
