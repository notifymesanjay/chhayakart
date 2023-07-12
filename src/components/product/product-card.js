import React, { useState } from "react";
import { AiOutlineEye } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "universal-cookie";
import { ActionTypes } from "../../model/action-type";
import { useNavigate } from "react-router-dom";
import { FaRupeeSign } from "react-icons/fa";
import { BsHeart, BsHeartFill, BsPlus } from "react-icons/bs";
import { toast } from "react-toastify";
import { BiMinus } from "react-icons/bi";
import Share from "./share";
import api from "../../api/api";
import {
  addProductToCart,
  decrementProduct,
  incrementProduct,
} from "../../services/cartService";
import { setSelectedProductId } from "../../utils/manageLocalStorage";
import QuickViewModal from "./QuickViewModal";

const share_url = "https://chhayakart.com";

const ProductCard = ({
  index,
  index0,
  product,
  productTriggered,
  setProductTriggered = () => {},
}) => {
  const cookies = new Cookies();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const city = useSelector((state) => state.city);
  const favorite = useSelector((state) => state.favorite);

  const [isCart, setIsCart] = useState(false);
  const [productInCartCount, setProductInCartCount] = useState(0);
  const [selectedProduct, setselectedProduct] = useState({});
  const [showViewModal, setShowViewModal] = useState(false);

  const getProductVariants = (product) => {
    return product.variants.map((variant, ind) => (
      <option
        key={ind}
        value={JSON.stringify(variant)}
        className="options_class"
      >
        {variant.measurement} {variant.stock_unit_name} Rs.{variant.price}
      </option>
    ));
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

  const addtoCart = async (product_id, product_variant_id, qty) => {
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
              if (res.status === 1)
                dispatch({
                  type: ActionTypes.SET_CART_CHECKOUT,
                  payload: res.data,
                });
            })
            .catch((error) => console.log(error));
        } else {
          toast.error(result.message);
        }
      });
  };

  const handleAddToCart = (index0, index, product) => {
    if (cookies.get("jwt_token") !== undefined) {
      setIsCart(true);
      setProductInCartCount(1);
      addtoCart(
        product.id,
        JSON.parse(
          document.getElementById(
            `select-product${index}${index0}-variant-section`
          ).value
        ).id,
        productInCartCount
      );
    } else {
      const isAdded = addProductToCart(product);
      if (isAdded) {
        setIsCart(true);
        setProductInCartCount(1);
        setProductTriggered(!productTriggered);
      }
    }
  };

  const removefromCart = async (product_id, product_variant_id) => {
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
              if (res.status === 1)
                dispatch({
                  type: ActionTypes.SET_CART_CHECKOUT,
                  payload: res.data,
                });
            })
            .catch((error) => console.log(error));
        } else {
          toast.error(result.message);
        }
      });
  };

  const handleDecrement = (product, index, index0) => {
    var val = productInCartCount;
    if (cookies.get("jwt_token") !== undefined) {
      if (val === 1) {
        setProductInCartCount(0);
        setIsCart(false);
        removefromCart(
          product.id,
          JSON.parse(
            document.getElementById(
              `select-product${index}${index0}-variant-section`
            ).value
          ).id
        );
      } else {
        setProductInCartCount(val - 1);
        addtoCart(
          product.id,
          JSON.parse(
            document.getElementById(
              `select-product${index}${index0}-variant-section`
            ).value
          ).id,
          val - 1
        );
      }
    } else {
      const isDecremented = decrementProduct(product.id, product);
      if (isDecremented) {
        setProductInCartCount(val - 1);
      } else {
        setIsCart(false);
      }
      setProductTriggered(!productTriggered);
    }
  };

  const handleIncrement = (product, index, index0) => {
    var val = productInCartCount;
    if (cookies.get("jwt_token") !== undefined) {
      if (val < product.total_allowed_quantity) {
        setProductInCartCount(val + 1);
        addtoCart(
          product.id,
          JSON.parse(
            document.getElementById(
              `select-product${index}${index0}-variant-section`
            ).value
          ).id,
          val + 1
        );
      }
    } else {
      const isIncremented = incrementProduct(product.id, product);
      if (isIncremented) {
        setProductInCartCount(val + 1);
      }
      setProductTriggered(!productTriggered);
    }
  };

  return (
    <>
      <div className="row" key={index}>
        <div className="col-md-12">
          <div className="product-card">
            <div className="image-container">
              <span
                className="border border-light rounded-circle p-2 px-3"
                id="aiEye"
              >
                <AiOutlineEye
                  onClick={() => {
                    setShowViewModal(true);
                    setselectedProduct(product);
                  }}
                />
              </span>
              <div className="imageWrapper">
                <img
                  data-src={product.image_url}
                  alt={product.slug}
                  className="card-img-top lazyload"
                  onClick={() => {
                    dispatch({
                      type: ActionTypes.SET_SELECTED_PRODUCT,
                      payload: product.id,
                    });
                    setSelectedProductId(product.id);
                    navigate("/product/" + product.id);
                  }}
                />
              </div>
            </div>

            <div className="card-body product-card-body p-3">
              <h3>{product.name}</h3>
              <div className="price">
                <span
                  id={`price${index}${index0}-section`}
                  className="d-flex align-items-center"
                >
                  <p id="fa-rupee" className="m-0">
                    <FaRupeeSign fill="var(--secondary-color)" />
                  </p>{" "}
                  {product.variants[0].discounted_price} ({Math.round(parseFloat((product.variants[0].price-product.variants[0].discounted_price)*100/product.variants[0].price))}% off)
                </span>
                {/* actual price of product displaying on home page  */}

                <span
                  id={`price${index}${index0}-section`}
                  className="d-flex align items-center"
                  style={{ textDecoration: "line-through" }}
                >
                  <p id="fa-rupee" className="m-0">
                    <FaRupeeSign fill="var(--secondary-color)" />
                  </p>{" "}
                  {parseFloat(product.variants[0].price)}
                </span>
              </div>
              <div className="product_varients_drop">
                {product.variants.length > 1 ? (
                  <>
                    <select
                      style={{ fontSize: "8px !important" }}
                      className="form-select variant_selection select-arrow"
                      id={`select-product${index}${index0}-variant-section`}
                      onChange={(e) => {
                        document.getElementById(
                          `price${index}${index0}-section`
                        ).innerHTML =
                          document.getElementById("fa-rupee").outerHTML +
                          parseFloat(JSON.parse(e.target.value).price);

                        if (isCart) {
                          setIsCart(false);
                        }
                      }}
                      defaultValue={JSON.stringify(product.variants[0])}
                    >
                      {getProductVariants(product)}
                    </select>
                  </>
                ) : (
                  <>
                    <input
                      type="hidden"
                      name=""
                      id={`select-product${index}${index0}-variant-section`}
                      value={JSON.stringify(product.variants[0])}
                    />
                    {/* <span className='variant_value select-arrow' id=''>{product.variants[0].measurement + " " + product.variants[0].stock_unit_name}
                                                                                </span> */}
                    <span className="variant_value select-arrow" id="">
                      {product.variants[0].stock_unit_name}
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="d-flex flex-row border-top product-card-footer">
              <div className="border-end">
                {favorite.favorite &&
                favorite.favorite.data.some(
                  (element) => element.id === product.id
                ) ? (
                  <button
                    type="button"
                    className="w-100 h-100"
                    onClick={() => {
                      if (cookies.get("jwt_token") !== undefined) {
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
                      if (cookies.get("jwt_token") !== undefined) {
                        addToFavorite(product.id);
                      } else {
                        toast.error("OOps! You need to login First");
                      }
                    }}
                  >
                    <BsHeart />
                  </button>
                )}
              </div>

              <div className="border-end" style={{ flexGrow: "1" }}>
                {!isCart ? (
                  <button
                    type="button"
                    className="w-100 h-100 add-to-cart"
                    onClick={() => {
                      handleAddToCart(index0, index, product);
                    }}
                  >
                    add to cart
                  </button>
                ) : (
                  <div
                    id={`input-cart-section${index}${index0}`}
                    className="w-100 h-100 input-to-cart"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        handleDecrement(product, index, index0);
                      }}
                    >
                      <BiMinus />
                    </button>
                    <span className="cartCount">{productInCartCount}</span>
                    <button
                      type="button"
                      onClick={() => {
                        handleIncrement(product, index, index0);
                      }}
                    >
                      <BsPlus />{" "}
                    </button>
                  </div>
                )}
              </div>

              <Share slug={product.slug} share_url={share_url} />
            </div>
          </div>
        </div>
      </div>
      {showViewModal && (
        <QuickViewModal
          isOpenModal={showViewModal}
          setIsOpenModal={setShowViewModal}
          selectedProduct={selectedProduct}
          setselectedProduct={setselectedProduct}
          productTriggered={productTriggered}
          setProductTriggered={setProductTriggered}
        />
      )}
    </>
  );
};

export default ProductCard;
