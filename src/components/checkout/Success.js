import React from "react";
import Order from "../order/Order";
import styles from "./Success.module.scss";
//import orderplaced from "../orderplased.avif";
import thanks from "../thanks.webp";
import ynks from "../ynks.webp";

export default function Success() {
	return (
		<>
			<div className={styles.cover}>
				<img
					data-src={ynks}
					className={`${styles.img} lazyload`}
					alt="order placed thankyou visit again"
				></img>
				{/* <span>THANKS.... </span> */}
				<div className={styles.title}>
					<h1 className="title">YOUR ORDER DETAILS WITH CHHAYAKART</h1>
				</div>
			</div>
			<Order />
		</>
	);
}
