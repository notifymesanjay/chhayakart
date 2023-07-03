import React, { useEffect, useState } from "react";
import "./product.css";

// import { FaRupeeSign } from "react-icons/fa";
import { BsHeart, BsShare, BsPlus, BsHeartFill } from "react-icons/bs";
import { BiMinus, BiLink } from "react-icons/bi";
import { toast } from "react-toastify";
import api from "../../api/api";
import { useDispatch, useSelector } from "react-redux";
import { ActionTypes } from "../../model/action-type";
import { useNavigate, Link, useParams } from "react-router-dom";
import Cookies from "universal-cookie";
import Slider from "react-slick";
import { AiOutlineEye } from "react-icons/ai";
import { FaChevronLeft, FaChevronRight, FaRupeeSign } from "react-icons/fa";
import {
  getSelectedProductId,
  removeSelectedProductId,
  setSelectedProductId,
} from "../../utils/manageLocalStorage";
import {
  FacebookIcon,
  FacebookShareButton,
  TelegramIcon,
  TelegramShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";
import QuickViewModal from "./QuickViewModal";
import {
  addProductToCart,
  decrementProduct,
  incrementProduct,
} from "../../services/cartService";
import LoginUser from "../login/login-user";

function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
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
              borderRadius: "50%",
              width: "30px",
              height: "30px",
            }
          : { display: "none" }
      }
      onClick={onClick}
    />
  );
}

function SampleNextArrow(props) {
  const { className, style, onClick } = props;
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
              margin: "0 -10px",
              background: "var(--secondary-color)",
              borderRadius: "50%",
              width: "30px",
              height: "30px",
            }
          : { display: "none" }
      }
      onClick={onClick}
    />
  );
}

const ProductDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cookies = new Cookies();
  const { slug } = useParams();

  const product = useSelector((state) => state.selectedProduct);
  const city = useSelector((state) => state.city);

  useEffect(() => {
    return () => {
      dispatch({ type: ActionTypes.CLEAR_SELECTED_PRODUCT, payload: null });
      setproductcategory({});
      setproductbrand({});
    };
  }, []);

  const [mainimage, setmainimage] = useState("");
  const [images, setimages] = useState([]);
  const [productdata, setproductdata] = useState({});
  const [productSize, setproductSize] = useState({});
  const [productcategory, setproductcategory] = useState({});
  const [productbrand, setproductbrand] = useState({});
  const [relatedProducts, setrelatedProducts] = useState(null);
  const [selectedProduct, setselectedProduct] = useState({});
  const [isLogin, setIsLogin] = useState(false);

  const getCategoryDetails = (id) => {
    api
      .getCategory()
      .then((response) => response.json())
      .then((result) => {
        if (result.status === 1) {
          result.data.forEach((ctg) => {
            if (ctg.id === id) {
              setproductcategory(ctg);
            }
          });
        }
      })
      .catch((error) => console.log(error));
  };

  const getBrandDetails = (id) => {
    api
      .getBrands()
      .then((response) => response.json())
      .then((result) => {
        if (result.status === 1) {
          result.data.forEach((brnd) => {
            if (brnd.id === id) {
              setproductbrand(brnd);
            }
          });
        }
      })
      .catch((error) => console.log(error));
  };

  const getProductDatafromApi = () => {
    // api.getProductbyFilter(city.city.id, city.city.latitude, city.city.longitude)
    //     .then(response => response.json())
    //     .then(result => {
    //         if (result.status === 1) {
    //             setproductSize(result.sizes)
    //         }
    //     })
    //     .catch(error => console.log(error))
    api
      .getProductbyId(
        city.city.id,
        city.city.latitude,
        city.city.longitude,
        product.selectedProduct_id
      )
      .then((response) => response.json())
      .then((result) => {
        if (result.status === 1) {
          setproductdata(result.data);
          setmainimage(result.data.image_url);
          setimages(result.data.images);
          getCategoryDetails(result.data.category_id);
          getBrandDetails(result.data.brand_id);
        }
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    const selected_prod_id = getSelectedProductId();
    if (selected_prod_id !== null && selected_prod_id !== undefined) {
      dispatch({
        type: ActionTypes.SET_SELECTED_PRODUCT,
        payload: selected_prod_id,
      });
    }
  }, []);

  useEffect(() => {
    const findProductBySlug = async () => {
      await api
        .getProductbyFilter(
          city.city.id,
          city.city.latitude,
          city.city.longitude,
          { slug: slug }
        )
        .then((response) => response.json())
        .then((result) => {
          if (result.status === 1) {
            dispatch({
              type: ActionTypes.SET_SELECTED_PRODUCT,
              payload: result.data[0].id,
            });
            // setSelectedProductId(result.data[0].id)
          } else {
          }
        })
        .catch((error) => console.log(error));
    };
    if (city.city !== null && slug !== undefined) {
      findProductBySlug();
    }
  }, [city]);

  useEffect(() => {
    if (Object.keys(productdata).length !== 0) {
      api
        .getProductbyFilter(
          city.city.id,
          city.city.latitude,
          city.city.longitude,
          {
            category_id: productdata.category_id,
          }
        )
        .then((response) => response.json())
        .then((result) => {
          if (result.status === 1) {
            setproductSize(result.sizes);
            setrelatedProducts(result.data);
          }
        })
        .catch((error) => console.log(error));
    }
  }, [productdata]);

  useEffect(() => {
    if (city.city !== null) {
      if (product.selectedProduct_id !== null && product.status !== "loading") {
        getProductDatafromApi();
      }
      // else {

      //     navigate("/")
      // }
    }
  }, [city, product]);

  useEffect(() => {
    return () => {
      removeSelectedProductId();
    };
  }, []);
  const settings = {
    infinite: false,
    slidesToShow: 5,
    initialSlide: 0,
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
        breakpoint: 1199,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 425,
        settings: {
          slidesToShow: 1.5,
          dots: true,
          arrows: false,
        },
      },
    ],
  };
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

  //for product variants
  const getProductSizeUnit = (variant) => {
    if (Object.keys(productSize).length > 0) {
      return productSize.map((psize) => {
        if (
          parseInt(psize.size) === parseInt(variant.measurement) &&
          psize.short_code === variant.stock_unit_name
        ) {
          return psize.unit_id;
        }
      });
    }
    return <></>;
  };

  const getProductVariants = (product) => {
    return product.variants.map((variant, index) => (
      <option key={index} value={JSON.stringify(variant)}>
        {variant.stock_unit_name} Rs.{variant.price}
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
  const favorite = useSelector((state) => state.favorite);
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
      document
        .getElementById(`Add-to-cart-productdetail`)
        .classList.toggle("visually-hidden");
      document
        .getElementById(`input-cart-productdetail`)
        .classList.toggle("visually-hidden");
      document.getElementById(`input-productdetail`).innerHTML = 1;
      addtoCart(
        productdata.id,
        JSON.parse(
          document.getElementById(`select-product-variant-productdetail`).value
        ).id,
        document.getElementById(`input-productdetail`).innerHTML
      );
    } else {
      addProductToCart(productdata);
      document
        .getElementById(`Add-to-cart-productdetail`)
        .classList.toggle("visually-hidden");
      document
        .getElementById(`input-cart-productdetail`)
        .classList.toggle("visually-hidden");
      document.getElementById(`input-productdetail`).innerHTML = 1;
    }
  };

  const handleAddToCart = (index, related_product) => {
    if (cookies.get("jwt_token") !== undefined) {
      document
        .getElementById(`Add-to-cart-section${index}`)
        .classList.remove("active");
      document
        .getElementById(`input-cart-section${index}`)
        .classList.add("active");
      document.getElementById(`input-section${index}`).innerHTML = 1;
      addtoCart(
        related_product.id,
        JSON.parse(
          document.getElementById(`select-product${index}-variant-section`)
            .value
        ).id,
        document.getElementById(`input-section${index}`).innerHTML
      );
    } else {
      addProductToCart(related_product);
      document
        .getElementById(`Add-to-cart-section${index}`)
        .classList.remove("active");
      document
        .getElementById(`input-cart-section${index}`)
        .classList.add("active");
      document.getElementById(`input-section${index}`).innerHTML = 1;
    }
  };

  const handleDecrement = () => {
    var val = parseInt(
      document.getElementById(`input-productdetail`).innerHTML
    );
    if (cookies.get("jwt_token") !== undefined) {
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
            document.getElementById(`select-product-variant-productdetail`)
              .value
          ).id
        );
      } else {
        document.getElementById(`input-productdetail`).innerHTML = val - 1;
        addtoCart(
          productdata.id,
          JSON.parse(
            document.getElementById(`select-product-variant-productdetail`)
              .value
          ).id,
          document.getElementById(`input-productdetail`).innerHTML
        );
      }
    } else {
      const isDecremented = decrementProduct(productdata.id, productdata);
      if (isDecremented) {
        document.getElementById(`input-productdetail`).innerHTML = val - 1;
      } else {
        document.getElementById(`input-productdetail`).innerHTML = 0;
        document
          .getElementById(`Add-to-cart-productdetail`)
          .classList.remove("visually-hidden");
        document
          .getElementById(`input-cart-productdetail`)
          .classList.toggle("visually-hidden");
      }
    }
  };

  const handleDecrement1 = (related_product, index) => {
    var val = parseInt(
      document.getElementById(`input-section${index}`).innerHTML
    );
    if (cookies.get("jwt_token") !== undefined) {
      if (val === 1) {
        document.getElementById(`input-section${index}`).innerHTML = 0;
        document
          .getElementById(`input-cart-section${index}`)
          .classList.remove("active");
        document
          .getElementById(`Add-to-cart-section${index}`)
          .classList.add("active");
        removefromCart(
          related_product.id,
          JSON.parse(
            document.getElementById(`select-product${index}-variant-section`)
              .value
          ).id
        );
      } else {
        document.getElementById(`input-section${index}`).innerHTML = val - 1;
        addtoCart(
          related_product.id,
          JSON.parse(
            document.getElementById(`select-product${index}-variant-section`)
              .value
          ).id,
          document.getElementById(`input-section${index}`).innerHTML
        );
      }
    } else {
      const isDecremented = decrementProduct(
        related_product.id,
        related_product
      );
      if (isDecremented) {
        document.getElementById(`input-section${index}`).innerHTML = val - 1;
      } else {
        document.getElementById(`input-section${index}`).innerHTML = 0;
        document
          .getElementById(`input-cart-section${index}`)
          .classList.remove("active");
        document
          .getElementById(`Add-to-cart-section${index}`)
          .classList.add("active");
      }
    }
  };

  const handleIncrement = () => {
    var val = document.getElementById(`input-productdetail`).innerHTML;
    if (cookies.get("jwt_token") !== undefined) {
      if (val < productdata.total_allowed_quantity) {
        document.getElementById(`input-productdetail`).innerHTML =
          parseInt(val) + 1;
        addtoCart(
          productdata.id,
          JSON.parse(
            document.getElementById(`select-product-variant-productdetail`)
              .value
          ).id,
          document.getElementById(`input-productdetail`).innerHTML
        );
      }
    } else {
      const isIncremented = incrementProduct(productdata.id, productdata);
      if (isIncremented) {
        document.getElementById(`input-productdetail`).innerHTML =
          parseInt(val) + 1;
      }
    }
  };

  const handleIncrement1 = (related_product, index) => {
    var val = document.getElementById(`input-section${index}`).innerHTML;
    if (cookies.get("jwt_token") !== undefined) {
      if (val < related_product.total_allowed_quantity) {
        document.getElementById(`input-section${index}`).innerHTML =
          parseInt(val) + 1;
        addtoCart(
          related_product.id,
          JSON.parse(
            document.getElementById(`select-product${index}-variant-section`)
              .value
          ).id,
          document.getElementById(`input-section${index}`).innerHTML
        );
      }
    } else {
      const isIncremented = incrementProduct(
        related_product.id,
        related_product
      );
      if (isIncremented) {
        document.getElementById(`input-section${index}`).innerHTML =
          parseInt(val) + 1;
      }
    }
  };

  return (
    <div className="product-details-view">
      <div className="container" style={{ gap: "20px" }}>
        <div className="top-wrapper">
          {product.selectedProduct_id === null ||
          Object.keys(productdata).length === 0 ||
          Object.keys(productSize).length === 0 ? (
            <div className="d-flex justify-content-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
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
                      <span
                        className="price green-text"
                        id={`price-productdetail`}
                      >
                        <FaRupeeSign fill="var(--secondary-color)" />
                        {parseFloat(productdata.variants[0].price)}{" "}
                      </span>{" "}
                      <div
                        className="not-price gray-text"
                        style={{ textDecoration: "line-through" }}
                      >
                        <FaRupeeSign
                          fill="var(--text-color)"
                          textDecoration="line-through"
                        />
                        {parseFloat(productdata.variants[0].price) +
                          productdata.variants[0].price * 0.13}
                      </div>
                    </div>
                  </div>
                  <div className="bottom-section">
                    <p>Product Variants</p>
                    <div className="d-flex gap-3 bottom-section-content">
                      <select
                        id={`select-product-variant-productdetail`}
                        onChange={(e) => {
                          document.getElementById(
                            `price-productdetail`
                          ).innerHTML = parseFloat(
                            JSON.parse(e.target.value).price
                          );

                          if (
                            document
                              .getElementById(`input-cart-productdetail`)
                              .classList.contains("active")
                          ) {
                            document
                              .getElementById(`input-cart-productdetail`)
                              .classList.remove("active");
                            document
                              .getElementById(`Add-to-cart-productdetail`)
                              .classList.add("active");
                          }
                        }}
                        defaultValue={JSON.stringify(productdata.variants[0])}
                      >
                        {getProductVariants(productdata)}
                      </select>

                      <button
                        type="button"
                        id={`Add-to-cart-productdetail`}
                        className="add-to-cart active"
                        onClick={addProductToCart1}
                      >
                        Add to Cart
                      </button>
                      <div
                        id={`input-cart-productdetail`}
                        className="input-to-cart visually-hidden"
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
                        <span id={`input-productdetail`}></span>
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
          )}
        </div>

        <div className="description-wrapper">
          <h5 className="title">Product Description</h5>
          <div>
            <div
              className="description product_description"
              style={{ overflow: "hidden" }}
              dangerouslySetInnerHTML={{ __html: productdata.description }}
            ></div>
          </div>

          <div className="related-product-wrapper">
            <h5>related product</h5>
            <div className="related-product-container">
              {relatedProducts === null ? (
                <div className="d-flex justify-content-center">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <div className="row">
                  <Slider {...settings}>
                    {relatedProducts.map((related_product, index) => (
                      <div className="col-md-3 col-lg-4">
                        <div className="product-card">
                          <div className="image-container">
                            <span
                              className="border border-light rounded-circle p-2 px-3"
                              id="aiEye"
                              onClick={() => {
                                setselectedProduct(related_product);
                              }}
                              data-bs-toggle="modal"
                              data-bs-target="#quickviewModal"
                            >
                              <AiOutlineEye
                                onClick={() => {
                                  setselectedProduct(related_product);
                                }}
                                data-bs-toggle="modal"
                                data-bs-target="#quickviewModal"
                              />
                            </span>
                            <img
                              src={related_product.image_url}
                              alt={related_product.slug}
                              className="card-img-top"
                              onClick={() => {
                                dispatch({
                                  type: ActionTypes.SET_SELECTED_PRODUCT,
                                  payload: related_product.id,
                                });
                                setSelectedProductId(related_product.id);
                                navigate("/product/" + related_product.id);
                                window.scrollTo(0, 0);
                              }}
                            />
                          </div>

                          <div
                            className="card-body product-card-body p-3"
                            onClick={() => {
                              dispatch({
                                type: ActionTypes.SET_SELECTED_PRODUCT,
                                payload: related_product.id,
                              });
                              setSelectedProductId(related_product.id);
                            }}
                          >
                            <h3>{related_product.name}</h3>
                            <div className="price">
                              <span
                                id={`price${index}-section`}
                                className="d-flex align-items-center"
                              >
                                <p id="fa-rupee" className="m-0">
                                  <FaRupeeSign fill="var(--secondary-color)" />
                                </p>
                                {related_product.variants[0].price}{" "}
                              </span>
                              <span
                                id={`price${index}-section`}
                                className="d-flex align items-center"
                                style={{ textDecoration: "line-through" }}
                              >
                                <p id="fa-rupee" className="m-0">
                                  <FaRupeeSign fill="var(--secondary-color)" />
                                </p>{" "}
                                {parseFloat(related_product.variants[0].price) +
                                  related_product.variants[0].price * 0.13}
                              </span>
                            </div>
                            <div className="product_varients_drop">
                              {related_product.variants.length > 1 ? (
                                <>
                                  <select
                                    style={{ fontSize: "8px !important" }}
                                    className="form-select variant_selection select-arrow"
                                    id={`select-product${index}-variant-section`}
                                    onChange={(e) => {
                                      document.getElementById(
                                        `price${index}-section`
                                      ).innerHTML = parseFloat(
                                        JSON.parse(e.target.value).price
                                      );

                                      if (
                                        document
                                          .getElementById(
                                            `input-cart-section${index}`
                                          )
                                          .classList.contains("active")
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
                                      related_product.variants[0]
                                    )}
                                  >
                                    {getProductVariants(related_product)}
                                  </select>
                                </>
                              ) : (
                                <>
                                  <input
                                    type="hidden"
                                    name=""
                                    id={`select-product${index}-variant-section`}
                                    value={JSON.stringify(
                                      related_product.variants[0]
                                    )}
                                  />
                                  {/* <span className='variant_value select-arrow' id=''>{product.variants[0].measurement + " " + product.variants[0].stock_unit_name}
																	</span> */}
                                  <span
                                    className="variant_value select-arrow"
                                    id=""
                                  >
                                    {
                                      related_product.variants[0]
                                        .stock_unit_name
                                    }
                                  </span>
                                </>
                              )}
                            </div>
                          </div>

                          <div className="d-flex flex-row border-top product-card-footer">
                            <div
                              className="border-end"
                              style={{ flexGrow: "1" }}
                            >
                              <button
                                type="button"
                                id={`Add-to-cart-section${index}`}
                                className="w-100 h-100 add-to-cart active"
                                onClick={() => {
                                  handleAddToCart(index, related_product);
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
                                    handleDecrement1(related_product, index);
                                  }}
                                >
                                  <BiMinus />
                                </button>
                                <span id={`input-section${index}`}></span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    handleIncrement1(related_product, index);
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
                                  url={`https://chhayakart.com/product/${related_product.slug}`}
                                >
                                  <WhatsappIcon size={32} round={true} />{" "}
                                  <span>WhatsApp</span>
                                </WhatsappShareButton>
                              </li>
                              <li className="dropDownLi">
                                <TelegramShareButton
                                  url={`https://chhayakart.com/product/${related_product.slug}`}
                                >
                                  <TelegramIcon size={32} round={true} />{" "}
                                  <span>Telegram</span>
                                </TelegramShareButton>
                              </li>
                              <li className="dropDownLi">
                                <FacebookShareButton
                                  url={`https://chhayakart.com/product/${related_product.slug}`}
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
                                      `https://chhayakart.com/product/${related_product.slug}`
                                    );
                                    toast.success("Copied Succesfully!!");
                                  }}
                                  className="react-share__ShareButton"
                                >
                                  {" "}
                                  <BiLink size={30} /> <span>Copy Link</span>
                                </button>
                              </li>
                            </ul>
                          </div>
						  
                          </div>
                        </div>
                      </div>
                    ))}
                  </Slider>
                </div>
              )}
            </div>
          </div>
          <QuickViewModal
            selectedProduct={selectedProduct}
            setselectedProduct={setselectedProduct}
          />
        </div>

        {isLogin && (
          <LoginUser isOpenModal={isLogin} setIsOpenModal={setIsLogin} />
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
