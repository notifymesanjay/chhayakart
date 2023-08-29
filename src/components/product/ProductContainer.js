import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useResponsive } from "../shared/use-responsive";
import Loader from "../loader/Loader";
import CategoryCard from "./category-card";
import ShopByRegion from "./region";
import "./product.css";
import DurgaCopy from "../DurgaCopy.jpg";
const shopByRegionName = "SHOP BY REGION";

const ProductContainer = ({ setSelectedFilter = () => {} }) => {
	const shop = useSelector((state) => state.shop);
	const { isSmScreen } = useResponsive();

	const [categories, setCategories] = useState([]);
	const [subCategories, setSubCategories] = useState([]);
	const [shopByRegionList, setShopByRegionList] = useState([]);
	const navigate = useNavigate();
	useEffect(() => {
		if (shop.shop.category != null && shop.shop.category.length > 0) {
			const categoryList = shop.shop.category;
			let finalCategoryList = [];
			let finalShopByRegionList = [];
			categoryList.map((category) => {
				if (
					category.has_child &&
					category.name.toLowerCase() !== shopByRegionName.toLowerCase()
				) {
					finalCategoryList.push(category);
				} else if (
					category.has_child &&
					category.name.toLowerCase() === shopByRegionName.toLowerCase()
				) {
					finalShopByRegionList.push(category);
				}
			});
			setShopByRegionList(finalShopByRegionList);
			setCategories(finalCategoryList);
		}
	}, [shop.shop]);

	useEffect(() => {
		if (shop.shop.sections.length > 0 && categories.length > 0) {
			const sectionList = shop.shop.sections;
			let finalSectionList = [];
			for (let i = 0; i < sectionList.length; i++) {
				let obj = {};
				for (let j = 0; j < categories.length; j++) {
					if (
						parseInt(sectionList[i].category_ids) === parseInt(categories[j].id)
					) {
						obj = {
							category_id: parseInt(categories[j].id),
							category_name: categories[j].name,
							category_image: categories[j].image_url,
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
	}, [shop.shop, categories]);

	return (
		<div className="container">
			{shop.shop === null ? (
				<Loader screen="full" />
			) : (
				<>
					{subCategories.length > 0 && (
						<CategoryCard
							subCategories={subCategories}
							setSelectedFilter={setSelectedFilter}
						/>
					)}
					{isSmScreen && shopByRegionList.length > 0 && (
						<ShopByRegion
							regionList={shopByRegionList}
							setSelectedFilter={setSelectedFilter}
						/>
					)}

					{!isSmScreen && shopByRegionList.length > 0 && (
						<ShopByRegion
							regionList={shopByRegionList}
							setSelectedFilter={setSelectedFilter}
						/>
					)}
				</>
			)}
			{isSmScreen && (
				<div className="durgaAdd">
					<img
						className="durgaAd"
						src={DurgaCopy}
						alt="Durga Offer"
						onClick={() => {
							navigate("/");
						}}
					/>
				</div>
			)}
		</div>
	);
};

export default ProductContainer;
