import React, { useEffect, useState } from "react";
import "./cart.css";
import { useSelector, useDispatch } from "react-redux";
import { FaRupeeSign } from "react-icons/fa";
import { BsPlus } from "react-icons/bs";
import { BiMinus } from "react-icons/bi";
import api from "../../api/api";
import { toast } from "react-toastify";
import Cookies from "universal-cookie";
import { ActionTypes } from "../../model/action-type";
import EmptyCart from "../../utils/zero-state-screens/Empty_Cart.svg";
import { useNavigate, Link } from "react-router-dom";
import coverImg from "../../utils/cover-img.jpg";
import { RiDeleteBinLine } from "react-icons/ri";
import Loader from "../loader/Loader";
import { motion } from "framer-motion";

const ViewCart = () => {
	const dispatch = useDispatch();
	const cookies = new Cookies();
	const navigate = useNavigate();

	const cart = useSelector((state) => state.cart);
	const city = useSelector((state) => state.city);
	const sizes = useSelector((state) => state.productSizes);

	const [productSizes, setproductSizes] = useState(null);
	const [iscartEmpty, setiscartEmpty] = useState(false);
	const [isLoader, setisLoader] = useState(false);

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

	const getProductVariantsSelection = (
		product_id,
		product_variant_id,
		div_id,
		index
	) => {
		api
			.getProductbyId(
				city.city.id,
				city.city.latitude,
				city.city.longitude,
				product_id
			)
			.then((response) => response.json())
			.then((result) => {
				if (result.status === 1) {
					var select = document.createElement("SELECT");

					select.setAttribute("id", `selectedVariant${index}-viewcart`);
					select.addEventListener("change", (e) => {
						addtoCart(
							product_id,
							JSON.parse(e.target.value).id,
							document.getElementById(`input-viewcart${index}`).innerHTML
						);
					});

					result.data.variants.forEach((variant, ind) => {
						var opt = document.createElement("option");
						opt.setAttribute("key", ind);
						opt.value = JSON.stringify(variant);

						//get unit_id
						var unit_id = 0;
						productSizes.forEach((psize) => {
							if (
								parseInt(psize.size) === parseInt(variant.measurement) &&
								psize.short_code === variant.stock_unit_name
							) {
								unit_id = psize.unit_id;
							}
						});
						opt.innerHTML = `${unit_id} ${variant.stock_unit_name} Rs.${variant.discounted_price}`;
						select.appendChild(opt);
					});

					if (document.getElementById(div_id).childNodes.length === 0)
						document.getElementById(div_id).appendChild(select);
				}
			})
			.catch((error) => console.log(error));
	};

	//Add to Cart
	const addtoCart = async (product_id, product_variant_id, qty) => {
		setisLoader(true);

		await api
			.addToCart(cookies.get("jwt_token"), product_id, product_variant_id, qty)
			.then((response) => response.json())
			.then(async (result) => {
				if (result.status === 1) {
					//popup commented
					//  toast.success(result.message)
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
	const removefromCart = async (product_id, product_variant_id) => {
		setisLoader(true);
		await api
			.removeFromCart(cookies.get("jwt_token"), product_id, product_variant_id)
			.then((response) => response.json())
			.then(async (result) => {
				if (result.status === 1) {
					//popup commented
					// toast.success(result.message);
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
							else dispatch({ type: ActionTypes.SET_CART, payload: null });
						})
						.catch((error) => console.log(error));
				} else {
					setisLoader(false);
					toast.error(result.message);
				}
			})
			.catch((error) => console.log(error));
	};

	return (
		<section id="viewcart" className="viewcart">
			<div className="cover">
				<img src={coverImg} className="img-fluid" alt="cover"></img>
				<div className="title">
					<h3>Cart</h3>
					<span>home / </span>
					<span className="active">cart</span>
				</div>
			</div>

			<div className="view-cart-container container">
				{iscartEmpty ? (
					<div className="empty-cart">
						<img src={EmptyCart} alt="empty-cart"></img>
						<p>Your Cart is empty</p>
						<span>You have no items in your shopping cart.</span>
						<span>Let's go buy something!</span>
						<button
							type="button"
							onClick={() => {
								navigate("/products");
							}}
						>
							start shopping
						</button>
					</div>
				) : (
					<>
						{cart.cart === null || productSizes === null ? (
							<Loader screen="full" />
						) : (
							<>
								{isLoader ? <Loader screen="full" background="none" /> : null}
								<div className="viewcart-product-wrapper">
									<div className="product-heading">
										<h3>your cart</h3>
										<span>There are </span>
										<span className="title">{cart.cart.total}</span>{" "}
										<span> product in your cart</span>
									</div>

									<table className="products-table table">
										<thead>
											<tr>
												<th className="first-column">Product</th>
												<th className="hide-mobile">unit</th>
												<th>price</th>
												<th>quantity</th>
												<th className="hide-mobile">subtotal</th>
												<th className="last-column">remove</th>
											</tr>
										</thead>

										<tbody>
											{cart.cart.data.cart.map((product, index) => (
												<tr key={index}>
													<th className="products-image-container first-column">
														<div className="image-container">
															<img src={product.image_url} alt="product"></img>
														</div>

														<div className="">
															<span>{product.name}</span>

															<div
																id={`selectedVariant${index}-wrapper-viewcart`}
															></div>
															{getProductVariantsSelection(
																product.product_id,
																product.product_variant_id,
																`selectedVariant${index}-wrapper-viewcart`,
																index
															)}
														</div>
													</th>

													<th className="unit hide-mobile">{product.qty}</th>

													<th className="price">
														<FaRupeeSign fill="var(--secondary-color)" />
														{parseFloat(product.discounted_price)}
													</th>

													<th className="quantity">
														<div>
															<button
																type="button"
																onClick={() => {
																	var val = parseInt(
																		document.getElementById(
																			`input-viewcart${index}`
																		).innerHTML
																	);
																	if (val > 1) {
																		document.getElementById(
																			`input-viewcart${index}`
																		).innerHTML = val - 1;
																		addtoCart(
																			product.product_id,
																			product.product_variant_id,
																			document.getElementById(
																				`input-cart-sidebar${index}`
																			).innerHTML
																		);
																	}
																}}
															>
																<BiMinus fill="#fff" fontSize={"2rem"} />
															</button>
															<span id={`input-viewcart${index}`}>
																{product.qty}
															</span>
															<button
																type="button"
																onClick={() => {
																	var val = parseInt(
																		document.getElementById(
																			`input-viewcart${index}`
																		).innerHTML
																	);
																	if (val < product.total_allowed_quantity) {
																		document.getElementById(
																			`input-viewcart${index}`
																		).innerHTML = val + 1;
																		addtoCart(
																			product.product_id,
																			product.product_variant_id,
																			document.getElementById(
																				`input-viewcart${index}`
																			).innerHTML
																		);
																	}
																}}
															>
																<BsPlus fill="#fff" fontSize={"2rem"} />
															</button>
														</div>
													</th>

													<th className="subtotal hide-mobile">
														<FaRupeeSign />

														{parseFloat(cart.cart.data.sub_total)}
													</th>

													<th className="remove last-column">
														<button
															whileTap={{ scale: 0.8 }}
															type="button"
															onClick={() =>
																removefromCart(
																	product.product_id,
																	product.product_variant_id
																)
															}
														>
															<RiDeleteBinLine
																fill="red"
																fontSize={"2.985rem"}
															/>
														</button>
													</th>
												</tr>
											))}
										</tbody>
									</table>
								</div>

								<div className="cart-summary-wrapper">
									<div className="heading">
										<span>Cart total</span>
									</div>
									{cart.checkout === null ? (
										<div className="d-flex justify-content-center">
											<div className="spinner-border" role="status">
												<span className="visually-hidden">Loading...</span>
											</div>
										</div>
									) : (
										<div className="summary">
											<div className="d-flex justify-content-between">
												<span>Subtotal</span>
												<div className="d-flex align-items-center">
													<FaRupeeSign />
													<span>{parseFloat(cart.checkout.sub_total)}</span>
												</div>
											</div>

											<div className="d-flex justify-content-between">
												<span>Delivery Charges</span>
												<div className="d-flex align-items-center">
													<FaRupeeSign />
													<span>
														{parseFloat(
															cart.checkout.delivery_charge
																.total_delivery_charge
														)}
													</span>
												</div>
											</div>

											<div className="d-flex justify-content-between total">
												<span>Total</span>
												<div className="d-flex align-items-center total-amount">
													<FaRupeeSign fill="var(--secondary-color)" />
													<span>{parseFloat(cart.checkout.total_amount)}</span>
												</div>
											</div>

											<div className="button-container">
												<Link to="/checkout" className="checkout">
													go to checkout
												</Link>
											</div>
										</div>
									)}
								</div>
							</>
						)}
					</>
				)}
			</div>
		</section>
	);
};

export default ViewCart;
