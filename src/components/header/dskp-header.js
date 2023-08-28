import React from "react";
import CkLogo from "../../public/images/logo/chhayakart-white-mini-logo.png";
import styles from "./dskp-header.module.scss";
import { useRef } from "react";
import { useState, useEffect } from "react";
import { useOnHoverOutside } from "./useOnHoverOutside";
import LoginUser from "../login/login-user";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import api from "../../api/api";
import Cookies from "universal-cookie";
import { removelocalstorageOTP } from "../../utils/manageLocalStorage";
import { ActionTypes } from "../../model/action-type";
import TemHeader from "./HeadTemp";
import { GoLocation } from "react-icons/go";
import { IoMdArrowDropdown } from "react-icons/io";
import Location from "../location/Location";
import CkModal from "../shared/ck-modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faLocationDot } from "@fortawesome/free-solid-svg-icons";

const DskpHeader = ({
  productTriggered,
  setProductTriggered = () => {},
  locationModalTrigger,
  isLocationPresent = false,
  setisLocationPresent = () => {},
}) => {
  const city = useSelector((state) => state.city);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const cookies = new Cookies();
  const signInRef = useRef(null);
  const helpRef = useRef(null);
  const navigate = useNavigate();
  const [isSignInDropDown, setIsSignInDropDown] = useState(false);
  const [isHelpDropDown, setIsHelpDropDown] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [showLocation, setShowLocation] = useState(false);

  const [productsInCart, setProductsInCart] = useState(0);
  const cart = useSelector((state) => state.cart);
  const handleWishlist = () => {
    if (user.status === "loading") {
      toast.error("You have to login first to see Wishlist !");
    } else {
      navigate("/wishlist");
    }
  };

  const handleOrders = () => {
    if (user.status === "loading") {
      toast.error("You have to login first to track your Orders !");
    } else {
      navigate("/profile");
    }
  };

  const handleLogout = () => {
    api
      .logout(cookies.get("jwt_token"))
      .then((response) => response.json())
      .then((result) => {
        if (result.status === 1) {
          cookies.remove("jwt_token");
          removelocalstorageOTP();
          dispatch({ type: ActionTypes.LOGOUT_AUTH, payload: null });
          toast.success("You're Successfully Logged Out");
          navigate("/");
        } else {
          toast.info(result.message);
        }
      });
  };

  const closeSignInMenu = () => {
    setIsSignInDropDown(false);
  };

  const closeHelpMenu = () => {
    setIsHelpDropDown(false);
  };

  const closeLocation = () => {
    setShowLocation(false);
  };

  useEffect(() => {
    if (cookies.get("jwt_token") === undefined) {
      if (localStorage.getItem("cart")) {
        const cartVal = JSON.parse(localStorage.getItem("cart"));
        if (cartVal) {
          setProductsInCart(cartVal.length);
        }
      }
    } else {
      if (cart.cart !== null) {
        setProductsInCart(cart.cart.total);
      }
    }
  }, [cart, productTriggered]);

  useOnHoverOutside(signInRef, closeSignInMenu);
  useOnHoverOutside(helpRef, closeHelpMenu);

  return (
    <div className={styles.headerWrapper}>
      <div className={`container ${styles.rowWrapper}`}>
        <img
          src={CkLogo}
          className={styles.logo}
          alt="ck-logo"
          onClick={() => {
            navigate("/");
          }}
        />
        <button
          type="button"
          onClick={() => {
            setShowLocation(true);
            console.log("xyz", showLocation);
          }}
          className={styles.locationWrapper}
        >
          <div className={styles.iconWrapper}>
            <div>
              {/* GuestLogin fuctionality need to be done */}
              {/* <GoLocation /> */}
              <FontAwesomeIcon
                className={styles.locationIcon}
                icon={faLocationDot}
              />
            </div>
            <div className={styles.deliverWrapper}>
              <span className={styles.deliveryDescription}>Deliver to </span>
              <span className={styles.currentLocation}>
                {isLocationPresent ? (
                  <>
                    {city.status === "fulfill" ? (
                      city.city.formatted_address
                    ) : (
                      <div className="d-flex justify-content-center">
                        <div className="spinner-border" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      </div>
                    )}
                    <FontAwesomeIcon
                      className={styles.caretIcon}
                      icon={faCaretDown}
                    />
                  </>
                ) : (
                  "Please select location"
                )}
              </span>
            </div>
          </div>
        </button>
        <div className={styles.linkWrapper}>
          {/* <p>ASKCK</p> */}
          <div
            className={styles.dropDown}
            ref={helpRef}
            onMouseOver={() => setIsHelpDropDown(true)}
          >
            <p className={styles.link}>Help</p>
            {isHelpDropDown && (
              <div className={styles.dropDownWrapper} name="dropDown">
                <div className={styles.optionWrapper}>
                  <p
                    className={styles.link}
                    onClick={() => {
                      navigate("/about");
                    }}
                  >
                    About Us
                  </p>
                  <p
                    className={styles.link}
                    onClick={() => {
                      navigate("/terms");
                    }}
                  >
                    Chhayakart Terms
                  </p>
                  <p
                    className={styles.link}
                    onClick={() => {
                      navigate("/policy/Privacy_Policy");
                    }}
                  >
                    Chhayakart Policies
                  </p>
                  <p
                    className={styles.link}
                    onClick={() => {
                      navigate("/contact");
                    }}
                  >
                    Contact Us
                  </p>
                </div>
              </div>
            )}
          </div>
          <div
            ref={signInRef}
            className={styles.dropDown}
            onMouseOver={() => setIsSignInDropDown(true)}
          >
            <p className={styles.link}>Sign In</p>
            {isSignInDropDown && (
              <div className={styles.dropDownWrapper} name="dropDown">
                <div className={styles.btnWrapper}>
                  {/* <p className={styles.label}>New to Chhayakart?</p> */}
                  <button
                    className={styles.signInBtn}
                    onClick={() => {
                      if (user.status === "loading") {
                        setIsLogin(true);
                      }
                    }}
                  >
                    {user.status === "loading"
                      ? "Sign In"
                      : `Hello ${user.user.name}`}
                  </button>
                </div>
                <div className={styles.optionWrapper}>
                  <p
                    className={styles.link}
                    onClick={() => {
                      navigate("/");
                    }}
                  >
                    Home
                  </p>
                  <p className={styles.link} onClick={handleOrders}>
                    My Orders
                  </p>
                  <p className={styles.link} onClick={handleWishlist}>
                    My Wishlist
                  </p>
                  <p className={styles.link}>
                    Chhaya Purse{" "}
                    <span className={styles.comingSoon}>( Coming Soon )</span>
                  </p>
                  <p className={styles.link}>
                    Share & Earn{" "}
                    <span className={styles.comingSoon}>( Coming Soon )</span>
                  </p>
                  <p className={styles.link}>
                    Donate{" "}
                    <span className={styles.comingSoon}>( Coming Soon )</span>
                  </p>
                  {user.status !== "loading" && (
                    <p className={styles.link} onClick={handleLogout}>
                      Logout
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
          <div>
            <TemHeader
              productTriggered={productTriggered}
              setProductTriggered={setProductTriggered}
            />
          </div>
        </div>
      </div>

      {showLocation && (
        <CkModal show={showLocation} onHide={closeLocation}>
          <Location
            isLocationPresent={isLocationPresent}
            setisLocationPresent={setisLocationPresent}
            isModalClosed={showLocation}
            setShowLocation={setShowLocation}
          />
        </CkModal>
      )}

      {isLogin && (
        <LoginUser isOpenModal={isLogin} setIsOpenModal={setIsLogin} />
      )}
    </div>
  );
};

export default DskpHeader;
