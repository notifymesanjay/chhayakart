import React, { useState, useEffect } from "react";
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
import { BsHeart, BsHeartFill, BsPlus, BsShare } from "react-icons/bs";
import { toast } from "react-toastify";
import Cookies from "universal-cookie";
import ResponsiveCarousel from "../shared/responsive-carousel/responsive-carousel";
import SpecificSubCategory from "../specific-sub-category";
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
import {
  faAngleDoubleRight,
  faIndianRupee,
  faPlayCircle
} from "@fortawesome/free-solid-svg-icons";
import { IoCartOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import BulkOrder from "./bulk-order";

const DskpProductDetail = ({
  images,
  videos,
  mainimage = "https://encrypted-tbn2.gstatic.com/licensed-image?q=tbn:ANd9GcQ9V9HCp5iiSLSve8c-OsHCt_xBkp0Q4j-RrM-m1IIS9IOMb6nzs8gipQGg_TCe4mOsxTGXJ8l5vY02K4A",
  productbrand,
  setmainimage = () => {},
  slug,
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
  const share_parent_url = "https://chhayakart.com/product";
  const [isCart, setIsCart] = useState(false);
  const [productInCartCount, setProductInCartCount] = useState(0);
  const user = useSelector((state) => state.user);
  const trackingService = new TrackingService();

	const [descriptionHeight, setDescriptionHeight] = useState({
		height: "50px",
		overflow: "hidden",
	});
	const [viewMore, setViewMore] = useState({
		description: true,
		feature: true,
	});
	const [isOpenBulk, setIsOpenBulk] = useState(false);
	const [isBulkOrder, setIsBulkOrder] = useState(false);
	//  Add to favorite
	const addToFavorite = async (productdata) => {
		await api
			.addToFavotite(cookies.get("jwt_token"), productdata.id)
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
	const removefromFavorite = async (productdata) => {
		await api
			.removeFromFavorite(cookies.get("jwt_token"), productdata.id)
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

  // const AddProductToCart1 = (quantity) => {
  // 	if (cookies.get("jwt_token") !== undefined) {
  // 		setIsCart(true);
  // 		setProductInCartCount(1);
  // 		addtoCart(
  // 			productdata,
  // 			JSON.parse(
  // 				document.getElementById(`select-product-variant-productdetail`).value
  // 			).id,
  // 			1
  // 		);
  // 	} else {
  // 		trackingService.trackCart(
  // 			productdata,
  // 			1,
  // 			user.status === "loading" ? "" : user.user.email
  // 		);
  // 		const isAdded = AddProductToCart(productdata, 1);
  // 		if (isAdded) {
  // 			setIsCart(true);
  // 			setProductInCartCount(1);
  // 			setProductTriggered(!productTriggered);
  // 		}
  // 	}
  // };

  // const handleDecrement = () => {
  // 	var val = productInCartCount;

  // 	if (cookies.get("jwt_token") !== undefined) {
  // 		if (val === 1) {
  // 			setProductInCartCount(0);
  // 			setIsCart(false);
  // 			removefromCart(
  // 				productdata,
  // 				JSON.parse(
  // 					document.getElementById(`select-product-variant-productdetail`)
  // 						.value
  // 				).id
  // 			);
  // 		} else {
  // 			setProductInCartCount(val - 1);
  // 			addtoCart(
  // 				productdata,
  // 				JSON.parse(
  // 					document.getElementById(`select-product-variant-productdetail`)
  // 						.value
  // 				).id,
  // 				val - 1
  // 			);
  // 		}
  // 	} else {
  // 		trackingService.trackCart(
  // 			productdata,
  // 			parseInt(val) - 1,
  // 			user.status === "loading" ? "" : user.user.email
  // 		);

  // 		const isDecremented = DecrementProduct(productdata.id, productdata);
  // 		if (isDecremented) {
  // 			setProductInCartCount(val - 1);
  // 		} else {
  // 			setProductInCartCount(0);
  // 			setIsCart(false);
  // 		}
  // 		setProductTriggered(!productTriggered);
  // 	}
  // };

  // const handleIncrement = () => {
  // 	var val = productInCartCount;

  // 	if (cookies.get("jwt_token") !== undefined) {
  // 		if (val < productdata.total_allowed_quantity) {
  // 			setProductInCartCount(val + 1);
  // 			addtoCart(
  // 				productdata,
  // 				JSON.parse(
  // 					document.getElementById(`select-product-variant-productdetail`)
  // 						.value
  // 				).id,
  // 				val + 1
  // 			);
  // 		}
  // 	} else {
  // 		trackingService.trackCart(
  // 			productdata,
  // 			parseInt(val) + 1,
  // 			user.status === "loading" ? "" : user.user.email
  // 		);

  // 		const isIncremented = IncrementProduct(
  // 			productdata.id,
  // 			productdata,
  // 			1,
  // 			false
  // 		);
  // 		if (isIncremented) {
  // 			setProductInCartCount(val + 1);
  // 		}
  // 		setProductTriggered(!productTriggered);
  // 	}
  // };

  const DirectAddProductToCart = (qunatity) => {
    if (cookies.get("jwt_token") !== undefined) {
      setIsCart(true);
      setProductTriggered(!productTriggered);
      setProductInCartCount(parseInt(qunatity));
      addtoCart(productdata, productdata.variants[0].id, parseInt(qunatity));
    } else {
      const isAdded = AddProductToCart(productdata, parseInt(qunatity));

      trackingService.trackCart(
        productdata,
        parseInt(qunatity),
        user.status === "loading" ? "" : user.user.email
      );
      if (isAdded) {
        setIsCart(true);
        setProductInCartCount(parseInt(qunatity));
        setProductTriggered(!productTriggered);
      }
    }
  };

  const handleDecrement = () => {
    var val = productInCartCount;
    if (cookies.get("jwt_token") !== undefined) {
      if (val > 0) {
        if (val === 1) {
          setProductInCartCount(0);
          setIsCart(false);
          removefromCart(productdata, productdata.variants[0].id);
        } else {
          setProductInCartCount(val - 1);
          addtoCart(productdata, productdata.variants[0].id, val - 1);
        }
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

  const IncrementProduct1 = (val, index) => {
    if (cookies.get("jwt_token") !== undefined) {
      if (parseInt(val) < parseInt(productdata.total_allowed_quantity)) {
        setProductInCartCount(parseInt(val) + 1);
        addtoCart(productdata, productdata.variants[0].id, parseInt(val) + 1);
      } else {
        toast.error("Maximum Quantity Exceeded");
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
        val + 1,
        true
      );
      if (isIncremented) {
        setProductInCartCount(val + 1);
      }
      setProductTriggered(!productTriggered);
    }
  };
  const handleIncrement = () => {
    var val = productInCartCount;
    if (val >= Math.ceil(parseInt(productdata.total_allowed_quantity) / 2)) {
      setIsOpenBulk(true);
      setIsBulkOrder(false);
    } else {
      IncrementProduct1(val, 0);
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
    //   if (viewMore.feature) {
    //     setFeatureHeight({ height: "100%", overflow: "auto" });
    //   } else {
    //     setFeatureHeight({ height: "50px", overflow: "hidden" });
    //   }
    //   setViewMore((prev) => ({ ...prev, feature: !viewMore.feature }));
    }
  };

  function getId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    return (match && match[2].length === 11)
      ? match[2]
      : null;
  }

	return (
		<>
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
									<img
										className={styles.subImg}
										// data-src={image}
										src={image}
										alt="product"
									/>
								</div>
							</div>
						))}
					{
						videos.length > 0 && 
						<div
							className={styles.subImages}
							onClick={() => {
								setmainimage('video');
							}}
						>
							<div className="d-flex justify-content-center align-items-center bg-black h-100">
								<FontAwesomeIcon
									icon={faPlayCircle}
									className={styles.faPlayCircleIcon}
									/>
							</div>
						</div>
					}
				</div>
				<div className={styles.cardWrapper}>
					{
						mainimage === 'video' ? <div id="yt-embed-player" className="d-flex justify-content-center">
						<iframe src={function(){
							 let videoId = getId(videos[0]);
							 return "https://www.youtube.com/embed/" + videoId;
						}()} width={560} height={315} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
					  </div> : 
					<img
						src={mainimage}
						className={styles.mainImage}
						alt="main-product"
					/>}
				</div>

        <div className={styles.bodyWrapper}>
          {/* {Object.keys(productbrand).length === 0 ? null : ( */}

          <p className={styles.productName}>{productdata.name}</p>
          {/* )} */}
          {/* <div>
						<span className={styles.brandLabel}> SOLD BY</span>
						<span className={styles.brandValue}> {productbrand.name}</span>
					</div> */}

          <p className={styles.discountedPrice}>
            <FontAwesomeIcon
              className={styles.rupeeIcon}
              icon={faIndianRupee}
            />{" "}
            {productdata.variants[0].discounted_price}
            <span className={styles.discountPercentage}>
              {Math.round(
                parseFloat(
                  ((productdata.variants[0].price -
                    productdata.variants[0].discounted_price) *
                    100) /
                    productdata.variants[0].price
                )
              )}
              % off
            </span>
            <div className={styles.shareIcon}>
              <button
                class="btn btn-primary"
                type="button"
                data-bs-toggle="offcanvas"
                data-bs-target="#offcanvasExample"
                aria-controls="offcanvasExample"
              >
                <BsShare size={20} fill="white" />
              </button>
              <div
                class="offcanvas offcanvas-start"
                tabindex="-1"
                id="offcanvasExample"
                aria-labelledby="offcanvasExampleLabel"
              >
                <div class="offcanvas-body">
                  <div>
                    <h2> Share This product</h2>
                  </div>
                  <br />

                  <div className="share-product-container">
                    <ul className="share-product">
                      <li className="share-product-icon">
                        <WhatsappShareButton
                          url={`${share_parent_url}/${productdata.id}/${
                            slug.includes("/") ? slug.split("/")[0] : slug
                          }`}
                        >
                          <WhatsappIcon size={32} round={true} />
                        </WhatsappShareButton>
                      </li>
                      <li className="share-product-icon">
                        <TelegramShareButton
                          url={`${share_parent_url}/${productdata.id}/${
                            slug.includes("/") ? slug.split("/")[0] : slug
                          }`}
                        >
                          <TelegramIcon size={32} round={true} />
                        </TelegramShareButton>
                      </li>
                      <li className="share-product-icon">
                        <FacebookShareButton
                          url={`${share_parent_url}/${productdata.id}/${
                            slug.includes("/") ? slug.split("/")[0] : slug
                          }`}
                        >
                          <FacebookIcon size={32} round={true} />
                        </FacebookShareButton>
                      </li>
                      {/* <li className="share-product-icon">
										<button
											type="button"
											onClick={() => {
												navigator.clipboard.writeText(
													`${share_parent_url}/${productdata.id}/${
														slug.includes("/") ? slug.split("/")[0] : slug
													}`
												);
												//popup commented
												//	toast.success("Copied Succesfully!!");
											}}
										>
											{" "}
											<BiLink size={20} />
										</button>
									</li> */}
										</ul>
									</div>
								</div>
							</div>
						</div>
						<div className={styles.shareIcon}>
							{favorite.favorite &&
							favorite.favorite.data.some(
								(element) => element.id === productdata.id
							) ? (
								<button
									type="button"
									className="wishlist-product"
									onClick={() => {
										if (cookies.get("jwt_token") !== undefined) {
											removefromFavorite(productdata);
										} else {
											toast.error(
												"OOps! You need to login first to add to favourites"
											);
										}
									}}
								>
									<BsHeartFill fill="#F27100" />
								</button>
							) : (
								<button
									key={productdata.id}
									type="button"
									className="wishlist-product"
									onClick={() => {
										if (cookies.get("jwt_token") !== undefined) {
											addToFavorite(productdata);
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
					</p>

          <p className={styles.actualPrice}>
            M.R.P:{" "}
            <span className={styles.strikeOff}>
              <FontAwesomeIcon
                className={styles.rupeeIcon}
                icon={faIndianRupee}
              />{" "}
              {parseFloat(productdata.variants[0].price)}
            </span>{" "}
            (Incl. of all taxes)
          </p>

          <hr />
		  <div className={styles.deliverToWrapper}>
		  <h2 className={styles.subHeader}>Deliver to</h2>
		  <div>
			<div className={styles.descriptionTextCityDetails}>
				Pin 400020
				<span className={styles.descriptionTextCityName}>Mumbai</span>
			</div>
			<div className={styles.descriptionTextDeliveryDateSection}><span className={styles.descriptionTextInStock}>In Stock </span><span className={styles.descriptionTextDeliveryMessageSeparator}>| </span>{function () {
				const monthList = ["January","February","March","April","May","June","July","August","September","October","November","December"];
				const nth = (d) => {
				  if (d > 3 && d < 21) return `${d}th`;
				  switch (d % 10) {
					case 1:  return `${d}st`;
					case 2:  return `${d}nd`;
					case 3:  return `${d}rd`;
					default: return `${d}th`;
				  }
				};
				let d1 = new Date(), d2 = new Date();
				d1.setDate(d1.getDate()+4);
				d2.setDate(d2.getDate()+5);
				return `Delivery Between ${nth(d1.getDate())} ${(monthList[d1.getMonth()]).substring(0,3)} to ${nth(d2.getDate())} ${(monthList[d2.getMonth()]).substring(0,3)}`;
			}()}</div>
			<div className={styles.descriptionTextAcrossIndia}>(Delivery across India to your town in 7 to 8 days)</div>
		  </div>
		  </div>
		  <hr/>

					<div className={styles.sellerName}>
						<span className={styles.brandLabel}>Sold By</span>
						<span className={styles.brandValue}>{productdata?.seller_name}</span>
					</div>
					<hr />
					{/* description starts here  */}
					<div className={styles.descriptionWrapper}>
						<h2 className={styles.subHeader}>Description</h2>
						<div
							className={styles.descriptionBodyWrapper}
							style={{
								height: descriptionHeight.height,
								overflow: descriptionHeight.overflow,
							}}
						>
							<div
								dangerouslySetInnerHTML={{ __html: productdata.description }}
							></div>
						</div>
						<button
							className={styles.viewMoreBtn}
							onClick={() => {
								expandDetails("description");
							}}
						>
							{viewMore.description ? "View More" : "View Less"}
						</button>
					</div>
					{/* features starts here  */}
					{ productdata.features && <hr />}
					{ productdata.features &&
					<div className={styles.featureWrapper}>
						<h2 className={styles.subHeader}>Features & Details</h2>
						<div
							className={styles.featureBodyWrapper}
						>
							<div
								dangerouslySetInnerHTML={{ __html: productdata.features }}
							></div>
						</div>
					</div>
					}
					{/* return policy starts here  */}
					<hr />
					<div className={styles.returnWrapper}>
						<h2 className={styles.subHeader}>Return Policy</h2>
						<div
							className={styles.returnBodyWrapper}
						>
							<div>
								{ productdata.cancelable_status === 0 ? 'This Product is Non-Returnable' : 'This Product is returnable in 7 days' }
							</div>
							<Link to="/return&refund">Know More</Link>
						</div>
					</div>
				</div>
			</div>

			<div className={styles.addSectionWrapper}>
				<div className={styles.viewCartSticker}>
					{!isCart ? (
						<button
							color="#F27100"
							id={`Add-to-cart-productdetail`}
							className={styles.addToCartActive}
							onClick={() => DirectAddProductToCart(1)}
						>
							<IoCartOutline className={styles.artAdd} /> Add to Cart
						</button>
					) : (
						<>
							<div
								id={`input-cart-productdetail`}
								className={styles.inputToCart}
							>
								<button
									type="button"
									className="wishlist-button"
									onClick={() => {
										handleDecrement();
									}}
								>
									<BiMinus />
								</button>
								<span id={`input-productdetail`}>{productInCartCount}</span>
								<button
									type="button"
									className={styles.wishlistButton}
									onClick={() => {
										handleIncrement();
									}}
								>
									<BsPlus />{" "}
								</button>
							</div>
						</>
					)}
				</div>
				<br />
				<div className={styles.viewCartSticker}>
					<button
						className={styles.button}
						type="button"
						onClick={() => DirectAddProductToCart(1)}
					>
						<FontAwesomeIcon
							icon={faAngleDoubleRight}
							className={styles.faAngleDoubleRight}
						/>
						<Link to="/checkout" className={styles.buynowButton}>
							Buy Now
						</Link>
					</button>
				</div>
			</div>
			<div className={styles.ganeshCaurosel}>
				<SpecificSubCategory
					categoryId={166}
					subCategoryId={81}
					productTriggered={productTriggered}
					setProductTriggered={setProductTriggered}
				/>
			</div>

			{/* <div className={styles.favIconWrapper}>
				<div
					id={`input-cart-productdetail`}
					className="input-to-cart visually-hidden"
				>
					<button
						type="button"
						className="wishlist-button"
						onClick={() => {
							var val = parseInt(
								document.getElementById(`input-productdetail`).innerHTML
							);
							if (val === 1) {
								document.getElementById(`input-productdetail`).innerHTML = 0;
								document
									.getElementById(`Add-to-cart-productdetail`)
									.classList.remove("visually-hidden");
								document
									.getElementById(`input-cart-productdetail`)
									.classList.toggle("visually-hidden");
								removefromCart(
									productdata.id,
									JSON.parse(
										document.getElementById(
											`select-product-variant-productdetail`
										).value
									).id
								);
							} else {
								document.getElementById(`input-productdetail`).innerHTML =
									val - 1;
								addtoCart(
									productdata.id,
									JSON.parse(
										document.getElementById(
											`select-product-variant-productdetail`
										).value
									).id,
									document.getElementById(`input-productdetail`).innerHTML
								);
							}
						}}
					>
						<BiMinus fill="#fff" />
					</button>
					<span id={`input-productdetail`}></span>
					<button
						type="button"
						className="wishlist-button"
						onClick={() => {
							var val =
								document.getElementById(`input-productdetail`).innerHTML;
							if (val < productdata.total_allowed_quantity) {
								document.getElementById(`input-productdetail`).innerHTML =
									parseInt(val) + 1;
								addtoCart(
									productdata.id,
									JSON.parse(
										document.getElementById(
											`select-product-variant-productdetail`
										).value
									).id,
									document.getElementById(`input-productdetail`).innerHTML
								);
							}
						}}
					>
						<BsPlus fill="#fff" />{" "}
					</button>
				</div>

				{/* <button type='button' className='wishlist-product' onClick={() => addToFavorite(productdata.id)}><BsHeart /></button> 
				{favorite.favorite &&
				favorite.favorite.data.some(
					(element) => element.id === productdata.id
				) ? (
					<button
						type="button"
						className="wishlist-product"
						onClick={() => removefromFavorite(productdata.id)}
					>
						<BsHeartFill fill="green" />
					</button>
				) : (
					<button
						key={productdata.id}
						type="button"
						className="wishlist-product"
						onClick={() => addToFavorite(productdata.id)}
					>
						<BsHeart />
					</button>
				)}
			</div> */}
		</>
	);
};

export default DskpProductDetail;
