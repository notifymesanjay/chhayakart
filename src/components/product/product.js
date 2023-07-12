import React, { useState } from "react";
import { BiLink, BiMinus } from "react-icons/bi";
import { FaChevronLeft, FaChevronRight, FaRupeeSign } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import Slider from "react-slick";
import api from "../../api/api";
import Cookies from "universal-cookie";
import { toast } from "react-toastify";
import { ActionTypes } from "../../model/action-type";
import {
  addProductToCart,
  decrementProduct,
  incrementProduct,
} from "../../services/cartService";
import { BsHeart, BsHeartFill, BsPlus } from "react-icons/bs";
import {
  FacebookIcon,
  FacebookShareButton,
  TelegramIcon,
  TelegramShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";

const Product = ({
  images,
  mainimage,
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

  const settings_subImage = {
    infinite: false,
    slidesToShow: 3,
    initialSlide: 0,
    // centerMargin: "10px",
    margin: "20px",
    prevArrow: (
      <button
        type="button"
        className="slick-prev"
        onClick={(e) => {
          setmainimage(e.target.value);
        }}
      >
        <FaChevronLeft size={30} className="prev-arrow" />
      </button>
    ),
    nextArrow: (
      <button
        type="button"
        className="slick-next"
        onClick={(e) => {
          setmainimage(e.target.value);
        }}
      >
        <FaChevronRight color="#f7f7f7" size={30} className="next-arrow" />
      </button>
    ),
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          infinite: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
    ],
  };

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

  const addProductToCart1 = () => {
    if (cookies.get("jwt_token") !== undefined) {
      setIsCart(true);
      setProductInCartCount(1);
      addtoCart(
        productdata.id,
        JSON.parse(
          document.getElementById(`select-product-variant-productdetail`).value
        ).id,
        1
      );
    } else {
      const isAdded = addProductToCart(productdata);
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
          productdata.id,
          JSON.parse(
            document.getElementById(`select-product-variant-productdetail`)
              .value
          ).id
        );
      } else {
        setProductInCartCount(val - 1);
        addtoCart(
          productdata.id,
          JSON.parse(
            document.getElementById(`select-product-variant-productdetail`)
              .value
          ).id,
          val - 1
        );
      }
    } else {
      const isDecremented = decrementProduct(productdata.id, productdata);
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
          productdata.id,
          JSON.parse(
            document.getElementById(`select-product-variant-productdetail`)
              .value
          ).id,
          val + 1
        );
      }
    } else {
      const isIncremented = incrementProduct(productdata.id, productdata);
      if (isIncremented) {
        setProductInCartCount(val + 1);
      }
      setProductTriggered(!productTriggered);
    }
  };
  return (
    <div className="row body-wrapper ">
      <div className="col-xl-4 col-lg-6 col-md-12 col-12">
        <div className="image-wrapper ">
          <div className="main-image col-12 border">
            <img
              src={mainimage}
              alt="main-product"
              className="col-12"
              style={{ width: "85%" }}
            />
          </div>

          <div className="sub-images-container">
            {images.length >= 4 ? (
              <>
                <Slider {...settings_subImage}>
                  {images.map((image, index) => (
                    <div key={index}>
                      <div
                        className={`sub-image border ${
                          mainimage === image ? "active" : ""
                        }`}
                      >
                        <img
                          src={image}
                          className="col-12"
                          alt="product"
                          onClick={() => {
                            setmainimage(image);
                          }}
                        ></img>
                      </div>
                    </div>
                  ))}
                </Slider>
              </>
            ) : (
              <>
                {images.map((image, index) => (
                  <div
                    key={index}
                    className={`sub-image border ${
                      mainimage === image ? "active" : ""
                    }`}
                  >
                    <img
                      src={image}
                      className="col-12 "
                      alt="product"
                      onClick={() => {
                        setmainimage(image);
                      }}
                    ></img>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
      <div className="col-xl-8 col-lg-6 col-md-12 col-12">
        <div className="detail-wrapper">
          <div className="top-section">
            <p className="product_name">{productdata.name}</p>
            {Object.keys(productbrand).length === 0 ? null : (
              <div className="product-brand">
                <span className="brand-title">Brand:</span>
                <span className="brand-name">{productbrand.name}</span>
              </div>
            )}
            <div className="d-flex flex-row gap-2 align-items-center my-1">
              <span className="price green-text" id={`price-productdetail`}>
                <FaRupeeSign fill="var(--secondary-color)" />
                {parseFloat(productdata.variants[0].discounted_price)}{" "} ({Math.round(parseFloat((productdata.variants[0].price-productdata.variants[0].discounted_price)*100/productdata.variants[0].price))}% off)
              </span>{" "}
              <div
                className="not-price gray-text"
                style={{ textDecoration: "line-through" }}
              >
                <FaRupeeSign
                  fill="var(--text-color)"
                  textDecoration="line-through"
                />
                {parseFloat(productdata.variants[0].price)}
              </div>
            </div>
          </div>
          <div className="bottom-section">
            <p>Product Variants</p>
            <div className="d-flex gap-3 bottom-section-content">
              <select
                id={`select-product-variant-productdetail`}
                onChange={(e) => {
                  document.getElementById(`price-productdetail`).innerHTML =
                    parseFloat(JSON.parse(e.target.value).price);

                  if (isCart) {
                    setIsCart(false);
                  }
                }}
                defaultValue={JSON.stringify(productdata.variants[0])}
              >
                {getProductVariants(productdata)}
              </select>

              {!isCart ? (
                <button
                  type="button"
                  id={`Add-to-cart-productdetail`}
                  className="add-to-cart active"
                  onClick={addProductToCart1}
                >
                  Add to Cart
                </button>
              ) : (
                <div
                  id={`input-cart-productdetail`}
                  className="input-to-cart"
                >
                  <button
                    type="button"
                    className="wishlist-button"
                    onClick={() => {
                      handleDecrement();
                    }}
                  >
                    <BiMinus fill="#fff" />
                  </button>
                  <span id={`input-productdetail`}>{productInCartCount}</span>
                  <button
                    type="button"
                    className="wishlist-button"
                    onClick={() => {
                      handleIncrement();
                    }}
                  >
                    <BsPlus fill="#fff" />{" "}
                  </button>
                </div>
              )}

              {/* <button type='button' className='wishlist-product' onClick={() => addToFavorite(productdata.id)}><BsHeart /></button> */}
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
            </div>
            <div className="product-overview">
              <div className="product-seller">
                {/* <span className='seller-title'>Sold By:</span>
                                                    <span className='seller-name'>{productdata.seller_name} </span> */}
              </div>

              {productdata.tags !== "" ? (
                <div className="product-tags">
                  <span className="tag-title">Product Tags:</span>
                  <span className="tag-name">{productdata.tags} </span>
                </div>
              ) : (
                ""
              )}
            </div>
            <div className="share-product-container">
              <span>Share product:</span>

              <ul className="share-product">
                <li className="share-product-icon">
                  <WhatsappShareButton
                    url={`https://chhayakart.com/product/${productdata.slug}`}
                  >
                    <WhatsappIcon size={32} round={true} />{" "}
                  </WhatsappShareButton>
                </li>
                <li className="share-product-icon">
                  <TelegramShareButton
                    url={`https://chhayakart.com/product/${productdata.slug}`}
                  >
                    <TelegramIcon size={32} round={true} />{" "}
                  </TelegramShareButton>
                </li>
                <li className="share-product-icon">
                  <FacebookShareButton
                    url={`https://chhayakart.com/product/${productdata.slug}`}
                  >
                    <FacebookIcon size={32} round={true} />{" "}
                  </FacebookShareButton>
                </li>
                <li className="share-product-icon">
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `https://chhayakart.com/product/${productdata.slug}`
                      );
                      toast.success("Copied Succesfully!!");
                    }}
                  >
                    {" "}
                    <BiLink size={30} />
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
