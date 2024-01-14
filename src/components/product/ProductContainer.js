import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useResponsive } from "../shared/use-responsive";
import Loader from "../loader/Loader";
import CategoryCard from "./category-card";
import ShopByRegion from "./region";
import "./product.css";
import loan from "../loan.webp";
import loanD from "../loanD.webp";
import CKWholesale from "../../public/images/ck-wholesale/CKWholesale.jpg";
import { toast } from "react-toastify";

const shopByRegionName = "SHOP BY REGION";

const ProductContainer = ({ setSelectedFilter = () => {} }) => {
	const shop = useSelector((state) => state.shop);
	const user = useSelector((state) => state.user);
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
			// if (categoryList.length > 0) {
			// 	for (let i = 0; i < finalSectionList.length; i++) {
			// 		for (let j = 0; j < finalSectionList[i].sub_category.length; j++) {
			// 			for (let k = 0; k < categoryList.length; k++) {
			// 				if (
			// 					finalSectionList[i].sub_category[j].title.toLowerCase() ===
			// 					categoryList[k].name.toLowerCase()
			// 				) {
			// 					finalSectionList[i].sub_category[j]["image_url"] =
			// 						categoryList[k].image_url;
			// 				}
			// 			}
			// 		}
			// 	}
			// }

			if (categoryList.length > 0) {
				for (let i = 0; i < finalSectionList.length; i++) {
					for (let j = 0; j < categoryList.length; j++) {
						if(finalSectionList[i].category_name.toLowerCase() === categoryList[j].name.toLowerCase()){
							for(let k=0; k<finalSectionList[i].sub_category.length; k++){
								let obj = categoryList[j].all_active_childs.find(x => x.name.toLowerCase() === finalSectionList[i].sub_category[k].title.toLowerCase());
								if(obj !== undefined){
									finalSectionList[i].sub_category[k]["image_url"] = obj["image_url"];
								}
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
					{isSmScreen && (
						<div className="loanWrapper">
							<a href="https://api.earnow.in/l/qCZvfTst0l">
								<img className="loan" src={loan} alt="loan" />
							</a>
						</div>
					)}

					{isSmScreen && (
						<div className="wholesaleWrapper">
							<img src={CKWholesale} alt="CK Wholesale" onClick={event=> {
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
							}}/>
						</div>
					)}

					{!isSmScreen && shopByRegionList.length > 0 && (
						<ShopByRegion
							regionList={shopByRegionList}
							setSelectedFilter={setSelectedFilter}
						/>
					)}
					{!isSmScreen && (
						<div className="loanWrapperDesktop">
							<a href="https://api.earnow.in/l/qCZvfTst0l">
								<img className="loanDesktop" src={loanD} alt="loan" />
							</a>
						</div>
					)}
				</>
			)}
		</div>
	);
};

export default ProductContainer;
