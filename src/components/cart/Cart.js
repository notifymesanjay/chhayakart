import React, { useEffect, useState, useRef } from "react";
import "./cart.css";
import { useSelector, useDispatch } from "react-redux";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { FaRupeeSign } from "react-icons/fa";
import { BsPlus } from "react-icons/bs";
import { BiMinus } from "react-icons/bi";
import api from "../../api/api";
import { toast } from "react-toastify";
import Cookies from "universal-cookie";
import { ActionTypes } from "../../model/action-type";
import EmptyCart from "../../utils/zero-state-screens/Empty_Cart.svg";
import { useNavigate, Link } from "react-router-dom";
import Loader from "../loader/Loader";
import {
	DecrementProduct,
	DeleteProductFromCart,
	IncrementProduct,
} from "../../services/cartService";
import TrackingService from "../../services/trackingService";

const Cart = ({ productTriggered, setProductTriggered = () => {} }) => {
	const closeCanvas = useRef();
	const cookies = new Cookies();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const user = useSelector((state) => state.user);

	const cart = useSelector((state) => state.cart);
	const city = useSelector((state) => state.city);
	const sizes = useSelector((state) => state.productSizes);

	const [productSizes, setproductSizes] = useState(null);
	const [iscartEmpty, setiscartEmpty] = useState(false);
	const [isLoader, setisLoader] = useState(false);
	const [orderSummary, setOrderSummary] = useState(false);
	const [cartProducts, setCartProducts] = useState([]);
	const trackingService = new TrackingService();

	useEffect(() => {
		if (sizes.sizes === null || sizes.status === "loading") {
			if (city.city !== null && cart.cart !== null) {
				api
					.getProductbyFilter(
						city.city.id,
						city.city.latitude,
						city.city.longitude
					)
					.then((response) => response.json())
					.then((result) => {
						if (result.status === 1) {
							setproductSizes(result.sizes);
							dispatch({
								type: ActionTypes.SET_PRODUCT_SIZES,
								payload: result.sizes,
							});
						}
					});
			}
		} else {
			setproductSizes(sizes.sizes);
		}

		if (cart.cart === null && cart.status === "fulfill") {
			setiscartEmpty(true);
		} else {
			setiscartEmpty(false);
		}
	}, [cart]);

	//Add to Cart
	const addtoCart = async (product, product_variant_id, qty) => {
		trackingService.trackCart(
			product,
			qty,
			user.status === "loading" ? "" : user.user.email
		);
		setisLoader(true);
		await api
			.addToCart(
				cookies.get("jwt_token"),
				product.product_id,
				product_variant_id,
				qty
			)
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
							if (res.status === 1)
								dispatch({
									type: ActionTypes.SET_CART,
									payload: res,
								});
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
							setisLoader(false);
							if (res.status === 1)
								dispatch({
									type: ActionTypes.SET_CART_CHECKOUT,
									payload: res.data,
								});
						})
						.catch((error) => console.log(error));
				} else {
					setisLoader(false);
					toast.error(result.message);
				}
			});
	};

	const handleDecrement = (product, index) => {
		var val = parseInt(
			document.getElementById(`input-cart-sidebar${index}`).innerHTML
		);
		if (cookies.get("jwt_token") !== undefined) {
			if (val > 1) {
				document.getElementById(`input-cart-sidebar${index}`).innerHTML =
					val - 1;
				addtoCart(
					product,
					product.product_variant_id,
					document.getElementById(`input-cart-sidebar${index}`).innerHTML
				);
			}
		} else {
			trackingService.trackCart(
				product,
				parseInt(val) - 1,
				user.status === "loading" ? "" : user.user.email
			);

			const isDecremented = DecrementProduct(product.product_id, product);
			if (val > 1 && isDecremented) {
				document.getElementById(`input-cart-sidebar${index}`).innerHTML =
					val - 1;
			}
			setProductTriggered(!productTriggered);
		}
	};

	const handleIncrement = (product, index) => {
		var val = parseInt(
			document.getElementById(`input-cart-sidebar${index}`).innerHTML
		);
		if (cookies.get("jwt_token") !== undefined) {
			if (val < product.total_allowed_quantity) {
				document.getElementById(`input-cart-sidebar${index}`).innerHTML =
					val + 1;
				addtoCart(
					product,
					product.product_variant_id,
					document.getElementById(`input-cart-sidebar${index}`).innerHTML
				);
			}
		} else {
			trackingService.trackCart(
				product,
				parseInt(val) + 1,
				user.status === "loading" ? "" : user.user.email
			);
			const isIncremented = IncrementProduct(
				product.product_id,
				product,
				1,
				false
			);
			if (isIncremented) {
				document.getElementById(`input-cart-sidebar${index}`).innerHTML =
					val + 1;
			}
			setProductTriggered(!productTriggered);
		}
	};

	const deleteProduct = (product) => {
		if (cookies.get("jwt_token") !== undefined) {
			removefromCart(product.product_id, product.product_variant_id);
		} else {
			let isDeleted = DeleteProductFromCart(product.product_id);
			if (isDeleted) {
				setProductTriggered(!productTriggered);
			}
		}
	};

	//remove from Cart
	const removefromCart = async (product, product_variant_id) => {
		trackingService.trackCart(
			product,
			0,
			user.status === "loading" ? "" : user.user.email
		);
		setisLoader(true);
		await api
			.removeFromCart(
				cookies.get("jwt_token"),
				product.product_id,
				product_variant_id
			)
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
							if (res.status === 1) {
								dispatch({
									type: ActionTypes.SET_CART,
									payload: res,
								});
							} else dispatch({ type: ActionTypes.SET_CART, payload: null });
						})
						.catch((error) => console.log(error));
					await api
						.getCart(
							cookies.get("jwt_token"),
							city.city.latitude,
							city.city.longitude,
							1
						)
						.then((resp) => resp.json())
						.then((res) => {
							setisLoader(false);
							if (res.status === 1)
								dispatch({
									type: ActionTypes.SET_CART_CHECKOUT,
									payload: res.data,
								});
						})
						.catch((error) => console.log(error));
				} else {
					setisLoader(false);
					toast.error(result.message);
				}
			})
			.catch((error) => console.log(error));
	};

	const handleOrderSummary = () => {
		if (cookies.get("jwt_token") === undefined) {
			if (localStorage.getItem("cart")) {
				const cartVal = JSON.parse(localStorage.getItem("cart"));
				if (cartVal && cartVal.length > 0) {
					let allProductVariantId = "",
						allQuantity = "",
						subTotal = 0,
						totalDeliveryCharge = 0,
						allProducts = [],
						taxes = 0;
					var isCodAllowed = true;

					for (let i = 0; i < cartVal.length - 1; i++) {
						const trackingService = new TrackingService();
						trackingService.viewCart(
							cartVal[i],
							user.status === "loading" ? "" : user.user.email
						);
						let product = {};
						allProductVariantId +=
							cartVal[i].product_variant_id.toString() + ",";
						allQuantity += cartVal[i].qty.toString() + ",";
						subTotal +=
							parseInt(cartVal[i].qty) * parseInt(cartVal[i].discounted_price);
						if (cartVal[i].delivery_charges == 0) {
							isCodAllowed = false;
						}
						totalDeliveryCharge += parseInt(cartVal[i].delivery_charges);
						taxes += parseFloat(
							(cartVal[i].taxes / 100) *
								(parseInt(cartVal[i].qty) *
									parseInt(cartVal[i].discounted_price))
						);
						product["cod_allowed"] = cartVal[i].cod_allowed;
						product["discounted_price"] = cartVal[i].discounted_price;
						product["image_url"] = cartVal[i].image_url;
						product["is_deliverable"] = cartVal[i].is_deliverable;
						product["is_unlimited_stock"] = cartVal[i].is_unlimited_stock;
						product["name"] = cartVal[i].name;
						product["price"] = cartVal[i].price;
						product["product_id"] = cartVal[i].product_id;
						product["product_variant_id"] = cartVal[i].product_variant_id;
						product["qty"] = cartVal[i].qty;
						product["status"] = cartVal[i].status;
						product["stock"] = cartVal[i].stock;
						product["taxable_amount"] = cartVal[i].taxable_amount;
						product["total_allowed_quantity"] =
							cartVal[i].total_allowed_quantity;
						product["unit"] = cartVal[i].unit;
						allProducts.push(product);
					}

					allProductVariantId +=
						cartVal[cartVal.length - 1].product_variant_id.toString();
					allQuantity += cartVal[cartVal.length - 1].qty.toString();
					subTotal +=
						parseInt(cartVal[cartVal.length - 1].qty) *
						parseInt(cartVal[cartVal.length - 1].discounted_price);
					totalDeliveryCharge += parseInt(
						cartVal[cartVal.length - 1].delivery_charges
					);
					taxes += parseFloat(
						(cartVal[cartVal.length - 1].taxes / 100) *
							(parseInt(cartVal[cartVal.length - 1].qty) *
								parseInt(cartVal[cartVal.length - 1].discounted_price))
					);
					let product = {};
					product["cod_allowed"] = cartVal[cartVal.length - 1].cod_allowed;
					product["discounted_price"] =
						cartVal[cartVal.length - 1].discounted_price;
					product["image_url"] = cartVal[cartVal.length - 1].image_url;
					product["is_deliverable"] =
						cartVal[cartVal.length - 1].is_deliverable;
					product["is_unlimited_stock"] =
						cartVal[cartVal.length - 1].is_unlimited_stock;
					product["name"] = cartVal[cartVal.length - 1].name;
					product["price"] = cartVal[cartVal.length - 1].price;
					product["product_id"] = cartVal[cartVal.length - 1].product_id;
					product["product_variant_id"] =
						cartVal[cartVal.length - 1].product_variant_id;
					product["qty"] = cartVal[cartVal.length - 1].qty;
					product["status"] = cartVal[cartVal.length - 1].status;
					product["stock"] = cartVal[cartVal.length - 1].stock;
					product["taxable_amount"] =
						cartVal[cartVal.length - 1].taxable_amount;
					product["total_allowed_quantity"] =
						cartVal[cartVal.length - 1].total_allowed_quantity;
					product["unit"] = cartVal[cartVal.length - 1].unit;
					allProducts.push(product);

					let orderVal = {
						product_variant_id: allProductVariantId,
						quantity: allQuantity,
						isCodAllowed: isCodAllowed,
						sub_total: subTotal,
						taxes:
							subTotal > 4999 && subTotal < 9999
								? Math.ceil(0.92 * taxes)
								: subTotal > 9999
								? Math.ceil(0.88 * taxes)
								: Math.ceil(taxes),
						discount:
							subTotal > 4999 && subTotal < 9999
								? Math.floor(0.08 * subTotal)
								: subTotal > 9999
								? Math.floor(0.12 * subTotal)
								: 0,
						delivery_charge: { total_delivery_charge: totalDeliveryCharge },
						total_amount:
							subTotal > 4999 && subTotal < 9999
								? Math.ceil(
										subTotal +
											0.92 * taxes +
											totalDeliveryCharge -
											Math.floor(0.08 * subTotal)
								  )
								: subTotal > 9999
								? Math.ceil(
										subTotal +
											0.88 * taxes +
											totalDeliveryCharge -
											Math.floor(0.12 * subTotal)
								  )
								: Math.ceil(subTotal + taxes + totalDeliveryCharge),
						cod_allowed: 1,
					};
					setCartProducts(allProducts);
					setOrderSummary(orderVal);
					setiscartEmpty(false);
				} else {
					setiscartEmpty(true);
				}
			} else {
				setiscartEmpty(true);
			}
		} else {
			if (cart.cart !== null && cart.checkout !== null) {
				let allProducts = [],
					taxes = 0,
					delivery_charges = 0;
				var isCodAllowed = true;
				for (let i = 0; i < cart.cart.data.cart.length; i++) {
					const trackingService = new TrackingService();
					trackingService.viewCart(
						cart.cart.data.cart[i],
						user.status === "loading" ? "" : user.user.email
					);
					let product = {};
					product["cod_allowed"] = cart.cart.data.cart[i].cod_allowed;
					product["discounted_price"] = cart.cart.data.cart[i].discounted_price;
					product["image_url"] = cart.cart.data.cart[i].image_url;
					product["is_deliverable"] = cart.cart.data.cart[i].is_deliverable;
					product["is_unlimited_stock"] =
						cart.cart.data.cart[i].is_unlimited_stock;
					product["name"] = cart.cart.data.cart[i].name;
					product["price"] = cart.cart.data.cart[i].price;
					product["product_id"] = cart.cart.data.cart[i].product_id;
					taxes +=
						((cart.cart.data.cart[i].taxes != null
							? cart.cart.data.cart[i].taxes
							: 5) /
							100) *
						(parseInt(cart.cart.data.cart[i].qty) *
							parseInt(cart.cart.data.cart[i].discounted_price));
					if (cart.cart.data.cart[i].delivery_charges == 0) {
						isCodAllowed = false;
					}
					delivery_charges +=
						cart.cart.data.cart[i].delivery_charges != undefined
							? cart.cart.data.cart[i].delivery_charges
							: 40;
					product["product_variant_id"] =
						cart.cart.data.cart[i].product_variant_id;
					product["qty"] = cart.cart.data.cart[i].qty;
					product["status"] = cart.cart.data.cart[i].status;
					product["stock"] = cart.cart.data.cart[i].stock;
					product["taxable_amount"] = cart.cart.data.cart[i].taxable_amount;
					product["total_allowed_quantity"] =
						cart.cart.data.cart[i].total_allowed_quantity;
					product["unit"] = cart.cart.data.cart[i].unit;
					allProducts.push(product);
				}
				let orderVal = {
					product_variant_id: cart.checkout.product_variant_id,
					quantity: cart.checkout.quantity,
					sub_total: cart.checkout.sub_total,
					isCodAllowed: isCodAllowed,
					taxes:
						cart.checkout.sub_total > 4999 && cart.checkout.sub_total < 9999
							? Math.ceil(0.92 * taxes)
							: cart.checkout.sub_total > 9999
							? Math.ceil(0.88 * taxes)
							: Math.ceil(taxes),
					discount:
						cart.checkout.sub_total > 4999 && cart.checkout.sub_total < 9999
							? Math.floor(0.08 * cart.checkout.sub_total)
							: cart.checkout.sub_total > 9999
							? Math.floor(0.12 * cart.checkout.sub_total)
							: 0,
					delivery_charge: {
						total_delivery_charge: delivery_charges,
					},
					total_amount:
						cart.checkout.sub_total > 4999 && cart.checkout.sub_total < 9999
							? Math.ceil(
									cart.checkout.sub_total +
										0.92 * taxes +
										delivery_charges -
										Math.floor(0.08 * cart.checkout.sub_total)
							  )
							: cart.checkout.sub_total > 9999
							? Math.ceil(
									cart.checkout.sub_total +
										0.88 * taxes +
										delivery_charges -
										Math.floor(0.12 * cart.checkout.sub_total)
							  )
							: Math.ceil(cart.checkout.sub_total + taxes + delivery_charges),

					cod_allowed: 1,
				};
				setCartProducts(allProducts);
				setOrderSummary(orderVal);
				setiscartEmpty(false);
			}
		}
	};

	useEffect(() => {
		handleOrderSummary();
	}, [cart, productTriggered]);

	return (
		<div
			tabIndex="-1"
			className={`cart-sidebar-container offcanvas offcanvas-end`}
			id="cartoffcanvasExample"
			aria-labelledby="cartoffcanvasExampleLabel"
		>
			<div className="cart-sidebar-header-discount">
				<h2>
					Additional 12% Cash discount on order above{" "}
					<FaRupeeSign fill="var(--secondary-color )" />
					9,999
					<br />
					Additional 8% Cash discount on order above
					<FaRupeeSign fill="var(--secondary-color )" />
					4,999
				</h2>
			</div>
			<div className="cart-sidebar-header">
				<h5>your cart</h5>
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

			{iscartEmpty ? (
				<div className="empty-cart">
					<img data-src={EmptyCart} alt="empty-cart" className="lazyload"></img>
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
					{/* {productSizes === null ? (
            <Loader width="100%" height="100%" />
          ) : ( */}
					<>
						{isLoader ? <Loader screen="full" background="none" /> : null}
						<div className="cart-sidebar-product">
							<div className="products-header">
								<span>Product</span>
								<span>Price</span>
							</div>

							<div className="products-container">
								{cartProducts.map((product, index) => (
									<div key={index} className="cart-card">
										<div className="left-wrapper">
											<div className="image-container">
												<img
													data-src={product.image_url}
													className="lazyload"
													alt="product"
												></img>
											</div>

											<div className="product-details">
												<span>{product.name}</span>

												<div
													id={`selectedVariant${index}-wrapper-cartsidebar`}
													className="selected-variant-cart"
												>
													{product.measurement} {product.unit}
												</div>

												<div className="counter">
													<button
														type="button"
														onClick={() => {
															handleDecrement(product, index);
														}}
													>
														<BiMinus fill="#fff" />
													</button>
													<span id={`input-cart-sidebar${index}`}>
														{product.qty}
													</span>
													<button
														type="button"
														onClick={() => {
															handleIncrement(product, index);
														}}
													>
														<BsPlus fill="#fff" />
													</button>
												</div>
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
													{parseFloat(product.discounted_price)}
												</span>
											</div>

											<button
												type="button"
												className="remove-product"
												onClick={() => {
													deleteProduct(product);
												}}
											>
												delete
											</button>
										</div>
									</div>
								))}
							</div>
						</div>

						<div className="cart-sidebar-footer">
							<div className="heading">
								<span>order summary</span>
							</div>

							{Object.keys(orderSummary).length === 0 ? (
								<Loader width="100%" height="90vh" />
							) : (
								<>
									<div className="summary">
										<div className="d-flex justify-content-between">
											<span>Subtotal</span>
											<div className="d-flex align-items-center">
												<FaRupeeSign />
												<span>{parseFloat(orderSummary.sub_total)}</span>
											</div>
										</div>

										<div className="d-flex justify-content-between">
											<span>Delivery Charges</span>
											<div className="d-flex align-items-center">
												<FaRupeeSign />
												<span>
													{parseFloat(
														orderSummary.delivery_charge.total_delivery_charge
													)}
												</span>
											</div>
										</div>

										{parseFloat(orderSummary.sub_total) > 4999 && (
											<div className="d-flex justify-content-between">
												<span>Discount</span>
												<div className="d-flex align-items-center">
													-<FaRupeeSign />
													<span>{parseFloat(orderSummary.discount)}</span>
												</div>
											</div>
										)}

										<div className="d-flex justify-content-between">
											<span>GST</span>
											<div className="d-flex align-items-center">
												<FaRupeeSign />
												<span>{parseFloat(orderSummary.taxes)}</span>
											</div>
										</div>
									</div>

									<div className="d-flex justify-content-between">
										<span>Total</span>
										<div className="d-flex align-items-center total-amount">
											<FaRupeeSign fill="var(--secondary-color)" />
											<span>{parseFloat(orderSummary.total_amount)}</span>
										</div>
									</div>

									<div className="button-container">
										{cookies.get("jwt_token") !== undefined && (
											<button
												type="button"
												className="view-cart"
												onClick={() => {
													closeCanvas.current.click();
													navigate("/cart");
												}}
											>
												view cart
											</button>
										)}
										<button
											type="button"
											className="checkout"
											onClick={() => {
												closeCanvas.current.click();
												navigate("/checkout");
											}}
										>
											go to checkout
										</button>
									</div>
								</>
							)}
						</div>
					</>
					{/* )} */}
				</>
			)}
		</div>
	);
};

export default Cart;
