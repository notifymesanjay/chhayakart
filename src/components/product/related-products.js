import React, { useState } from "react";
import { AiOutlineEye } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaRupeeSign } from "react-icons/fa";
import { BiLink, BiMinus } from "react-icons/bi";
import { BsPlus, BsShare } from "react-icons/bs";
import {
  FacebookIcon,
  FacebookShareButton,
  TelegramIcon,
  TelegramShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";
import { toast } from "react-toastify";
import Cookies from "universal-cookie";
import { ActionTypes } from "../../model/action-type";
import {
  addProductToCart,
  decrementProduct,
  incrementProduct,
} from "../../services/cartService";

const RelateProduct = ({
  index,
  related_product,
  productTriggered,
  setIsViewModal = () => {},
  setselectedProduct = () => {},
  setSelectedProductId = () => {},
  setProductTriggered = () => {},
  getProductVariants = () => {},
  removefromCart = () => {},
  addtoCart = () => {},
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cookies = new Cookies();

  const [isCart, setIsCart] = useState(false);
  const [productInCartCount, setProductInCartCount] = useState(0);

  const handleAddToCart = (index, related_product) => {
    if (cookies.get("jwt_token") !== undefined) {
      setIsCart(true);
      setProductInCartCount(1);
      addtoCart(
        related_product.id,
        JSON.parse(
          document.getElementById(`select-product${index}-variant-section`)
            .value
        ).id,
        1
      );
    } else {
      addProductToCart(related_product);
      setIsCart(true);
      setProductInCartCount(1);
      setProductTriggered(!productTriggered);
    }
  };

  const handleDecrement = (related_product, index) => {
    var val = productInCartCount;
    if (cookies.get("jwt_token") !== undefined) {
      if (val === 1) {
        setProductInCartCount(0);
        setIsCart(false);
        removefromCart(
          related_product.id,
          JSON.parse(
            document.getElementById(`select-product${index}-variant-section`)
              .value
          ).id
        );
      } else {
        setProductInCartCount(val - 1);
        addtoCart(
          related_product.id,
          JSON.parse(
            document.getElementById(`select-product${index}-variant-section`)
              .value
          ).id,
          val - 1
        );
      }
    } else {
      const isDecremented = decrementProduct(
        related_product.id,
        related_product
      );
      if (isDecremented) {
        setProductInCartCount(val - 1);
      } else {
        setProductInCartCount(0);
        setIsCart(false);
      }
      setProductTriggered(!productTriggered);
    }
  };

  const handleIncrement = (related_product, index) => {
    var val = productInCartCount;
    if (cookies.get("jwt_token") !== undefined) {
      if (val < related_product.total_allowed_quantity) {
        setProductInCartCount(val + 1);
        addtoCart(
          related_product.id,
          JSON.parse(
            document.getElementById(`select-product${index}-variant-section`)
              .value
          ).id,
          val + 1
        );
      }
    } else {
      const isIncremented = incrementProduct(
        related_product.id,
        related_product
      );
      if (isIncremented) {
        setProductInCartCount(val + 1);
      }
      setProductTriggered(!productTriggered);
    }
  };
  return (
    <div className="product-card">
      <div className="image-container">
        <span
          className="border border-light rounded-circle p-2 px-3"
          id="aiEye"
          onClick={() => {
            setselectedProduct(related_product);
            setIsViewModal(true);
          }}
        >
          <AiOutlineEye
            onClick={() => {
              setselectedProduct(related_product);
              setIsViewModal(true);
            }}
          />
        </span>
        <div className="imageWrapper">
          <img
            data-src={related_product.image_url}
            alt={related_product.slug}
            className="card-img-top lazyload"
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
            {related_product.variants[0].discounted_price}{" "} ({Math.round(parseFloat((related_product.variants[0].price-related_product.variants[0].discounted_price)*100/related_product.variants[0].price))}% off)
          </span>
          <span
            id={`price${index}-section`}
            className="d-flex align items-center"
            style={{ textDecoration: "line-through" }}
          >
            <p id="fa-rupee" className="m-0">
              <FaRupeeSign fill="var(--secondary-color)" />
            </p>{" "}
            {parseFloat(related_product.variants[0].price)}
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
                  document.getElementById(`price${index}-section`).innerHTML =
                    parseFloat(JSON.parse(e.target.value).price);

                  if (isCart) {
                    setIsCart(false);
                  }
                }}
                defaultValue={JSON.stringify(related_product.variants[0])}
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
                value={JSON.stringify(related_product.variants[0])}
              />
              {/* <span className='variant_value select-arrow' id=''>{product.variants[0].measurement + " " + product.variants[0].stock_unit_name}
																	</span> */}
              <span className="variant_value select-arrow" id="">
                {related_product.variants[0].stock_unit_name}
              </span>
            </>
          )}
        </div>
      </div>

      <div className="d-flex flex-row border-top product-card-footer">
        <div className="border-end" style={{ flexGrow: "1" }}>
          {!isCart ? (
            <button
              type="button"
              id={`Add-to-cart-section${index}`}
              className="w-100 h-100 add-to-cart"
              onClick={() => {
                handleAddToCart(index, related_product);
              }}
            >
              add to cart
            </button>
          ) : (
            <div
              id={`input-cart-section${index}`}
              className="w-100 h-100 input-to-cart"
            >
              <button
                type="button"
                onClick={() => {
                  handleDecrement(related_product, index);
                }}
              >
                <BiMinus />
              </button>
              <span id={`input-section${index}`}>{productInCartCount}</span>
              <button
                type="button"
                onClick={() => {
                  handleIncrement(related_product, index);
                }}
              >
                <BsPlus />{" "}
              </button>
            </div>
          )}
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
                <WhatsappIcon size={32} round={true} /> <span>WhatsApp</span>
              </WhatsappShareButton>
            </li>
            <li className="dropDownLi">
              <TelegramShareButton
                url={`https://chhayakart.com/product/${related_product.slug}`}
              >
                <TelegramIcon size={32} round={true} /> <span>Telegram</span>
              </TelegramShareButton>
            </li>
            <li className="dropDownLi">
              <FacebookShareButton
                url={`https://chhayakart.com/product/${related_product.slug}`}
              >
                <FacebookIcon size={32} round={true} /> <span>Facebook</span>
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
  );
};

export default RelateProduct;
