import React, { useEffect, useState } from "react";
import { BiLink, BiMinus } from "react-icons/bi";

import {
	FaAngleDoubleRight,
	FaChevronLeft,
	FaChevronRight,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import ResponsiveCarousel from "../shared/responsive-carousel/responsive-carousel";
import ChatOnWhatsapp from "../whatsappChatFeature";
import api from "../../api/api";
import Cookies from "universal-cookie";
import { toast } from "react-toastify";
import { ActionTypes } from "../../model/action-type";
import { useResponsive } from "../shared/use-responsive";
import CollapsibleButton from "./Collapsible";
import "./product-mobile.css";
import {
	AddProductToCart,
	DecrementProduct,
	IncrementProduct,
} from "../../services/cartService";
import { BsPlus, BsShare } from "react-icons/bs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faAngleDoubleRight,
	faCartShopping,
	faIndianRupeeSign,
} from "@fortawesome/free-solid-svg-icons";
import CkModal from "../shared/ck-modal";
import { Link } from "react-router-dom";
import BulkOrder from "./bulk-order";
import TrackingService from "../../services/trackingService";
import { IoCartOutline } from "react-icons/io5";

const ProductMobile = ({
	images,
	mainimage,
	setmainimage = () => {},
	addtoCart = () => {},
	slug,
	productdata,
	productTriggered,
	setProductTriggered = () => {},
	removefromCart = () => {},
	getProductVariants = () => {},
}) => {
	const cookies = new Cookies();
	const dispatch = useDispatch();
	const favorite = useSelector((state) => state.favorite);
	const city = useSelector((state) => state.city);

	const [isCart, setIsCart] = useState(false);
	const [productInCartCount, setProductInCartCount] = useState(0);
	const { isSmScreen } = useResponsive();
	const [showImages, setShowImages] = useState(false);
	const [isOpenBulk, setIsOpenBulk] = useState(false);
	const [isBulkOrder, setIsBulkOrder] = useState(false);
	const [selectQunatityClassName, setSelectQunatityClassName] = useState("");
	const user = useSelector((state) => state.user);
	const handleClick = (event) => {
		alert(event);
		// setSelectedQuantity(event.target.id);
	};

	const trackingService = new TrackingService();

	// //Add to favorite
	// const addToFavorite = async (product_id) => {
	// 	await api
	// 		.addToFavotite(cookies.get("jwt_token"), product_id)
	// 		.then((response) => response.json())
	// 		.then(async (result) => {
	// 			if (result.status === 1) {
	// 				toast.success(result.message);
	// 				await api
	// 					.getFavorite(
	// 						cookies.get("jwt_token"),
	// 						city.city.latitude,
	// 						city.city.longitude
	// 					)
	// 					.then((resp) => resp.json())
	// 					.then((res) => {
	// 						if (res.status === 1)
	// 							dispatch({ type: ActionTypes.SET_FAVORITE, payload: res });
	// 					});
	// 			} else {
	// 				toast.error(result.message);
	// 			}
	// 		});
	// };

	// const removefromFavorite = async (product_id) => {
	// 	await api
	// 		.removeFromFavorite(cookies.get("jwt_token"), product_id)
	// 		.then((response) => response.json())
	// 		.then(async (result) => {
	// 			if (result.status === 1) {
	// 				toast.success(result.message);
	// 				await api
	// 					.getFavorite(
	// 						cookies.get("jwt_token"),
	// 						city.city.latitude,
	// 						city.city.longitude
	// 					)
	// 					.then((resp) => resp.json())
	// 					.then((res) => {
	// 						if (res.status === 1)
	// 							dispatch({ type: ActionTypes.SET_FAVORITE, payload: res });
	// 						else dispatch({ type: ActionTypes.SET_FAVORITE, payload: null });
	// 					});
	// 			} else {
	// 				toast.error(result.message);
	// 			}
	// 		});
	// };

	const DirectAddProductToCart = (qunatity) => {
		if (cookies.get("jwt_token") !== undefined) {
			setIsCart(true);
			setProductTriggered(!productTriggered);
			setProductInCartCount(parseInt(qunatity));
			addtoCart(productdata, productdata.variants[0].id, parseInt(qunatity));
		} else {
			const isAdded = AddProductToCart(productdata, parseInt(qunatity));

			trackingService.trackCart(
				productdata,
				parseInt(qunatity),
				user.status === "loading" ? "" : user.user.email
			);
			if (isAdded) {
				setIsCart(true);
				setProductInCartCount(parseInt(qunatity));
				setProductTriggered(!productTriggered);
			}
		}
	};

	const handleDecrement = () => {
		var val = productInCartCount;
		if (cookies.get("jwt_token") !== undefined) {
			if (val > 0) {
				if (val === 1) {
					setProductInCartCount(0);
					setIsCart(false);
					removefromCart(productdata, productdata.variants[0].id);
				} else {
					setProductInCartCount(val - 1);
					addtoCart(productdata, productdata.variants[0].id, val - 1);
				}
			}
		} else {
			trackingService.trackCart(
				productdata,
				parseInt(val) - 1,
				user.status === "loading" ? "" : user.user.email
			);

			const isDecremented = DecrementProduct(productdata.id, productdata);
			if (isDecremented) {
				setProductInCartCount(val - 1);
			} else {
				setProductInCartCount(0);
				setIsCart(false);
			}
			setProductTriggered(!productTriggered);
		}
	};

	const IncrementProduct1 = (val, index) => {
		if (cookies.get("jwt_token") !== undefined) {
			if (parseInt(val) < parseInt(productdata.total_allowed_quantity)) {
				setProductInCartCount(parseInt(val) + 1);
				addtoCart(productdata, productdata.variants[0].id, parseInt(val) + 1);
			} else {
				toast.error("Maximum Quantity Exceeded");
			}
		} else {
			trackingService.trackCart(
				productdata,
				parseInt(val) + 1,
				user.status === "loading" ? "" : user.user.email
			);

			console.log("xyz", val, productdata);
			const isIncremented = IncrementProduct(
				productdata.id,
				productdata,
				val + 1,
				true
			);
			if (isIncremented) {
				setProductInCartCount(val + 1);
			}
			setProductTriggered(!productTriggered);
		}
	};

	const handleIncrement = () => {
		var val = productInCartCount;
		if (val >= Math.ceil(parseInt(productdata.total_allowed_quantity) / 2)) {
			setIsOpenBulk(true);
			setIsBulkOrder(false);
		} else {
			IncrementProduct1(val, 0);
		}
	};

	useEffect(() => {
		console.log("xyz23", isOpenBulk);
	}, [isOpenBulk]);

	return (
		<div className="row body-wrapper productDetailWrapper ">
			<div className="carousel-container">
				{/* sharebutton  */}
				<div className="ShareBtn">
					<button
						type="button"
						onClick={() => {
							if (navigator.share) {
								navigator
									.share({
										url: `https://chhayakart.com/product/${productdata.id}/${
											productdata.slug.includes("/")
												? productdata.slug.split("/")[0]
												: productdata.slug
										}`,
										text: productdata.name,
									})
									.catch(console.error);
							} else {
								//Your browser doesn't support navigator.share!
							}
						}}
					>
						{" "}
						<BsShare size={30} />
					</button>
				</div>
				<div>
					<ResponsiveCarousel
						items={5}
						itemsInTablet={3}
						infinite={true}
						autoPlay={false}
						autoPlaySpeed={4000}
						showArrows={false}
						showDots={true}
						className="carousel"
					>
						{images.map((image, index) => (
							<div key={index}>
								<div
									className={`sub-image border ${
										mainimage === image ? "active" : ""
									}`}
								>
									<img
										data-src={image}
										className="col-12 imgZoom lazyload "
										alt="product"
										onClick={() => {
											setmainimage(image);
										}}
									></img>
								</div>
							</div>
						))}
					</ResponsiveCarousel>
				</div>
			</div>

			<div>
				<p className="productTitle">{productdata.name}</p>
			</div>
			<div className="productPricing">
				<div className="d-flex flex-row gap-2 align-items-center my-1">
					<div className="price green-text" id={`price-productdetail`}>
						<span className="productDisPrice">
							<FontAwesomeIcon icon={faIndianRupeeSign} className="rupeeIcon" />
							{parseFloat(productdata.variants[0].discounted_price)}
						</span>
					</div>{" "}
					<div
						className="not-price gray-text productActualPrice"
						style={{ textDecoration: "line-through" }}
					>
						<FontAwesomeIcon icon={faIndianRupeeSign} className="rupeeIcon" />
						{parseFloat(productdata.variants[0].price)}{" "}
					</div>
					<div className="percentageOff">
						(
						{Math.round(
							parseFloat(
								((productdata.variants[0].price -
									productdata.variants[0].discounted_price) *
									100) /
									productdata.variants[0].price
							)
						)}
						% off)
					</div>
				</div>
			</div>
			{/* quantity buttons */}
			<div className="productQuantityDiv">
				<span
					className={`defaultProductQuantity ${
						productInCartCount == 1
							? "defaultProductQuantity"
							: "productQuantityBtn"
					}`}
					onClick={() => {
						DirectAddProductToCart(1);
						console.log("xyz2");
					}}
					id="1"
				>
					{" "}
					{parseFloat(productdata.variants[0].stock_unit_name) +
						productdata.variants[0].stock_unit_name.replace(
							parseFloat(productdata.variants[0].stock_unit_name),
							""
						)}
				</span>

				<span
					className={`productQuantityBtn ${
						productInCartCount == 2
							? "defaultProductQuantity"
							: "productQuantityBtn"
					}`}
					onClick={() => {
						DirectAddProductToCart(2);
						console.log("xyz1");
					}}
					id="2"
				>
					{" "}
					{parseFloat(productdata.variants[0].stock_unit_name) * 2 +
						productdata.variants[0].stock_unit_name.replace(
							parseFloat(productdata.variants[0].stock_unit_name),
							""
						)}
				</span>

				<span
					className="productQuantityBtn"
					onClick={() => {
						console.log("xyz");
						setIsOpenBulk(true);
						setIsBulkOrder(true);
					}}
				>
					Bulk Order
				</span>
			</div>
			{/* //collapsiable buttons start */}
			<div className="productDetailsContainer">
				<div className="productDescriptionContianer" index="0">
					<CollapsibleButton
						title="Product Description"
						content={productdata.description}
					/>
				</div>

				{/* <div className="productFeaturesContianer" index="1">
					<CollapsibleButton
						title="Product Feature & Details"
						content={productdata.features}
					/>
				</div> */}
			</div>
			<div className="addToCartStickerDiv">
				{!isCart ? (
					<button
						color="#f25cc5"
						id={`Add-to-cart-productdetail`}
						className="add-to-cartActive"
						onClick={() => DirectAddProductToCart(1)}
					>
						<IoCartOutline className="cartAdd" /> Add to Cart
					</button>
				) : (
					<>
						<div id={`input-cart-productdetail`} className="input-to-cart">
							<button
								type="button"
								className="wishlist-button"
								onClick={() => {
									handleDecrement();
								}}
							>
								<BiMinus />
							</button>
							<span id={`input-productdetail`}>{productInCartCount}</span>
							<button
								type="button"
								className="wishlist-button"
								onClick={() => {
									handleIncrement();
								}}
							>
								<BsPlus />{" "}
							</button>
						</div>
					</>
				)}

				<div>
					<ChatOnWhatsapp></ChatOnWhatsapp>
				</div>

				<div className="viewCartSticker">
					<button type="button" onClick={() => DirectAddProductToCart(1)}>
						<FontAwesomeIcon
							icon={faAngleDoubleRight}
							className="faAngleDoubleRight"
						/>
						<Link to="/checkout" className="buynowButton">
							Buy Now
						</Link>
					</button>
				</div>
			</div>
			{showImages && (
				<>
					<p>Hello</p>
					<CkModal
						show={showImages}
						onHide={() => {
							setShowImages(false);
						}}
					>
						<div>
							{images.map((img, index) => (
								<div key={index}>
									<img data-src={img} className="lazyload" alt="chhayakart" />
								</div>
							))}
						</div>
					</CkModal>
				</>
			)}
			{isOpenBulk && (
				<BulkOrder
					isOpenBulk={isOpenBulk}
					setIsOpenBulk={setIsOpenBulk}
					product={productdata}
					onSubmit={IncrementProduct1}
					onSubmit1={DirectAddProductToCart}
					productVal={productInCartCount}
					isBulkOrder={isBulkOrder}
				/>
			)}
		</div>
	);
};

export default ProductMobile;
