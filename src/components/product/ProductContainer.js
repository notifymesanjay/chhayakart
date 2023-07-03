import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "../../api/api";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./product.css";
import { AiOutlineEye } from "react-icons/ai";
import { FaChevronLeft, FaChevronRight, FaRupeeSign } from "react-icons/fa";
import { BsHeart, BsShare, BsPlus, BsHeartFill } from "react-icons/bs";
import { BiMinus, BiLink } from "react-icons/bi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { setSelectedProductId } from "../../utils/manageLocalStorage";

import Cookies from "universal-cookie";
import { ActionTypes } from "../../model/action-type";

import QuickViewModal from "./QuickViewModal";
import Offers from "../offer/Offers";
import {
  FacebookIcon,
  FacebookShareButton,
  TelegramIcon,
  TelegramShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";
import {
  addProductToCart,
  decrementProduct,
  incrementProduct,
} from "../../services/cartService";
import LoginUser from "../login/login-user";
// import Select from 'react-select';

function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  const handleTouchEnd = () => {
    onClick();
  };
  return (
    <div
      className={className}
      style={
        window.innerWidth > 450
          ? {
              ...style,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "var(--secondary-color)",
              borderRadius: "100%",
              width: "30px",
              height: "30px",
            }
          : { display: "none" }
      }
      onClick={onClick}
      onTouchEnd={handleTouchEnd}
    />
  );
}

function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  const handleTouchEnd = () => {
    onClick();
  };
  return (
    <div
      className={className + " fa-solid fa-chevron-right"}
      onClick={onClick}
      onTouchEnd={handleTouchEnd}
      style={window.innerWidth > 450 ? {} : { display: "none" }}
    >
      <i className="fa-solid fa-chevron-right"></i>
    </div>
  );
}

const ProductContainer = ({productTriggered, setProductTriggered = () => {}}) => {
  //initialize cookies
  const cookies = new Cookies();
  const dispatch = useDispatch();
  const curr_url = useLocation();
  const navigate = useNavigate();

  const share_url = "https://chhayakart.com";

  const city = useSelector((state) => state.city);
  const shop = useSelector((state) => state.shop);
  const sizes = useSelector((state) => state.productSizes);
  const favorite = useSelector((state) => state.favorite);

  // const shop = useSelector(state=>state.shop);

  useEffect(() => {
    if (sizes.sizes === null || sizes.status === "loading") {
      if (city.city !== null) {
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
  }, [city, sizes]);

  const [selectedProduct, setselectedProduct] = useState({});
  const [productSizes, setproductSizes] = useState(null);
  const [offerConatiner, setOfferContainer] = useState(0);
  const [isLogin, setIsLogin] = useState(false);

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
        value={JSON.stringify(variant)}
        className="options_class"
      >
        {variant.measurement} {variant.stock_unit_name} Rs.{variant.price}
      </option>
    ));
  };

  //Add to Cart
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

  //remove from Cart
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

  const settings = {
    infinite: false,
    slidesToShow: 5.5,
    slidesPerRow: 1,
    initialSlide: 0,
    // centerMode: true,
    centerMargin: "10px",
    margin: "20px", // set the time interval between slides
    // Add custom navigation buttons using Font Awesome icons
    prevArrow: (
      <button type="button" className="slick-prev">
        <FaChevronLeft size={30} className="prev-arrow" />
      </button>
    ),
    nextArrow: (
      <button type="button" className="slick-next">
        <FaChevronRight color="#f7f7f7" size={30} className="next-arrow" />
      </button>
    ),
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 425,
        settings: {
          slidesToShow: 2,
        },
      },
    ],
  };

  const handleValueChange = (index0, newValue) => {
    setOfferContainer(index0);
  };

  const handleAddToCart = (index0, index, product) => {
    if (cookies.get("jwt_token") !== undefined) {
      document
        .getElementById(`Add-to-cart-section${index}${index0}`)
        .classList.remove("active");
      document
        .getElementById(`input-cart-section${index}${index0}`)
        .classList.add("active");
      document.getElementById(`input-section${index}${index0}`).innerHTML = 1;
      addtoCart(
        product.id,
        JSON.parse(
          document.getElementById(
            `select-product${index}${index0}-variant-section`
          ).value
        ).id,
        document.getElementById(`input-section${index}${index0}`).innerHTML
      );
    } else {
      addProductToCart(product);
      document
        .getElementById(`Add-to-cart-section${index}${index0}`)
        .classList.remove("active");
      document
        .getElementById(`input-cart-section${index}${index0}`)
        .classList.add("active");
      document.getElementById(`input-section${index}${index0}`).innerHTML = 1;
      setProductTriggered(!productTriggered)
    }
  };

  const handleDecrement = (product, index, index0) => {
    var val = parseInt(
      document.getElementById(`input-section${index}${index0}`).innerHTML
    );
    if (cookies.get("jwt_token") !== undefined) {
      if (val === 1) {
        document.getElementById(`input-section${index}${index0}`).innerHTML = 0;
        document
          .getElementById(`input-cart-section${index}${index0}`)
          .classList.remove("active");
        document
          .getElementById(`Add-to-cart-section${index}${index0}`)
          .classList.add("active");
        removefromCart(
          product.id,
          JSON.parse(
            document.getElementById(
              `select-product${index}${index0}-variant-section`
            ).value
          ).id
        );
      } else {
        document.getElementById(`input-section${index}${index0}`).innerHTML =
          val - 1;
        addtoCart(
          product.id,
          JSON.parse(
            document.getElementById(
              `select-product${index}${index0}-variant-section`
            ).value
          ).id,
          document.getElementById(`input-section${index}${index0}`).innerHTML
        );
      }
    } else {
      const isDecremented = decrementProduct(product.id, product);
      if (isDecremented) {
        document.getElementById(`input-section${index}${index0}`).innerHTML =
          val - 1;
      } else {
        document
          .getElementById(`input-cart-section${index}${index0}`)
          .classList.remove("active");
        document
          .getElementById(`Add-to-cart-section${index}${index0}`)
          .classList.add("active");
      }
      setProductTriggered(!productTriggered)
    }
  };

  const handleIncrement = (product, index, index0) => {
    var val = document.getElementById(
      `input-section${index}${index0}`
    ).innerHTML;
    if (cookies.get("jwt_token") !== undefined) {
      if (val < product.total_allowed_quantity) {
        document.getElementById(`input-section${index}${index0}`).innerHTML =
          parseInt(val) + 1;
        addtoCart(
          product.id,
          JSON.parse(
            document.getElementById(
              `select-product${index}${index0}-variant-section`
            ).value
          ).id,
          document.getElementById(`input-section${index}${index0}`).innerHTML
        );
      }
    } else {
      const isIncremented = incrementProduct(product.id, product);
      if (isIncremented) {
        document.getElementById(`input-section${index}${index0}`).innerHTML =
          parseInt(val) + 1;
      }
      setProductTriggered(!productTriggered)
    }
  };

  return (
    <section id="products">
      <div className="container">
        {shop.shop === null || productSizes === null ? (
          <>
            <div className="d-flex justify-content-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          </>
        ) : (
          <>
            {shop.shop.sections.map((section, index0) => (
              <div key={index0}>
                <div
                  className="product_section row flex-column"
                  value={index0}
                  onChange={(e) => {
                    setOfferContainer(index0);
                  }}
                >
                  <div className="d-flex product_title_content justify-content-between align-items-center col-md-12">
                    <div className="">
                      <span className="d-none d-md-block">
                        {section.short_description}
                      </span>
                      <p>{section.title}</p>
                    </div>
                    <div>
                      {/* <Link to='/products'>see all</Link> */}
                      <Link
                        to="/products"
                        onClick={() => {
                          dispatch({
                            type: ActionTypes.SET_FILTER_CATEGORY,
                            payload:
                              section.title == "All Products"
                                ? section.category_ids
                                : section.products[0].category_id,
                          });
                          navigate("/products");
                        }}
                      >
                        see all
                      </Link>
                    </div>
                  </div>

                  <div className="product_section_content p-0">
                    <Slider {...settings}>
                      {section.products.map((product, index) => (
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
                                    navigate("/product/" + product.id);
                                  }}
                                />
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
                                    {product.variants[0].price}
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
                                    {parseFloat(product.variants[0].price) +
                                      product.variants[0].price * 0.13}
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
                                            document.getElementById("fa-rupee")
                                              .outerHTML +
                                            parseFloat(
                                              JSON.parse(e.target.value).price
                                            );

                                          if (
                                            document
                                              .getElementById(
                                                `input-cart-section${index}${index0}`
                                              )
                                              .classList.contains("active")
                                          ) {
                                            document
                                              .getElementById(
                                                `input-cart-section${index}${index0}`
                                              )
                                              .classList.remove("active");
                                            document
                                              .getElementById(
                                                `Add-to-cart-section${index}${index0}`
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
                                        name=""
                                        id={`select-product${index}${index0}-variant-section`}
                                        value={JSON.stringify(
                                          product.variants[0]
                                        )}
                                      />
                                      {/* <span className='variant_value select-arrow' id=''>{product.variants[0].measurement + " " + product.variants[0].stock_unit_name}
                                                                                </span> */}
                                      <span
                                        className="variant_value select-arrow"
                                        id=""
                                      >
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
                                        if (
                                          cookies.get("jwt_token") !== undefined
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
                                          cookies.get("jwt_token") !== undefined
                                        ) {
                                          addToFavorite(product.id);
                                        } else {
                                          toast.error(
                                            "OOps! You need to login First"
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
                                    id={`Add-to-cart-section${index}${index0}`}
                                    className="w-100 h-100 add-to-cart active"
                                    onClick={() => {
                                      handleAddToCart(index0, index, product);
                                    }}
                                  >
                                    add to cart
                                  </button>

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
                                    <span
                                      id={`input-section${index}${index0}`}
                                    ></span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        handleIncrement(product, index, index0);
                                      }}
                                    >
                                      <BsPlus />{" "}
                                    </button>
                                  </div>
                                </div>

                                <div className="dropup share">
                                  <button
                                    type="button"
                                    className="w-100 h-100 "
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                  >
                                    <BsShare />
                                  </button>

                                  <ul className="dropdown-menu">
                                    <li className="dropDownLi">
                                      <WhatsappShareButton
                                        url={`${share_url}/product/${product.slug}`}
                                      >
                                        <WhatsappIcon size={32} round={true} />{" "}
                                        <span>WhatsApp</span>
                                      </WhatsappShareButton>
                                    </li>
                                    <li className="dropDownLi">
                                      <TelegramShareButton
                                        url={`${share_url}/product/${product.slug}`}
                                      >
                                        <TelegramIcon size={32} round={true} />{" "}
                                        <span>Telegram</span>
                                      </TelegramShareButton>
                                    </li>
                                    <li className="dropDownLi">
                                      <FacebookShareButton
                                        url={`${share_url}/product/${product.slug}`}
                                      >
                                        <FacebookIcon size={32} round={true} />{" "}
                                        <span>Facebook</span>
                                      </FacebookShareButton>
                                    </li>
                                    <li>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          navigator.clipboard.writeText(
                                            `${share_url}/product/${product.slug}`
                                          );
                                          toast.success("Copied Succesfully!!");
                                        }}
                                        className="react-share__ShareButton"
                                      >
                                        {" "}
                                        <BiLink size={30} />{" "}
                                        <span>Copy Link</span>
                                      </button>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </Slider>
                  </div>
                </div>

                {index0 === 1 && (
                  <div className="product_section row flex-column" id="offers">
                    <Offers />
                  </div>
                )}
              </div>
            ))}
            <QuickViewModal
              selectedProduct={selectedProduct}
              setselectedProduct={setselectedProduct}
              productTriggered={productTriggered}
              setProductTriggered={setProductTriggered}
            />
          </>
        )}
        {offerConatiner === 1 ? <Offers /> : null}
        {/* <div>
                    <div className="product_container">
                    <Offers />
                    </div>
                </div> */}
      </div>
      {isLogin && (
        <LoginUser isOpenModal={isLogin} setIsOpenModal={setIsLogin} />
      )}
    </section>
  );
};

export default ProductContainer;
