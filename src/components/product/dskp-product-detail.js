import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BiLink, BiMinus } from "react-icons/bi";
import { FaRupeeSign } from "react-icons/fa";
import {
	FacebookIcon,
	FacebookShareButton,
	TelegramIcon,
	TelegramShareButton,
	WhatsappIcon,
	WhatsappShareButton,
} from "react-share";
import { BsHeart, BsHeartFill, BsPlus } from "react-icons/bs";
import { toast } from "react-toastify";
import Cookies from "universal-cookie";
import ResponsiveCarousel from "../shared/responsive-carousel/responsive-carousel";
import api from "../../api/api";
import { ActionTypes } from "../../model/action-type";
import TrackingService from "../../services/trackingService";
import {
	AddProductToCart,
	DecrementProduct,
	IncrementProduct,
} from "../../services/cartService";
import styles from "./dskp-product-detail.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faIndianRupee } from "@fortawesome/free-solid-svg-icons";

const DskpProductDetail = ({
	images,
	mainimage = "https://encrypted-tbn2.gstatic.com/licensed-image?q=tbn:ANd9GcQ9V9HCp5iiSLSve8c-OsHCt_xBkp0Q4j-RrM-m1IIS9IOMb6nzs8gipQGg_TCe4mOsxTGXJ8l5vY02K4A",
	productbrand,
	setmainimage = () => {},
	addtoCart = () => {},
	productdata,
	productTriggered,
	setProductTriggered = () => {},
	removefromCart = () => {},
	getProductVariants = () => {},
}) => {
	const cookies = new Cookies();
	const dispatch = useDispatch();
	const favorite = useSelector((state) => state.favorite);
	const city = useSelector((state) => state.city);

	const [isCart, setIsCart] = useState(false);
	const [productInCartCount, setProductInCartCount] = useState(0);
	const user = useSelector((state) => state.user);
	const trackingService = new TrackingService();

	const [descriptionHeight, setDescriptionHeight] = useState({
		height: "50px",
		overflow: "hidden",
	});
	const [featureHeight, setFeatureHeight] = useState({
		height: "50px",
		overflow: "hidden",
	});
	const [viewMore, setViewMore] = useState({
		description: true,
		feature: true,
	});

	//Add to favorite
	const addToFavorite = async (product_id) => {
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
							if (res.status === 1)
								dispatch({ type: ActionTypes.SET_FAVORITE, payload: res });
						});
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

	const AddProductToCart1 = () => {
		if (cookies.get("jwt_token") !== undefined) {
			setIsCart(true);
			setProductInCartCount(1);
			addtoCart(
				productdata,
				JSON.parse(
					document.getElementById(`select-product-variant-productdetail`).value
				).id,
				1
			);
		} else {
			trackingService.trackCart(
				productdata,
				1,
				user.status === "loading" ? "" : user.user.email
			);
			const isAdded = AddProductToCart(productdata, 1);
			if (isAdded) {
				setIsCart(true);
				setProductInCartCount(1);
				setProductTriggered(!productTriggered);
			}
		}
	};

	const handleDecrement = () => {
		var val = productInCartCount;

		if (cookies.get("jwt_token") !== undefined) {
			if (val === 1) {
				setProductInCartCount(0);
				setIsCart(false);
				removefromCart(
					productdata,
					JSON.parse(
						document.getElementById(`select-product-variant-productdetail`)
							.value
					).id
				);
			} else {
				setProductInCartCount(val - 1);
				addtoCart(
					productdata,
					JSON.parse(
						document.getElementById(`select-product-variant-productdetail`)
							.value
					).id,
					val - 1
				);
			}
		} else {
			trackingService.trackCart(
				productdata,
				parseInt(val) - 1,
				user.status === "loading" ? "" : user.user.email
			);

			const isDecremented = DecrementProduct(productdata.id, productdata);
			if (isDecremented) {
				setProductInCartCount(val - 1);
			} else {
				setProductInCartCount(0);
				setIsCart(false);
			}
			setProductTriggered(!productTriggered);
		}
	};

	const handleIncrement = () => {
		var val = productInCartCount;

		if (cookies.get("jwt_token") !== undefined) {
			if (val < productdata.total_allowed_quantity) {
				setProductInCartCount(val + 1);
				addtoCart(
					productdata,
					JSON.parse(
						document.getElementById(`select-product-variant-productdetail`)
							.value
					).id,
					val + 1
				);
			}
		} else {
			trackingService.trackCart(
				productdata,
				parseInt(val) + 1,
				user.status === "loading" ? "" : user.user.email
			);

			const isIncremented = IncrementProduct(
				productdata.id,
				productdata,
				1,
				false
			);
			if (isIncremented) {
				setProductInCartCount(val + 1);
			}
			setProductTriggered(!productTriggered);
		}
	};

	const expandDetails = (type = "") => {
		if (type === "description") {
			if (viewMore.description) {
				setDescriptionHeight({ height: "100%", overflow: "auto" });
			} else {
				setDescriptionHeight({ height: "50px", overflow: "hidden" });
			}
			setViewMore((prev) => ({ ...prev, description: !viewMore.description }));
		} else if (type === "feature") {
			if (viewMore.feature) {
				setFeatureHeight({ height: "100%", overflow: "auto" });
			} else {
				setFeatureHeight({ height: "50px", overflow: "hidden" });
			}
			setViewMore((prev) => ({ ...prev, feature: !viewMore.feature }));
		}
	};
	return (
		<div className={styles.detailWrapper}>
			<div>
				{images.length > 0 &&
					images.map((image, index) => (
						<div key={index}>
							<div
								className={styles.subImages}
								onClick={() => {
									setmainimage(image);
								}}
							>
								<img className={styles.subImg} data-src={image} alt="product" />
							</div>
						</div>
					))}
			</div>
			<div className={styles.cardWrapper}>
				<img src={mainimage} className={styles.mainImage} alt="main-product" />
			</div>
			<div className={styles.bodyWrapper}>
				{/* {Object.keys(productbrand).length === 0 ? null : ( */}
				<div>
					<span className={styles.brandLabel}>Brand:</span>
					<span className={styles.brandValue}>LG</span>
				</div>
				{/* )} */}

				<p className={styles.productName}>
					LG 81.28 cm (32 inch) HD LED Smart TV, 32LM562BPTA
				</p>
				<p className={styles.discountedPrice}>
					<FontAwesomeIcon className={styles.rupeeIcon} icon={faIndianRupee} />{" "}
					53,900 <span className={styles.discountPercentage}>36% Off</span>
				</p>
				<p className={styles.actualPrice}>
					M.R.P:{" "}
					<span className={styles.strikeOff}>
						<FontAwesomeIcon
							className={styles.rupeeIcon}
							icon={faIndianRupee}
						/>{" "}
						85,900
					</span>{" "}
					(Incl. of all taxes)
				</p>
				<hr />
				<div className={styles.descriptionWrapper}>
					<h2 className={styles.subHeader}>Description</h2>
					<div
						className={styles.descriptionBodyWrapper}
						style={{
							height: descriptionHeight.height,
							overflow: descriptionHeight.overflow,
						}}
					>
						<p className={styles.descriptionBody}>
							Carry and flaunt it wherever you go, at just 1.7 kgs and a
							thinness of 19.9 mm, the only weight you'll feel is its
							performance.Carry and flaunt it wherever you go, at just 1.7 kgs
							and a thinness of 19.9 mm, the only weight you'll feel is its
							performance.Carry and flaunt it wherever you go, at just 1.7 kgs
							and a thinness of 19.9 mm, the only weight you'll feel is its
							performance.Carry and flaunt it wherever you go, at just 1.7 kgs
							and a thinness of 19.9 mm, the only weight you'll feel is its
							performance.Carry and flaunt it wherever you go, at just 1.7 kgs
							and a thinness of 19.9 mm, the only weight you'll feel is its
							performance.Carry and flaunt it wherever you go, at just 1.7 kgs
							and a thinness of 19.9 mm, the only weight you'll feel is its
							performance. Carry and flaunt it wherever you go, at just 1.7 kgs
							and a thinness of 19.9 mm, the only weight you'll feel is its
							performance.Carry and flaunt it wherever you go, at just 1.7 kgs
							and a thinness of 19.9 mm, the only weight you'll feel is its
							performance.Carry and flaunt it wherever you go, at just 1.7 kgs
							and a thinness of 19.9 mm, the only weight you'll feel is its
							performance.Carry and flaunt it wherever you go, at just 1.7 kgs
							and a thinness of 19.9 mm, the only weight you'll feel is its
							performance.Carry and flaunt it wherever you go, at just 1.7 kgs
							and a thinness of 19.9 mm, the only weight you'll feel is its
							performance.Carry and flaunt it wherever you go, at just 1.7 kgs
							and a thinness of 19.9 mm, the only weight you'll feel is its
							performance.Carry and flaunt it wherever you go, at just 1.7 kgs
							and a thinness of 19.9 mm, the only weight you'll feel is its
							performance.Carry and flaunt it wherever you go, at just 1.7 kgs
							and a thinness of 19.9 mm, the only weight you'll feel is its
							performance.Carry and flaunt it wherever you go, at just 1.7 kgs
							and a thinness of 19.9 mm, the only weight you'll feel is its
							performance.Carry and flaunt it wherever you go, at just 1.7 kgs
							and a thinness of 19.9 mm, the only weight you'll feel is its
							performance.Carry and flaunt it wherever you go, at just 1.7 kgs
							and a thinness of 19.9 mm, the only weight you'll feel is its
							performance.Carry and flaunt it wherever you go, at just 1.7 kgs
							and a thinness of 19.9 mm, the only weight you'll feel is its
							performance.
						</p>
					</div>
					<button
						className={styles.viewMoreBtn}
						onClick={() => {
							expandDetails("description");
						}}
					>
						{viewMore.description ? "View More" : "View Less"}
					</button>
					{/* <h2 className={styles.subHeader}>Feature & Details</h2> */}
					{/* <div
            className={styles.descriptionBodyWrapper}
            style={{
              height: featureHeight.height,
              overflow: featureHeight.overflow,
            }}
          >
            <p className={styles.descriptionBody}>
              Carry and flaunt it wherever you go, at just 1.7 kgs and 
            </p>
          </div>
          <button
            className={styles.viewMoreBtn}
            onClick={() => {
              expandDetails("feature");
            }}
          >
            {viewMore.feature ? "View More" : "View Less"}
          </button> */}
				</div>
			</div>
		</div>
	);
};

export default DskpProductDetail;
