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
import Cookies from "universal-cookie";
import Loader from "../loader/Loader";
import SuccessOrder from "./success-order";
import { useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import SpecificSubCategory from "../specific-sub-category";

const totalVisible = 1;
export default function Success({
	productTriggered,
	setProductTriggered = () => {},
}) {
	const [relatedProducts, setrelatedProducts] = useState(null);
	const city = useSelector((state) => state.city);
	const { isMobile } = useResponsive();
	const [categoryId, setCategoryId] = useState({});
	const navigate = useNavigate();
	const cookies = new Cookies();
	const [isLoader, setIsLoader] = useState(false);
	const [orders, setOrders] = useState([]);
	const [cardToShow, setCardToShow] = useState(0);
	const [totalOrders, setTotalOrders] = useState(0);
	const inputRefs = useMemo(
		() =>
			Array(totalOrders)
				.fill(0)
				.map((_) => React.createRef()),
		[totalOrders]
	);
	const topPos = (element) =>
		element ? element.getBoundingClientRect().top - 140 : 0;
	const { isSmScreen } = useResponsive();

	useEffect(() => {
		const timeout = setTimeout(() => {
			let cardRef = inputRefs[cardToShow];
			if (cardRef) {
				window.scrollBy({
					left: 0,
					top: topPos(cardRef.current),
					behavior: "smooth",
				});
			}

			return () => clearTimeout(timeout);
		}, [100]);
	}, [cardToShow]);

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

	useEffect(() => {
		api
			.getOrders(cookies.get("jwt_token"), 20, 0)
			.then((response) => response.json())
			.then((result) => {
				if (result.status === 1) {
					setIsLoader(false);
					setOrders(result.data);
					setTotalOrders(result.data.length);
				}
			});
	}, []);

	return (
		<>
			<div className={styles.cover}>
				<img
					data-src={ynks}
					className={`${styles.img} lazyload`}
					alt="order placed thankyou visit again"
				></img>
				{/* <span>THANKS.... </span> */}
				{/* <h1 className={styles.title}>YOUR RECENT ORDER WITH CHHAYAKART</h1> */}
			</div>
			<div>
				<div className={styles.transactionWrapper}>
					{orders.length === 0 ? (
						<Loader width="100%" height="350px" />
					) : (
						<>
							{orders.slice(0, totalVisible).map((order, index) => (
								<SuccessOrder
									cardRef={inputRefs[index]}
									order={order}
									id={index}
									show={cardToShow === index}
									setCardToShow={setCardToShow}
								/>
							))}
						</>
					)}
				</div>
				{/* <Order displayAll={false} setCategoryId={setCategoryId} /> */}
				{orders.length > totalVisible && (
					<p
						className={styles.transactionHistory}
						onClick={() => {
							isSmScreen ? navigate('/orders') :
							navigate("/profile");
						}}
					>
						{" "}
						See Past Orders
						<FontAwesomeIcon className={styles.arrowIcon} icon={faArrowRight} />
					</p>
				)}
			</div>

			<div className="related-product-wrapper">
				<br />

				<SpecificSubCategory
					categoryId={166}
					subCategoryId={81}
					productTriggered={productTriggered}
					setProductTriggered={setProductTriggered}
				/>

				<br />
				<h4 className="relatedProductsHeader">Similar Products </h4>
				<div className="related-product-container">
					{relatedProducts === null ? (
						<div className="d-flex justify-content-center">
							<div className="spinner-border" role="status">
								<span className="visually-hidden">Loading...</span>
							</div>
						</div>
					) : (
						<div className="row">
							<ResponsiveCarousel
								items={5}
								itemsInTablet={3}
								itemsInMobile={1.5}
								infinite={true}
								autoPlaySpeed={1000}
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
