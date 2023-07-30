import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ActionTypes } from "../../model/action-type";
import SectionTitle from "../shared/section-title/section-title";
import ResponsiveCarousel from "../shared/responsive-carousel/responsive-carousel";
import { useResponsive } from "../shared/use-responsive";
import styles from "./category.module.scss";
import Gaon from "../Gaon.png";
const Category = ({ categories = [], setSelectedFilter = () => {} }) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { isSmScreen } = useResponsive();

	const shop = useSelector((state) => state.shop);

	const selectCategory = (category) => {
		dispatch({ type: ActionTypes.SET_FILTER_CATEGORY, payload: category.id });
		navigate("/products");
	};

	return useMemo(
		() => (
			<>
				{shop.shop !== null && (
					<>
						{!isSmScreen ? (
							<>
								<div className={styles.categoryWrapper}>
									<SectionTitle
										title={"SHOP BY CATOGERY"}
										linkText={true}
										linkName={!isSmScreen ? "See All Categories" : "See All"}
										onLinkClick={() => {
											navigate("/categories");
										}}
									/>
								</div>
								<ResponsiveCarousel
									items={5}
									itemsInTablet={3}
									infinite={true}
									autoPlay={true}
									autoPlaySpeed={4000}
									showArrows={false}
									showDots={false}
								>
									{shop.shop.category.map((ctg, index) => (
										<div
											key={index}
											className={styles.cardWrapper}
											onClick={() => selectCategory(ctg)}
										>
											<img
												data-src={ctg.image_url}
												alt={ctg.subtitle}
												className={`${styles.categoryImg} lazyload`}
											/>
											<p className={styles.categoryName}>{ctg.name}</p>
										</div>
									))}
								</ResponsiveCarousel>
							</>
						) : (
							<div className={styles.mobCardWrapper}>
								<div className={styles.headerWrapper}>
									<h1 className={styles.header}>SHOP BY CATEGORY</h1>

									<img
										className={`${styles.gaonKiDukan} lazyload`}
										data-src={Gaon}
										alt="Gaon Ki Dukan"
									/>
								</div>

								<div className={styles.mobCategoryWrapper}>
									{categories.map((ctg, index) => (
										<div className={styles.category} key={index}>
											<div
												className={styles.imageWrapper}
												onClick={() => {
													navigate(`/subCategory/${ctg.id}`);
													setSelectedFilter(0);
												}}
											>
												<img
													className={`${styles.categoryImg} lazyload`}
													src={ctg.image_url}
													alt={ctg.subtitle}
												/>
											</div>
										</div>
									))}
								</div>
							</div>
						)}
					</>
				)}
			</>
		),
		[shop, isSmScreen, navigate]
	);
};

export default Category;
