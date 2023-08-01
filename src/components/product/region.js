import React, { useEffect, useState } from "react";
import { useResponsive } from "../shared/use-responsive";
import CategoryCard from "./category-card";
import styles from "./region.module.scss";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ShopByRegion = ({ regionList = [], setSelectedFilter = () => {} }) => {
	const { isSmScreen } = useResponsive();
	const navigate = useNavigate();
	const shop = useSelector((state) => state.shop);
	const [subCategories, setSubCategories] = useState([]);

	useEffect(() => {
		if (shop.shop.sections.length > 0 && regionList.length > 0) {
			const sectionList = shop.shop.sections;
			let finalSectionList = [];
			for (let i = 0; i < sectionList.length; i++) {
				let obj = {};
				for (let j = 0; j < regionList.length; j++) {
					if (
						parseInt(sectionList[i].category_ids) === parseInt(regionList[j].id)
					) {
						obj = {
							category_id: parseInt(regionList[j].id),
							category_name: regionList[j].name,
						};
						obj["sub_category"] = [sectionList[i]];
					}
				}
				let flag = Number.MAX_VALUE;
				for (let k = 0; k < finalSectionList.length && obj.category_id; k++) {
					if (parseInt(finalSectionList[k].category_id) === obj.category_id) {
						flag = k;
					}
				}
				if (flag === Number.MAX_VALUE && obj.category_id) {
					finalSectionList.push(obj);
				} else if (flag !== Number.MAX_VALUE && obj.category_id) {
					finalSectionList[flag]["sub_category"].push(obj["sub_category"][0]);
				}
			}
			const categoryList = shop.shop.category;
			if (categoryList.length > 0) {
				for (let i = 0; i < finalSectionList.length; i++) {
					for (let j = 0; j < finalSectionList[i].sub_category.length; j++) {
						for (let k = 0; k < categoryList.length; k++) {
							if (
								finalSectionList[i].sub_category[j].title.toLowerCase() ===
								categoryList[k].name.toLowerCase()
							) {
								finalSectionList[i].sub_category[j]["image_url"] =
									categoryList[k].image_url;
							}
						}
					}
				}
			}
			setSubCategories(finalSectionList);
		}
	}, [shop.shop, regionList]);

	return (
		isSmScreen &&
		subCategories.length > 0 && (
			<div className={styles.mobCardWrapper}>
				<div className={styles.headerWrapper}>
					<h1 className={styles.header}>SHOP BY REGION</h1>
				</div>
				<div className={styles.mobCategoryWrapper}>
					{subCategories[0].sub_category.map((ctg, index) => (
						<div className={styles.category} key={index}>
							<div
								className={styles.imageWrapper}
								onClick={() => {
									navigate(`/subCategory/${subCategories[0].category_id}`);
									setSelectedFilter(ctg.id);
								}}
							>
								<img
									className={`${styles.categoryImg} lazyload`}
									data-src={ctg.image_url}
									alt={ctg.subtitle}
								/>
							</div>
						</div>
					))}
				</div>
			</div>
		)
	);
};

export default ShopByRegion;
