import React from "react";
// import Header from "../header/Header";
import DskpHeader from "../header/dskp-header";
import Footer from "../footer/new-footer";
import Order from "../order/Order";
import styles from "./Success.module.scss";
export default function Success() {
	return (
		<div>
			<h1 className={styles.title}>YOUR ORDER HISTORY WITH CHHAYAKART</h1>
			<Order />
		</div>
	);
}
