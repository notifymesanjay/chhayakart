import React, { useState, useEffect } from "react";
import "./header.css";
import { IoCartOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import api from "../../api/api";
import { ActionTypes } from "../../model/action-type";
import Cookies from "universal-cookie";
import Cart from "../cart/Cart";

const TemHeader = ({ productTriggered, setProductTriggered = () => {} }) => {
	const dispatch = useDispatch();

	const city = useSelector((state) => state.city);

	const cart = useSelector((state) => state.cart);

	const [isSticky, setIsSticky] = useState(false);
	const cookies = new Cookies();

	const fetchCart = async (token, latitude, longitude) => {
		await api
			.getCart(token, latitude, longitude)
			.then((response) => response.json())
			.then((result) => {
				if (result.status === 1) {
					dispatch({ type: ActionTypes.SET_CART, payload: result });
				} else {
					dispatch({ type: ActionTypes.SET_CART, payload: null });
				}
			})
			.catch((error) => {});
		await api
			.getCart(token, latitude, longitude, 1)
			.then((response) => response.json())
			.then((result) => {
				if (result.status === 1) {
					dispatch({
						type: ActionTypes.SET_CART_CHECKOUT,
						payload: result.data,
					});
				}
			})
			.catch((error) => {});
	};

	const [productsInCart, setProductsInCart] = useState(0);

	useEffect(() => {
		if (city.city !== null && cookies.get("jwt_token") !== undefined) {
			fetchCart(
				cookies.get("jwt_token"),
				city.city.latitude,
				city.city.longitude
			);
		}
	}, [city]);

	const fetchPaymentSetting = async () => {
		await api
			.getPaymentSettings(cookies.get("jwt_token"))
			.then((response) => response.json())
			.then((result) => {
				if (result.status === 1) {
					dispatch({
						type: ActionTypes.SET_PAYMENT_SETTING,
						payload: result.data,
					});
				}
			})
			.catch((error) => {});
	};

	useEffect(() => {
		fetchPaymentSetting();
		window.addEventListener("scroll", handleScroll);
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);
	const handleScroll = () => {
		if (window.pageYOffset > 0) {
			setIsSticky(true);
		} else {
			setIsSticky(false);
		}
	};

	useEffect(() => {
		if (cookies.get("jwt_token") === undefined) {
			if (localStorage.getItem("cart")) {
				const cartVal = JSON.parse(localStorage.getItem("cart"));
				if (cartVal) {
					setProductsInCart(cartVal.length);
				}
			}
		} else {
			if (cart.cart !== null) {
				setProductsInCart(cart.cart.total);
			}
		}
	}, [cart, productTriggered]);

	return (
		<>
			<header className="site-header  desktop-shadow-disable mobile-shadow-enable bg-white  mobile-nav-enable border-bottom">
				<div
					className={isSticky ? " header-main  w-100" : "header-main  w-100"}
				>
					<div className="container">
						<div className="d-flex row-reverse justify-content-lg-between justify-content-center">
							<div className="d-flex col-md-3 w-auto order-3  justify-content-end align-items-center">
								{/* cart starts here  */}
								{city.city === null ? (
									<button
										aria-label="cart"
										type="button"
										className="icon mx-4 me-sm-5 position-relative"
									>
										<IoCartOutline />
									</button>
								) : (
									<button
										aria-label="cart"
										type="button"
										className="icon mx-4 me-sm-5 position-relative"
										data-bs-toggle="offcanvas"
										data-bs-target="#cartoffcanvasExample"
										aria-controls="cartoffcanvasExample"
									>
										<IoCartOutline />

										{productsInCart > 0 ? (
											<span className="position-absolute start-100 translate-middle badge rounded-pill fs-5">
												{productsInCart}
												<span className="visually-hidden">unread messages</span>
											</span>
										) : null}
									</button>
								)}
							</div>
						</div>
					</div>
				</div>
				<Cart
					productTriggered={productTriggered}
					setProductTriggered={setProductTriggered}
				/>
			</header>
		</>
	);
};

export default TemHeader;
