import React, { useEffect, useState } from "react";
import "./productDetails.css";
import ProductCard from "../shared/card/product-card";
// import { FaRupeeSign } from "react-icons/fa";
import { BsHeart, BsShare, BsPlus, BsHeartFill } from "react-icons/bs";
import { BiMinus, BiLink } from "react-icons/bi";
import { toast } from "react-toastify";
import api from "../../api/api";
import { useDispatch, useSelector } from "react-redux";
import { ActionTypes } from "../../model/action-type";
import { useNavigate, Link, useParams } from "react-router-dom";
import Cookies from "universal-cookie";
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
import { useResponsive } from "../shared/use-responsive";
import Product from "./product";
import ProductMobile from "./product-mobile";
import ResponsiveCarousel from "../shared/responsive-carousel/responsive-carousel";

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
  const city = useSelector((state) => state.city);
  const [product, setProduct] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    return () => {
      dispatch({ type: ActionTypes.CLEAR_SELECTED_PRODUCT, payload: null });
      setproductbrand({});
    };
  }, []);

  useEffect(() => {
    const currUrl = window.location.href;
    const productId = currUrl.split("/")[4];
    setProduct(productId);
  }, [window.location.href]);

  const [mainimage, setmainimage] = useState("");
  const [images, setimages] = useState([]);
  const [productdata, setproductdata] = useState({});
  const [productSize, setproductSize] = useState({});
  const [productbrand, setproductbrand] = useState({});
  const [relatedProducts, setrelatedProducts] = useState(null);
  const [selectedProduct, setselectedProduct] = useState({});
  const [isLogin, setIsLogin] = useState(false);
  const [isViewModal, setIsViewModal] = useState(false);
  const { isSmScreen, isMobile } = useResponsive();

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
      .catch((error) => {});
  };

  const getProductDatafromApi = () => {
    // api.getProductbyFilter(city.city.id, city.city.latitude, city.city.longitude)
    //     .then(response => response.json())
    //     .then(result => {
    //         if (result.status === 1) {
    //             setproductSize(result.sizes)
    //         }
    //     })
    api
      .getProductbyId(
        city.city.id,
        city.city.latitude,
        city.city.longitude,
        product
      )
      .then((response) => response.json())
      .then((result) => {
        if (result.status === 1) {
          setproductdata(result.data);
          setmainimage(result.data.image_url);
          setimages(result.data.images);
          getBrandDetails(result.data.brand_id);
        }
      })
      .catch((error) => {});
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
    if (
      city.city !== null &&
      slug !== undefined &&
      Object.keys(productdata).length !== 0
    ) {
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
            for (let i = 0; i < result.data.length; i++) {
              if (slug.toLowerCase() === result.data[i].slug.toLowerCase()) {
                dispatch({
                  type: ActionTypes.SET_SELECTED_PRODUCT,
                  payload: result.data[i].id,
                });
              }
            }
            setproductSize(result.sizes);
            setrelatedProducts(result.data);
          }
        })
        .catch((error) => {});
    }
  }, [city, productdata]);

  useEffect(() => {
    if (city.city !== null) {
      if (product !== 0) {
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
            .catch((error) => {});
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
            .catch((error) => {});
        } else {
          toast.error(result.message);
        }
      });
  };

  return (
    <div className="product-details-view">
      <div className="container" style={{ gap: "20px" }}>
        <div className="top-wrapper">
          {product === 0 ||
          Object.keys(productdata).length === 0 ||
          Object.keys(productSize).length === 0 ? (
            <div className="d-flex justify-content-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <>
              {!isSmScreen ? (
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
              ) : (
                <ProductMobile
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
            </>
          )}
        </div>

        {/* <div className="description-wrapper">
					<h5 className="title">Product Description</h5>
					<div>
						<div
							className="description product_description"
							style={{ overflow: "hidden" }}
							dangerouslySetInnerHTML={{ __html: productdata.description }}
						></div>
					</div>
				</div> */}

        <div className="related-product-wrapper">
          <h4 className="relatedProductsHeader">You might also like</h4>
          <div className="related-product-container">
            {relatedProducts === null ? (
              <div className="d-flex justify-content-center">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <div className="row">
                {/* //<ResponsiveCarousel */}
                <ResponsiveCarousel
                  items={5}
                  itemsInTablet={3}
				  itemsInMobile={1}
                  infinite={false}
                  autoPlaySpeed={4000}
                  showArrows={false}
                  showDots={false}
                  autoPlay={true}
                  partialVisible={isMobile}
                  partialVisibilityGutter={16}
                >
                  {relatedProducts.map((related_product, index) => (
                    <div className="col-md-3 col-lg-4" key={index}>
                      <ProductCard
                        productTriggered={productTriggered}
                        setProductTriggered={setProductTriggered}
                        product={related_product}
                        displayAddtoCart={false}
						className="customProductCard"
                      />
                      {/* <RelateProduct
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
											/> */}
                    </div>
                  ))}
                </ResponsiveCarousel>
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
  );
};

export default ProductDetails;
