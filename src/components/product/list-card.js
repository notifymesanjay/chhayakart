import React from "react";
import { AiOutlineEye } from "react-icons/ai";
import { BiLink, BiMinus } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import {
	FacebookIcon,
	FacebookShareButton,
	TelegramIcon,
	TelegramShareButton,
	WhatsappIcon,
	WhatsappShareButton,
} from "react-share";
import { toast } from "react-toastify";
import { ActionTypes } from "../../model/action-type";
import { useNavigate } from "react-router-dom";
import { BsHeart, BsHeartFill, BsPlus, BsShare } from "react-icons/bs";
import Cookies from "universal-cookie";
import { FaRupeeSign } from "react-icons/fa";
import CryptoJS from "crypto-js";
import api from "../../api/api";
import {
	addProductToCart,
	decrementProduct,
	incrementProduct,
} from "../../services/cartService";
import "./product.css";

const share_parent_url = "https://chhayakart.com/product";
const secret_key = "Xyredg$5g";

const ListCard = ({
	index,
	product,
	setSelectedProductId = () => {},
	productTriggered,
	setProductTriggered = () => {},
	setisLoader = () => {},
	setselectedProduct = () => {},
	setShowViewModal = () => {},
}) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const cookies = new Cookies();
	const filter = useSelector((state) => state.productFilter);
	const favorite = useSelector((state) => state.favorite);
	const city = useSelector((state) => state.city);

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

	const handleFavoriteAddToCart = (product, index) => {
		if (cookies.get("jwt_token") !== undefined) {
			document
				.getElementById(`Add-to-cart-section${index}`)
				.classList.remove("active");
			document
				.getElementById(`input-cart-section${index}`)
				.classList.add("active");
			document.getElementById(`input-section${index}`).innerHTML = 1;
			addtoCart(
				product.id,
				product.variants.length > 1
					? JSON.parse(
							document.getElementById(`select-product${index}-variant-section`)
								.value
					  ).id
					: JSON.parse(
							document.getElementById(`default-product${index}-variant-id
			`).value
					  ),
				document.getElementById(`input-section${index}`).innerHTML
			);
		} else {
			const isAdded = addProductToCart(product, 1);
			if (isAdded) {
				document
					.getElementById(`Add-to-cart-section${index}`)
					.classList.remove("active");
				document
					.getElementById(`input-cart-section${index}`)
					.classList.add("active");
				document.getElementById(`input-section${index}`).innerHTML = 1;
				setProductTriggered(!productTriggered);
			}
		}
	};

	const handleFavoriteDecrement = (product, index) => {
		var val = parseInt(
			document.getElementById(`input-productlist${index}`).innerHTML
		);
		if (cookies.get("jwt_token") !== undefined) {
			if (val === 1) {
				document.getElementById(`input-productlist${index}`).innerHTML = 0;
				document
					.getElementById(`input-cart-productlist${index}`)
					.classList.remove("active");
				document
					.getElementById(`Add-to-cart-productlist${index}`)
					.classList.add("active");
				removefromCart(
					product.id,
					JSON.parse(
						document.getElementById(`selectedVariant${index}-productlist`).value
					).id
				);
			} else {
				document.getElementById(`input-productlist${index}`).innerHTML =
					val - 1;
				addtoCart(
					product.id,
					JSON.parse(
						document.getElementById(`selectedVariant${index}-productlist`).value
					).id,
					document.getElementById(`input-productlist${index}`).innerHTML
				);
			}
		} else {
			const isDecremented = decrementProduct(product.id, product);
			if (isDecremented) {
				document.getElementById(`input-productlist${index}`).innerHTML =
					val - 1;
			} else {
				document.getElementById(`input-productlist${index}`).innerHTML = 0;
				document
					.getElementById(`input-cart-productlist${index}`)
					.classList.remove("active");
				document
					.getElementById(`Add-to-cart-productlist${index}`)
					.classList.add("active");
			}
			setProductTriggered(!productTriggered);
		}
	};

	const handleFavoriteIncrement = (product, index) => {
		var val = document.getElementById(`input-productlist${index}`).innerHTML;
		if (cookies.get("jwt_token") !== undefined) {
			if (val < product.total_allowed_quantity) {
				document.getElementById(`input-productlist${index}`).innerHTML =
					parseInt(val) + 1;
				addtoCart(
					product.id,
					JSON.parse(
						document.getElementById(`selectedVariant${index}-productlist`).value
					).id,
					document.getElementById(`input-productlist${index}`).innerHTML
				);
			}
		} else {
			const isIncremented = incrementProduct(product.id, product, 1, false);
			if (isIncremented) {
				document.getElementById(`input-productlist${index}`).innerHTML =
					parseInt(val) + 1;
			}
			setProductTriggered(!productTriggered);
		}
	};

	const getProductVariants = (product) => {
		return product.variants.map((variant, ind) => (
			<option
				key={ind}
				value={CryptoJS.AES.encrypt(
					JSON.stringify(variant),
					secret_key
				).toString()}
			>
				{variant.stock_unit_name} Rs.{variant.price}
			</option>
		));
	};

	const addtoCart = async (product_id, product_variant_id, qty) => {
		setisLoader(true);
		await api
			.addToCart(cookies.get("jwt_token"), product_id, product_variant_id, qty)
			.then((response) => response.json())
			.then(async (result) => {
				if (result.status === 1) {
					toast.success(result.message);
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
					setisLoader(false);
					toast.error(result.message);
				}
			});
	};

	const removefromCart = async (product_id, product_variant_id) => {
		setisLoader(true);
		await api
			.removeFromCart(cookies.get("jwt_token"), product_id, product_variant_id)
			.then((response) => response.json())
			.then(async (result) => {
				if (result.status === 1) {
					toast.success(result.message);
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
					setisLoader(false);
					toast.error(result.message);
				}
			});
	};

	const addToFavorite = async (product_id) => {
		setisLoader(true);
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
							setisLoader(false);
							if (res.status === 1)
								dispatch({ type: ActionTypes.SET_FAVORITE, payload: res });
						})
						.catch((error) => {
							setisLoader(false);
						});
				} else if (result.status === 0) {
					setisLoader(false);
				} else {
					setisLoader(false);
					toast.error(result.message);
				}
			});
	};

	const handleAddToCart = (product, index) => {
		if (cookies.get("jwt_token") !== undefined) {
			document
				.getElementById(`Add-to-cart-section${index}`)
				.classList.remove("active");
			document
				.getElementById(`input-cart-section${index}`)
				.classList.add("active");
			document.getElementById(`input-section${index}`).innerHTML = 1;
			addtoCart(
				product.id,
				product.variants.length > 1
					? JSON.parse(
							CryptoJS.AES.decrypt(
								document.getElementById(
									`select-product${index}-variant-section`
								).value,
								secret_key
							).toString(CryptoJS.enc.Utf8)
					  ).id
					: document.getElementById(`default-product${index}-variant-id`).value,
				document.getElementById(`input-section${index}`).innerHTML
			);
		} else {
			const isAdded = addProductToCart(product, 1);
			if (isAdded) {
				document
					.getElementById(`Add-to-cart-section${index}`)
					.classList.remove("active");
				document
					.getElementById(`input-cart-section${index}`)
					.classList.add("active");
				document.getElementById(`input-section${index}`).innerHTML = 1;
				setProductTriggered(!productTriggered);
			}
		}
	};

	const handleDecrement = (product, index) => {
		var val = parseInt(
			document.getElementById(`input-section${index}`).innerHTML
		);
		if (cookies.get("jwt_token") !== undefined) {
			if (val === 1) {
				document.getElementById(`input-section${index}`).innerHTML = 0;
				document
					.getElementById(`input-cart-section${index}`)
					.classList.remove("active");
				document
					.getElementById(`Add-to-cart-section${index}`)
					.classList.add("active");
				removefromCart(
					product.id,
					product.variants.length > 1
						? JSON.parse(
								CryptoJS.AES.decrypt(
									document.getElementById(
										`select-product${index}-variant-section`
									).value,
									secret_key
								).toString(CryptoJS.enc.Utf8)
						  ).id
						: document.getElementById(`default-product${index}-variant-id`)
								.value
				);
			} else {
				document.getElementById(`input-section${index}`).innerHTML = val - 1;
				addtoCart(
					product.id,
					product.variants.length > 1
						? JSON.parse(
								CryptoJS.AES.decrypt(
									document.getElementById(
										`select-product${index}-variant-section`
									).value,
									secret_key
								).toString(CryptoJS.enc.Utf8)
						  ).id
						: document.getElementById(`default-product${index}-variant-id`)
								.value,
					document.getElementById(`input-section${index}`).innerHTML
				);
			}
		} else {
			const isDecremented = decrementProduct(product.id, product);
			if (isDecremented) {
				document.getElementById(`input-section${index}`).innerHTML = val - 1;
			} else {
				document.getElementById(`input-section${index}`).innerHTML = 0;
				document
					.getElementById(`input-cart-section${index}`)
					.classList.remove("active");
				document
					.getElementById(`Add-to-cart-section${index}`)
					.classList.add("active");
			}
			setProductTriggered(!productTriggered);
		}
	};

	const handleIncrement = (product, index) => {
		var val = document.getElementById(`input-section${index}`).innerHTML;
		if (cookies.get("jwt_token") !== undefined) {
			if (val < product.total_allowed_quantity) {
				document.getElementById(`input-section${index}`).innerHTML =
					parseInt(val) + 1;
				addtoCart(
					product.id,
					product.variants.length > 1
						? JSON.parse(
								CryptoJS.AES.decrypt(
									document.getElementById(
										`select-product${index}-variant-section`
									).value,
									secret_key
								).toString(CryptoJS.enc.Utf8)
						  ).id
						: document.getElementById(`default-product${index}-variant-id`)
								.value,
					document.getElementById(`input-section${index}`).innerHTML
				);
			}
		} else {
			const isIncremented = incrementProduct(product.id, product, 1, false);
			if (isIncremented) {
				document.getElementById(`input-section${index}`).innerHTML =
					parseInt(val) + 1;
			}
			setProductTriggered(!productTriggered);
		}
	};

	return (
		<div
			key={index}
			className={`${
				!filter.grid_view ? "col-12 list-view " : "col-md-4 col-lg-3 "
			}`}
		>
			<div
				className={`product-card my-3 ${
					filter.grid_view ? "flex-column " : "my-3"
				}`}
			>
				<div
					className={`image-container  ${
						!filter.grid_view ? "border-end col-3 " : "col-12"
					}`}
				>
					<span
						className="border border-light rounded-circle p-2 px-3"
						id="aiEye"
					>
						<AiOutlineEye
							onClick={() => {
								setselectedProduct(product);
								setShowViewModal(true);
							}}
						/>
					</span>
					<div className="imageWrapper">
						<img
							data-src={product.image_url}
							alt={product.slug}
							className="card-img-top lazyload"
							onClick={() => {
								dispatch({
									type: ActionTypes.SET_SELECTED_PRODUCT,
									payload: product.id,
								});
								setSelectedProductId(product.id);
								navigate("/product/" + product.id + "/" + product.slug);
							}}
						/>
					</div>
					{filter.grid_view ? (
						""
					) : (
						<>
							<div className="d-flex flex-row border-top product-card-footer">
								<div className="border-end ">
									{favorite.favorite &&
									favorite.favorite.data.some(
										(element) => element.id === product.id
									) ? (
										<button
											type="button"
											className="w-100 h-100"
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
											className="w-100 h-100"
											onClick={() => {
												if (cookies.get("jwt_token") !== undefined) {
													addToFavorite(product.id);
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

								<div className="border-end" style={{ flexGrow: "1" }}>
									<button
										type="button"
										id={`Add-to-cart-section${index}`}
										className="w-100 h-100 add-to-cart active"
										onClick={() => {
											handleFavoriteAddToCart(product, index);
										}}
									>
										add to cart1
									</button>

									<div
										id={`input-cart-productlist${index}`}
										className="w-100 h-100 input-to-cart"
									>
										<button
											type="button"
											onClick={() => {
												handleFavoriteDecrement(product, index);
											}}
										>
											<BiMinus />
										</button>
										<span id={`input-productlist${index}`}></span>
										<button
											type="button"
											onClick={() => {
												handleFavoriteIncrement(product, index);
											}}
										>
											<BsPlus />{" "}
										</button>
									</div>
								</div>

								<div className="dropup share">
									<button
										type="button"
										className="w-100 h-100"
										data-bs-toggle="dropdown"
										aria-expanded="false"
									>
										<BsShare />
									</button>

									<ul className="dropdown-menu">
										<li>
											<WhatsappShareButton
												url={`https://chhayakart.com/product/${product.id}`}
											>
												<WhatsappIcon size={32} round={true} />{" "}
												<span>WhatsApp</span>
											</WhatsappShareButton>
										</li>
										<li>
											<TelegramShareButton
												url={`https://chhayakart.com/product/${product.id}`}
											>
												<TelegramIcon size={32} round={true} />{" "}
												<span>Telegram</span>
											</TelegramShareButton>
										</li>
										<li>
											<FacebookShareButton
												url={`https://chhayakart.com/product/${product.id}`}
											>
												<FacebookIcon size={32} round={true} />{" "}
												<span>Facebook</span>
											</FacebookShareButton>
										</li>
										<li>
											<button
												type="button"
												onClick={() => {
													navigator.clipboard.writeText(
														`https://chhayakart.com/product/${product.id}`
													);
													toast.success("Copied Succesfully!!");
												}}
												className="react-share__ShareButton"
											>
												{" "}
												<BiLink /> <span>Copy Link</span>
											</button>
										</li>
									</ul>
								</div>
							</div>
						</>
					)}
				</div>

				<div className="card-body product-card-body p-3">
					{/* {filter.grid_view?
                                                                        <></>:
                                                                         <>
                                                                         <div className="product_name"></div>
                                                                         </>} */}
					<h3
						onClick={() => {
							dispatch({
								type: ActionTypes.SET_SELECTED_PRODUCT,
								payload: product.id,
							});
							setSelectedProductId(product.id);
							navigate("/product/" + product.id + "/" + product.slug);
						}}
					>
						{product.name}
					</h3>
					<div className="price">
						{filter.grid_view ? (
							<>
								<span
									id={`price${index}-section`}
									className="d-flex align-items-center"
								>
									<p id="fa-rupee">
										<FaRupeeSign fill="var(--secondary-color)" />
									</p>{" "}
									{product.variants[0].discounted_price} (
									{Math.round(
										parseFloat(
											((product.variants[0].price -
												product.variants[0].discounted_price) *
												100) /
												product.variants[0].price
										)
									)}
									% off)
								</span>
								<span
									id={`price${index}-section`}
									className="d-flex align items-center"
									style={{
										textDecoration: "line-through",
									}}
								>
									<p id="fa-rupee" className="m-0">
										<FaRupeeSign fill="var(--secondary-color)" />
									</p>{" "}
									{parseFloat(product.variants[0].price)}
								</span>

								<div className="product_varients_drop">
									{product.variants.length > 1 ? (
										<>
											<select
												style={{
													fontSize: "8px !important",
												}}
												className="form-select variant_selection select-arrow"
												id={`select-product${index}-variant-section`}
												onChange={(e) => {
													document.getElementById(
														`price${index}-section`
													).innerHTML =
														document.getElementById("fa-rupee").outerHTML +
														JSON.parse(
															CryptoJS.AES.decrypt(
																e.target.value,
																secret_key
															).toString(CryptoJS.enc.Utf8)
														).price;
													parseFloat(JSON.parse(e.target.value).price);

													if (
														document
															.getElementById(`input-cart-section${index}`)
															.classList.contains("active")
													) {
														document
															.getElementById(`input-cart-section${index}`)
															.classList.remove("active");
														document
															.getElementById(`Add-to-cart-section${index}`)
															.classList.add("active");
													}
												}}
												defaultValue={JSON.stringify(product.variants[0])}
											>
												{getProductVariants(product)}
											</select>
										</>
									) : (
										<>
											<input
												type="hidden"
												name={`default-product${index}-variant-id`}
												id={`default-product${index}-variant-id`}
												value={product.variants[0].id}
											/>
											<p
												id={`default-product${index}-variant`}
												value={product.variants[0].id}
												className="variant_value select-arrow"
											>
												{product.variants[0].stock_unit_name}
											</p>
										</>
									)}
								</div>
							</>
						) : (
							<>
								<div className="product_varients_drop d-flex align-items-center">
									{product.variants.length > 1 ? (
										<>
											<select
												style={{
													fontSize: "8px !important",
												}}
												className="form-select variant_selection select-arrow"
												id={`select-product${index}-variant-section`}
												onChange={(e) => {
													document.getElementById(
														`price${index}-section`
													).innerHTML =
														document.getElementById("fa-rupee").outerHTML +
														JSON.parse(
															CryptoJS.AES.decrypt(
																e.target.value,
																secret_key
															).toString(CryptoJS.enc.Utf8)
														).price;

													if (
														document
															.getElementById(`input-cart-section${index}`)
															.classList.contains("active")
													) {
														document
															.getElementById(`input-cart-section${index}`)
															.classList.remove("active");
														document
															.getElementById(`Add-to-cart-section${index}`)
															.classList.add("active");
													}
												}}
												defaultValue={JSON.stringify(product.variants[0])}
											>
												{getProductVariants(product)}
											</select>
										</>
									) : (
										<>
											<p
												id={`default-product${index}-variant`}
												value={product.variants[0].id}
												className="variant_value variant_value_a select-arrow"
											>
												{product.variants[0].stock_unit_name}
											</p>
										</>
									)}
									<span
										id={`price${index}-section`}
										className="d-flex align-items-center"
									>
										<p id="fa-rupee">
											<FaRupeeSign fill="var(--secondary-color)" />
										</p>{" "}
										{product.variants[0].discounted_price}{" "}
									</span>

									<span
										id={`price${index}-section`}
										className="d-flex align items-center"
										style={{
											textDecoration: "line-through",
										}}
									>
										<p id="fa-rupee" className="m-0">
											<FaRupeeSign fill="var(--secondary-color)" />
										</p>{" "}
										{parseFloat(product.variants[0].price)}
									</span>
								</div>
								<p className="product_list_description"></p>
							</>
						)}
					</div>
				</div>
				{filter.grid_view ? (
					<>
						<div className="d-flex flex-row border-top product-card-footer">
							<div className="border-end ">
								{favorite.favorite &&
								favorite.favorite.data.some(
									(element) => element.id === product.id
								) ? (
									<button
										type="button"
										className="w-100 h-100"
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
										className="w-100 h-100"
										onClick={() => {
											if (cookies.get("jwt_token") !== undefined) {
												addToFavorite(product.id);
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

							<div className="border-end" style={{ flexGrow: "1" }}>
								<button
									type="button"
									id={`Add-to-cart-section${index}`}
									className="w-100 h-100 add-to-cart active"
									onClick={() => {
										handleAddToCart(product, index);
									}}
								>
									add to cart
								</button>

								<div
									id={`input-cart-section${index}`}
									className="w-100 h-100 input-to-cart"
								>
									<button
										type="button"
										onClick={() => {
											handleDecrement(product, index);
										}}
									>
										<BiMinus />
									</button>
									<span id={`input-section${index}`}></span>
									<button
										type="button"
										onClick={() => {
											handleIncrement(product, index);
										}}
									>
										<BsPlus />{" "}
									</button>
								</div>
							</div>

							<div className="dropup share">
								<button
									type="button"
									className="w-100 h-100"
									data-bs-toggle="dropdown"
									aria-expanded="false"
								>
									<BsShare />
								</button>

								<ul className="dropdown-menu">
									<li className="dropDownLi">
										<WhatsappShareButton
											url={`${share_parent_url}/${product.id}`}
										>
											<WhatsappIcon size={32} round={true} />{" "}
											<span>WhatsApp</span>
										</WhatsappShareButton>
									</li>
									<li className="dropDownLi">
										<TelegramShareButton
											url={`${share_parent_url}/${product.id}`}
										>
											<TelegramIcon size={32} round={true} />{" "}
											<span>Telegram</span>
										</TelegramShareButton>
									</li>
									<li className="dropDownLi">
										<FacebookShareButton
											url={`${share_parent_url}/${product.id}`}
										>
											<FacebookIcon size={32} round={true} />{" "}
											<span>Facebook</span>
										</FacebookShareButton>
									</li>
									<li>
										<button
											type="button"
											onClick={() => {
												navigator.clipboard.writeText(
													`${share_parent_url}/${product.id}`
												);
												toast.success("Copied Succesfully!!");
											}}
											className="react-share__ShareButton"
										>
											{" "}
											<BiLink /> Copy Link
										</button>
									</li>
								</ul>
							</div>
						</div>
					</>
				) : (
					<></>
				)}
			</div>
		</div>
	);
};

export default ListCard;
