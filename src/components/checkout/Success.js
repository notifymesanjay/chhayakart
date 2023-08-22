import React, { useEffect, useState } from "react";
import Order from "../order/Order";
import styles from "./Success.module.scss";
import ProductCard from "../shared/card/product-card";
//import orderplaced from "../orderplased.avif";
import api from "../../api/api";
import thanks from "../thanks.webp";
import ynks from "../ynks.webp";
import ResponsiveCarousel from "../shared/responsive-carousel/responsive-carousel";
import { useSelector } from "react-redux";
import { useResponsive } from "../shared/use-responsive";
import { useNavigate, Link } from "react-router-dom";
export default function Success({
	productTriggered,
	setProductTriggered = () => {},
}) {
	const [relatedProducts, setrelatedProducts] = useState(null);
	const city = useSelector((state) => state.city);
	const { isMobile } = useResponsive();
	const [categoryId, setCategoryId] = useState({});
	const navigate = useNavigate();
	useEffect(() => {
		if (city.city !== null) {
			// api
			// 	.getProductbyId(
			// 		city.city.id,
			// 		city.city.latitude,
			// 		city.city.longitude,
			// 		categoryId[0].items[0].id
			// 	)
			// 	.then((response) => response.json())
			// 	.then((result) => {
			// 		if (result.status === 1) {
			// 			debugger;
			// 			var t = result.data;
			// 		}
			// 	})
			// 	.catch((error) => {});

			api
				.getProductbyFilter(
					city.city.id,
					city.city.latitude,
					city.city.longitude,
					{
						category_id: 63,
					}
				)
				.then((response) => response.json())
				.then((result) => {
					if (result.status === 1) {
						// for (let i = 0; i < result.data.length; i++) {
						// 	// if (slug.toLowerCase() === result.data[i].slug.toLowerCase()) {
						// 	// 	dispatch({
						// 	// 		type: ActionTypes.SET_SELECTED_PRODUCT,
						// 	// 		payload: result.data[i].id,
						// 	// 	});
						// 	// }
						// }
						// setproductSize(result.sizes);
						setrelatedProducts(result.data);
					}
				})
				.catch((error) => {});
		}
	}, [city]);

	return (
		<>
			<div className={styles.cover}>
				<img
					data-src={ynks}
					className={`${styles.img} lazyload`}
					alt="order placed thankyou visit again"
				></img>
				{/* <span>THANKS.... </span> */}
				<div className={styles.title}>
					<h1 className="title">YOUR RECENT ORDER WITH CHHAYAKART</h1>
				</div>
			</div>
			<div className={styles.transactionHistory}>
				<Order displayAll={false} setCategoryId={setCategoryId} />
				<span
					className={styles.transactionHistory}
					onClick={() => {
						navigate("/profile");
					}}
				>
					{" "}
					click here for Previous order history
				</span>
			</div>
			<div className="related-product-wrapper">
				<h4 className="relatedProductsHeader">You might also like</h4>
				<div className="related-product-container">
					{relatedProducts === null ? (
						<div className="d-flex justify-content-center">
							<div className="spinner-border" role="status">
								<span className="visually-hidden">Loading...</span>
							</div>
						</div>
					) : (
						<div className="row">
							{/* //<ResponsiveCarousel */}
							<ResponsiveCarousel
								items={5}
								itemsInTablet={3}
								itemsInMobile={1.5}
								infinite={false}
								autoPlaySpeed={2000}
								showArrows={false}
								showDots={false}
								autoPlay={true}
								partialVisible={isMobile}
								partialVisibilityGutter={16}
							>
								{relatedProducts.map((related_product, index) => (
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
					)}
				</div>
			</div>
		</>
	);
}
