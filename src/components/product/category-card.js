import React from "react";
import styles from "./category-card.module.scss";
import { useHref, useNavigate } from "react-router-dom";
import { useResponsive } from "../shared/use-responsive";
import SBI from "../SBI.webp";
import AU from "../AU.webp";
import BOB from "../BOB.jpg";
import shingadaLaddo from "../shingadaLaddo.webp";
import batata from "../batata.webp";
import KahjurDryfruit from "../KahjurDryfruit.webp";
import Sabudanapremix from "../Sabudanapremix.webp";
import INDUSIND from "../INDUSIND.webp";
import allOffers from "../allOffers.webp";
import order4999 from "../order4999.webp";
import order9999 from "../order9999.webp";
import freeUpwasKit from "../freeUpwasKit.webp";
import shirdiladdu from "../shirdiladdu.webp";
import mahakalU from "../mahakalU.webp";
import maharashtrianChakli from "../maharashtrianChakli.webp";
import khurdai from "../khurdai.webp";
import vade from "../vade.webp";
import ragiPapad from "../ragiPapad.webp";
import crunchyPatra from "../crunchyPatra.webp";
import chatpataGahu from "../chatpataGahu.webp";

import ResponsiveCarousel from "../shared/responsive-carousel/responsive-carousel";
const CategoryCard = ({ subCategories = [], setSelectedFilter = () => {} }) => {
	const navigate = useNavigate();
	const { isSmScreen } = useResponsive();
	const dynamicBanners = [
		[
			{
				id: 1,
				image: SBI,
				title: "banner1",
				link: "subCategory/96",
			},
			{
				id: 2,
				image: AU,
				title: "banner2 ",
				link: "subCategory/96",
			},
			{
				id: 3,
				image: INDUSIND,
				title: "banner3",
				link: "subCategory/96",
			},
		],
		[
			{
				id: 1,
				image: shingadaLaddo,
				title: "banner1",
				link: "subCategory/96/23_UPWAS%20Food",
			},
			{
				id: 2,
				image: batata,
				title: "banner2 ",
				link: "subCategory/96/23_UPWAS%20Food",
			},
			{
				id: 3,
				image: Sabudanapremix,
				title: "banner3",
				link: "subCategory/96/23_UPWAS%20Food",
			},
			{
				id: 4,
				image: KahjurDryfruit,
				title: "banner4",
				link: "subCategory/96/23_UPWAS%20Food",
			},
		],
		[
			{
				id: 1,
				image: allOffers,
				title: "banner1",
				link: "/",
			},
			{
				id: 2,
				image: freeUpwasKit,
				title: "banner2 ",
				link: "/",
			},
			{
				id: 3,
				image: order4999,
				title: "banner3",
				link: "/",
			},
			{
				id: 4,
				image: order9999,
				title: "banner4",
				link: "/",
			},
		],
		[
			{
				id: 1,
				image: shirdiladdu,
				title: "shirdiladdu",
				link: "subCategory/98/29_PRASAD",
			},
			{
				id: 2,
				image: mahakalU,
				title: "mahakalU ",
				link: "subCategory/98/29_PRASAD",
			},
		],
		[
			{
				id: 1,
				image: crunchyPatra,
				title: "crunchyPatra",
				link: "subCategory/100/41_HOMEMADE%20DESI%20SNACK",
			},
			{
				id: 2,
				image: maharashtrianChakli,
				title: "maharashtrianChakli ",
				link: "subCategory/100/41_HOMEMADE%20DESI%20SNACK",
			},
			{
				id: 3,
				image: chatpataGahu,
				title: "chatpataGahu",
				link: "subCategory/100/41_HOMEMADE%20DESI%20SNACK",
			},
		],
		[
			{
				id: 1,
				image: ragiPapad,
				title: "ragiPapad",
				link: "subCategory/94/31_PAPAD",
			},
			{
				id: 2,
				image: khurdai,
				title: "khurdai ",
				link: "subCategory/94/32_KURDAI",
			},
			{
				id: 3,
				image: vade,
				title: "vade",
				link: "subCategory/94/82_VADE",
			},
		],
	];
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
		{
			id: 4,
			image: BOB,
			title: "banner4",
			link: "https://api.earnow.in/l/g88cIpdLqi",
		},
	];
	return isSmScreen ? (
		<>
			{subCategories.slice(0, 12).map((subCategory, index) => (
				<div key={index}>
					{index % 2 === 0 && (
						<div
							className={`${styles.BankBanner} ${
								index === 0 && styles.hideBanner
							}`}
						>
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
								{dynamicBanners[index / 2].map((img) => (
									<div key={img.id}>
										<img
											onClick={() => {
												navigate(img.link);
											}}
											className={styles.banner}
											src={img.image}
											alt={img.title}
										/>
									</div>
								))}
							</ResponsiveCarousel>
						</div>
					)}
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
