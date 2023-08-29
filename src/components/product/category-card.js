import React from "react";
import styles from "./category-card.module.scss";
import { useHref, useNavigate } from "react-router-dom";
import { useResponsive } from "../shared/use-responsive";
import SBI from "../SBI.webp";
import AU from "../AU.webp";

import INDUSIND from "../INDUSIND.webp";
import ResponsiveCarousel from "../shared/responsive-carousel/responsive-carousel";
const CategoryCard = ({ subCategories = [], setSelectedFilter = () => {} }) => {
	const navigate = useNavigate();
	const { isSmScreen } = useResponsive();
	const banners = [
		{
			id: 1,
			image: SBI,
			title: "banner1",
			link: "https://api.earnow.in/l/c4HDPrmGOi",
		},
		{
			id: 2,
			image: AU,
			title: "banner2 ",
			link: "https://api.earnow.in/l/Q6hkysjezl",
		},
		{
			id: 3,
			image: INDUSIND,
			title: "banner3",
			link: "https://api.earnow.in/l/PkFqRHbgH9",
		},
	];
	return isSmScreen ? (
		<>
			{subCategories.slice(0, 12).map((subCategory, index) => (
				<div className={styles.homeCategoryWrapper} key={index}>
					<div className={styles.headerWrapper}>
						<h1 className={styles.header}>{subCategory.category_name}</h1>
					</div>
					<div className={styles.subCategoryWrapper}>
						{subCategory.sub_category.map((sub_ctg, index1) => (
							<div
								className={styles.subCategoryCard}
								key={index1}
								onClick={() => {
									navigate(
										`/subCategory/${subCategory.category_id}/${sub_ctg.id}_${sub_ctg.title}`
									);
									setSelectedFilter(sub_ctg.id);
								}}
							>
								<div className={styles.imageWrapper}>
									<img
										className={styles.subCategoryImg}
										src={sub_ctg.image_url}
										alt="Catogery"
									/>
								</div>
								<div className={styles.cardBody}>
									<p className={styles.title}>{sub_ctg.title}</p>
								</div>
							</div>
						))}
					</div>
				</div>
			))}
			<div className={styles.BankBanner}>
				<ResponsiveCarousel
					items={1}
					itemsInTablet={1}
					itemsInMobile={1}
					infinite={true}
					autoPlaySpeed={3500}
					showArrows={false}
					showDots={true}
					autoPlay={true}
					partialVisibilityGutter={false}
				>
					{banners.map((img) => (
						<div key={img.id}>
							<a href={img.link}>
								<img
									className={styles.banner}
									src={img.image}
									alt={img.title}
								/>
							</a>
						</div>
					))}
				</ResponsiveCarousel>
			</div>
		</>
	) : (
		<div className="container">
			{subCategories.slice(0, 12).map((subCategory) => (
				<div className={styles.cardWrapper}>
					<div className={styles.headerWrapper}>
						<h1 className={styles.header}>{subCategory.category_name}</h1>
					</div>
					<div className={styles.categoryWrapper}>
						<div
							className={styles.categoryImgWrapper}
							onClick={() => {
								navigate(`/subCategory/${subCategory.category_id}`);
								setSelectedFilter(0);
							}}
						>
							<img
								src={`${
									subCategory.category_image.split(".webp")[0]
								}_desktop.webp`}
								alt="category-img"
							/>

							{/* <div className={styles.viewAll}>
								{" "}
								<button className={styles.view}> APPLY NOW</button>{" "}
							</div> */}
						</div>
						<div className={styles.bodyWrapper}>
							<div className={styles.subCategoryWrapper}>
								{subCategory.sub_category.map((sub_ctg, index1) => (
									<div
										className={styles.subCategoryCard}
										key={index1}
										onClick={() => {
											navigate(
												`/subCategory/${subCategory.category_id}/${sub_ctg.id}_${sub_ctg.title}`
											);
											setSelectedFilter(sub_ctg.id);
										}}
									>
										<div className={styles.imageWrapper}>
											<img
												className={styles.subCategoryImg}
												src={`${
													sub_ctg.image_url &&
													sub_ctg.image_url.split(".webp")[0]
												}_desktop.webp`}
												alt="Catogery"
											/>
										</div>
										{/* <div className={styles.cardBody}>
											<p className={styles.title}>{sub_ctg.title}</p>
										</div> */}
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			))}
		</div>
	);
};

export default CategoryCard;
