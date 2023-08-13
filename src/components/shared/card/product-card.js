import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { AiOutlineEye } from "react-icons/ai";
import { BiMinus } from "react-icons/bi";
import { BsHeart, BsHeartFill, BsPlus } from "react-icons/bs";
import Cookies from "universal-cookie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faIndianRupeeSign } from "@fortawesome/free-solid-svg-icons";
import { ActionTypes } from "../../../model/action-type";
import {
	AddProductToCart,
	DecrementProduct,
	IncrementProduct,
} from "../../../services/cartService";
import api from "../../../api/api";
import Share from "../../product/share";
import QuickViewModal from "../../product/QuickViewModal";
import styles from "./product-card.module.scss";
import TrackingService from "../../../services/trackingService";

const share_url = "https://chhayakart.com";

const ProductCard = ({
	productTriggered,
	setProductTriggered = () => {},
	displayAddtoCart = true,
	product,
	className = "",
}) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const cookies = new Cookies();

	const city = useSelector((state) => state.city);
	const favorite = useSelector((state) => state.favorite);
	const cart = useSelector((state) => state.cart);

	const [selectedProductId, setSelectedProductId] = useState();
	const [showViewModal, setShowViewModal] = useState(false);
	const [isCart, setIsCart] = useState(false);
	const [productInCartCount, setProductInCartCount] = useState(0);
	const [selectedProduct, setSelectedProduct] = useState({});
	const user = useSelector((state) => state.user);

	const addtoCart = async (product, product_variant_id, qty) => {
		const trackingService = new TrackingService();
		trackingService.trackCart(
			product,
			1,
			user.status === "loading" ? "" : user.user.email
		);
		await api
			.addToCart(cookies.get("jwt_token"), product.id, product_variant_id, qty)
			.then((response) => response.json())
			.then(async (result) => {
				if (result.status === 1) {
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

	const removefromCart = async (product_id, product_variant_id) => {
		await api
			.removeFromCart(cookies.get("jwt_token"), product_id, product_variant_id)
			.then((response) => response.json())
			.then(async (result) => {
				if (result.status === 1) {
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

	const handleDecrement = (product, index, index0) => {
		var val = productInCartCount;
		const trackingService = new TrackingService();
		trackingService.trackCart(
			product,
			parseInt(val) - 1,
			user.status === "loading" ? "" : user.user.email
		);
		if (cookies.get("jwt_token") !== undefined) {
			if (val === 1) {
				setProductInCartCount(0);
				setIsCart(false);
				removefromCart(product.id, product.variants[0].id);
			} else {
				setProductInCartCount(val - 1);
				addtoCart(product.id, product.variants[0].id, val - 1);
			}
		} else {
			const isDecremented = DecrementProduct(product.id, product);
			if (isDecremented) {
				setProductInCartCount(val - 1);
			} else {
				setIsCart(false);
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
		if (cookies.get("jwt_token") !== undefined) {
			if (val < product.total_allowed_quantity) {
				setProductInCartCount(val + 1);
				addtoCart(product.id, product.variants[0].id, val + 1);
			}
		} else {
			const isIncremented = IncrementProduct(product.id, product, 1, false);
			if (isIncremented) {
				setProductInCartCount(val + 1);
			}
			setProductTriggered(!productTriggered);
		}
	};

	const handleAddToCart = (product) => {
		const trackingService = new TrackingService();
		trackingService.trackCart(
			product,
			1,
			user.status === "loading" ? "" : user.user.email
		);

		if (cookies.get("jwt_token") !== undefined) {
			setIsCart(true);
			setProductInCartCount(1);
			addtoCart(product.id, product.variants[0].id, 1);
		} else {
			const isAdded = AddProductToCart(product, 1);
			if (isAdded) {
				setIsCart(true);
				setProductInCartCount(1);
				setProductTriggered(!productTriggered);
			}
		}
	};

	const addToFavorite = async (product) => {
		if (cookies.get("jwt_token") !== undefined) {
			await api
				.addToFavotite(cookies.get("jwt_token"), product.id)
				.then((response) => response.json())
				.then(async (result) => {
					if (result.status === 1) {
						// toast.success(result.message);
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
		} else {
			toast.error("OOps! You need to login First");
		}
	};

	const removeFromFavorite = async (product) => {
		if (cookies.get("jwt_token") !== undefined) {
			await api
				.removeFromFavorite(cookies.get("jwt_token"), product.id)
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
								else
									dispatch({ type: ActionTypes.SET_FAVORITE, payload: null });
							});
					} else {
						toast.error(result.message);
					}
				});
		} else {
			toast.error("OOps! You need to login first to add to favourites");
		}
	};

	useEffect(() => {
		if (cookies.get("jwt_token") !== undefined) {
			if (cart.cart) {
				const productsInCart = cart.cart.data.cart;
				if (productsInCart != null) {
					for (let i = 0; i < productsInCart.length; i++) {
						if (
							parseInt(productsInCart[i].product_id) === parseInt(product.id)
						) {
							setIsCart(true);
							setProductInCartCount(parseInt(productsInCart[i].qty));
						}
					}
				}
			}
		} else {
			const products = JSON.parse(localStorage.getItem("cart"));
			if (products != null) {
				for (let i = 0; i < products.length; i++) {
					if (products[i].product_id === product.id) {
						setIsCart(true);
						setProductInCartCount(products[i].qty);
					}
				}
			}
		}
	}, [product, cart]);

	return (
		<>
			<div className={`${styles.cardWrapper} ${className}`}>
				<div className={styles.imageContainer}>
					<span className={styles.eyeIcon}>
						<AiOutlineEye
							onClick={() => {
								setShowViewModal(true);
								setSelectedProduct(product);
							}}
						/>
					</span>
					<div className={styles.imageWrapper}>
						<img
							data-src={product.image_url}
							alt={product.slug}
							className={`${styles.image} lazyload`}
							onClick={() => {
								dispatch({
									type: ActionTypes.SET_SELECTED_PRODUCT,
									payload: product.id,
								});
								setSelectedProductId(product.id);
								navigate("/product/" + product.id + "/" + product.slug);
								window.location.reload();
							}}
						/>
					</div>
				</div>
				<div className={styles.productBody}>
					<h3 className={styles.productName}>{product.name}</h3>
					<div className={styles.priceWrapper}>
						<p className={styles.discountPrice}>
							<FontAwesomeIcon
								icon={faIndianRupeeSign}
								className={styles.rupeeIcon}
							/>
							{product.variants[0].discounted_price}
						</p>
						<p className={`${styles.discountPrice} ${styles.actualPrice}`}>
							<FontAwesomeIcon
								icon={faIndianRupeeSign}
								className={styles.rupeeIcon}
							/>
							{parseFloat(product.variants[0].price)}
						</p>
						<p
							className={`${styles.discountPrice} ${styles.actualPrice} ${styles.precentage}`}
						>
							(
							{Math.ceil(
								((parseFloat(product.variants[0].price) -
									parseFloat(product.variants[0].discounted_price)) /
									parseFloat(product.variants[0].price)) *
									100
							)}
							% off)
						</p>
					</div>
					<p className={styles.stockUnit}>
						{product.variants[0].stock_unit_name}
					</p>
				</div>
				{displayAddtoCart && (
					<>
						<div className={styles.cardFooter}>
							<div>
								{favorite.favorite &&
								favorite.favorite.data.some(
									(element) => element.id === product.id
								) ? (
									<button
										type="button"
										className={styles.wishlistIcon}
										onClick={() => {
											removeFromFavorite(product);
										}}
									>
										<BsHeartFill fill="green" />
									</button>
								) : (
									<button
										key={product.id}
										type="button"
										className={styles.wishlistIcon}
										onClick={() => {
											addToFavorite(product);
										}}
									>
										<BsHeart />
									</button>
								)}
							</div>

							<div style={{ flexGrow: "1" }}>
								{!isCart ? (
									<button
										type="button"
										className={styles.addToCartBtn}
										onClick={() => {
											handleAddToCart(product);
										}}
									>
										add to cart
									</button>
								) : (
									<div className={styles.cartQtyWrapper}>
										<button
											type="button"
											onClick={() => {
												handleDecrement(product);
											}}
										>
											<BiMinus />
										</button>
										<span className="cartCount">{productInCartCount}</span>
										<button
											type="button"
											onClick={() => {
												handleIncrement(product);
											}}
										>
											<BsPlus />{" "}
										</button>
									</div>
								)}
							</div>

							<div className={styles.shareWrapper}>
								<Share slug={product.id} share_url={share_url} />
							</div>
						</div>
					</>
				)}
			</div>
			{showViewModal && (
				<QuickViewModal
					isOpenModal={showViewModal}
					setIsOpenModal={setShowViewModal}
					selectedProduct={selectedProduct}
					setselectedProduct={setSelectedProduct}
					productTriggered={productTriggered}
					setProductTriggered={setProductTriggered}
				/>
			)}
		</>
	);
};

export default ProductCard;
