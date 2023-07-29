import React, { useEffect, useState } from "react";
import "./product.css";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { BsHeart, BsShare, BsPlus, BsHeartFill } from "react-icons/bs";
import { BiMinus, BiLink, BiDollar } from "react-icons/bi";
import { FaChevronLeft, FaChevronRight, FaRupeeSign } from "react-icons/fa";
import { toast } from "react-toastify";
import api from "../../api/api";
import Cookies from "universal-cookie";
import { useDispatch, useSelector } from "react-redux";
import { ActionTypes } from "../../model/action-type";
import ResponsiveCarousel from "../shared/responsive-carousel/responsive-carousel";
import {
	FacebookIcon,
	FacebookShareButton,
	TelegramIcon,
	TelegramShareButton,
	WhatsappIcon,
	WhatsappShareButton,
} from "react-share";
import Loader from "../loader/Loader";
import CryptoJS from "crypto-js";
import {
	addProductToCart,
	decrementProduct,
	incrementProduct,
} from "../../services/cartService";
import LoginUser from "../login/login-user";
import CkModal from "../shared/ck-modal";

const QuickViewModal = (props) => {
	const cookies = new Cookies();
	const dispatch = useDispatch();

	const city = useSelector((state) => state.city);
	const favorite = useSelector((state) => state.favorite);
	const setting = useSelector((state) => state.setting);

	const secret_key = "Xyredg$5g";
	const share_parent_url = "https://chhayakart.com/product";

	useEffect(() => {
		return () => {
			props.setselectedProduct({});
			setproductcategory({});
			setproductbrand({});
			setproduct({});
		};
	}, []);

	const fetchProduct = async (product_id) => {
		await api
			.getProductbyId(
				city.city.id,
				city.city.latitude,
				city.city.longitude,
				product_id
			)
			.then((response) => response.json())
			.then((result) => {
				if (result.status === 1) {
					setproduct(result.data);
					setmainimage(result.data.image_url);
				}
			})
			.catch((error) => {});
	};

	useEffect(() => {
		if (Object.keys(props.selectedProduct).length > 0 && city.city !== null) {
			fetchProduct(props.selectedProduct.id);

			getCategoryDetails();
			getBrandDetails();
		}
	}, [props.selectedProduct, city]);

	const [mainimage, setmainimage] = useState("");
	const [productcategory, setproductcategory] = useState({});
	const [productbrand, setproductbrand] = useState({});
	const [product, setproduct] = useState({});
	const [isLoader, setisLoader] = useState(false);
	const [isLogin, setIsLogin] = useState(false);

	const getProductVariants = (product) => {
		return product.variants.map((variant, ind) => (
			<option key={ind} value={JSON.stringify(variant)}>
				{variant.stock_unit_name} Rs.{variant.price}
			</option>
		));
	};

	const getCategoryDetails = () => {
		api
			.getCategory()
			.then((response) => response.json())
			.then((result) => {
				if (result.status === 1) {
					result.data.forEach((ctg) => {
						if (ctg.id === props.selectedProduct.category_id) {
							setproductcategory(ctg);
						}
					});
				}
			})
			.catch((error) => {});
	};

	const getBrandDetails = () => {
		api
			.getBrands()
			.then((response) => response.json())
			.then((result) => {
				if (result.status === 1) {
					result.data.forEach((brnd) => {
						if (brnd.id === props.selectedProduct.brand_id) {
							setproductbrand(brnd);
						}
					});
				}
			})
			.catch((error) => {});
	};

	//Add to Cart
	const addtoCart = async (product_id, product_variant_id, qty) => {
		setisLoader(true);
		await api
			.addToCart(cookies.get("jwt_token"), product_id, product_variant_id, qty)
			.then((response) => response.json())
			.then(async (result) => {
				if (result.status === 1) {
					//popup commented
					//	toast.success(result.message);
					await api
						.getCart(
							cookies.get("jwt_token"),
							city.city.latitude,
							city.city.longitude
						)
						.then((resp) => resp.json())
						.then((res) => {
							if (res.status === 1)
								dispatch({ type: ActionTypes.SET_CART, payload: res });
						});
					await api
						.getCart(
							cookies.get("jwt_token"),
							city.city.latitude,
							city.city.longitude,
							1
						)
						.then((resp) => resp.json())
						.then((res) => {
							setisLoader(false);
							if (res.status === 1)
								dispatch({
									type: ActionTypes.SET_CART_CHECKOUT,
									payload: res.data,
								});
						})
						.catch((error) => {});
				} else {
					toast.error(result.message);
				}
			});
	};

	//remove from Cart
	const removefromCart = async (product_id, product_variant_id) => {
		setisLoader(true);
		await api
			.removeFromCart(cookies.get("jwt_token"), product_id, product_variant_id)
			.then((response) => response.json())
			.then(async (result) => {
				if (result.status === 1) {
					//popup commented
					// toast.success(result.message);
					await api
						.getCart(
							cookies.get("jwt_token"),
							city.city.latitude,
							city.city.longitude
						)
						.then((resp) => resp.json())
						.then((res) => {
							if (res.status === 1)
								dispatch({ type: ActionTypes.SET_CART, payload: res });
							else dispatch({ type: ActionTypes.SET_CART, payload: null });
						});
					await api
						.getCart(
							cookies.get("jwt_token"),
							city.city.latitude,
							city.city.longitude,
							1
						)
						.then((resp) => resp.json())
						.then((res) => {
							setisLoader(false);
							if (res.status === 1)
								dispatch({
									type: ActionTypes.SET_CART_CHECKOUT,
									payload: res.data,
								});
						})
						.catch((error) => {});
				} else {
					toast.error(result.message);
				}
			});
	};

	//Add to favorite
	const addToFavorite = async (product_id) => {
		setisLoader(true);

		await api
			.addToFavotite(cookies.get("jwt_token"), product_id)
			.then((response) => response.json())
			.then(async (result) => {
				if (result.status === 1) {
					//popup commented
					// toast.success(result.message);
					await api
						.getFavorite(
							cookies.get("jwt_token"),
							city.city.latitude,
							city.city.longitude
						)
						.then((resp) => resp.json())
						.then((res) => {
							setisLoader(false);
							if (res.status === 1)
								dispatch({ type: ActionTypes.SET_FAVORITE, payload: res });
						});
				} else {
					setisLoader(false);
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
					//popup commented
					//toast.success(result.message);
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
					setisLoader(false);
					toast.error(result.message);
				}
			});
	};

	const handleAddToCart = () => {
		if (cookies.get("jwt_token") !== undefined) {
			document
				.getElementById(`Add-to-cart-quickview`)
				.classList.toggle("visually-hidden");
			document
				.getElementById(`input-cart-quickview`)
				.classList.toggle("visually-hidden");
			document.getElementById(`input-quickview`).innerHTML = 1;
			addtoCart(
				product.id,
				JSON.parse(
					document.getElementById(`select-product-variant-quickview`).value
				).id,
				document.getElementById(`input-quickview`).innerHTML
			);
		} else {
			const isAdded = addProductToCart(product, 1);
			if (isAdded) {
				document
					.getElementById(`Add-to-cart-quickview`)
					.classList.toggle("visually-hidden");
				document
					.getElementById(`input-cart-quickview`)
					.classList.toggle("visually-hidden");
				document.getElementById(`input-quickview`).innerHTML = 1;
				props.setProductTriggered(!props.productTriggered);
			}
		}
	};

	const handleIncrement = () => {
		var val = document.getElementById(`input-quickview`).innerHTML;
		if (cookies.get("jwt_token") !== undefined) {
			if (val < product.total_allowed_quantity) {
				document.getElementById(`input-quickview`).innerHTML =
					parseInt(val) + 1;
				addtoCart(
					product.id,
					JSON.parse(
						document.getElementById(`select-product-variant-quickview`).value
					).id,
					document.getElementById(`input-quickview`).innerHTML
				);
			}
		} else {
			const isIncremented = incrementProduct(product.id, product, 1, false);
			if (isIncremented) {
				document.getElementById(`input-quickview`).innerHTML =
					parseInt(val) + 1;
			}
			props.setProductTriggered(!props.productTriggered);
		}
	};

	const handleDecrement = () => {
		var val = parseInt(document.getElementById(`input-quickview`).innerHTML);
		if (cookies.get("jwt_token") !== undefined) {
			if (val === 1) {
				document.getElementById(`input-quickview`).innerHTML = 0;
				document
					.getElementById(`input-cart-quickview`)
					.classList.toggle("visually-hidden");
				document
					.getElementById(`Add-to-cart-quickview`)
					.classList.toggle("visually-hidden");
				removefromCart(
					product.id,
					JSON.parse(
						document.getElementById(`select-product-variant-quickview`).value
					).id
				);
			} else {
				document.getElementById(`input-quickview`).innerHTML = val - 1;
				addtoCart(
					product.id,
					JSON.parse(
						document.getElementById(`select-product-variant-quickview`).value
					).id,
					document.getElementById(`input-quickview`).innerHTML
				);
			}
		} else {
			const isDecremented = decrementProduct(product.id, product);
			if (isDecremented) {
				document.getElementById(`input-quickview`).innerHTML = val - 1;
			} else {
				document.getElementById(`input-quickview`).innerHTML = 0;
				document
					.getElementById(`input-cart-quickview`)
					.classList.toggle("visually-hidden");
				document
					.getElementById(`Add-to-cart-quickview`)
					.classList.toggle("visually-hidden");
			}
			props.setProductTriggered(!props.productTriggered);
		}
	};

	const closeQuickModal = () => {
		props.setIsOpenModal(false);
		props.setselectedProduct({});
		setproductcategory({});
		setproductbrand({});
		setproduct({});
	};

	return (
		<div>
			<CkModal show={props.isOpenModal} onHide={closeQuickModal}>
				<div className="product-details-view">
					{Object.keys(product).length === 0 ? (
						<Loader />
					) : (
						<div className="top-wrapper">
							<div className="row body-wrapper">
								<div className="col-xl-4 col-lg-6 col-md-12 col-12">
									<div className="image-wrapper">
										<div className="main-image col-12 border">
											<img
												data-src={mainimage}
												alt="main-product"
												className="col-12 lazyload"
												style={{ width: "85%" }}
											/>
										</div>

										<div className="sub-images-container row">
											{product.images.length >= 4 ? (
												<>
													<ResponsiveCarousel
													items={3}
            										itemsInTablet={3}
													itemsInMobile={3}
            										infinite={false}
            										autoPlay={true}
            										autoPlaySpeed={4000}
            										showArrows={false}
            										showDots={false}
          											>
														{product.images.map((image, index) => (
															<div key={index}>
																<div
																	className={`sub-image border ${
																		mainimage === image ? "active" : ""
																	}`}
																>
																	<img
																		data-src={image}
																		className="col-12 lazyload"
																		alt="product"
																		onClick={() => {
																			setmainimage(image);
																		}}
																	></img>
																</div>
															</div>
														))}
													</ResponsiveCarousel>
												</>
											) : (
												<>
													{product.images.map((image, index) => (
														<div
															key={index}
															className={`sub-image border ${
																mainimage === image ? "active" : ""
															}`}
														>
															<img
																data-src={image}
																className="col-12 lazyload "
																alt="product"
																onClick={() => {
																	setmainimage(image);
																}}
															></img>
														</div>
													))}
												</>
											)}
										</div>
									</div>
								</div>
								<div className="col-xl-8 col-lg-6 col-md-12 col-12">
									<div className="detail-wrapper">
										<div className="top-section">
											<p className="product_name">{product.name}</p>
											<div className="product-brand">
												{/* <span className='price green-text' id={`price-quickview`}>
                                                                {setting.setting.currency_code === "INR" ? <FaRupeeSign fill='var(--secondary-color)' fontSize={"18px"} /> : <BiDollar fill='var(--secondary-color)' fontSize={"18px"} />}
                                                                {parseFloat(product.variants[0].price)} 
                                                                </span> */}
												{Object.keys(productbrand).length === 0 ? null : (
													<div className="product-brand">
														<span className="brand-title">Brand:</span>
														<span className="brand-name">
															{productbrand.name}
														</span>
													</div>
												)}
											</div>
											<div className="d-flex flex-row gap-2 align-items-center my-1">
												<span className="price green-text">
													{setting.setting.currency_code === "INR" ? (
														<FaRupeeSign
															fill="var(--secondary-color)"
															fontSize={"18px"}
														/>
													) : (
														<BiDollar
															fill="var(--secondary-color)"
															fontSize={"18px"}
														/>
													)}{" "}
													<span className="green-text" id="price-productdetail">
														{parseFloat(product.variants[0].discounted_price)}
													</span>{" "}
												</span>
											</div>
										</div>
										<div className="bottom-section">
											<p>Product Variants</p>

											<div className="d-flex gap-3 bottom-section-content ">
												<select
													id={`select-product-variant-quickview`}
													onChange={(e) => {
														document.getElementById(
															`price-productdetail`
														).innerHTML = parseFloat(
															JSON.parse(e.target.value).price
														);
														if (
															document
																.getElementById(`input-cart-quickview`)
																.classList.contains("active")
														) {
															document
																.getElementById(`input-cart-quickview`)
																.classList.remove("active");
															document
																.getElementById(`Add-to-cart-quickview`)
																.classList.add("active");
														}
													}}
													defaultValue={JSON.stringify(product.variants[0])}
												>
													{getProductVariants(product)}
												</select>

												<button
													type="button"
													id={`Add-to-cart-quickview`}
													className="add-to-cart active"
													onClick={handleAddToCart}
												>
													Add to Cart
												</button>

												{isLoader ? (
													<Loader screen="full" background="none" />
												) : null}

												<div
													id={`input-cart-quickview`}
													className="input-to-cart visually-hidden"
												>
													<button
														type="button"
														onClick={() => {
															handleDecrement();
														}}
														className="wishlist-button"
													>
														<BiMinus fill="#fff" />
													</button>
													<span id={`input-quickview`}></span>
													<button
														type="button"
														onClick={() => {
															handleIncrement();
														}}
														className="wishlist-button"
													>
														<BsPlus fill="#fff" />{" "}
													</button>
												</div>

												{favorite.favorite &&
												favorite.favorite.data.some(
													(element) => element.id === product.id
												) ? (
													<button
														type="button"
														className="wishlist-product"
														onClick={() => {
															if (cookies.get("jwt_token") !== undefined) {
																removefromFavorite(product.id);
															} else {
																toast.error(
																	"OOps! You need to login first to add to favourites"
																);
															}
														}}
													>
														<BsHeartFill fill="green" />
													</button>
												) : (
													<button
														key={product.id}
														type="button"
														className="wishlist-product"
														onClick={() => {
															if (cookies.get("jwt_token") !== undefined) {
																removefromFavorite(product.id);
															} else {
																toast.error(
																	"OOps! You need to login first to add to favourites"
																);
															}
														}}
													>
														<BsHeart />
													</button>
												)}
											</div>
											<div className="product-overview">
												{productbrand !== "" ? (
													<div className="product-tags">
														<span className="tag-title">Brand :</span>
														<span className="tag-name">
															{productbrand.name}{" "}
														</span>
													</div>
												) : (
													""
												)}
												{product.tags !== "" ? (
													<div className="product-tags">
														<span className="tag-title">Product Tags:</span>
														<span className="tag-name">{product.tags} </span>
													</div>
												) : (
													""
												)}
											</div>
											<div className="share-product-container">
												<span>Share Product :</span>

												<ul className="share-product">
													<li className="share-product-icon">
														<WhatsappShareButton
															url={`${share_parent_url}/${product.id}`}
														>
															<WhatsappIcon size={32} round={true} />
														</WhatsappShareButton>
													</li>
													<li className="share-product-icon">
														<TelegramShareButton
															url={`${share_parent_url}/${product.id}`}
														>
															<TelegramIcon size={32} round={true} />
														</TelegramShareButton>
													</li>
													<li className="share-product-icon">
														<FacebookShareButton
															url={`${share_parent_url}/${product.id}`}
														>
															<FacebookIcon size={32} round={true} />
														</FacebookShareButton>
													</li>
													<li className="share-product-icon">
														<button
															type="button"
															onClick={() => {
																navigator.clipboard.writeText(
																	`${share_parent_url}/${product.id}`
																);
																//popup commented
																//	toast.success("Copied Succesfully!!");
															}}
														>
															{" "}
															<BiLink size={30} />
														</button>
													</li>
												</ul>
											</div>
										</div>

										{/* <div className='key-feature'>
                                                <p>Key Features</p>
                                            </div> */}
									</div>
								</div>
							</div>
						</div>
					)}
				</div>
			</CkModal>

			{isLogin && (
				<LoginUser isOpenModal={isLogin} setIsOpenModal={setIsLogin} />
			)}
		</div>
	);
};

export default QuickViewModal;
