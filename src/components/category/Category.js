import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useResponsive } from "../shared/use-responsive";
import Gaon from "../Gaon.png";
import styles from "./category.module.scss";
// import DiwaliOffer from "../../public/images/home-page/DiwaliOffer.webp";
// import diwaliKit from "../../public/images/home-page/diwaliKit.webp";
import Banner from "../seasonBanner/bannerCarousel";
// import ShirdiLadduimg from "../ShirdiLadduimg.jpg";
import WinterSpecialLaddoo from "../WinterSpecialLaddoo.jpg";
import UpwasKit from '../UpwasKit.jpg'
import TulshiPujanKit from '../../public/images/home-page/TulshiPujanKit.jpg'

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
									<div className={styles.ganeshAddDesktop}>
										<img
											className={`${styles.ganeshAdDesktop} lazyload`}
											data-src={TulshiPujanKit}
											alt="Tulsi Pujan Kit"
											onClick={() => {
												navigate("subCategory/96/24_TRADITION");
											}}
										/>
									</div>
									<div className={styles.headerWrapper}>
										<h1 className={styles.header}>SHOP BY CATEGORY</h1>
									</div>

									<div className={styles.categoryWrapper}>
										{categories.slice(0, 12).map((ctg, index) => (
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
								{/* <div className={styles.seasonBannerDesktop}>
									<Banner />
								</div> */}
								{/* 
								<div className={styles.durgaAddDesktop}>
									<img
										className={styles.durgaAdDesktop}
										src={durgaD}
										alt="Durga Offer"
										onClick={() => {
											navigate("/");
										}}
									/>
								</div> */}
							</div>
						) : (
							<>
								<div className={styles.ganeshAdd}>
									<img
										className={`${styles.ganeshAd} lazyload`}
										data-src={TulshiPujanKit}
										alt="Tulsi Pujan Kit"
										onClick={() => {
											navigate("/subCategory/96/24_TRADITION");
										}}
									/>
								</div>
								<div className="container">
									<div className={styles.cardWrapper}>
										<div className={styles.headerWrapper}>
											<h1 className={styles.header}>SHOP BY CATEGORY</h1>

											<img
												className={`${styles.gaonKiDukan} lazyload`}
												data-src={Gaon}
												alt="Gaon Ki Dukan"
											/>
										</div>

										<div className={styles.mobCategoryWrapper}>
											{categories.slice(0, 12).map((ctg, index) => (
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
									<div>
										<img
											className={styles.durgaAd}
											src={WinterSpecialLaddoo}
											alt="Winter Special Laddoo"
											onClick={() => {
												navigate("/subCategory/103/51_LADDU");
											}}
										/>
									</div>
									<div className="durgaAdd">
										{" "}
										<img
											className={styles.durgaAd}
											src={UpwasKit}
											alt="Upwas Kit"
											onClick={() => {
												navigate("/subCategory/96/87_UPWAS%20FOOD");
											}}
										/>
									</div>
									<div className={styles.seasonBanner}>
										<Banner />
									</div>
								</div>
							</>
						)}
					</>
				)}
			</>
		),
		[shop, isSmScreen, navigate]
	);
};

export default ShopByCategory;
