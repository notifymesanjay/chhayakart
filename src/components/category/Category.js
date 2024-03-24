import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useResponsive } from "../shared/use-responsive";
import Gaon from "../Gaon.webp";
import styles from "./category.module.scss";
// import DiwaliOffer from "../../public/images/home-page/DiwaliOffer.webp";
// import diwaliKit from "../../public/images/home-page/diwaliKit.webp";
import Banner from "../seasonBanner/bannerCarousel";
// import ShirdiLadduimg from "../ShirdiLadduimg.jpg";
import { toast } from "react-toastify";

const ShopByCategory = ({
	categories = [],
	setSelectedFilter = () => {},
	ref,
}) => {
	const navigate = useNavigate();
	const { isSmScreen } = useResponsive();
	const user = useSelector((state) => state.user);

	const shop = useSelector((state) => state.shop);
	let topBanners = shop.shop.top_banners;
	let firstBanner = topBanners[0];

	const handleCkWholesale = () => {
		//Check if logged in
		if(user.status === "loading"){
			toast.error("You have to login first to visit CK Wholesale!");
		}else{
			if(user.user.hasRegisteredWholesaleStore){
				navigate("/wholesale/categories");
			}else{
				navigate("/wholesale/add_store");
			}
		}
	}

	return useMemo(
		() => (
			<>
				{shop.shop !== null && (
					<>
						{!isSmScreen ?
						(
							<div className="container">
								<div className={styles.cardWrapper}>
									{/* <div className={styles.ganeshAddDesktop}>
										<img
											className={`${styles.ganeshAdDesktop} lazyload`}
											data-src={TulshiPujanKit}
											alt="Tulsi Pujan Kit"
											onClick={() => {
												navigate("subCategory/96/24_TRADITION");
											}}
										/>
									</div> */}
									<div className="my-2"></div>
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
														// setSelectedFilter(0);
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
						) 
						: (
							<div>
								{firstBanner && <div>
									<img
										className={styles.ganeshAd}
										src={firstBanner.image_url}
										alt={firstBanner.alt}
										onClick={()=>{
											if(firstBanner.navigate_url){
												navigate(firstBanner.navigate_url);
											}
										}}
										/>
								</div>}
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
															// setSelectedFilter(0);
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
									{
										topBanners.map((ele, idx)=> idx===0 ? <div key={`empty_div${idx}`}></div> :
											<div className="my-1" key={`banner${idx}`}>
												<img
													className={styles.durgaAd}
													src={ele.image_url}
													alt={ele.alt}
													onClick={() => {
														if(ele.type === 'wholesale'){
															handleCkWholesale();
														}else{
															if(ele.navigate_url){
																navigate(ele.navigate_url);
															}
														}
													}}
												/>
											</div>
										)
									}
									<div className={styles.seasonBanner}>
										<Banner />
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
