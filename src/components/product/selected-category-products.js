import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "universal-cookie";
import { BiMinus } from "react-icons/bi";
import { BsPlus } from "react-icons/bs";
import styles from "./productlist.module.scss";
import {
	AddProductToCart,
	DecrementProduct,
	IncrementProduct,
} from "../../services/cartService";
import api from "../../api/api";
import { toast } from "react-toastify";
import { ActionTypes } from "../../model/action-type";
import CryptoJS from "crypto-js";
import { faIndianRupeeSign } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import BulkOrder from "./bulk-order";
import TrackingService from "../../services/trackingService";

const secret_key = "Xyredg$5g";

const SelectedCategoryProducts = ({
	product,
	productTriggered,
	setProductTriggered,
	index,
}) => {
	const user = useSelector((state) => state.user);
	const cookies = new Cookies();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const city = useSelector((state) => state.city);
	const [isProductAdded, setIsProductAdded] = useState(false);
	const [productVal, setProductVal] = useState(0);
	const [isOpenBulk, setIsOpenBulk] = useState(false);
	const [bulkVal, setBulkVal] = useState(0);
	const trackingService = new TrackingService();

	const addtoCart = async (product, product_variant_id, qty) => {
		trackingService.trackCart(
			product,
			qty,
			user != null && user.status === "loading" ? "" : user.user.email
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

	const handleAddToCart = (product, index) => {
		if (cookies.get("jwt_token") !== undefined) {
			console.log("xyzu", product);
			console.log(
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
				""
			);
			setIsProductAdded(true);
			setProductVal(1);
			addtoCart(
				product,
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
				1
			);
		} else {
			trackingService.trackCart(
				product,
				1,
				user.status === "loading" ? "" : user.user.email
			);

			const isAdded = AddProductToCart(product);
			if (isAdded) {
				setIsProductAdded(true);
				setProductVal(1);
				setProductTriggered(!productTriggered);
			}
		}
	};

	const removefromCart = async (product, product_variant_id) => {
		trackingService.trackCart(
			product,
			0,
			user != null && user.status === "loading" ? "" : user.user.email
		);

		await api
			.removeFromCart(cookies.get("jwt_token"), product.id, product_variant_id)
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

	const handleDecrement = (product, index) => {
		var val = productVal;

		if (cookies.get("jwt_token") !== undefined) {
			if (val === 1) {
				setProductVal(0);
				setIsProductAdded(false);

				removefromCart(
					product,
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
				setProductVal(val - 1);
				addtoCart(
					product,
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
					val - 1
				);
			}
		} else {
			trackingService.trackCart(
				product,
				parseInt(val) - 1,
				user.status === "loading" ? "" : user.user.email
			);

			const isDecremented = DecrementProduct(product.id, product);

			if (isDecremented) {
				setProductVal(val - 1);
			} else {
				setProductVal(0);
				setIsProductAdded(false);
			}
			setProductTriggered(!productTriggered);
		}
	};

	const handleIncrement = (product, index) => {
		var val = productVal;
		if (val >= Math.ceil(parseInt(product.total_allowed_quantity) / 2)) {
			setIsOpenBulk(true);
		} else {
			IncrementProduct1(val, index);
		}
	};

	const IncrementProduct1 = (val, index) => {
		if (cookies.get("jwt_token") !== undefined) {
			if (parseInt(val) < parseInt(product.total_allowed_quantity)) {
				setProductVal(parseInt(val) + 1);
				addtoCart(
					product,
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
					parseInt(val) + 1
				);
			} else {
				toast.error("Maximum Quantity Exceeded");
			}
		} else {
			trackingService.trackCart(
				product,
				parseInt(val) + 1,
				user.status === "loading" ? "" : user.user.email
			);
			const isIncremented = IncrementProduct(
				product.id,
				product,
				val + 1,
				true
			);
			if (isIncremented) {
				setProductVal(parseInt(val) + 1);
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

	return (
		<div className={`${styles.productCard} ${styles.cardWrapper}`} key={index}>
			<div
				className={styles.imageWrapper}
				onClick={() => {
					navigate(`/product/${product.id}/${
						product.slug.includes("/")
							? product.slug.split("/")[0]
							: product.slug
					}			
					`);
					dispatch({
						type: ActionTypes.SET_SELECTED_PRODUCT,
						payload: product.id,
					});
				}}
			>
				<img src={product.image_url} alt="" className={styles.productImg} />
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
									document.getElementById(`price${index}-section`).innerHTML =
										document.getElementById("fa-rupee").outerHTML +
										JSON.parse(
											CryptoJS.AES.decrypt(e.target.value, secret_key).toString(
												CryptoJS.enc.Utf8
											)
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

				<div className={styles.btnWrapper} style={{ flexGrow: "1" }}>
					{!isProductAdded ? (
						<button
							type="button"
							id={`Add-to-cart-section${index}`}
							className={styles.addBtn}
							onClick={() => {
								handleAddToCart(product, index);
							}}
						>
							Add
						</button>
					) : (
						<>
							<div
								id={`input-cart-section${index}`}
								className={`${styles.addBtn} ${styles.addedProduct}`}
							>
								<button
									type="button"
									onClick={() => {
										handleDecrement(product, index);
									}}
								>
									<BiMinus />
								</button>
								<span id={`input-section${index}`}>{productVal}</span>
								<button
									type="button"
									onClick={() => {
										handleIncrement(product, index);
									}}
								>
									<BsPlus />{" "}
								</button>
							</div>
							{isOpenBulk && (
								<BulkOrder
									isOpenBulk={isOpenBulk}
									setIsOpenBulk={setIsOpenBulk}
									product={product}
									onSubmit={IncrementProduct1}
									productVal={productVal}
									index={index}
								/>
							)}
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default SelectedCategoryProducts;
