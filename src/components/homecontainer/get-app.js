import React from "react";
import AppImg from "../../public/images/home-page/phone.png";
import DownloadApp from "../../public/images/logo/app-logo.svg";
import ChhaykartPinkLogo from "../../public/images/logo/chhayakart-pink-logo.png";
import styles from "./get-app.module.scss";
import CKWholesale from "../../public/images/ck-wholesale/CKWholesale.jpg";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const GetApp = () => {
	const navigate = useNavigate();
	const user = useSelector((state) => state.user);
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
			</div>
			<div className={`${styles.cardWrapper} justify-content-center`}>
				<img src={CKWholesale} alt="CK Wholesale" style={{width: '60%'}} onClick={event=> {
					//Check if logged in
					if(user.user != null){
						if(user.user.hasRegisteredWholesaleStore){
							navigate("/wholesale/categories");
						}else{
							navigate("/wholesale/add_store");
						}
					}else{
						navigate("/wholesale/categories");
					}
				}}/>
			</div>
		</div>
	);
};

export default GetApp;
