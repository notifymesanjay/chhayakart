import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BsPlusCircle, BsGrid, BsListUl } from "react-icons/bs";
import { AiOutlineEye, AiOutlineCloseCircle } from "react-icons/ai";
import { FaRupeeSign } from "react-icons/fa";
import { BsHeart, BsShare, BsPlus, BsHeartFill } from "react-icons/bs";
import { BiMinus, BiLink } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/api";
import { motion } from "framer-motion";
import { ActionTypes } from "../../model/action-type";
import ReactSlider from "react-slider";
import logoPath from "../../utils/logo_egrocer.svg";
import Pagination from "react-js-pagination";
import { toast } from "react-toastify";
import Cookies from "universal-cookie";
import { setSelectedProductId } from "../../utils/manageLocalStorage";
import {
	FacebookIcon,
	FacebookShareButton,
	TelegramIcon,
	TelegramShareButton,
	WhatsappIcon,
	WhatsappShareButton,
} from "react-share";
import Loader from "../loader/Loader";
import No_Orders from "../../utils/zero-state-screens/No_Orders.svg";
import CryptoJS from "crypto-js";
import QuickViewModal from "./QuickViewModal";
import ScrollToTop from "../shared/ScrollToTop";

const ProductList = () => {
	const total_products_per_page = 12;
	const secret_key = "Xyredg$5g";
	const share_parent_url = "https://chhayakart.com/product";

	const dispatch = useDispatch();
	const navigate = useNavigate();
	const cookies = new Cookies();

	const closeCanvas = useRef();

	// const navigate = useNavigate();
	// let query = new URLSearchParams(useLocation().search)

	const category = useSelector((state) => state.category);
	const city = useSelector((state) => state.city);
	const filter = useSelector((state) => state.productFilter);

	const favorite = useSelector((state) => state.favorite);

	const [brands, setbrands] = useState(null);
	const [productresult, setproductresult] = useState(null);
	const [productSizes, setproductSizes] = useState(null);
	const [selectedProduct, setselectedProduct] = useState({});
	const [minmaxTotalPrice, setminmaxTotalPrice] = useState({
		total_min_price: null,
		total_max_price: null,
		min_price: null,
		max_price: null,
	});
	const [offset, setoffset] = useState(0);
	const [totalProducts, settotalProducts] = useState(0);
	const [currPage, setcurrPage] = useState(1);
	const [pagination, setpagination] = useState(null);
	// const [minPrice, setminPrice] = useState(null)
	// const [maxPrice, setmaxPrice] = useState(null)
	const [isLoader, setisLoader] = useState(false);

	const getBrandsApi = () => {
		api
			.getBrands()
			.then((response) => response.json())
			.then((result) => {
				console.log(result);
				if (result.status === 1) {
					result.data.forEach((brand) => {
						api
							.getProductbyFilter(
								city.city.id,
								city.city.latitude,
								city.city.longitude,
								{ brand_ids: brand.id }
							)
							.then((resp) => resp.json())
							.then((res) => {
								if (res.status === 1) {
									setBrandproductcountmap(
										new Map(
											brandproductcountmap.set(`brand${brand.id}`, res.total)
										)
									);
								} else {
								}
							})
							.catch((error) => console.log("error ", error));
					});
					setbrands(result.data);
				} else {
				}
			})
			.catch((error) => console.log("error ", error));
	};

	const getProductfromApi = () => {
		setproductresult(null);
		api
			.getProductbyFilter(
				city.city.id,
				city.city.latitude,
				city.city.longitude,
				{
					sort: filter.sort_filter,
					limit: total_products_per_page,
					offset: offset,
				}
			)
			.then((response) => response.json())
			.then((result) => {
				console.log(result);
				if (result.status === 1) {
					setminmaxTotalPrice({
						total_min_price: result.total_min_price,
						total_max_price: result.total_max_price,
						min_price: result.min_price,
						max_price: result.max_price,
					});
					setproductSizes(result.sizes);
					setproductresult(result.data);
					settotalProducts(result.total);
				} else {
					setproductresult([]);
					settotalProducts(0);
				}
			});
	};

	useEffect(() => {
		if (city.city !== null) {
			getBrandsApi();

			if (
				filter.category_id === null &&
				filter.brand_ids.length === 0 &&
				filter.price_filter === null &&
				filter.search === null
			) {
				getProductfromApi();
			} else if (
				filter.brand_ids.length !== 0 &&
				filter.category_id !== null &&
				filter.price_filter !== null &&
				filter.search !== null
			) {
				console.log(filter);
				filterProductsFromApi({
					category_id: filter.category_id,
					brand_ids: filter.brand_ids.toString(),
					min_price: filter.price_filter.min_price,
					max_price: filter.price_filter.max_price,
					sort: filter.sort_filter,
					search: filter.search,
					limit: total_products_per_page,
					offset: offset,
				});
			} else if (filter.brand_ids.length !== 0) {
				filterProductsFromApi({
					brand_ids: filter.brand_ids.toString(),
					sort: filter.sort_filter,
					limit: total_products_per_page,
					offset: offset,
				});
			} else if (filter.category_id !== null) {
				filterProductsFromApi({
					category_id: filter.category_id,
					sort: filter.sort_filter,
					limit: total_products_per_page,
					offset: offset,
				});
			} else if (filter.search !== null) {
				filterProductsFromApi({
					search: filter.search,
					sort: filter.sort_filter,
					limit: total_products_per_page,
					offset: offset,
				});
			} else {
				filterProductsFromApi({
					min_price: filter.price_filter.min_price,
					max_price: filter.price_filter.max_price,
					sort: filter.sort_filter,
					limit: total_products_per_page,
					offset: offset,
				});
			}
		}
	}, [city, filter, offset]);

	useEffect(() => {
		return () => {
			dispatch({ type: ActionTypes.SET_FILTER_CATEGORY, payload: null });
			dispatch({ type: ActionTypes.SET_FILTER_BRANDS, payload: [] });
			dispatch({ type: ActionTypes.SET_FILTER_VIEW, payload: true });
			dispatch({ type: ActionTypes.SET_FILTER_MIN_MAX_PRICE, payload: null });
			dispatch({ type: ActionTypes.SET_FILTER_SORT, payload: "new" });
			dispatch({ type: ActionTypes.SET_FILTER_SEARCH, payload: null });
		};
	}, []);

	//brands and their product count map
	const [brandproductcountmap, setBrandproductcountmap] = useState(new Map());

	//for product variants dropdown in product card
	const getProductSizeUnit = (variant) => {
		return productSizes.map((psize) => {
			if (
				parseInt(psize.size) === parseInt(variant.measurement) &&
				psize.short_code === variant.stock_unit_name
			) {
				return psize.unit_id;
			}
		});
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
				{variant.measurement} {variant.stock_unit_name} Rs.{variant.price}
			</option>
		));
	};

	//filters
	const filterProductsFromApi = async (filter) => {
		setproductresult(null);
		await api
			.getProductbyFilter(
				city.city.id,
				city.city.latitude,
				city.city.longitude,
				filter
			)
			.then((response) => response.json())
			.then((result) => {
				if (result.status === 1) {
					setminmaxTotalPrice({
						total_min_price: result.total_min_price,
						total_max_price: result.total_max_price,
						min_price: result.min_price,
						max_price: result.max_price,
					});
					const dataToBeSorted = result.data;
					//sorting of items lexographically..
					const strAscending = [...dataToBeSorted].sort((a, b) =>
						a.name > b.name ? 1 : -1
					);
					const filtered_data = strAscending;
					setproductresult(filtered_data);
					setproductSizes(result.sizes);
					console.log(result);
					console.error(result.total);

					settotalProducts(result.total);
				} else {
					setproductresult([]);
					settotalProducts(0);
				}
			})
			.catch((error) => console.log("error ", error));
	};

	//filter by brands
	const sort_unique_brand_ids = (int_brand_ids) => {
		if (int_brand_ids.length === 0) return int_brand_ids;
		int_brand_ids = int_brand_ids.sort(function (a, b) {
			return a * 1 - b * 1;
		});
		var ret = [int_brand_ids[0]];
		for (var i = 1; i < int_brand_ids.length; i++) {
			//Start loop at 1: arr[0] can never be a duplicate
			if (int_brand_ids[i - 1] !== int_brand_ids[i]) {
				ret.push(int_brand_ids[i]);
			}
		}
		return ret;
	};

	//onClick event of brands
	const filterbyBrands = (brand) => {
		setcurrPage(1);
		setoffset(0);
		var brand_ids = [...filter.brand_ids];

		if (brand_ids.includes(brand.id)) {
			brand_ids.splice(brand_ids.indexOf(brand.id), 1);
		} else {
			brand_ids.push(parseInt(brand.id));
		}

		const sorted_brand_ids = sort_unique_brand_ids(brand_ids);

		dispatch({
			type: ActionTypes.SET_FILTER_BRANDS,
			payload: sorted_brand_ids,
		});

		// if (filter.brand_ids === null) {
		//     navigate(`?brand_ids=${parseInt(brand.id)}`)
		// }
		// else {
		//     const brand_ids = query.get('brand_ids').split(',');

		//     var int_brand_ids = [];

		//     brand_ids.forEach(ids => {
		//         int_brand_ids.push(parseInt(ids))
		//     });

		//     if (int_brand_ids.includes(brand.id)) {
		//         int_brand_ids.splice(int_brand_ids.indexOf(brand.id), 1)
		//     }
		//     else {
		//         int_brand_ids.push(parseInt(brand.id))
		//     }

		//     if (int_brand_ids.length > 0) {
		//         var next_url = '?brand_ids=';

		//         const sorted_brand_ids = sort_unique_brand_ids(int_brand_ids);

		//         for (const ids in sorted_brand_ids) {
		//             if (parseInt(ids) + 1 === (sorted_brand_ids.length)) {
		//                 next_url += parseInt(sorted_brand_ids[ids])
		//             }
		//             else {
		//                 next_url += parseInt(sorted_brand_ids[ids]) + ','
		//             }
		//         }

		//         navigate(next_url)
		//     }
		//     else {
		//         navigate('/products')
		//     }

		// }
	};

	//filter by category

	//onLClick event of category
	const filterbyCategory = (category) => {
		setcurrPage(1);
		setoffset(0);
		if (filter.category_id === category.id) {
			dispatch({ type: ActionTypes.SET_FILTER_CATEGORY, payload: null });
		} else {
			dispatch({ type: ActionTypes.SET_FILTER_CATEGORY, payload: category.id });
		}
	};

	const Filter = () => {
		return (
			<>
				{/* filter section */}

				<div className=" filter-row">
					<h5>Product category</h5>
					{category.status === "loading" ? (
						<Loader screen="full" />
					) : (
						<>
							{category.category.map((ctg, index) => (
								<div
									whileTap={{ scale: 0.8 }}
									onClick={() => {
										filterbyCategory(ctg);
										closeCanvas.current.click();
									}}
									className={`d-flex justify-content-between align-items-center filter-bar ${
										filter.category_id !== null
											? filter.category_id === ctg.id
												? "active"
												: null
											: null
									}`}
									key={index}
								>
									<div className="d-flex gap-3">
										<div className="image-container">
											<img src={ctg.image_url} alt="category"></img>
										</div>
										<p>{ctg.name}</p>
									</div>

									<BsPlusCircle />
								</div>
							))}
						</>
					)}
				</div>

				<div className="filter-row ">
					<h5>Filter by price</h5>

					{minmaxTotalPrice.total_min_price === 0 ||
					minmaxTotalPrice.total_max_price === null ||
					minmaxTotalPrice.min_price === null ||
					minmaxTotalPrice.max_price === null ? (
						<Loader screen="full" />
					) : (
						<>
							<ReactSlider
								className="slider"
								thumbClassName="thumb"
								trackClassName="track"
								min={minmaxTotalPrice.total_min_price}
								max={minmaxTotalPrice.total_max_price}
								defaultValue={[0, 10000000]}
								ariaLabel={["Lower thumb", "Upper thumb"]}
								ariaValuetext={(state) => `Thumb value ${state.valueNow}`}
								renderThumb={(props, state) => (
									<div {...props}>{state.valueNow}</div>
								)}
								pearling={true}
								withTracks={true}
								minDistance={100}
								onAfterChange={([min, max]) => {
									setcurrPage(1);
									setoffset(0);
									dispatch({
										type: ActionTypes.SET_FILTER_MIN_MAX_PRICE,
										payload: { min_price: min, max_price: max },
									});
									closeCanvas.current.click();
								}}
							/>
						</>
					)}
				</div>

				<div className="filter-row">
					<h5>Brands</h5>
					{brands === null ? (
						<Loader screen="full" />
					) : (
						<>
							{brands.map((brand, index) => (
								<div
									whileTap={{ scale: 0.8 }}
									onClick={() => {
										filterbyBrands(brand);
										closeCanvas.current.click();
									}}
									className={`d-flex justify-content-between align-items-center filter-bar ${
										filter.brand_ids !== []
											? filter.brand_ids.includes(brand.id)
												? "active"
												: null
											: null
									}`}
									key={index}
								>
									<div className="d-flex gap-3 align-items-baseline">
										<div className="image-container">
											<img src={brand.image_url} alt="category"></img>
										</div>
										<p>{brand.name}</p>
									</div>
									<div className="d-flex align-items-baseline justify-content-center brand-count">
										<p className="m-auto">
											{brandproductcountmap.get(`brand${brand.id}`) !==
											undefined
												? brandproductcountmap.get(`brand${brand.id}`)
												: 0}
										</p>
									</div>
								</div>
							))}
						</>
					)}
				</div>
			</>
		);
	};

	//page change
	const handlePageChange = (pageNum) => {
		setcurrPage(pageNum);
		setoffset(pageNum * total_products_per_page - total_products_per_page);
	};

	//Add to Cart
	const addtoCart = async (product_id, product_variant_id, qty) => {
		setisLoader(true);
		await api
			.addToCart(cookies.get("jwt_token"), product_id, product_variant_id, qty)
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

	//remove from Cart
	const removefromCart = async (product_id, product_variant_id) => {
		setisLoader(true);
		await api
			.removeFromCart(cookies.get("jwt_token"), product_id, product_variant_id)
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

	//Add to favorite
	const addToFavorite = async (product_id) => {
		setisLoader(true);
		await api
			.addToFavotite(cookies.get("jwt_token"), product_id)
			.then((response) => response.json())
			.then(async (result) => {
				if (result.status === 1) {
					toast.success(result.message);
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
						})
						.catch((error) => {
							setisLoader(false);
						});
				} else if (result.status === 0) {
					setisLoader(false);
				} else {
					toast.error(result.message);
				}
			});
	};
	const removefromFavorite = async (product_id) => {
		await api
			.removeFromFavorite(cookies.get("jwt_token"), product_id)
			.then((response) => response.json())
			.then(async (result) => {
				if (result.status === 1) {
					toast.success(result.message);
					await api
						.getFavorite(
							cookies.get("jwt_token"),
							city.city.latitude,
							city.city.longitude
						)
						.then((resp) => resp.json())
						.then((res) => {
							if (res.status === 1)
								dispatch({ type: ActionTypes.SET_FAVORITE, payload: res });
							else dispatch({ type: ActionTypes.SET_FAVORITE, payload: null });
						});
				} else {
					toast.error(result.message);
				}
			});
	};

	return (
		<>
			<section
				id="productlist"
				className="container"
				onContextMenu={() => {
					return false;
				}}
			>
				<div className="row" id="products">
					<div
						className="hide-desktop col-3 offcanvas offcanvas-start"
						tabIndex="-1"
						id="filteroffcanvasExample"
						aria-labelledby="filteroffcanvasExampleLabel"
						data-bs-backdrop="false"
					>
						<div className="canvas-header">
							<div className="site-brand">
								<img src={logoPath} height="50px" alt="logo"></img>
							</div>

							<button
								type="button"
								className="close-canvas"
								data-bs-dismiss="offcanvas"
								aria-label="Close"
								ref={closeCanvas}
								onClick={() => {
									document
										.getElementsByClassName("filter")[0]
										.classList.remove("active");
								}}
							>
								<AiOutlineCloseCircle />
							</button>
						</div>
						{Filter()}
					</div>

					{/* filter section */}
					<div
						className="flex-column col-2 col-md-3 col-md-auto filter-container hide-mobile-screen"
						style={{ gap: "30px" }}
					>
						{Filter()}
					</div>

					{/* products according to applied filter */}
					<div
						className="d-flex flex-column col-md-9 col-12 h-100 productList_container"
						style={{ gap: "20px;" }}
					>
						<div className="row">
							<div className="d-flex col-12 flex-row justify-content-between align-items-center filter-view">
								<div className="d-flex gap-3">
									{/* 2nd Phase feature - List View */}
									{/* <div className={`icon ${!filter.grid_view ? 'active' : null}`} onClick={() => {
                                        dispatch({ type: ActionTypes.SET_FILTER_VIEW, payload: false });
                                    }}>
                                        <BsListUl fontSize={"2rem"} />
                                    </div>
                                    <div className={`icon ${filter.grid_view ? 'active' : null}`} onClick={() => {
                                        dispatch({ type: ActionTypes.SET_FILTER_VIEW, payload: true });
                                    }}>
                                        <BsGrid fontSize={"2rem"} />
                                    </div> */}
									<span className="total_product_count">
										{totalProducts} - Products Found
									</span>
								</div>

								<div className="select">
									<select
										className="form-select"
										aria-label="Default select example"
										onChange={(e) => {
											dispatch({
												type: ActionTypes.SET_FILTER_SORT,
												payload: e.target.value,
											});
										}}
									>
										<option value="new">New Products</option>
										<option value="old">Old Products</option>
										<option value="high">High to Low Price</option>
										<option value="low">Low to High Price</option>
										<option value="discount">Discounted Products</option>
										<option value="popular">Popular Products</option>
									</select>
								</div>
							</div>

							{productresult === null ? (
								<Loader background="none" width="100%" height="75vh" />
							) : (
								<>
									{isLoader ? <Loader screen="full" background="none" /> : null}
									{productresult.length > 0 ? (
										<div className="h-100 productList_content">
											<div className="row flex-wrap">
												{productresult.map((product, index) => (
													<div
														key={index}
														className={`${
															!filter.grid_view
																? "col-12 list-view "
																: "col-md-4 col-lg-3 "
														}`}
													>
														<div
															className={`product-card my-3 ${
																filter.grid_view ? "flex-column " : "my-3"
															}`}
														>
															<div
																className={`image-container  ${
																	!filter.grid_view
																		? "border-end col-3 "
																		: "col-12"
																}`}
															>
																<span
																	className="border border-light rounded-circle p-2 px-3"
																	id="aiEye"
																>
																	<AiOutlineEye
																		onClick={() => {
																			setselectedProduct(product);
																		}}
																		data-bs-toggle="modal"
																		data-bs-target="#quickviewModal"
																	/>
																</span>
																<img
																	src={product.image_url}
																	alt={product.slug}
																	className="card-img-top"
																	onClick={() => {
																		dispatch({
																			type: ActionTypes.SET_SELECTED_PRODUCT,
																			payload: product.id,
																		});
																		setSelectedProductId(product.id);
																		navigate("/product");
																	}}
																/>
																{filter.grid_view ? (
																	""
																) : (
																	<>
																		<div className="d-flex flex-row border-top product-card-footer">
																			<div className="border-end ">
																				{favorite.favorite &&
																				favorite.favorite.data.some(
																					(element) => element.id === product.id
																				) ? (
																					<button
																						type="button"
																						className="w-100 h-100"
																						onClick={() => {
																							if (
																								cookies.get("jwt_token") !==
																								undefined
																							) {
																								removefromFavorite(product.id);
																							} else {
																								toast.error(
																									"OOps! You need to login first to add to favourites"
																								);
																							}
																						}}
																					>
																						<BsHeartFill fill="green" />
																					</button>
																				) : (
																					<button
																						key={product.id}
																						type="button"
																						className="w-100 h-100"
																						onClick={() => {
																							if (
																								cookies.get("jwt_token") !==
																								undefined
																							) {
																								addToFavorite(product.id);
																							} else {
																								toast.error(
																									"OOps! You need to login first to add to favourites"
																								);
																							}
																						}}
																					>
																						<BsHeart />
																					</button>
																				)}
																			</div>

																			<div
																				className="border-end"
																				style={{ flexGrow: "1" }}
																			>
																				<button
																					type="button"
																					id={`Add-to-cart-section${index}`}
																					className="w-100 h-100 add-to-cart active"
																					onClick={() => {
																						if (
																							cookies.get("jwt_token") !==
																							undefined
																						) {
																							document
																								.getElementById(
																									`Add-to-cart-section${index}`
																								)
																								.classList.remove("active");
																							document
																								.getElementById(
																									`input-cart-section${index}`
																								)
																								.classList.add("active");
																							document.getElementById(
																								`input-section${index}`
																							).innerHTML = 1;
																							addtoCart(
																								product.id,
																								product.variants.length > 1
																									? JSON.parse(
																											document.getElementById(
																												`select-product${index}-variant-section`
																											).value
																									  ).id
																									: JSON.parse(
																											document.getElementById(`default-product${index}-variant-id
                                                                                            `)
																												.value
																									  ),
																								document.getElementById(
																									`input-section${index}`
																								).innerHTML
																							);
																						} else {
																							toast.error(
																								"OOps! You need to login first to access the cart!"
																							);
																						}
																					}}
																				>
																					add to cart
																				</button>

																				<div
																					id={`input-cart-productlist${index}`}
																					className="w-100 h-100 input-to-cart"
																				>
																					<button
																						type="button"
																						onClick={() => {
																							var val = parseInt(
																								document.getElementById(
																									`input-productlist${index}`
																								).innerHTML
																							);
																							if (val === 1) {
																								document.getElementById(
																									`input-productlist${index}`
																								).innerHTML = 0;
																								document
																									.getElementById(
																										`input-cart-productlist${index}`
																									)
																									.classList.remove("active");
																								document
																									.getElementById(
																										`Add-to-cart-productlist${index}`
																									)
																									.classList.add("active");
																								removefromCart(
																									product.id,
																									JSON.parse(
																										document.getElementById(
																											`selectedVariant${index}-productlist`
																										).value
																									).id
																								);
																							} else {
																								document.getElementById(
																									`input-productlist${index}`
																								).innerHTML = val - 1;
																								addtoCart(
																									product.id,
																									JSON.parse(
																										document.getElementById(
																											`selectedVariant${index}-productlist`
																										).value
																									).id,
																									document.getElementById(
																										`input-productlist${index}`
																									).innerHTML
																								);
																							}
																						}}
																					>
																						<BiMinus />
																					</button>
																					<span
																						id={`input-productlist${index}`}
																					></span>
																					<button
																						type="button"
																						onClick={() => {
																							var val = document.getElementById(
																								`input-productlist${index}`
																							).innerHTML;
																							if (
																								val <
																								product.total_allowed_quantity
																							) {
																								document.getElementById(
																									`input-productlist${index}`
																								).innerHTML = parseInt(val) + 1;
																								addtoCart(
																									product.id,
																									JSON.parse(
																										document.getElementById(
																											`selectedVariant${index}-productlist`
																										).value
																									).id,
																									document.getElementById(
																										`input-productlist${index}`
																									).innerHTML
																								);
																							}
																						}}
																					>
																						<BsPlus />{" "}
																					</button>
																				</div>
																			</div>

																			<div className="dropup share">
																				<button
																					type="button"
																					className="w-100 h-100"
																					data-bs-toggle="dropdown"
																					aria-expanded="false"
																				>
																					<BsShare />
																				</button>

																				<ul className="dropdown-menu">
																					<li>
																						<WhatsappShareButton
																							url={`https://chhayakart.com/product/${product.slug}`}
																						>
																							<WhatsappIcon
																								size={32}
																								round={true}
																							/>{" "}
																							<span>WhatsApp</span>
																						</WhatsappShareButton>
																					</li>
																					<li>
																						<TelegramShareButton
																							url={`https://chhayakart.com/product/${product.slug}`}
																						>
																							<TelegramIcon
																								size={32}
																								round={true}
																							/>{" "}
																							<span>Telegram</span>
																						</TelegramShareButton>
																					</li>
																					<li>
																						<FacebookShareButton
																							url={`https://chhayakart.com/product/${product.slug}`}
																						>
																							<FacebookIcon
																								size={32}
																								round={true}
																							/>{" "}
																							<span>Facebook</span>
																						</FacebookShareButton>
																					</li>
																					<li>
																						<button
																							type="button"
																							onClick={() => {
																								navigator.clipboard.writeText(
																									`https://chhayakart.com/product/${product.slug}`
																								);
																								toast.success(
																									"Copied Succesfully!!"
																								);
																							}}
																							className="react-share__ShareButton"
																						>
																							{" "}
																							<BiLink /> <span>Copy Link</span>
																						</button>
																					</li>
																				</ul>
																			</div>
																		</div>
																	</>
																)}
															</div>

															<div className="card-body product-card-body p-3">
																{/* {filter.grid_view?
                                                                        <></>:
                                                                         <>
                                                                         <div className="product_name"></div>
                                                                         </>} */}
																<h3
																	onClick={() => {
																		dispatch({
																			type: ActionTypes.SET_SELECTED_PRODUCT,
																			payload: product.id,
																		});
																		setSelectedProductId(product.id);
																		navigate("/product");
																	}}
																>
																	{product.name}
																</h3>
																<div className="price">
																	{filter.grid_view ? (
																		<>
																			<span
																				id={`price${index}-section`}
																				className="d-flex align-items-center"
																			>
																				<p id="fa-rupee">
																					<FaRupeeSign fill="var(--secondary-color)" />
																				</p>{" "}
																				{product.variants[0].price}
																			</span>
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
																								document.getElementById(
																									`price${index}-section`
																								).innerHTML =
																									document.getElementById(
																										"fa-rupee"
																									).outerHTML +
																									JSON.parse(
																										CryptoJS.AES.decrypt(
																											e.target.value,
																											secret_key
																										).toString(
																											CryptoJS.enc.Utf8
																										)
																									).price; //parseFloat(JSON.parse(e.target.value).price);

																								if (
																									document
																										.getElementById(
																											`input-cart-section${index}`
																										)
																										.classList.contains(
																											"active"
																										)
																								) {
																									document
																										.getElementById(
																											`input-cart-section${index}`
																										)
																										.classList.remove("active");
																									document
																										.getElementById(
																											`Add-to-cart-section${index}`
																										)
																										.classList.add("active");
																								}
																							}}
																							defaultValue={JSON.stringify(
																								product.variants[0]
																							)}
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
																							{product.variants[0].measurement +
																								" " +
																								product.variants[0]
																									.stock_unit_name}
																						</p>
																					</>
																				)}
																			</div>
																		</>
																	) : (
																		<>
																			<div className="product_varients_drop d-flex align-items-center">
																				{product.variants.length > 1 ? (
																					<>
																						<select
																							style={{
																								fontSize: "8px !important",
																							}}
																							className="form-select variant_selection select-arrow"
																							id={`select-product${index}-variant-section`}
																							onChange={(e) => {
																								document.getElementById(
																									`price${index}-section`
																								).innerHTML =
																									document.getElementById(
																										"fa-rupee"
																									).outerHTML +
																									JSON.parse(
																										CryptoJS.AES.decrypt(
																											e.target.value,
																											secret_key
																										).toString(
																											CryptoJS.enc.Utf8
																										)
																									).price;

																								if (
																									document
																										.getElementById(
																											`input-cart-section${index}`
																										)
																										.classList.contains(
																											"active"
																										)
																								) {
																									document
																										.getElementById(
																											`input-cart-section${index}`
																										)
																										.classList.remove("active");
																									document
																										.getElementById(
																											`Add-to-cart-section${index}`
																										)
																										.classList.add("active");
																								}
																							}}
																							defaultValue={JSON.stringify(
																								product.variants[0]
																							)}
																						>
																							{getProductVariants(product)}
																						</select>
																					</>
																				) : (
																					<>
																						<p
																							id={`default-product${index}-variant`}
																							value={product.variants[0].id}
																							className="variant_value variant_value_a select-arrow"
																						>
																							{product.variants[0].measurement +
																								" " +
																								product.variants[0]
																									.stock_unit_name}
																						</p>
																					</>
																				)}
																				<span
																					id={`price${index}-section`}
																					className="d-flex align-items-center"
																				>
																					<p id="fa-rupee">
																						<FaRupeeSign fill="var(--secondary-color)" />
																					</p>{" "}
																					{product.variants[0].price}
																				</span>
																			</div>
																			<p className="product_list_description"></p>
																		</>
																	)}
																</div>
															</div>
															{filter.grid_view ? (
																<>
																	<div className="d-flex flex-row border-top product-card-footer">
																		<div className="border-end ">
																			{favorite.favorite &&
																			favorite.favorite.data.some(
																				(element) => element.id === product.id
																			) ? (
																				<button
																					type="button"
																					className="w-100 h-100"
																					onClick={() => {
																						if (
																							cookies.get("jwt_token") !==
																							undefined
																						) {
																							removefromFavorite(product.id);
																						} else {
																							toast.error(
																								"OOps! You need to login first to add to favourites"
																							);
																						}
																					}}
																				>
																					<BsHeartFill fill="green" />
																				</button>
																			) : (
																				<button
																					key={product.id}
																					type="button"
																					className="w-100 h-100"
																					onClick={() => {
																						if (
																							cookies.get("jwt_token") !==
																							undefined
																						) {
																							addToFavorite(product.id);
																						} else {
																							toast.error(
																								"OOps! You need to login first to add to favourites"
																							);
																						}
																					}}
																				>
																					<BsHeart />
																				</button>
																			)}
																		</div>

																		<div
																			className="border-end"
																			style={{ flexGrow: "1" }}
																		>
																			<button
																				type="button"
																				id={`Add-to-cart-section${index}`}
																				className="w-100 h-100 add-to-cart active"
																				onClick={() => {
																					if (
																						cookies.get("jwt_token") !==
																						undefined
																					) {
																						document
																							.getElementById(
																								`Add-to-cart-section${index}`
																							)
																							.classList.remove("active");
																						document
																							.getElementById(
																								`input-cart-section${index}`
																							)
																							.classList.add("active");
																						document.getElementById(
																							`input-section${index}`
																						).innerHTML = 1;
																						addtoCart(
																							product.id,
																							product.variants.length > 1
																								? JSON.parse(
																										CryptoJS.AES.decrypt(
																											document.getElementById(
																												`select-product${index}-variant-section`
																											).value,
																											secret_key
																										).toString(
																											CryptoJS.enc.Utf8
																										)
																								  ).id
																								: document.getElementById(
																										`default-product${index}-variant-id`
																								  ).value,
																							document.getElementById(
																								`input-section${index}`
																							).innerHTML
																						);
																					} else {
																						toast.error(
																							"OOps! You need to login first to access the cart!"
																						);
																					}
																				}}
																			>
																				add to cart
																			</button>

																			<div
																				id={`input-cart-section${index}`}
																				className="w-100 h-100 input-to-cart"
																			>
																				<button
																					type="button"
																					onClick={() => {
																						var val = parseInt(
																							document.getElementById(
																								`input-section${index}`
																							).innerHTML
																						);
																						if (val === 1) {
																							document.getElementById(
																								`input-section${index}`
																							).innerHTML = 0;
																							document
																								.getElementById(
																									`input-cart-section${index}`
																								)
																								.classList.remove("active");
																							document
																								.getElementById(
																									`Add-to-cart-section${index}`
																								)
																								.classList.add("active");
																							removefromCart(
																								product.id,
																								product.variants.length > 1
																									? JSON.parse(
																											CryptoJS.AES.decrypt(
																												document.getElementById(
																													`select-product${index}-variant-section`
																												).value,
																												secret_key
																											).toString(
																												CryptoJS.enc.Utf8
																											)
																									  ).id
																									: document.getElementById(
																											`default-product${index}-variant-id`
																									  ).value
																							);
																						} else {
																							document.getElementById(
																								`input-section${index}`
																							).innerHTML = val - 1;
																							addtoCart(
																								product.id,
																								product.variants.length > 1
																									? JSON.parse(
																											CryptoJS.AES.decrypt(
																												document.getElementById(
																													`select-product${index}-variant-section`
																												).value,
																												secret_key
																											).toString(
																												CryptoJS.enc.Utf8
																											)
																									  ).id
																									: document.getElementById(
																											`default-product${index}-variant-id`
																									  ).value,
																								document.getElementById(
																									`input-section${index}`
																								).innerHTML
																							);
																						}
																					}}
																				>
																					<BiMinus />
																				</button>
																				<span
																					id={`input-section${index}`}
																				></span>
																				<button
																					type="button"
																					onClick={() => {
																						var val = document.getElementById(
																							`input-section${index}`
																						).innerHTML;
																						if (
																							val <
																							product.total_allowed_quantity
																						) {
																							document.getElementById(
																								`input-section${index}`
																							).innerHTML = parseInt(val) + 1;
																							addtoCart(
																								product.id,
																								product.variants.length > 1
																									? JSON.parse(
																											CryptoJS.AES.decrypt(
																												document.getElementById(
																													`select-product${index}-variant-section`
																												).value,
																												secret_key
																											).toString(
																												CryptoJS.enc.Utf8
																											)
																									  ).id
																									: document.getElementById(
																											`default-product${index}-variant-id`
																									  ).value,
																								document.getElementById(
																									`input-section${index}`
																								).innerHTML
																							);
																						}
																					}}
																				>
																					<BsPlus />{" "}
																				</button>
																			</div>
																		</div>

																		<div className="dropup share">
																			<button
																				type="button"
																				className="w-100 h-100"
																				data-bs-toggle="dropdown"
																				aria-expanded="false"
																			>
																				<BsShare />
																			</button>

																			<ul className="dropdown-menu">
																				<li className="dropDownLi">
																					<WhatsappShareButton
																						url={`${share_parent_url}/${product.slug}`}
																					>
																						<WhatsappIcon
																							size={32}
																							round={true}
																						/>{" "}
																						<span>WhatsApp</span>
																					</WhatsappShareButton>
																				</li>
																				<li className="dropDownLi">
																					<TelegramShareButton
																						url={`${share_parent_url}/${product.slug}`}
																					>
																						<TelegramIcon
																							size={32}
																							round={true}
																						/>{" "}
																						<span>Telegram</span>
																					</TelegramShareButton>
																				</li>
																				<li className="dropDownLi">
																					<FacebookShareButton
																						url={`${share_parent_url}/${product.slug}`}
																					>
																						<FacebookIcon
																							size={32}
																							round={true}
																						/>{" "}
																						<span>Facebook</span>
																					</FacebookShareButton>
																				</li>
																				<li>
																					<button
																						type="button"
																						onClick={() => {
																							navigator.clipboard.writeText(
																								`${share_parent_url}/${product.slug}`
																							);
																							toast.success(
																								"Copied Succesfully!!"
																							);
																						}}
																						className="react-share__ShareButton"
																					>
																						{" "}
																						<BiLink /> Copy Link
																					</button>
																				</li>
																			</ul>
																		</div>
																	</div>
																</>
															) : (
																<></>
															)}
														</div>
													</div>
												))}
											</div>

											<div>
												<Pagination
													activePage={currPage}
													itemsCountPerPage={total_products_per_page}
													totalItemsCount={totalProducts}
													pageRangeDisplayed={5}
													onChange={handlePageChange.bind(this)}
												/>
											</div>
											<QuickViewModal
												selectedProduct={selectedProduct}
												setselectedProduct={setselectedProduct}
											/>
										</div>
									) : (
										<div className="no-product">
											<img
												src={No_Orders}
												alt="no-product"
												className="img-fluid"
											></img>
											<p>No Products Found</p>
										</div>
									)}
								</>
							)}
						</div>
					</div>
				</div>
			</section>
		</>
	);
};

export default ProductList;
