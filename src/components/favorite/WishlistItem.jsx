import {useState} from 'react'
import { FaRupeeSign } from "react-icons/fa";
import './wishlist_item.css'
import { BsHeart, BsHeartFill, BsPlus } from "react-icons/bs";
import { BiMinus } from "react-icons/bi";
import {useSelector, useDispatch} from 'react-redux';
import Cookies from "universal-cookie";
import { toast } from "react-toastify";
import api from "../../api/api";
import { ActionTypes } from "../../model/action-type";
import CryptoJS from "crypto-js";
import BulkOrder from "../product/bulk-order";
import TrackingService from '../../services/trackingService';
import {
	AddProductToCart,
	DecrementProduct,
	IncrementProduct,
} from "../../services/cartService";
import { useResponsive } from "../shared/use-responsive";

const secret_key = "Xyredg$5g";


const WishlistItem = ({productData, index, onClick, productTriggered,
	setProductTriggered}) => {
    const favorite = useSelector((state) => state.favorite);
    const cookies = new Cookies();
    const city = useSelector((state) => state.city);
    const dispatch = useDispatch();
    const cart = useSelector((state) => state.cart);
    const [isProductAdded, setIsProductAdded] = useState(()=>{
		if(cart.cart === null){
			return false;
		}
        return cart.cart.data.cart.some((ele)=> ele.product_id === productData.id);
    });
    const [isOpenBulk, setIsOpenBulk] = useState(false);
    const [productVal, setProductVal] = useState(isProductAdded ? ()=>{
        let cartProduct = cart.cart.data.cart.find((ele) => ele.product_id === productData.id);
        return cartProduct.qty;
    }: 0);
    const trackingService = new TrackingService();
    const user = useSelector((state) => state.user);
	const { isSmScreen } = useResponsive();

    //  Add to favorite
	const addToFavorite = async () => {
		await api
			.addToFavotite(cookies.get("jwt_token"), productData.id)
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
	const removefromFavorite = async () => {
		await api
			.removeFromFavorite(cookies.get("jwt_token"), productData.id)
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

    const getProductVariants = () => {
		return productData.variants.map((variant, ind) => (
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

    const handleAddToCart = () => {
		if (cookies.get("jwt_token") !== undefined) {
			console.log(
				productData.variants.length > 1
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
				productData,
				productData.variants.length > 1
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
				productData,
				1,
				user.status === "loading" ? "" : user.user.email
			);

			const isAdded = AddProductToCart(productData);
			if (isAdded) {
				setIsProductAdded(true);
				setProductVal(1);
				setProductTriggered(!productTriggered);
			}
		}
	};

    const removefromCart = async (product_variant_id) => {
		trackingService.trackCart(
			productData,
			0,
			user != null && user.status === "loading" ? "" : user.user.email
		);

		await api
			.removeFromCart(cookies.get("jwt_token"), productData.id, product_variant_id)
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

    const handleIncrement = () => {
		var val = productVal;
		if (val >= Math.ceil(parseInt(productData.total_allowed_quantity) / 2)) {
			setIsOpenBulk(true);
		} else {
			IncrementProduct1(val);
		}
	};

    const handleDecrement = () => {
		var val = productVal;

		if (cookies.get("jwt_token") !== undefined) {
			if (val === 1) {
				setProductVal(0);
				setIsProductAdded(false);

				removefromCart(
					productData.variants.length > 1
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
					productData,
					productData.variants.length > 1
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
				productData,
				parseInt(val) - 1,
				user.status === "loading" ? "" : user.user.email
			);

			const isDecremented = DecrementProduct(productData.id, productData);

			if (isDecremented) {
				setProductVal(val - 1);
			} else {
				setProductVal(0);
				setIsProductAdded(false);
			}
			setProductTriggered(!productTriggered);
		}
	};

    const IncrementProduct1 = (val) => {
		if (cookies.get("jwt_token") !== undefined) {
			if (parseInt(val) < parseInt(productData.total_allowed_quantity)) {
				setProductVal(parseInt(val) + 1);
				addtoCart(
					productData,
					productData.variants.length > 1
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
				productData,
				parseInt(val) + 1,
				user.status === "loading" ? "" : user.user.email
			);
			const isIncremented = IncrementProduct(
				productData.id,
				productData,
				val + 1,
				true
			);
			if (isIncremented) {
				setProductVal(parseInt(val) + 1);
			}
			setProductTriggered(!productTriggered);
		}
	};

    return <div className={`d-flex flex-column shadow rounded-2 ${isSmScreen ? 'm-1 px-2 py-2' : 'm-3 px-4 py-2'}`} onClick={onClick}>
        <div className="image-section py-2 d-flex align-items-center">
            <img data-src={productData.image_url} alt={productData.name} className="lazyload" style={{maxWidth: '100%'}}/>
            <div className="favorite-button">
                {
                    favorite.favorite &&
                    favorite.favorite.data.some(
                        (element) => element.id === productData.id
                    ) ? 
                    <button onClick={(e) => {
                        e.stopPropagation();
                        if (cookies.get("jwt_token") !== undefined) {
                            removefromFavorite();
                        } else {
                            toast.error(
                                "OOps! You need to login first to add to favourites"
                            );
                        }
                    }}>
                        <BsHeartFill size={18} fill="#F27100"/>
                    </button> :
                    <button onClick={(e) => {
                        e.stopPropagation();
                        if (cookies.get("jwt_token") !== undefined) {
                            addToFavorite();
                        } else {
                            toast.error(
                                "OOps! You need to login first to add to favourites"
                            );
                        }
                    }}>
                        <BsHeart size={18}/>
                    </button>
                }
            </div>
        </div>
        <hr className="mx-3" />
        <div className="product-name">{productData.name}</div>
        {productData.variants.length > 0 && <div className="product_varients_drop">
            {productData.variants.length > 1 ? (
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
                        defaultValue={JSON.stringify(productData.variants[0])}
                    >
                        {getProductVariants()}
                    </select>
                </>
            ) : (
                <>
                    <input
                        type="hidden"
                        name={`default-product${index}-variant-id`}
                        id={`default-product${index}-variant-id`}
                        value={productData.variants[0].id}
                    />
                    <p
                        id={`default-product${index}-variant`}
                        value={productData.variants[0].id}
                        className="variant_value select-arrow"
                    >
                        {productData.variants[0].stock_unit_name}
                    </p>
                </>
            )}
        </div>}
        {productData.variants.length > 0 && <div className="price my-2">
            <FaRupeeSign size={15}/>
            <span id={`price-wishlist${productData.id}`}>
                {parseFloat(
                productData.variants.length > 0
                    ? productData.variants[0].discounted_price
                    : 0
                )}
            </span>
        </div>}
        {
			productData.variants.length === 0 ? 
			<div className='d-flex justify-content-center py-2'>
				<div className='outOfStock' onClick={(e)=>{
					e.stopPropagation();
				}}>
					Out of Stock
				</div>
			</div> :
			<div className="d-flex justify-content-center py-2">
            { !isProductAdded ?
                <button className="addBtn" onClick={(e)=>{
                e.stopPropagation();
                handleAddToCart();
            }}>
                Add to bag
            </button> : (
						<>
							<div
								id={`input-cart-section${index}`}
								className='addBtn addedProduct'
							>
								<button
									type="button"
									onClick={(e) => {
                                        e.stopPropagation();
										handleDecrement();
									}}
								>
									<BiMinus />
								</button>
								<span id={`input-section${index}`}>{productVal}</span>
								<button
									type="button"
									onClick={(e) => {
                                        e.stopPropagation();
										handleIncrement();
									}}
								>
									<BsPlus />{" "}
								</button>
							</div>
							{/* {isOpenBulk && (
								<BulkOrder
									isOpenBulk={isOpenBulk}
									setIsOpenBulk={setIsOpenBulk}
									product={productData}
									onSubmit={IncrementProduct1}
									productVal={productVal}
									index={index}
								/>
							)} */}
						</>
					)}
        </div>}
    </div>
}

export default WishlistItem;