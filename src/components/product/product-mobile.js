import React, { useState } from "react";
import { BiLink, BiMinus } from "react-icons/bi";

import { FaChevronLeft, FaChevronRight, FaRupeeSign } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import ResponsiveCarousel from "../shared/responsive-carousel/responsive-carousel";
import ChatOnWhatsapp from "../whatsappChatFeature";
import Slider from "react-slick";
import api from "../../api/api";
import Cookies from "universal-cookie";
import { toast } from "react-toastify";
import { ActionTypes } from "../../model/action-type";
import { useResponsive } from "../shared/use-responsive";
import CollapsibleButton from "./Collapsible";
import "./product-mobile.css";
import {
	addProductToCart,
	decrementProduct,
	incrementProduct,
} from "../../services/cartService";
import { BsHeart, BsHeartFill, BsPlus } from "react-icons/bs";
import {
	FacebookIcon,
	FacebookShareButton,
	TelegramIcon,
	TelegramShareButton,
	WhatsappIcon,
	WhatsappShareButton,
} from "react-share";

const ProductMobile = ({
	images,
	mainimage,
	productbrand,
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

	const [selectQunatityClassName, setSelectQunatityClassName] = useState("");
	const handleClick = (event) => {
		alert(event);
		// setSelectedQuantity(event.target.id);
	};

	const settings_subImage = {
		infinite: false,
		slidesToShow: 3,
		initialSlide: 0,
		// centerMargin: "10px",
		margin: "20px",
		prevArrow: (
			<button
				type="button"
				className="slick-prev"
				onClick={(e) => {
					setmainimage(e.target.value);
				}}
			>
				<FaChevronLeft size={30} className="prev-arrow" />
			</button>
		),
		nextArrow: (
			<button
				type="button"
				className="slick-next"
				onClick={(e) => {
					setmainimage(e.target.value);
				}}
			>
				<FaChevronRight color="#f7f7f7" size={30} className="next-arrow" />
			</button>
		),
		responsive: [
			{
				breakpoint: 1024,
				settings: {
					slidesToShow: 4,
					slidesToScroll: 1,
					infinite: true,
				},
			},
			{
				breakpoint: 768,
				settings: {
					slidesToShow: 3,
					slidesToScroll: 1,
				},
			},
		],
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

	const addProductToCart1 = (qunatity) => {
		if (cookies.get("jwt_token") !== undefined) {
			setIsCart(true);
			setProductInCartCount(parseInt(qunatity));
			addtoCart(
				productdata.id,
				JSON.parse(
					document.getElementById(`select-product-variant-productdetail`).value
				).id,
				parseInt(qunatity)
			);
		} else {
			const isAdded = addProductToCart(productdata, parseInt(qunatity));
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
					removefromCart(
						productdata.id,
						JSON.parse(
							document.getElementById(`select-product-variant-productdetail`)
								.value
						).id
					);
				} else {
					setProductInCartCount(val - 1);
					addtoCart(
						productdata.id,
						JSON.parse(
							document.getElementById(`select-product-variant-productdetail`)
								.value
						).id,
						val - 1
					);
				}
			}
		} else {
			const isDecremented = decrementProduct(productdata.id, productdata);
			if (isDecremented) {
				setProductInCartCount(val - 1);
			} else {
				setProductInCartCount(0);
				setIsCart(false);
			}
			setProductTriggered(!productTriggered);
		}
	};

	const handleIncrement = () => {
		var val = productInCartCount;
		if (cookies.get("jwt_token") !== undefined) {
			if (val < productdata.total_allowed_quantity) {
				setProductInCartCount(val + 1);
				addtoCart(
					productdata.id,
					JSON.parse(
						document.getElementById(`select-product-variant-productdetail`)
							.value
					).id,
					val + 1
				);
			}
		} else {
			const isIncremented = incrementProduct(productdata.id, productdata, 1);
			if (isIncremented) {
				setProductInCartCount(val + 1);
			}
			setProductTriggered(!productTriggered);
		}
	};

	return (
		<div className="row body-wrapper ">
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
								console.log("Your browser doesn't support navigator.share!");
							}
						}}
					>
						{" "}
						<BiLink size={30} />
					</button>
				</div>

				<ResponsiveCarousel
					items={images.length}
					itemsInTablet={3}
					infinite={true}
					autoPlay={true}
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

			<div>
				<p className="productTitle">{productdata.name}</p>
			</div>
			<div classNam="productPricing">
				<div className="d-flex flex-row gap-2 align-items-center my-1">
					<div className="price green-text" id={`price-productdetail`}>
						<FaRupeeSign fill="var(--secondary-color)" />
						<span className="productDisPrice">
							{parseFloat(productdata.variants[0].discounted_price)}
						</span>
					</div>{" "}
					<div
						className="not-price gray-text productActualPrice"
						style={{ textDecoration: "line-through" }}
					>
						<FaRupeeSign
							fill="var(--text-color)"
							textDecoration="line-through"
						/>
						{parseFloat(productdata.variants[0].price)}{" "}
					</div>
					<div className="percentageOff">
						-{" "}
						{Math.round(
							parseFloat(
								((productdata.variants[0].price -
									productdata.variants[0].discounted_price) *
									100) /
									productdata.variants[0].price
							)
						)}
						% off
					</div>
				</div>
			</div>
			{/* quantity buttons */}
			<div className="productQuantityDiv">
				<button
					className={`defaultProductQuantity ${
						productInCartCount == 1
							? "defaultProductQuantity"
							: "productQuantityBtn"
					}`}
					onClick={() => addProductToCart1(1)}
					id="1"
				>
					{" "}
					{parseFloat(productdata.variants[0].stock_unit_name) +
						productdata.variants[0].stock_unit_name.replace(
							parseFloat(productdata.variants[0].stock_unit_name),
							""
						)}
				</button>

				<button
					className={`productQuantityBtn ${
						productInCartCount == 2
							? "defaultProductQuantity"
							: "productQuantityBtn"
					}`}
					onClick={() => addProductToCart1(2)}
					id="2"
				>
					{" "}
					{parseFloat(productdata.variants[0].stock_unit_name) * 2 +
						productdata.variants[0].stock_unit_name.replace(
							parseFloat(productdata.variants[0].stock_unit_name),
							""
						)}
				</button>
				<button
					id="3"
					className={` ${
						productInCartCount == 4
							? "defaultProductQuantity"
							: "productQuantityBtn"
					}`}
					onClick={() => addProductToCart1(4)}
				>
					{" "}
					{parseFloat(productdata.variants[0].stock_unit_name) * 4 +
						productdata.variants[0].stock_unit_name.replace(
							parseFloat(productdata.variants[0].stock_unit_name),
							""
						)}
				</button>
			</div>

			{/* //collapsiable buttons start */}
			<div className="productDetailsContainer">
				<div
					// style={{ overflow: "hidden" }}
					className="productDescriptionContianer"
				>
					<CollapsibleButton
						title="Product Description"
						content={productdata.description}
					/>
				</div>

				<div className="productFeaturesContianer">
					<CollapsibleButton
						title="Product Feature & Details"
						content={productdata.features}
					/>
				</div>
			</div>

			{/* // collapse end */}
			{/*<div className="col-xl-8 col-lg-6 col-md-12 col-12">
				<div className="detail-wrapper">
					 <div className="top-section">
						{/* <p className="product_name">{productdata.name}</p>
						{Object.keys(productbrand).length === 0 ? null : (
							<div className="product-brand">
								<span className="brand-title">Brand:</span>
								<span className="brand-name">{productbrand.name}</span>
							</div>
            )} 
            
						{/* <div className="d-flex flex-row gap-2 align-items-center my-1">
							<span className="price green-text" id={`price-productdetail`}>
								<FaRupeeSign fill="var(--secondary-color)" />
								{parseFloat(productdata.variants[0].discounted_price)}{" "}
							</span>{" "}
							{/* <div
								className="not-price gray-text"
								style={{ textDecoration: "line-through" }}
							>
								<FaRupeeSign
									fill="var(--text-color)"
									textDecoration="line-through"
								/>
								{parseFloat(productdata.variants[0].price)}
							</div> 
						</div> 
          </div> 

					<div className="bottom-section">
						 <p>Product Variants</p> 
						<div className="d-flex gap-3 bottom-section-content">
							{/* <select
								id={`select-product-variant-productdetail`}
								onChange={(e) => {
									document.getElementById(`price-productdetail`).innerHTML =
										parseFloat(JSON.parse(e.target.value).price);

									if (isCart) {
										setIsCart(false);
									}
								}}
								defaultValue={JSON.stringify(productdata.variants[0])}
							>
								{getProductVariants(productdata)}
							</select> 
						</div>
							<div className="product-overview">
							 <div className="product-seller">
								{/* <span className='seller-title'>Sold By:</span>
                                                    <span className='seller-name'>{productdata.seller_name} </span> 
							</div> {productdata.tags !== "" ? (
								<div className="product-tags">
									<span className="tag-title">Product Tags:</span>
									<span className="tag-name">{productdata.tags} </span>
								</div>
							) : (
								""
							)} 
						</div> 
					    <div className="share-product-container">
							<span>Share product:</span>

							<ul className="share-product">
								<li className="share-product-icon">
									<WhatsappShareButton
										url={`https://chhayakart.com/product/${productdata.slug}`}
									>
										<WhatsappIcon size={32} round={true} />{" "}
									</WhatsappShareButton>
								</li>
								<li className="share-product-icon">
									<TelegramShareButton
										url={`https://chhayakart.com/product/${productdata.slug}`}
									>
										<TelegramIcon size={32} round={true} />{" "}
									</TelegramShareButton>
								</li>
								<li className="share-product-icon">
									<FacebookShareButton
										url={`https://chhayakart.com/product/${productdata.slug}`}
									>
										<FacebookIcon size={32} round={true} />{" "}
									</FacebookShareButton>
								</li>
								<li className="share-product-icon">
									<button
										type="button"
										onClick={() => {
											navigator.clipboard.writeText(
												`https://chhayakart.com/product/${productdata.slug}`
											);
											toast.success("Copied Succesfully!!");
										}}
									>
										{" "}
										<BiLink size={30} />
									</button>
								</li>
							</ul>
						</div> 

					 </div>
				</div>
			</div>*/}

			<div className="addToCartStickerDiv">
				{!isCart ? (
					<button
						type="button"
						id={`Add-to-cart-productdetail`}
						className="add-to-cartActive"
						onClick={() => addProductToCart1(1)}
					>
						Add to Cart
					</button>
				) : (
					<div id={`input-cart-productdetail`} className="input-to-cart">
						<button
							type="button"
							className="wishlist-button"
							onClick={() => {
								handleDecrement();
							}}
						>
							<BiMinus fill="#fff" />
						</button>
						<span id={`input-productdetail`}>{productInCartCount}</span>
						<button
							type="button"
							className="wishlist-button"
							onClick={() => {
								handleIncrement();
							}}
						>
							<BsPlus fill="#fff" />{" "}
						</button>
					</div>
				)}

				<div className="viewCartSticker">
					<ChatOnWhatsapp></ChatOnWhatsapp>
					{/* {favorite.favorite &&
					favorite.favorite.data.some(
						(element) => element.id === productdata.id
					) ? (
						<button
							type="button"
							className="wishlist-product"
							onClick={() => removefromFavorite(productdata.id)}
						>
							<BsHeartFill fill="red" />
							Add to wishlist
						</button>
					) : (
						<button
							key={productdata.id}
							type="button"
							className="wishlist-product"
							onClick={() => addToFavorite(productdata.id)}
						>
							<BsHeart /> wishlist
						</button>
					)} */}
				</div>
			</div>
		</div>
	);
};

export default ProductMobile;
