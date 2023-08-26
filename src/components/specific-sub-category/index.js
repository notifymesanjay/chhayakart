import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useResponsive } from "../shared/use-responsive";
import ProductCard from "../shared/card/product-card";
import ResponsiveCarousel from "../shared/responsive-carousel/responsive-carousel";
import styles from "./specific-sub-category.module.scss";

const SpecificSubCategory = ({
	categoryId = 166,
	subCategoryId = 81,
	productTriggered = false,
	setProductTriggered = () => {},
}) => {
	const { isMobile } = useResponsive();
	const shop = useSelector((state) => state.shop);
	const [subCategories, setSubCategories] = useState([]);
	const [products, setProducts] = useState([]);

	useEffect(() => {
		const sectionList = [...shop.shop.sections];
		if (shop.shop.sections.length > 0) {
			let finalList = [];
			for (let i = 0; i < sectionList.length; i++) {
				let obj = {};
				if (parseInt(sectionList[i].category_ids) === parseInt(categoryId)) {
					obj = {
						category_id: parseInt(categoryId),
					};
					obj["sub_category"] = [sectionList[i]];
				}
				let flag = Number.MAX_VALUE;
				for (let k = 0; k < finalList.length && obj.category_id; k++) {
					if (parseInt(finalList[k].category_id) === obj.category_id) {
						flag = k;
					}
				}
				if (flag === Number.MAX_VALUE && obj.category_id) {
					finalList.push(obj);
				} else if (flag !== Number.MAX_VALUE && obj.category_id) {
					finalList[flag]["sub_category"].push(obj["sub_category"][0]);
				}
			}
			setSubCategories(finalList[0].sub_category);
		}
	}, [categoryId, shop.shop]);

	useEffect(() => {
		if (subCategories.length > 0) {
			let selectCategory = [];
			for (let i = 0; i < subCategories.length; i++) {
				if (subCategories[i].id === subCategoryId) {
					if (subCategories[i].products.length > 0) {
						subCategories[i].products.map((product) => {
							if (product.variants.length > 0) {
								selectCategory.push(product);
							}
						});
					}
				}
			}
			setProducts(selectCategory);
		}
	}, [subCategoryId, subCategories]);
	return (
		<div className={styles.productWrapper}>
			{products.length > 0 ? (
				<>
					<h1 className={styles.header}>Season's Best Seller</h1>
					<div className="row">
						<ResponsiveCarousel
							items={5}
							itemsInTablet={3}
							itemsInMobile={1.5}
							infinite={true}
							autoPlaySpeed={2000}
							showArrows={false}
							showDots={false}
							autoPlay={false}
							partialVisible={isMobile}
							partialVisibilityGutter={16}
						>
							{products.map((related_product, index) => (
								<div className="col-md-3 col-lg-4" key={index}>
									<ProductCard
										productTriggered={productTriggered}
										setProductTriggered={setProductTriggered}
										product={related_product}
										displayAddtoCart={false}
										className="customProductCard"
									/>
								</div>
							))}
						</ResponsiveCarousel>
					</div>
				</>
			) : (
				""
			)}
		</div>
	);
};

export default SpecificSubCategory;
