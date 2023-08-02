import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineCloseCircle } from "react-icons/ai";
import Pagination from "react-js-pagination";
import api from "../../api/api";
import { ActionTypes } from "../../model/action-type";
import { setSelectedProductId } from "../../utils/manageLocalStorage";
import No_Orders from "../../utils/zero-state-screens/No_Orders.svg";
import logoPath from "../../utils/logo_egrocer.svg";
import Loader from "../loader/Loader";
import QuickViewModal from "./QuickViewModal";
import ListCard from "./list-card";
import ProductFilterDropDown from "./product-filter-dropdown";
import ProductFilter from "./product-filter";
import { useResponsive } from "../shared/use-responsive";
const total_products_per_page = 12;

const ProductList = ({ productTriggered, setProductTriggered = () => {} }) => {
	const dispatch = useDispatch();
	const sliderRef = useRef();
	const closeCanvas = useRef();
	const { isSmScreen } = useResponsive();

	const category = useSelector((state) => state.category);
	const city = useSelector((state) => state.city);
	const filter = useSelector((state) => state.productFilter);

	const [brands, setbrands] = useState(null);
	const [productresult, setproductresult] = useState([]);
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
	const [isLoader, setisLoader] = useState(false);
	const [showViewModal, setShowViewModal] = useState(false);

	const getBrandsApi = () => {
		api
			.getBrands()
			.then((response) => response.json())
			.then((result) => {
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
							.catch((error) => {});
					});
					setbrands(result.data);
				} else {
				}
			})
			.catch((error) => {});
	};

	const getProductfromApi = () => {
		setproductresult([]);
		setisLoader(true);
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
				setisLoader(false);
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
			})
			.catch(() => {
				setisLoader(false);
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

	//filters
	const filterProductsFromApi = async (filter) => {
		setproductresult([]);
		setisLoader(true);
		await api
			.getProductbyFilter(
				city.city.id,
				city.city.latitude,
				city.city.longitude,
				filter
			)
			.then((response) => response.json())
			.then((result) => {
				setisLoader(false);
				if (result.status === 1) {
					setminmaxTotalPrice({
						total_min_price: result.total_min_price,
						total_max_price: result.total_max_price,
						min_price: result.min_price,
						max_price: result.max_price,
					});
					//  const dataToBeSorted = result.data;
					//  //sorting of items lexographically..
					//  const strAscending = [...dataToBeSorted].sort((a, b) =>
					//  	a.name > b.name ? 1 : -1
					//  );
					// const filtered_data = strAscending;

					setproductresult(result.data);
					setproductSizes(result.sizes);

					settotalProducts(result.total);
				} else {
					setproductresult([]);
					settotalProducts(0);
				}
			})
			.catch((error) => {
				setisLoader(false);
			});
	};

	//page change
	const handlePageChange = (pageNum) => {
		setcurrPage(pageNum);
		setoffset(pageNum * total_products_per_page - total_products_per_page);
	};

	return (
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
						>
							<AiOutlineCloseCircle />
						</button>
					</div>
					<ProductFilter
						category={category}
						closeCanvas={closeCanvas}
						brands={brands}
						setcurrPage={setcurrPage}
						setoffset={setoffset}
						minmaxTotalPrice={minmaxTotalPrice}
						brandproductcountmap={brandproductcountmap}
					/>
				</div>

				{/* filter section */}
				<div
					className="flex-column col-2 col-md-3 col-md-auto filter-container hide-mobile-screen"
					style={{ gap: "30px" }}
				>
					<ProductFilter
						category={category}
						closeCanvas={closeCanvas}
						brands={brands}
						setcurrPage={setcurrPage}
						setoffset={setoffset}
						minmaxTotalPrice={minmaxTotalPrice}
						brandproductcountmap={brandproductcountmap}
					/>
				</div>

				{/* products according to applied filter */}
				<div
					className="d-flex flex-column col-md-9 col-12 h-100 productList_container"
					style={{ gap: "20px;" }}
				>
					<div className="row">
						<ProductFilterDropDown totalProducts={totalProducts} />

						{isLoader ? (
							<Loader background="none" width="100%" height="75vh" />
						) : (
							<>
								{productresult.length > 0 ? (
									<div className="h-100 productList_content">
										<div className="row flex-wrap">
											{productresult.map((product, index) => (
												<ListCard
													index={index}
													product={product}
													setSelectedProductId={setSelectedProductId}
													productTriggered={productTriggered}
													setProductTriggered={setProductTriggered}
													setisLoader={setisLoader}
													setselectedProduct={setselectedProduct}
													setShowViewModal={setShowViewModal}
												/>
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
										{showViewModal && (
											<QuickViewModal
												selectedProduct={selectedProduct}
												setselectedProduct={setselectedProduct}
												productTriggered={productTriggered}
												setProductTriggered={setProductTriggered}
												isOpenModal={showViewModal}
												setIsOpenModal={setShowViewModal}
											/>
										)}
									</div>
								) : (
									<div className="no-product">
										<img
											data-src={No_Orders}
											alt="no-product"
											className="img-fluid lazyloader"
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
	);
};

export default ProductList;
