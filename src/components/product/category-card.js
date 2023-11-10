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
import PoojaGomutr from "../PoojaGomutr.jpg";
import PoojaRose from "../PoojaRose.jpg";
import GomutraTulsi from "../GomutraTulsi.jpg";
import NimboliArk from "../NimboliArk.jpg";

import ResponsiveCarousel from "../shared/responsive-carousel/responsive-carousel";

import AmbeHaladPickle from "../../public/images/banners/AmbeHaladPickle.webp";
import ApniEve from "../../public/images/banners/ApniEve.webp";
import BoiledMoong from "../../public/images/banners/BoiledMoong.webp";
import BoiledRAJMA from "../../public/images/banners/BoiledRAJMA.webp";
import Butterdamakhanigravy from "../../public/images/banners/Butterdamakhanigravy.webp";
import GarlicPickle from "../../public/images/banners/GarlicPickle.webp";
import GingerPickle from "../../public/images/banners/GingerPickle.webp";
import JowarBakedChivda from "../../public/images/banners/JowarBakedChivda.webp";
import JowarFlakes from "../../public/images/banners/JowarFlakes.webp";
import JowarPufftomato from "../../public/images/banners/JowarPufftomato.webp";
import TurmericPickle from "../../public/images/banners/TurmericPickle.webp";
import KadiPatta from "../../public/images/banners/KadiPatta.webp";
import KhichadiMultiMilletPremix from "../../public/images/banners/KhichadiMultiMilletPremix.webp";
import KhobraCoconutChutney from "../../public/images/banners/KhobraCoconutChutney.webp";
import MumbaiPavBhajiMasalaGravy from "../../public/images/banners/MumbaiPavBhajiMasalaGravy.webp";
import OrganicHathchadiBrownRice from "../../public/images/banners/OrganicHathchadiBrownRice.webp";
import PancakeMultiMilletPremix from "../../public/images/banners/PancakeMultiMilletPremix.webp";
import OrganicRupaliRice from "../../public/images/banners/OrganicRupaliRice.webp";
import PastaMultiMilletPremix from "../../public/images/banners/PastaMultiMilletPremix.webp";
import RagiDosaPremix from "../../public/images/banners/RagiDosaPremix.webp";
import RagiPuffCheese from "../../public/images/banners/RagiPuffCheese.webp";
import RagiRava from "../../public/images/banners/RagiRava.webp";
import TeelSesameSeedChutney from "../../public/images/banners/TeelSesameSeedChutney.webp";
import ShengdanPeanutChutney from "../../public/images/banners/ShengdanPeanutChutney.webp";
import bajraBaked from "../../public/images/banners/bajraBaked.webp";
import bajraPuff from "../../public/images/banners/bajraPuff.webp";
import boiledChole from "../../public/images/banners/boiledChole.webp";
import OrganicIndrayaniRice from "../../public/images/banners/OrganicIndrayaniRice.webp";
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
				image: JowarFlakes,
				title: "JowarFlakes",
				link: "/subCategory/99/37_Millet%20Breakfast",
			},
			{
				id: 2,
				image: bajraPuff,
				title: "bajraPuff ",
				link: "/subCategory/99/38_Millet%20Snacks",
			},
			{
				id: 3,
				image: bajraBaked,
				title: "bajraBaked",
				link: "/subCategory/99/38_Millet%20Snacks",
			},
			{
				id: 4,
				image: RagiPuffCheese,
				title: "RagiPuffCheese",
				link: "/subCategory/99/38_Millet%20Snacks",
			},
			{
				id: 5,
				image: JowarBakedChivda,
				title: "JowarBakedChivda ",
				link: "/subCategory/99/38_Millet%20Snacks",
			},
			{
				id: 6,
				image: JowarPufftomato,
				title: "JowarPufftomato",
				link: "/subCategory/99/38_Millet%20Snacks",
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
				image: TeelSesameSeedChutney,
				title: "TeelSesameSeedChutney",
				link: "subCategory/102/49_CHUTNEY",
			},
			{
				id: 2,
				image: KhobraCoconutChutney,
				title: "KhobraCoconutChutney ",
				link: "subCategory/102/49_CHUTNEY",
			},
			{
				id: 3,
				image: KadiPatta,
				title: "KadiPatta",
				link: "subCategory/102/49_CHUTNEY",
			},
			{
				id: 4,
				image: ShengdanPeanutChutney,
				title: "ShengdanPeanutChutney",
				link: "subCategory/102/49_CHUTNEY",
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
				image: ApniEve,
				title: "ApniEve",
				link: "/subCategory/97/28_Ready%202%20Cook%20-%20GRAVY",
			},
			{
				id: 2,
				image: boiledChole,
				title: "boiledChole ",
				link: "/subCategory/97/27_Ready%202%20Cook%20-%20LENTIL",
			},
			{
				id: 3,
				image: Butterdamakhanigravy,
				title: "Butterdamakhanigravy",
				link: "/subCategory/97/28_Ready%202%20Cook%20-%20GRAVY",
			},
			{
				id: 4,
				image: BoiledRAJMA,
				title: "BoiledRAJMA",
				link: "/subCategory/97/27_Ready%202%20Cook%20-%20LENTIL",
			},
			{
				id: 5,
				image: MumbaiPavBhajiMasalaGravy,
				title: "MumbaiPavBhajiMasalaGravy",
				link: "subCategory/97/28_Ready%202%20Cook%20-%20GRAVY",
			},
			{
				id: 6,
				image: BoiledMoong,
				title: " BoiledMoong",
				link: "subCategory/97/27_Ready%202%20Cook%20-%20LENTIL",
			},
		],
		[
			{
				id: 3,
				image: NimboliArk,
				title: "NimboliArk",
				link: "subCategory/98/29_PRASAD",
			},
			{
				id: 4,
				image: PoojaGomutr,
				title: "PoojaGomutr ",
				link: "subCategory/98/29_PRASAD",
			},
			{
				id: 5,
				image: PoojaRose,
				title: "PoojaRose ",
				link: "subCategory/98/29_PRASAD",
			},
			{
				id: 6,
				image: GomutraTulsi,
				title: "GomutraTulsi ",
				link: "subCategory/98/29_PRASAD",
			},
		],
		[
			{
				id: 1,
				image: OrganicRupaliRice,
				title: "OrganicRupaliRice",
				link: "subCategory/104/56_RICE",
			},
			{
				id: 2,
				image: OrganicHathchadiBrownRice,
				title: "OrganicHathchadiBrownRice ",
				link: "subCategory/104/56_RICE",
			},
			{
				id: 3,
				image: OrganicIndrayaniRice,
				title: "OrganicIndrayaniRice ",
				link: "subCategory/104/56_RICE",
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
				image: KhichadiMultiMilletPremix,
				title: "KhichadiMultiMilletPremix",
				link: "/subCategory/97/26_MILLET%20PREMIX",
			},
			{
				id: 2,
				image: RagiRava,
				title: "RagiRava ",
				link: "/subCategory/99",
			},
			{
				id: 3,
				image: PancakeMultiMilletPremix,
				title: "PancakeMultiMilletPremix",
				link: "/subCategory/97/26_MILLET%20PREMIX",
			},
			{
				id: 4,
				image: PastaMultiMilletPremix,
				title: "PastaMultiMilletPremix",
				link: "/subCategory/97/26_MILLET%20PREMIX",
			},
			{
				id: 5,
				image: RagiDosaPremix,
				title: " RagiDosaPremix",
				link: "/subCategory/97/26_MILLET%20PREMIX",
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
		[
			{
				id: 1,
				image: AmbeHaladPickle,
				title: "AmbeHaladPickle",
				link: "subCategory/101/46_Special%20Pickle",
			},
			{
				id: 2,
				image: GarlicPickle,
				title: "GarlicPickle ",
				link: "subCategory/101/46_Special%20Pickle",
			},
			{
				id: 3,
				image: GingerPickle,
				title: "GingerPickle",
				link: "subCategory/101/46_Special%20Pickle",
			},
			{
				id: 4,
				image: TurmericPickle,
				title: "TurmericPickle",
				link: "subCategory/101/46_Special%20Pickle",
			},
		],
		// [
		// 	{
		// 		id: 1,
		// 		image: ,
		// 		title: "",
		// 		link: "subCategory",
		// 	},
		// 	{
		// 		id: 2,
		// 		image: ,
		// 		title: " ",
		// 		link: "subCategory/",
		// 	},
		// 	{
		// 		id: 3,
		// 		image: ,
		// 		title: "",
		// 		link: "subCategory/",
		// 	},
		// ],
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
					{1 && (
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
								{dynamicBanners[index].map((img) => (
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
			{subCategories.slice(0, 12).map((subCategory, index) => (
				<div key={index}>
					{1 && (
						<div
							className={`${styles.BankBannerDesktop} ${
								index === 0 && styles.hideBanner
							}`}
						>
							<ResponsiveCarousel
								items={3}
								itemsInTablet={1}
								itemsInMobile={1}
								infinite={true}
								autoPlaySpeed={2000}
								showArrows={false}
								showDots={true}
								autoPlay={true}
								partialVisibilityGutter={false}
							>
								{dynamicBanners[index].map((img) => (
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
													// src= {`${
													// 		sub_ctg.image_url}`}
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
				</div>
			))}
			<div className={styles.BankBannerDesktop}>
				<ResponsiveCarousel
					items={3}
					itemsInTablet={1}
					itemsInMobile={1}
					infinite={true}
					autoPlaySpeed={3000}
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
		</div>
	);
};

export default CategoryCard;
