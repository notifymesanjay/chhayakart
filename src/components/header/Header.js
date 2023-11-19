import React, { useState, useEffect, useRef } from "react";
import "./header.css";
import { BsShopWindow } from "react-icons/bs";
import { BiUserCircle } from "react-icons/bi";
import { MdSearch, MdGTranslate, MdOutlineAccountCircle } from "react-icons/md";
import {
	IoContrast,
	IoNotificationsOutline,
	IoHeartOutline,
	IoCartOutline,
	IoPersonOutline,
} from "react-icons/io5";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import api from "../../api/api";
import { ActionTypes } from "../../model/action-type";

import Cookies from "universal-cookie";
import Cart from "../cart/Cart";
import { toast } from "react-toastify";
import Favorite from "../favorite/Favorite";

import LoginUser from "../login/login-user";
import ChhaykartPinkLogo from "../../public/images/logo/chhayakart-pink-logo.png";
import ChhayakartWhiteLogo from "../../public/images/logo/chhayakart-white-logo.png";
import styles from "./header.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { useResponsive } from "../shared/use-responsive";
import MobileMenu from "./mobile-menu";
import chhayakartPinkMiniLogo from "../../public/images/logo/chhayakert-pink-mini-logo.png";
import Sidebar from "./sidebar";
import { FiMenu } from "react-icons/fi";
import DskpHeader from "./dskp-header";

const Header = ({ productTriggered, setProductTriggered = () => {} }) => {
	const [isLocationPresent, setisLocationPresent] = useState(false);
	const [totalNotification, settotalNotification] = useState(null);
	const [search, setsearch] = useState("");
	const [active, setActive] = useState(false);

	//	const locationModalTrigger = useRef();
	const closeSidebarRef = useRef();
	//	const searchNavTrigger = useRef();

	const navigate = useNavigate();

	const dispatch = useDispatch();
	const { isSmScreen } = useResponsive();

	const city = useSelector((state) => state.city);
	const cssmode = useSelector((state) => state.cssmode);
	const user = useSelector((state) => state.user);
	const cart = useSelector((state) => state.cart);
	const favorite = useSelector((state) => state.favorite);
	const [isSticky, setIsSticky] = useState(false);
	const cookies = new Cookies();

	const curr_url = useLocation();

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

	function closeItem() {
		setActive(true);
	}
	const [counter, setCounter] = useState(1);
	const [isLogin, setIsLogin] = useState(false);
	const [productsInCart, setProductsInCart] = useState(0);

	const handleRemoveDiv = () => {
		setCounter(counter - 1);
	};
	const fetchFavorite = async (token, latitude, longitude) => {
		await api
			.getFavorite(token, latitude, longitude)
			.then((response) => response.json())
			.then((result) => {
				if (result.status === 1) {
					dispatch({ type: ActionTypes.SET_FAVORITE, payload: result });
				} else {
					dispatch({ type: ActionTypes.SET_FAVORITE, payload: null });
				}
			})
			.catch((error) => {});
	};

	const fetchNotification = async (token) => {
		await api
			.getNotification(token)
			.then((response) => response.json())
			.then((result) => {
				if (result.status === 1) {
					settotalNotification(result.total);
				}
			})
			.catch((error) => {});
	};

	useEffect(() => {
		if (city.city !== null && cookies.get("jwt_token") !== undefined) {
			fetchCart(
				cookies.get("jwt_token"),
				city.city.latitude,
				city.city.longitude
			);
			fetchFavorite(
				cookies.get("jwt_token"),
				city.city.latitude,
				city.city.longitude
			);
			fetchNotification(cookies.get("jwt_token"));
		}
	}, [city]);

	const fetchPaymentSetting = async () => {
		await api
			.getPaymentSettings(cookies.get("jwt_token"))
			.then((response) => response.json())
			.then((result) => {
				if (result.status === 1) {
					// window.razorpay_key = result.data.razorpay_key
					// window.stripe_publishable_key = result.data.stripe_publishable_key
					// window.paystack_public_key = result.data.paystack_public_key

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

	const handleCssModeChange = (e) => {
		dispatch({ type: ActionTypes.SET_CSSMODE, payload: e.target.value });
	};

	const handleLanguageChange = (e) => {
		dispatch({ type: ActionTypes.SET_LANGUAGE, payload: e.target.value });
	};

	const handleSignUp = () => {
		setIsLogin(true);
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

	const handleMobLogin = () => {
		setIsLogin(true);
		document.getElementsByClassName("wishlist")[0].classList.remove("active");
		if (curr_url.pathname === "/products") {
			document.getElementsByClassName("filter")[0].classList.remove("active");
		}
		if (curr_url.pathname !== "/products") {
			document.getElementsByClassName("shop")[0].classList.remove("active");
		}
		document.getElementsByClassName("search")[0].classList.remove("active");
		document
			.getElementsByClassName("header-search")[0]
			.classList.remove("active");
	};

	return isSmScreen ? (
		<>
			{/* sidebar */}

			{isSmScreen && (
				<>
					{/* {Array.from(Array(counter)).map((item, idx) => (
						<div className={styles.appWrapper} key={idx}>
							<FontAwesomeIcon
								onClick={handleRemoveDiv}
								icon={faTimes}
								className={styles.icon}
							/>
							<div className={styles.appContentWrapper}>
								<img
									data-src={chhayakartPinkMiniLogo}
									className={`${styles.logo} lazyload`}
									alt="CHHAYAKART"
								/>
								<p className={styles.description}>
									<b>Use App for Additional Discounts & Offers</b>
									<br />
									Avialable for android
								</p>
								<div>
									<button className={styles.btn}>
										<a
											className={styles.anchorTag}
											href="https://play.google.com/store/apps/details?id=com.chayakart"
										>
											{" "}
											Use App
										</a>
									</button>
								</div>
							</div>
						</div>
					))} */}
				</>
			)}
			<div
				className="hide-desktop offcanvas offcanvas-start sidebarWrapper"
				tabIndex="-1"
				id="sidebaroffcanvasExample"
				aria-labelledby="sidebaroffcanvasExampleLabel"
			>
				<Sidebar setIsLogin={setIsLogin} closeRef={closeSidebarRef} />
			</div>

			{/* header */}
			<header className="site-header  desktop-shadow-disable mobile-shadow-enable bg-white  mobile-nav-enable border-bottom">
				{/* top header */}
				<div
					className={`header-top  hide-mobile ${
						cssmode.cssmode === "dark" ? "dark-header-top" : ""
					}`}
				>
					<div className="container">
						<div className={`row justify-content-between`}>
							<div className="col-md-6 d-flex justify-content-start align-items-center">
								<Link
									to="/about"
									className={`borderPad ${
										cssmode.cssmode === "dark" ? "dark-header-1" : ""
									}`}
								>
									{" "}
									About us
								</Link>
								<Link to="/contact" className={`borderPad`}>
									{" "}
									Contact us
								</Link>

								<Link to="/terms" className={`borderPad`}>
									{" "}
									Terms
								</Link>
								<Link to="/policy/Privacy_Policy" className={`borderPad`}>
									{" "}
									Policy
								</Link>
								{/* <Link to='/faq' className={`borderPad`} > faq</Link> */}
							</div>
							<div className="col-md-6 d-flex justify-content-end"></div>
						</div>
					</div>
				</div>

				{/* bottom header */}
				<div
					className={
						isSticky ? "sticky header-main  w-100" : "header-main  w-100"
					}
				>
					<div className="container">
						<div className="d-flex row-reverse justify-content-lg-between justify-content-center">
							<div className="d-flex w-auto align-items-center justify-content-start col-md-2 order-1 column-left ">
								<div
									className="header-buttons hide-desktop"
									style={
										curr_url.pathname === "/profile"
											? { display: "none" }
											: null
									}
								>
									<button
										aria-label="menu"
										className="header-canvas button-item"
										type="button"
										data-bs-toggle="offcanvas"
										data-bs-target="#sidebaroffcanvasExample"
										aria-controls="sidebaroffcanvasExample"
									>
										<div className="button-menu">
											<FiMenu />
										</div>
									</button>
								</div>

								<div className="siteBrandWrapper">
									<Link
										to="/"
										className="site-brand"
										style={
											curr_url.pathname === "/profile"
												? { marginLeft: "4px" }
												: null
										}
									>
										<img
											data-src={
												isSmScreen ? ChhayakartWhiteLogo : ChhaykartPinkLogo
											}
											height="50px"
											alt="logo"
											className="desktop-logo lazyload"
										/>
									</Link>
								</div>
							</div>

							<div className="d-flex col-md-3 w-auto order-3  justify-content-end align-items-center">
								<button
									type="button"
									aria-label="notifications"
									className="icon position-relative hide-mobile mx-sm-4"
									onClick={() => {
										if (cookies.get("jwt_token") === undefined) {
											toast.error(
												"OOPS! You have to login first to see notification!"
											);
										} else {
											navigate("/notification");
										}
										navigate("/notification");
									}}
								>
									<IoNotificationsOutline />
									{totalNotification === null ? null : (
										<span className="position-absolute start-100 translate-middle badge rounded-pill fs-5 ">
											{totalNotification}
											<span className="visually-hidden">unread messages</span>
										</span>
									)}
								</button>

								{city.city === null ||
								cookies.get("jwt_token") === undefined ? (
									<button
										aria-label="wishlist"
										className="icon mx-sm-4 position-relative hide-mobile-screen"
										onClick={() => {
											if (cookies.get("jwt_token") === undefined) {
												toast.error(
													"OOPS! You have to login first to see favourite list !"
												);
											} else if (city.city === null) {
												toast.error(
													"Please Select you delivery location first!"
												);
											}
										}}
									>
										<IoHeartOutline className="" />
									</button>
								) : (
									<button
										aria-label="wishlist"
										className="icon mx-4 position-relative hide-mobile-screen"
										data-bs-toggle="offcanvas"
										data-bs-target="#favoriteoffcanvasExample"
										aria-controls="favoriteoffcanvasExample"
										onClick={() => {
											if (cookies.get("jwt_token") === undefined) {
												toast.error(
													"OOPS! You have to login first to see your cart!"
												);
											} else if (city.city === null) {
												toast.error(
													"Please Select you delivery location first!"
												);
											}
										}}
									>
										<IoHeartOutline className="" />
										{favorite.favorite !== null ? (
											<span className="position-absolute start-100 translate-middle badge rounded-pill fs-5 ">
												{favorite.favorite.total}
												<span className="visually-hidden">unread messages</span>
											</span>
										) : null}
									</button>
								)}

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

								{user.status === "loading" ? (
									<div className="hide-mobile-screen px-3">
										<div
											className="d-flex flex-row user-profile gap-1"
											onClick={handleSignUp}
										>
											<div className="d-flex align-items-center user-info my-auto">
												<span className="btn-success">
													<IoPersonOutline className="user_icon" />
												</span>
												<span className="pe-3">Sign Up</span>
											</div>
										</div>
									</div>
								) : (
									<div className="hide-mobile-screen ms-5">
										<Link
											to="/profile"
											className="d-flex align-items-center flex-row user-profile gap-1"
										>
											<div className="d-flex flex-column user-info my-auto">
												<span className="number"> Welcome</span>
												<span className="name"> {user.user.name}</span>
											</div>
											<img
												data-src={user.user.profile}
												className="lazyload"
												alt="user"
											></img>
										</Link>
									</div>
								)}
							</div>
						</div>
						{isSmScreen && (
							<>
								<br />
								<div className="d-flex  w-lg-100 col-md-6 order-4 justify-content-center align-items-center ">
									<div className="header-search mob-header-search rounded-3 ">
										<form
											onSubmit={(e) => {
												e.preventDefault();

												if (search !== "") {
													dispatch({
														type: ActionTypes.SET_FILTER_SEARCH,
														payload: search,
													});
													if (curr_url.pathname !== "/products") {
														navigate("/products");
													}
													// searchNavTrigger.current.click();
												}
											}}
											className="search-form"
										>
											<input
												type="search"
												id="search-box1"
												placeholder="Delivering 1000+ Products Across India"
												className="rounded-5"
												onChange={(e) => {
													if (e.target.value === "") {
														dispatch({
															type: ActionTypes.SET_FILTER_SEARCH,
															payload: null,
														});
													}
													setsearch(e.target.value);
												}}
											/>

											<button aria-label="search" type="submit">
												<MdSearch fill="black" />
											</button>
										</form>
									</div>
								</div>
							</>
						)}
					</div>
				</div>

				{isSmScreen && <MobileMenu />}

				{/* Cart Sidebar */}
				<Cart
					productTriggered={productTriggered}
					setProductTriggered={setProductTriggered}
				/>

				{/* favorite sidebar */}
				<Favorite />
			</header>

			{isLogin && (
				<LoginUser isOpenModal={isLogin} setIsOpenModal={setIsLogin} />
			)}
		</>
	) : (
		<DskpHeader
			productTriggered={productTriggered}
			setProductTriggered={setProductTriggered}
		/>
	);
};

export default Header;
