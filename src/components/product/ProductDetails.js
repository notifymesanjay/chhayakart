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
import RelateProducts from "./related-products";
import RelateProduct from "./related-products";
import Product from "./product";

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

const ProductDetails = ({
  productTriggered,
  setProductTriggered = () => {},
}) => {
  const dispatch = useDispatch();
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
  const [isViewModal, setIsViewModal] = useState(false);

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
      console.log("productDetails1");
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
      console.log("productDetails2");
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
            <Product
              images={images}
              mainimage={mainimage}
              productbrand={productbrand}
              setmainimage={setmainimage}
              addtoCart={addtoCart}
              productdata={productdata}
              productTriggered={productTriggered}
              setProductTriggered={setProductTriggered}
              removefromCart={removefromCart}
              getProductVariants={getProductVariants}
            />
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
                        <RelateProduct
                          index={index}
                          related_product={related_product}
                          productTriggered={productTriggered}
                          setIsViewModal={setIsViewModal}
                          setselectedProduct={setselectedProduct}
                          setSelectedProductId={setSelectedProductId}
                          setProductTriggered={setProductTriggered}
                          getProductVariants={getProductVariants}
                          removefromCart={removefromCart}
                          addtoCart={addtoCart}
                        />
                      </div>
                    ))}
                  </Slider>
                </div>
              )}
            </div>
          </div>
          {isViewModal && (
            <QuickViewModal
              selectedProduct={selectedProduct}
              setselectedProduct={setselectedProduct}
              productTriggered={productTriggered}
              setProductTriggered={setProductTriggered}
              isOpenModal={isViewModal}
              setIsOpenModal={setIsViewModal}
            />
          )}
        </div>

        {isLogin && (
          <LoginUser isOpenModal={isLogin} setIsOpenModal={setIsLogin} />
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
