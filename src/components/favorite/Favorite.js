import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../cart/cart.css";
import "./favorite.css";
import { AiOutlineCloseCircle } from "react-icons/ai";
import EmptyCart from "../../utils/zero-state-screens/Empty_Cart.svg";
import { useNavigate, Link } from "react-router-dom";
import { FaRupeeSign } from "react-icons/fa";
import { BsPlus } from "react-icons/bs";
import { BiMinus } from "react-icons/bi";
import api from "../../api/api";
import { toast } from "react-toastify";
import Cookies from "universal-cookie";
import { ActionTypes } from "../../model/action-type";
import Loader from "../loader/Loader";
import LoginUser from "../login/login-user";
import TrackingService from "../../services/trackingService";

const Favorite = () => {
	const closeCanvas = useRef();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const cookies = new Cookies();

	const favorite = useSelector((state) => state.favorite);
	const city = useSelector((state) => state.city);
	const cart = useSelector((state) => state.cart);
	const [isfavoriteEmpty, setisfavoriteEmpty] = useState(false);
	const [isLoader, setisLoader] = useState(false);
	const [isLogin, setIsLogin] = useState(false);
	const user = useSelector((state) => state.user);

	useEffect(() => {
		if (favorite.favorite === null && favorite.status === "fulfill") {
			setisfavoriteEmpty(true);
		} else {
			setisfavoriteEmpty(false);
		}
	}, [favorite]);

	//Add to Cart
	const addtoCart = async (product, product_variant_id, qty) => {
		const trackingService = new TrackingService();
		trackingService.trackCart(
			product,
			qty,
			user.status === "loading" ? "" : user.user.email
		);
		setisLoader(true);
		await api
			.addToCart(cookies.get("jwt_token"), product.id, product_variant_id, qty)
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
							setisLoader(false);

							if (res.status === 1)
								dispatch({ type: ActionTypes.SET_CART, payload: res });
						});
				} else {
					setisLoader(false);
					toast.error(result.message);
				}
			});
	};

	//remove from Cart
	// const removefromCart = async (product_id, product_variant_id) => {
	// 	setisLoader(true);
	// 	await api
	// 		.removeFromCart(cookies.get("jwt_token"), product_id, product_variant_id)
	// 		.then((response) => response.json())
	// 		.then(async (result) => {
	// 			if (result.status === 1) {
	// 				toast.success(result.message);
	// 				await api
	// 					.getCart(
	// 						cookies.get("jwt_token"),
	// 						city.city.latitude,
	// 						city.city.longitude
	// 					)
	// 					.then((resp) => resp.json())
	// 					.then((res) => {
	// 						setisLoader(false);
	// 						if (res.status === 1)
	// 							dispatch({ type: ActionTypes.SET_CART, payload: res });
	// 						else dispatch({ type: ActionTypes.SET_CART, payload: null });
	// 					})
	// 					.catch((error) => {});
	// 			} else {
	// 				setisLoader(false);
	// 				toast.error(result.message);
	// 			}
	// 		})
	// 		.catch((error) => {});
	// };

	//remove from favorite
	const removefromFavorite = async (product_id) => {
		setisLoader(true);
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
							setisLoader(false);
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

	const handleAddToCart = (product) => {
		if (cookies.get("jwt_token") !== undefined) {
			addtoCart(product, product.variants[0].id, 1);
		} else {
			setIsLogin(true);
		}
	};
	return (
		<div
			tabIndex="-1"
			className={`cart-sidebar-container offcanvas offcanvas-end`}
			id="favoriteoffcanvasExample"
			aria-labelledby="favoriteoffcanvasExampleLabel"
		>
			<div className="cart-sidebar-header">
				<h5>saved</h5>
				<button
					type="button"
					className="close-canvas"
					data-bs-dismiss="offcanvas"
					aria-label="Close"
					ref={closeCanvas}
				>
					<AiOutlineCloseCircle />
				</button>
			</div>

			{isfavoriteEmpty ? (
				<div className="empty-cart">
					<img data-src={EmptyCart} className="lazyload" alt="empty-cart"></img>
					<p>Your Cart is empty</p>
					<span>You have no items in your shopping cart.</span>
					<span>Let's go buy something!</span>
					<button
						type="button"
						className="close-canvas"
						data-bs-dismiss="offcanvas"
						aria-label="Close"
						onClick={() => {
							navigate("/products");
						}}
					>
						start shopping
					</button>
				</div>
			) : (
				<>
					{favorite.favorite === null ? (
						<Loader width="100%" height="100%" />
					) : (
						<>
							{isLoader ? <Loader screen="full" background="none" /> : null}
							<div className="cart-sidebar-product">
								<div className="products-header">
									<span>Product</span>
									<span>Price</span>
								</div>

								<div className="products-container">
									{favorite.favorite.data.map((product, index) => (
										<div key={index} className="cart-card">
											<div className="left-wrapper">
												<div className="image-container">
													<img
														data-src={product.image_url}
														alt="product"
														className="lazyload"
													></img>
												</div>

												<div className="product-details">
													<span>{product.name}</span>
													<span>
														{product.variants[0] &&
															cart.cart &&
															+` ` + product.variants[0].stock_unit_name}
													</span>
													{/* <button type='button' id={`Add-to-cart-favoritesidebar${index}`} className='add-to-cart active'
                                                                onClick={() => {
                                                                    if (cookies.get('jwt_token') !== undefined) {      
                                                                        document.getElementById(`Add-to-cart-favoritesidebar${index}`).classList.add('disabled')                                                                  
                                                                        document.getElementById(`Add-to-cart-favoritesidebar${index}`).innerHTML= 'Item already in cart'                                                                  
                                                                        addtoCart(product.id, product.variants[0].id, 1)
                                                                    }
                                                                    else {
                                                                        toast.error("OOps! You need to login first to access the cart!")
                                                                    }

                                                                }}
                                                            >add to cart</button> */}

													{cart.cart !== null ? (
														cart.cart.data.cart.some(
															(element) => element.product_id === product.id
														) ? (
															<button
																type="button"
																disabled
																className="add-to-cart btn-seconday btn active"
															>
																Item in Cart
															</button>
														) : (
															<button
																type="button"
																id={`Add-to-cart-favoritesidebar${index}`}
																className="add-to-cart active"
																onClick={() => {
																	handleAddToCart(product);
																}}
															>
																add to cart
															</button>
														)
													) : (
														<>
															<button
																type="button"
																id={`Add-to-cart-favoritesidebar${index}`}
																className="add-to-cart active"
																onClick={() => {
																	handleAddToCart(product);
																}}
															>
																Add to cart
															</button>
														</>
													)}
												</div>
											</div>

											<div className="cart-card-end">
												<div
													className="d-flex align-items-center"
													style={{ fontSize: "1.855rem" }}
												>
													<FaRupeeSign fill="var(--secondary-color)" />{" "}
													<span id={`price${index}-cart-sidebar`}>
														{" "}
														{parseFloat(
															product.variants.length > 0
																? product.variants[0].discounted_price
																: 0
														)}
													</span>
												</div>

												<button
													type="button"
													className="remove-product"
													onClick={() => removefromFavorite(product.id)}
												>
													delete
												</button>
											</div>
										</div>
									))}
								</div>
							</div>

							<div className="cart-sidebar-footer">
								<div className="button-container">
									<button
										type="button"
										className="view-cart"
										onClick={() => {
											closeCanvas.current.click();
											navigate("/wishlist");
										}}
									>
										view saved
									</button>
								</div>
							</div>
						</>
					)}
				</>
			)}
			{isLogin && (
				<LoginUser isOpenModal={isLogin} setIsOpenModal={setIsLogin} />
			)}
		</div>
	);
};

export default Favorite;
