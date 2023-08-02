import React, { useState, useEffect } from "react";
import SelectedCategoryProducts from "./selected-category-products";
import No_Orders from "../../utils/zero-state-screens/No_Orders.svg";
import styles from "./product-list-mobile.module.scss";

const ProductMobile = ({
	subCategories = [],
	selectedFilter = 0,
	productTriggered,
	setProductTriggered,
}) => {
	const [productList, setProductList] = useState([]);

	useEffect(() => {
		if (subCategories.length > 0) {
			if (selectedFilter === 0) {
				let selectCategory = [];
				subCategories.map((sub_ctg) => {
					if (sub_ctg.products.length > 0) {
						sub_ctg.products.map((product) => {
							if (product.variants.length > 0) {
								selectCategory.push(product);
							}
						});
					}
				});
				setProductList(selectCategory);
			} else {
				let selectCategory = [];
				subCategories.map((sub_ctg) => {
					if (sub_ctg.id === selectedFilter) {
						if (sub_ctg.products.length > 0) {
							sub_ctg.products.map((product) => {
								if (product.variants.length > 0) {
									selectCategory.push(product);
								}
							});
						}
					}
				});
				setProductList(selectCategory);
			}
		}
	}, [selectedFilter, subCategories]);

	return (
		<>
			{productList.length > 0 ? (
				<div className={styles.productCardWrapper}>
					{productList.map((product, index) => (
						<SelectedCategoryProducts
							product={product}
							productTriggered={productTriggered}
							setProductTriggered={setProductTriggered}
							index={index}
						/>
					))}
				</div>
			) : (
				<div className={styles.imageCard}>
					<img
						src={No_Orders}
						alt="no-product"
						className="img-fluid lazyloader"
					></img>
					<p className={styles.description}>No Products Found</p>
				</div>
			)}
		</>
	);
};

export default ProductMobile;
