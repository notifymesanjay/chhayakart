import React, { Fragment, useState, useEffect, useRef } from "react";
import Carousel from "react-multi-carousel";
import { CustomLeftArrow, CustomRightArrow } from "./custom-arrow";
import styles from "./responsive-carousel.module.scss";

const ResponsiveCarousel = ({
	infinite = true,
	loop,
	autoPlay,
	showDots,
	showArrows,
	items,
	itemsInTablet = 2,
	itemsInMobile = 1,
	partialVisibilityGutter = 16,
	slidesToSlide = 1,
	className = "",
	defaultSlide,
	children,
	...props
}) => {
	const carouselRef = useRef();
	const [carouselItems] = useState(
		Array.isArray(children) ? children : [children]
	);
	const hasWindow = typeof window !== "undefined";
	const [isSmallScreen, setIsSmallScreen] = useState(
		hasWindow ? window.innerWidth < 1024 : ""
	);
	const [responsive] = useState({
		desktop: {
			breakpoint: { max: 3000, min: 1024 },
			items: items,
			partialVisibilityGutter: partialVisibilityGutter,
			slidesToSlide: slidesToSlide,
		},
		tablet: {
			breakpoint: { max: 1023, min: 464 },
			items: itemsInTablet,
			partialVisibilityGutter: partialVisibilityGutter,
			slidesToSlide: 1,
		},
		mobile: {
			breakpoint: { max: 464, min: 0 },
			items: itemsInMobile,
			partialVisibilityGutter: partialVisibilityGutter,
			slidesToSlide: 1,
		},
	});

	const onResize = () => {
		setIsSmallScreen(window.innerWidth < 1024);
	};

	useEffect(() => {
		window.addEventListener("resize", onResize);
		return () => {
			window.removeEventListener("resize", onResize);
		};
	}, []);

	useEffect(() => {
		if (defaultSlide !== undefined && carouselRef && carouselRef.current) {
			setTimeout(() => {
				carouselRef.current.goToSlide(defaultSlide, true);
			}, [100]);
		}
	}, [defaultSlide]);

	return (
		<Carousel
			ref={carouselRef}
			arrows={
				showArrows === undefined
					? !isSmallScreen && carouselItems.length > items
					: showArrows
			}
			infinite={infinite}
			showDots={showDots === undefined ? isSmallScreen : showDots}
			autoPlay={
				autoPlay === undefined
					? (!isSmallScreen && loop) || (isSmallScreen && !loop)
					: autoPlay
			}
			responsive={responsive}
			customLeftArrow={<CustomLeftArrow />}
			customRightArrow={<CustomRightArrow />}
			className={`${styles.carousel} ${className}`}
			{...props}
		>
			{carouselItems.map((child, index) => (
				<Fragment key={index}>{child}</Fragment>
			))}
		</Carousel>
	);
};

export default ResponsiveCarousel;
