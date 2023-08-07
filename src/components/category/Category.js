import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useResponsive } from "../shared/use-responsive";
import Gaon from "../Gaon.png";
import styles from "./category.module.scss";
import gana from "../gana.jpg";

const ShopByCategory = ({
	categories = [],
	setSelectedFilter = () => {},
	ref,
}) => {
	const navigate = useNavigate();
	const { isSmScreen } = useResponsive();

	const shop = useSelector((state) => state.shop);

	return useMemo(
		() => (
			<>
				{shop.shop !== null && (
					<>
						{!isSmScreen ? (
							<div className="container">
								<div className={styles.cardWrapper}>
									<div className={styles.headerWrapper}>
										<h1 className={styles.header}>SHOP BY CATEGORY</h1>
									</div>
									<div className={styles.categoryWrapper}>
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
							</div>
						) : (
							<div className="container">
								<div className={styles.cardWrapper}>
									{/* <div className="ganeshAdd">
										<img
											className={`${styles.ganeshAd} lazyload`}
											data-src={gana}
											alt="Ganesh Icon"
											onClick={() => {
												navigate("/subCategory/96");
											}}
										/>{" "}
										SPECIAL OFFERS ON GANESH IDOL
									</div> */}
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
							</div>
						)}
					</>
				)}
			</>
		),
		[shop, isSmScreen, navigate]
	);
};

export default ShopByCategory;
