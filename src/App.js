import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Header from "./components/header/Header";
import MainContainer from "./components/MainContainer";
import { AnimatePresence } from "framer-motion";
import { Footer } from "./components/footer/Footer";
import ProfileDashboard from "./components/profile/ProfileDashboard";
import Cookies from "universal-cookie";
import { useDispatch, useSelector } from "react-redux";
import { ActionTypes } from "./model/action-type";
import api from "./api/api";
import ScrollToTop from "./components/./shared/./ScrollToTop";
import { BsArrowUpSquareFill } from "react-icons/bs";
//react-toast
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import ShowAllCategories from "./components/category/ShowAllCategories";
import ProductList from "./components/product/ProductList";
import ProductDetails from "./components/product/ProductDetails";
import Productdetails from "./components/product/ProductdetailsMobile";
import ViewCart from "./components/cart/ViewCart";
import Wishlist from "./components/favorite/Wishlist";
import Checkout from "./components/checkout/Checkout";
import Transaction from "./components/transaction/Transaction";
import Notification from "./components/notification/Notification";
import About from "./components/about/About";
import Contact from "./components/contact/Contact";
import FAQ from "./components/faq/FAQ";
import Loader from "./components/loader/Loader";
import Terms from "./components/terms/Terms";
import Policy from "./components/policy/Policy";
import Return from "./components/policy/return";
import NotFound from "./components/404/NotFound";
import SubCategory from "./components/product/sub-category";
import DskpFooter from "./components/footer/new-footer";
import { useResponsive } from "./components/shared/use-responsive";
import Success from "./components/checkout/Success";
import Order from "./components/order/Order";
function App() {
	//initialize cookies
	const cookies = new Cookies();

	const { isSmScreen } = useResponsive();

	const dispatch = useDispatch();

	const city = useSelector((state) => state.city);
	const shop = useSelector((state) => state.shop);
	const setting = useSelector((state) => state.setting);
	const [productTriggered, setProductTriggered] = useState(false);
	const [selectedFilter, setSelectedFilter] = useState(0);

	const getCurrentUser = (token) => {
		api
			.getUser(token)
			.then((response) => response.json())
			.then((result) => {
				if (result.status === 1) {
					dispatch({
						type: ActionTypes.SET_CURRENT_USER,
						payload: result.user,
					});
				}
			});
	};

	//fetching app-settings
	const getSetting = async () => {
		await api
			.getSettings()
			.then((response) => response.json())
			.then((result) => {
				if (result.status === 1) {
					dispatch({ type: ActionTypes.SET_SETTING, payload: result.data });
				}
			})
			.catch((error) => {});
	};

	useEffect(() => {
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
		if (city.city !== null) {
			fetchShop(city.city.id, city.city.latitude, city.city.longitude);
		} else {
			let data = {
				id: 4,
				name: "Maharashtra",
				state: "Maharashtra",
				formatted_address: "Maharashtra, India",
				latitude: "19.7514798",
				longitude: "75.7138884",
				min_amount_for_free_delivery: "1000",
				delivery_charge_method: "fixed_charge",
				fixed_charge: "40",
				per_km_charge: "0",
				time_to_travel: "100",
				max_deliverable_distance: "50000",
				distance: "992.6918238833864",
			};
			dispatch({ type: ActionTypes.SET_CITY, payload: data });
		}
	}, [city]);

	//authenticate current user
	useEffect(() => {
		if (cookies.get("jwt_token") !== undefined) {
			getCurrentUser(cookies.get("jwt_token"));
		}
		getSetting();
	}, []);

	// document.addEventListener('scroll', () => {
	//   if (window.pageYOffset > 100) {
	//     document.getElementById('toTop').classList.add('active')
	//   }
	//   else {
	//     document.getElementById('toTop').classList.remove('active')

	//   }
	// })

	return (
		<AnimatePresence>
			<div className="h-auto">
				<ScrollToTop />
				<Header
					productTriggered={productTriggered}
					setProductTriggered={setProductTriggered}
				/>
				{city.city === null ||
				shop.shop === null ||
				setting.setting === null ? (
					<>
						<Loader screen="full" />
					</>
				) : (
					<>
						<main id="main" className="main-app">
							<Routes>
								<Route exact={true} path="/cart" element={<ViewCart />}></Route>
								<Route
									exact={true}
									path="/checkout"
									element={<Checkout productTriggered={productTriggered} />}
								></Route>

								<Route
									exact={true}
									path="/success"
									element={
										<Success
											productTriggered={productTriggered}
											setProductTriggered={setProductTriggered}
										/>
									}
								></Route>

								<Route
									exact={true}
									path="/wishlist"
									element={<Wishlist />}
								></Route>

								<Route exact={true} path="/orders" element={<Order />}></Route>

								<Route
									exact={true}
									path="/profile"
									element={<ProfileDashboard />}
								></Route>
								<Route
									exact={true}
									path="/notification"
									element={<Notification />}
								></Route>
								<Route
									exact={true}
									path="/categories"
									element={<ShowAllCategories />}
								></Route>
								<Route
									exact={true}
									path="/products"
									element={
										<ProductList
											productTriggered={productTriggered}
											setProductTriggered={setProductTriggered}
											selectedFilter={selectedFilter}
											setSelectedFilter={setSelectedFilter}
										/>
									}
								></Route>
								<Route
									exact={true}
									path="/subCategory/:slug/"
									element={
										<SubCategory
											productTriggered={productTriggered}
											setProductTriggered={setProductTriggered}
											selectedFilter={selectedFilter}
											setSelectedFilter={setSelectedFilter}
										/>
									}
								></Route>
								<Route
									exact={true}
									path="/subCategory/:slug/:title"
									element={
										<SubCategory
											productTriggered={productTriggered}
											setProductTriggered={setProductTriggered}
											selectedFilter={selectedFilter}
											setSelectedFilter={setSelectedFilter}
										/>
									}
								></Route>
								<Route
									exact={true}
									path="/product"
									element={
										<ProductDetails
											productTriggered={productTriggered}
											setProductTriggered={setProductTriggered}
										/>
									}
								></Route>
								<Route
									exact={true}
									path="/product/:id/:slug"
									element={
										<ProductDetails
											productTriggered={productTriggered}
											setProductTriggered={setProductTriggered}
										/>
									}
								></Route>
								<Route
									exact={true}
									path="/product/:slug"
									element={
										<ProductDetails
											productTriggered={productTriggered}
											setProductTriggered={setProductTriggered}
										/>
									}
								></Route>
								<Route
									exact={true}
									path="/transactions"
									element={<Transaction />}
								></Route>
								<Route exact={true} path="/about" element={<About />}></Route>
								<Route
									exact={true}
									path="/contact"
									element={<Contact />}
								></Route>
								<Route exact={true} path="/faq" element={<FAQ />}></Route>
								<Route exact={true} path="/terms" element={<Terms />}></Route>
								<Route
									exact={true}
									path="/policy/:policy_type"
									element={<Policy />}
								></Route>
								<Route exact={true} path="/return" element={<Return />}></Route>
								<Route
									exact={true}
									path="/"
									element={
										<MainContainer
											productTriggered={productTriggered}
											setProductTriggered={setProductTriggered}
											setSelectedFilter={setSelectedFilter}
										/>
									}
								></Route>

								<Route exact={true} path="*" element={<NotFound />}></Route>
							</Routes>

							<button
								type="button"
								id="toTop"
								onClick={() => {
									window.scrollTo({ top: 0, behavior: "smooth" });
								}}
							>
								<BsArrowUpSquareFill
									fontSize={"6rem"}
									fill="var(--secondary-color)"
								/>
							</button>
						</main>
					</>
				)}
				{isSmScreen ? (
					<Footer />
				) : (
					<DskpFooter setSelectedFilter={setSelectedFilter} />
				)}

				<ToastContainer toastClassName="toast-container-class" />
			</div>
		</AnimatePresence>
	);
}

export default App;
