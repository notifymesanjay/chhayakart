import React from "react";
import AppImg from "../../public/images/home-page/phone.png";
import DownloadApp from "../../public/images/logo/app-logo.svg";
import ChhaykartPinkLogo from "../../public/images/logo/chhayakart-pink-logo.png";
import styles from "./get-app.module.scss";
// import ScrollToTop from "../shared/ScrollToTop";
// import { IoArrowUpSharp, IoSearchOutline } from "react-icons/io5";
// import { useState, useEffect } from "react";
const GetApp = () => {
	// const [showScroll, setShowScroll] = useState(false);
	// const checkScrollTop = () => {
	// 	if (!showScroll && window.pageYOffset > 400) {
	// 		setShowScroll(true);
	// 	} else if (showScroll && window.pageYOffset <= 400) {
	// 		setShowScroll(false);
	// 	}
	// };
	// window.addEventListener("scroll", checkScrollTop);
	return (
		<div className="container">
			<div className={styles.cardWrapper}>
				<div className={styles.imageWrapper}>
					<img className={styles.appImg} src={AppImg} alt="app-img" />
				</div>
				<div className={styles.bodyWrapper}>
					<h3 className={styles.header}>Get CHHAYAKART APP</h3>

					<img
						className={styles.logoImg}
						src={ChhaykartPinkLogo}
						alt="ckLogo"
					/>
					<a href="https://play.google.com/store/apps/details?id=com.chayakart">
						<img
							data-src={DownloadApp}
							className={`lazyload ${styles.appLogo}`}
							alt="app-download"
						/>
					</a>
				</div>
				{/* <IoArrowUpSharp
					className={styles.arrow}
					size={40}
					onClick={checkScrollTop}
				/> */}
			</div>
		</div>
	);
};

export default GetApp;
