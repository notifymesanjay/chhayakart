import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import coverImg from "../../utils/cover-img.jpg";
import "../cart/cart.css";
import "./favorite.css";
import EmptyCart from "../../utils/zero-state-screens/Empty_Cart.svg";
import { useNavigate, Link } from "react-router-dom";
import { FaRupeeSign } from "react-icons/fa";
import { BsPlus } from "react-icons/bs";
import { BiMinus } from "react-icons/bi";
import api from "../../api/api";
import { toast } from "react-toastify";
import Cookies from "universal-cookie";
import { ActionTypes } from "../../model/action-type";
import { RiDeleteBinLine } from "react-icons/ri";
import Loader from "../loader/Loader";
import LoginUser from "../login/login-user";

const Wishlist = () => {
	const closeCanvas = useRef();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const cookies = new Cookies();

	const favorite = useSelector((state) => state.favorite);
	const city = useSelector((state) => state.city);
	const sizes = useSelector((state) => state.productSizes);

	const [productSizes, setproductSizes] = useState(null);
	const [isfavoriteEmpty, setisfavoriteEmpty] = useState(false);
	const [isLoader, setisLoader] = useState(false);
	const [isLogin, setIsLogin] = useState(false);

	useEffect(() => {
		if (sizes.sizes === null || sizes.status === "loading") {
			if (city.city !== null && favorite.favorite !== null) {
				console.log('wishlist');
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

		if (favorite.favorite === null && favorite.status === "fulfill") {
			setisfavoriteEmpty(true);
		} else {
			setisfavoriteEmpty(false);
		}
	}, [favorite]);

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

					select.setAttribute("id", `selectedVariant${index}-wishlist`);
					select.addEventListener("change", (e) => {
						document.getElementById(`input-wishlist${index}`).innerHTML = 0;
						document
							.getElementById(`input-cart-wishlist${index}`)
							.classList.remove("active");
						document
							.getElementById(`Add-to-cart-wishlist${index}`)
							.classList.add("active");
						document.getElementById(`price-wishlist${index}`).innerHTML =
							JSON.parse(e.target.value).price;
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
						opt.innerHTML = `${unit_id} ${variant.stock_unit_name} Rs.${variant.price}`;
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
					//  toast.success(result.message);
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

	//remove from favorite
	const removefromFavorite = async (product_id) => {
		setisLoader(true);
		await api
			.removeFromFavorite(cookies.get("jwt_token"), product_id)
			.then((response) => response.json())
			.then(async (result) => {
				if (result.status === 1) {
					//popup commented
					//   toast.success(result.message);
					await api
						.getFavorite(
							cookies.get("jwt_token"),
							city.city.latitude,
							city.city.longitude
						)
						.then((resp) => resp.json())
						.then((res) => {
							setisLoader(false);
							if (res.status === 1)
								dispatch({ type: ActionTypes.SET_FAVORITE, payload: res });
							else dispatch({ type: ActionTypes.SET_FAVORITE, payload: null });
						});
				} else {
					setisLoader(false);
					toast.error(result.message);
				}
			});
	};

	const handleAddToCart = (index, product) => {
		if (cookies.get("jwt_token") !== undefined) {
			document
				.getElementById(`Add-to-cart-wishlist${index}`)
				.classList.remove("active");
			document
				.getElementById(`input-cart-wishlist${index}`)
				.classList.add("active");
			document.getElementById(`input-wishlist${index}`).innerHTML = 1;
			addtoCart(
				product.id,
				JSON.parse(
					document.getElementById(`selectedVariant${index}-wishlist`).value
				).id,
				document.getElementById(`input-wishlist${index}`).innerHTML
			);
		} else {
			setIsLogin(true);
		}
	};

	return (
		<section id="wishlist" className="wishlist">
			<div className="cover">
				<img src={coverImg} className="img-fluid" alt="cover"></img>
				<div className="title">
					<h3>Wishlist</h3>
					<span>home / </span>
					<span className="active">Wishlist</span>
				</div>
			</div>

			<div className="view-cart-container container">
				{isfavoriteEmpty ? (
					<div className="empty-cart">
						<img src={EmptyCart} alt="empty-cart"></img>
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
						{favorite.favorite === null || productSizes === null ? (
							<Loader screen="full" />
						) : (
							<>
								{isLoader ? <Loader screen="full" background="none" /> : null}
								<div className="viewcart-product-wrapper">
									<div className="product-heading">
										<h3>your wishlist</h3>
										<span>There are </span>
										<span className="title">
											{favorite.favorite.total}
										</span>{" "}
										<span> product in this list</span>
									</div>

									<table className="products-table table">
										<thead>
											<tr>
												<th className="first-column">Product</th>
												<th>price</th>
												<th>Add to cart</th>
												<th className="last-column">remove</th>
											</tr>
										</thead>

										<tbody>
											{favorite.favorite.data.map((product, index) => (
												<tr key={index} className="">
													<th className="products-image-container first-column">
														<div className="image-container">
															<img src={product.image_url} alt="product"></img>
														</div>

														<div className="">
															<span>{product.name}</span>

															<div
																id={`selectedVariant${index}-wrapper-wishlist`}
															></div>
															{getProductVariantsSelection(
																product.id,
																product.variants[0]?.id,
																`selectedVariant${index}-wrapper-wishlist`,
																index
															)}
														</div>
													</th>

													<th className="price">
														<FaRupeeSign fill="var(--secondary-color)" />
														<span id={`price-wishlist${index}`}>
															{parseFloat(
																product.variants.length > 0
																	? product.variants[0].price
																	: 0
															)}
														</span>
													</th>

													<th className="quantity">
														<button
															type="button"
															id={`Add-to-cart-wishlist${index}`}
															className="add-to-cart active"
															onClick={() => {
																handleAddToCart(index, product);
															}}
														>
															add to cart
														</button>

														<div
															className="counter"
															id={`input-cart-wishlist${index}`}
														>
															<button
																type="button"
																onClick={() => {
																	var val = parseInt(
																		document.getElementById(
																			`input-wishlist${index}`
																		).innerHTML
																	);
																	if (val === 1) {
																		document.getElementById(
																			`input-wishlist${index}`
																		).innerHTML = 0;
																		document
																			.getElementById(
																				`input-cart-wishlist${index}`
																			)
																			.classList.remove("active");
																		document
																			.getElementById(
																				`Add-to-cart-wishlist${index}`
																			)
																			.classList.add("active");
																		removefromCart(
																			product.id,
																			JSON.parse(
																				document.getElementById(
																					`selectedVariant${index}-wishlist`
																				).value
																			).id
																		);
																	} else {
																		document.getElementById(
																			`input-wishlist${index}`
																		).innerHTML = val - 1;
																		addtoCart(
																			product.id,
																			JSON.parse(
																				document.getElementById(
																					`selectedVariant${index}-wishlist`
																				).value
																			).id,
																			document.getElementById(
																				`input-wishlist${index}`
																			).innerHTML
																		);
																	}
																}}
															>
																<BiMinus fill="#fff" />
															</button>
															<span id={`input-wishlist${index}`}></span>
															<button
																type="button"
																onClick={() => {
																	var val = document.getElementById(
																		`input-wishlist${index}`
																	).innerHTML;
																	if (val < product.total_allowed_quantity) {
																		document.getElementById(
																			`input-wishlist${index}`
																		).innerHTML = parseInt(val) + 1;
																		addtoCart(
																			product.id,
																			JSON.parse(
																				document.getElementById(
																					`selectedVariant${index}-wishlist`
																				).value
																			).id,
																			document.getElementById(
																				`input-wishlist${index}`
																			).innerHTML
																		);
																	}
																}}
															>
																<BsPlus fill="#fff" />
															</button>
														</div>
													</th>

                          <th className="remove last-column">
                            <button
                              type="button"
                              onClick={() => removefromFavorite(product.id)}
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
              </>
            )}
          </>
        )}
      </div>
      
      {isLogin && <LoginUser isOpenModal={isLogin} setIsOpenModal={setIsLogin} /> }
    </section>
  );
};

export default Wishlist;
