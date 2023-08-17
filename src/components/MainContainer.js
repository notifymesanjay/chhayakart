import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineClose } from "react-icons/ai";
import { ActionTypes } from "../model/action-type";
import TrackingService from "../services/trackingService";
import api from "../api/api";
import ProductContainer from "./product/ProductContainer";
import Loader from "./loader/Loader";
import ShopByCategory from "./category/Category";
import SearchInput from "./shared/inputs/search-input";
import { useResponsive } from "./shared/use-responsive";
import styles from "./main-container.module.scss";
import { useLocation, useNavigate } from "react-router-dom";
import ShopByRegion from "./product/region";
import GetApp from "./homecontainer/get-app";
import Footer from "./footer/new-footer";

const shopByRegion = "SHOP BY REGION";

const MainContainer = ({
	productTriggered,
	setProductTriggered = () => {},
	setSelectedFilter = () => {},
}) => {
	const { isSmScreen } = useResponsive();
	const dispatch = useDispatch();

	const modalRef = useRef();
	const navigate = useNavigate();
	const curr_url = useLocation();

	const user = useSelector((state) => state.user);
	const city = useSelector((state) => state.city);
	const shop = useSelector((state) => state.shop);
	const setting = useSelector((state) => state.setting);
	const [categories, setCategories] = useState([]);
	const [searchText, setSearchText] = useState("");

	const fetchShop = (city_id, latitude, longitude) => {
		api
			.getShop(city_id, latitude, longitude)
			.then((response) => response.json())
			.then((result) => {
				if (result.status === 1) {
					const dataToBeSorted = result.data.category;
					//sorting of items lexographically..
					result.data.category = [...dataToBeSorted].sort((a, b) =>
						a.name > b.name ? 1 : -1
					);
					dispatch({ type: ActionTypes.SET_SHOP, payload: result.data });
				}
			});
	};

	const onSearchText = (event) => {
		const searchValue = event.target.value;
		setSearchText(searchValue);
		if (searchText !== "") {
			dispatch({
				type: ActionTypes.SET_FILTER_SEARCH,
				payload: searchValue,
			});
		}
	};

	const search = () => {
		if (curr_url.pathname !== "/products") {
			navigate("/products");
		}
	};

	useEffect(() => {
		if (city.city !== null && shop.shop === null) {
			fetchShop(city.city.id, city.city.latitude, city.city.longitude);
		}
	}, [city]);

	useEffect(() => {
		if (shop.shop.category.length > 0) {
			const categoryList = shop.shop.category;
			let finalCategoryList = [];
			categoryList.map((category) => {
				if (
					category.has_child &&
					category.name.toLowerCase() !== shopByRegion.toLowerCase()
				) {
					finalCategoryList.push(category);
				}
			});
			finalCategoryList.sort((a, b) => a.id - b.id);
			setCategories(finalCategoryList);
		}
	}, [shop.shop]);

	useEffect(() => {
		if (modalRef.current && setting.setting !== null) {
			modalRef.current.click();
		}
	}, [setting]);

	useEffect(() => {
		const trackingService = new TrackingService();
		trackingService.trackHomePage(
			user.status === "loading" ? "" : user.user.email
		);
	}, []);

	return (
		<>
			{setting.setting === null ? (
				<Loader screen="full" />
			) : (
				<>
					{!isSmScreen && (
						<div className={styles.searchWrapper}>
							<h1 className={styles.searchHeader}>
								Self-Help Groups, Women Entrepreneurs & Rural
								Manufacturers Products
							</h1>
							<SearchInput
								inputClass={styles.searchBar}
								onSearchText={onSearchText}
								searchText={searchText}
								onBtnClick={search}
							/>
						</div>
					)}
					{categories.length > 0 && (
						<ShopByCategory
							categories={categories}
							setSelectedFilter={setSelectedFilter}
						/>
					)}
					<ProductContainer
						productTriggered={productTriggered}
						setProductTriggered={setProductTriggered}
						setSelectedFilter={setSelectedFilter}
					/>
					{!isSmScreen && (
						<div className="container">
							<GetApp />
						</div>
					)}

					{parseInt(setting.setting.popup_enabled) === 1 ? (
						<>
							<button
								type="button"
								className="d-none"
								ref={modalRef}
								data-bs-toggle="modal"
								data-bs-target="#myModal"
							></button>
							<div id="myModal" className="modal fade" role="dialog">
								<div className="modal-dialog modal-dialog-centered">
									<div
										className="modal-content"
										style={{ padding: "0", minWidth: "30vw" }}
									>
										<button
											type="button"
											className=""
											data-bs-dismiss="modal"
											aria-label="Close"
											style={{
												position: "absolute",
												top: "-30px",
												right: "0",
												background: "none",
											}}
										>
											<AiOutlineClose fill="white" fontSize={"3.5rem"} />
										</button>
										<img
											data-src={setting.setting.popup_image}
											className="lazyload"
											alt="image"
											onClick={() => {
												window.location = setting.setting.popup_url;
											}}
											style={{ width: "100%", height: "100%" }}
										></img>
									</div>
								</div>
							</div>
						</>
					) : null}
				</>
			)}
		</>
	);
};

export default MainContainer;
