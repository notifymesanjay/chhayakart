import React, { useEffect, useState } from "react";
import { BiLink, BiMinus } from "react-icons/bi";

import { FaChevronLeft, FaChevronRight, FaRupeeSign } from "react-icons/fa";
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
import { BsPlus } from "react-icons/bs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faIndianRupeeSign } from "@fortawesome/free-solid-svg-icons";
import CkModal from "../shared/ck-modal";
import { Link } from "react-router-dom";
import BulkOrder from "./bulk-order";
import TrackingService from "../../services/trackingService";

const ProductMobile = ({
	images,
	mainimage,
	setmainimage = () => {},
	addtoCart = () => {},
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

	//Add to favorite
	const addToFavorite = async (product_id) => {
		await api
			.addToFavotite(cookies.get("jwt_token"), product_id)
			.then((response) => response.json())
			.then(async (result) => {
				if (result.status === 1) {
					toast.success(result.message);
					await api
						.getFavorite(
							cookies.get("jwt_token"),
							city.city.latitude,
							city.city.longitude
						)
						.then((resp) => resp.json())
						.then((res) => {
							if (res.status === 1)
								dispatch({ type: ActionTypes.SET_FAVORITE, payload: res });
						});
				} else {
					toast.error(result.message);
				}
			});
	};
	const removefromFavorite = async (product_id) => {
		await api
			.removeFromFavorite(cookies.get("jwt_token"), product_id)
			.then((response) => response.json())
			.then(async (result) => {
				if (result.status === 1) {
					toast.success(result.message);
					await api
						.getFavorite(
							cookies.get("jwt_token"),
							city.city.latitude,
							city.city.longitude
						)
						.then((resp) => resp.json())
						.then((res) => {
							if (res.status === 1)
								dispatch({ type: ActionTypes.SET_FAVORITE, payload: res });
							else dispatch({ type: ActionTypes.SET_FAVORITE, payload: null });
						});
				} else {
					toast.error(result.message);
				}
			});
	};

	const AddProductToCart1 = (qunatity) => {
		if (cookies.get("jwt_token") !== undefined) {
			setIsCart(true);
			setProductTriggered(!productTriggered);
			setProductInCartCount(parseInt(qunatity));
			addtoCart(productdata.id, productdata.variants[0].id, parseInt(qunatity));
		} else {
			const isAdded = AddProductToCart(productdata, parseInt(qunatity));
			if (isAdded) {
				setIsCart(true);
				setProductInCartCount(parseInt(qunatity));
				setProductTriggered(!productTriggered);
			}
		}
	};

	const handleDecrement = (product) => {
		const trackingService = new TrackingService();
		trackingService.trackCart(
			product,
			parseInt(val) - 1,
			user.status === "loading" ? "" : user.user.email
		);
		var val = productInCartCount;
		if (cookies.get("jwt_token") !== undefined) {
			if (val > 0) {
				if (val === 1) {
					setProductInCartCount(0);
					setIsCart(false);
					removefromCart(productdata.id, productdata.variants[0].id);
				} else {
					setProductInCartCount(val - 1);
					addtoCart(productdata.id, productdata.variants[0].id, val - 1);
				}
			}
		} else {
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
				addtoCart(
					productdata.id,
					productdata.variants[0].id,
					parseInt(val) + 1
				);
			} else {
				toast.error("Maximum Quantity Exceeded");
			}
		} else {
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

	const handleIncrement = (product) => {
		var val = productInCartCount;
		const trackingService = new TrackingService();
		trackingService.trackCart(
			product,
			parseInt(val) + 1,
			user.status === "loading" ? "" : user.user.email
		);
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
										url: `https://chhayakart.com/product/${productdata.id}`,
										text: productdata.name,
									})
									.catch(console.error);
							} else {
								//Your browser doesn't support navigator.share!
							}
						}}
					>
						{" "}
						<BiLink size={30} />
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
										src={image}
										className="col-12 imgZoom"
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
						AddProductToCart1(1);
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
						AddProductToCart1(2);
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

				<div className="productFeaturesContianer" index="1">
					<CollapsibleButton
						title="Product Feature & Details"
						content={productdata.features}
					/>
				</div>
			</div>
			<div className="addToCartStickerDiv">
				{!isCart ? (
					<button
						type="button"
						id={`Add-to-cart-productdetail`}
						className="add-to-cartActive"
						onClick={() => AddProductToCart1(1)}
					>
						Add to Cart
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

				<div className="viewCartSticker">
					<button type="button" onClick={() => AddProductToCart1(1)}>
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
									<img src={img} alt="" />
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
					onSubmit1={AddProductToCart1}
					productVal={productInCartCount}
					isBulkOrder={isBulkOrder}
				/>
			)}
		</div>
	);
};

export default ProductMobile;
