import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "universal-cookie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import DownloadApp from "../../public/images/logo/app-logo.svg";
import ChhayakartPinkLogo from "../../public/images/logo/chhayakart-pink-logo.png";
import { removelocalstorageOTP } from "../../utils/manageLocalStorage";
import api from "../../api/api";
import { ActionTypes } from "../../model/action-type";
import styles from "./sidebar.module.scss";

const Sidebar = ({ setIsLogin = () => {}, closeRef }) => {
	const user = useSelector((state) => state.user);

	const navigate = useNavigate();
	const dispatch = useDispatch();
	const cookies = new Cookies();

	const [isSubMenu, setIsSubMenu] = useState(false);

	const handleLogout = () => {
		api
			.logout(cookies.get("jwt_token"))
			.then((response) => response.json())
			.then((result) => {
				if (result.status === 1) {
					cookies.remove("jwt_token");
					removelocalstorageOTP();
					dispatch({ type: ActionTypes.LOGOUT_AUTH, payload: null });
					toast.success("You're Successfully Logged Out");
					navigate("/");
				} else {
					toast.info(result.message);
				}
			});
	};

	const handleWishlist = () => {
		if (user.status === "loading") {
			toast.error("You have to login first to see Wishlist !");
		} else {
			navigate("/wishlist");
		}
	};

	const MyProfile = () => {
		if (user.status === "loading") {
			toast.error("You have to login first to track your Orders !");
		} else {
			navigate("/profile");
		}
	};

	const [orderClick, setorderClick] = useState(false);

	const handleOrders = () => {
		if (user.status === "loading") {
			toast.error("You have to login first to track your Orders !");
		} else {
			navigate("/orders");
		}
	};

	const handleCkWholesale = () => {
		//Check if logged in
		if(user.status === "loading"){
			toast.error("You have to login first to visit CK Wholesale!");
		}else{
			if(user.user.hasRegisteredWholesaleStore){
				navigate("/wholesale/categories");
			}else{
				navigate("/wholesale/add_store");
			}
		}
	}
	return (
		<div>
			<div className={styles.headerWrapper}>
				<div className={styles.iconWrapper}>
					<FontAwesomeIcon
						icon={faAngleLeft}
						className={styles.backIcon}
						data-bs-dismiss="offcanvas"
						aria-label="Close"
						ref={closeRef}
					/>
					<p className={styles.header}> Hello! </p>
				</div>
				{user.status === "loading" && (
					<button
						className={styles.loginBtn}
						onClick={() => {
							setIsLogin(true);
						}}
						data-bs-dismiss="offcanvas"
						aria-label="Close"
						ref={closeRef}
					>
						Login
					</button>
				)}
			</div>
			<ul className={styles.listWrapper}>
				<li
					className={styles.listItem}
					data-bs-dismiss="offcanvas"
					aria-label="Close"
					ref={closeRef}
					onClick={() => {
						navigate("/");
					}}
				>
					Home
				</li>
				<li
					className={styles.listItem}
					data-bs-dismiss="offcanvas"
					aria-label="Close"
					ref={closeRef}
					onClick={() => {
						navigate("/subCategory/96");
					}}
				>
					Season Special
				</li>
				<li
					className={styles.listItem}
					data-bs-dismiss="offcanvas"
					aria-label="Close"
					ref={closeRef}
					onClick={MyProfile}
				>
					My Profile
				</li>
				<li
					className={styles.listItem}
					data-bs-dismiss="offcanvas"
					aria-label="Close"
					ref={closeRef}
					onClick={handleOrders}
				>
					My Orders
				</li>
				<li
					className={styles.listItem}
					data-bs-dismiss="offcanvas"
					aria-label="Close"
					ref={closeRef}
					onClick={handleWishlist}
				>
					My Wishlist
				</li>
				<li className={`${styles.listItem} ${styles.disableItem}`}>
					Chhaya Purse<span className={styles.comingSoon}>( Coming Soon )</span>
				</li>
				<li
					className={styles.listItem}
					data-bs-dismiss="offcanvas"
					aria-label="Close"
					ref={closeRef}
					onClick={handleCkWholesale}
				>
					CK Wholesale
				</li>
				{/* <li className={`${styles.listItem} ${styles.disableItem}`}>
					Share & Earn<span className={styles.comingSoon}>( Coming Soon )</span>
				</li>
				<li className={`${styles.listItem} ${styles.disableItem}`}>
					Donate<span className={styles.comingSoon}>( Coming Soon )</span>
				</li> */}
				<p
					className={styles.subMenuHeader}
					onClick={() => {
						setIsSubMenu(!isSubMenu);
					}}
				>
					About Chhayakart{" "}
					<FontAwesomeIcon
						className={isSubMenu ? styles.activeIcon : ""}
						icon={faAngleDown}
					/>
				</p>
				{isSubMenu && (
					<ul className={`${styles.listWrapper} ${styles.subWrapper}`}>
						<li
							className={styles.listItem}
							data-bs-dismiss="offcanvas"
							aria-label="Close"
							ref={closeRef}
							onClick={() => {
								navigate("/about");
							}}
						>
							About Us
						</li>
						<li
							className={styles.listItem}
							data-bs-dismiss="offcanvas"
							aria-label="Close"
							ref={closeRef}
							onClick={() => {
								navigate("/terms");
							}}
						>
							Chhayakart Terms
						</li>
						<li
							className={styles.listItem}
							data-bs-dismiss="offcanvas"
							aria-label="Close"
							ref={closeRef}
							onClick={() => {
								navigate("/policy/Privacy_Policy");
							}}
						>
							Chhayakart Policies
						</li>
						<li
							className={styles.listItem}
							data-bs-dismiss="offcanvas"
							aria-label="Close"
							ref={closeRef}
							onClick={() => {
								navigate("/contact");
							}}
						>
							Contact Us
						</li>
						<li
							className={styles.listItem}
							data-bs-dismiss="offcanvas"
							aria-label="Close"
							ref={closeRef}
							onClick={() => {
								navigate("/return&refund");
							}}
						>
							Return & Refund
						</li>
					</ul>
				)}
				{user.status !== "loading" && (
					<li
						className={styles.listItem}
						onClick={handleLogout}
						data-bs-dismiss="offcanvas"
						aria-label="Close"
						ref={closeRef}
					>
						Logout
					</li>
				)}
			</ul>
			<div className={styles.bottomSection}>
				<div className={styles.downloadAppWrapper}>
					<p className={styles.downloadAppHeader}>Download the App</p>
					<a href="https://play.google.com/store/apps/details?id=com.chayakart">
						<img
							data-src={DownloadApp}
							className="lazyload"
							alt="app-download"
						/>
					</a>
				</div>
				<img
					className={`${styles.logo} lazyload`}
					data-src={ChhayakartPinkLogo}
					alt="chhayakart-logo"
				/>
			</div>
		</div>
	);
};

export default Sidebar;
