import React, { Fragment, useState, useEffect, useRef } from "react";
import ResponsiveCarousel from "../shared/responsive-carousel/responsive-carousel";
import SHINGHADALADOO from "../SHINGHADALADOO.jpg";
import BESANLADOO from "../BESANLADOO.jpg";
import banner3 from "../banner3.jpg";
import RAVALADOO from "../RAVALADOO.jpg";
import MOONGDRYFRUITLADOO from "../MOONGDRYFRUITLADOO.jpg";
import bannerGKit from "../bannerGKit.webp";
import { useResponsive } from "../shared/use-responsive";
import { useNavigate } from "react-router-dom";
import styles from "./bannercarousel.module.scss";
const Banner = () => {
	const bannerImg = [
		{ id: 1, image: BESANLADOO, title: "banner1" },
		{ id: 2, image: MOONGDRYFRUITLADOO, title: "banner2" },
		,
		{ id: 3, image: RAVALADOO, title: "banner3" },

		{ id: 4, image: SHINGHADALADOO, title: "banner4" },
		,
	];
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
				autoPlaySpeed={4000}
				showArrows={false}
				showDots={true}
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
								navigate("/subCategory/103/51_LADDU");
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
				autoPlaySpeed={4000}
				showArrows={false}
				showDots={true}
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
								navigate("/subCategory/103/51_LADDU");
							}}
						/>
					</div>
				))}
			</ResponsiveCarousel>
		</div>
	);
};
export default Banner;
