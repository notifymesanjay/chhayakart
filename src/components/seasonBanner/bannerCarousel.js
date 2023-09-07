import React, { Fragment, useState, useEffect, useRef } from "react";
import ResponsiveCarousel from "../shared/responsive-carousel/responsive-carousel";
import banner1 from "../banner1.jpg";
import banner2 from "../banner2.jpg";
import banner3 from "../banner3.jpg";
import banner4 from "../banner4.jpg";
import bannerGKit from "../bannerGKit.webp";
import { useResponsive } from "../shared/use-responsive";
import { useNavigate } from "react-router-dom";
import styles from "./bannercarousel.module.scss";
const Banner = () => {
	const bannerImg = [{ id: 1, image: banner3, title: "banner1" }];
	const bannerimg = [{ id: 1, image: bannerGKit, title: "Ganesh Kit" }];
	// useEffect(alert(banner1), []);
	const { isSmScreen } = useResponsive();
	const navigate = useNavigate();
	return isSmScreen ? (
		<div>
			<ResponsiveCarousel
				items={1}
				itemsInTablet={1}
				itemsInMobile={1}
				infinite={true}
				autoPlaySpeed={8000}
				showArrows={false}
				showDots={false}
				autoPlay={true}
				partialVisibilityGutter={false}
			>
				{bannerImg.map((img) => (
					<div key={img.id}>
						<img
							className={styles.banner}
							src={img.image}
							alt={img.title}
							onClick={() => {
								navigate("/subCategory/166");
							}}
						/>
					</div>
				))}
			</ResponsiveCarousel>
		</div>
	) : (
		<div>
			<ResponsiveCarousel
				items={1}
				itemsInTablet={1}
				itemsInMobile={1}
				infinite={true}
				autoPlaySpeed={8000}
				showArrows={false}
				showDots={false}
				autoPlay={true}
				partialVisibilityGutter={false}
			>
				{bannerImg.map((img) => (
					<div key={img.id}>
						<img
							className={styles.bannerDesktop}
							src={img.image}
							alt={img.title}
							onClick={() => {
								navigate("/subCategory/166");
							}}
						/>
					</div>
				))}
			</ResponsiveCarousel>
		</div>
	);
};
export default Banner;
