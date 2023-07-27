import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "universal-cookie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import DownloadApp from "../../public/images/logo/app-logo.svg";
import ChhayakartPinkLogo from "../../public/images/logo/chhayakart-pink-logo.png";
import { removelocalstorageOTP } from "../../utils/manageLocalStorage";
import api from "../../api/api";
import { ActionTypes } from "../../model/action-type";
import styles from "./sidebar.module.scss";

const Sidebar = ({ setIsLogin = () => {}, closeRef }) => {
  const user = useSelector((state) => state.user);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cookies = new Cookies();

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

  const handleWishlist = () => {
    if (user.status === "loading") {
      toast.error("OOPS! You have to login first to see notification!");
    } else {
      navigate("/wishlist");
    }
  };

  const handleOrders = () => {
    if (user.status === "loading") {
      toast.error("OOPS! You have to login first to see notification!");
    } else {
      navigate("/profile");
    }
  };

  return (
    <div>
      <div className={styles.headerWrapper}>
        <div className={styles.iconWrapper}>
          <FontAwesomeIcon
            icon={faAngleLeft}
            className={styles.backIcon}
            data-bs-dismiss="offcanvas"
            aria-label="Close"
            ref={closeRef}
          />
          <p className={styles.header}> Gaon Ki Dukaan Me Swagat Hai </p>
        </div>
        {user.status === "loading" && (
          <button
            className={styles.loginBtn}
            onClick={() => {
              setIsLogin(true);
            }}
            data-bs-dismiss="offcanvas"
            aria-label="Close"
            ref={closeRef}
          >
            Login
          </button>
        )}
      </div>
      <ul className={styles.listWrapper}>
        <li
          className={styles.listItem}
          data-bs-dismiss="offcanvas"
          aria-label="Close"
          ref={closeRef}
          onClick={() => {
            navigate("/");
          }}
        >
          Home
        </li>
        <li
          className={styles.listItem}
          data-bs-dismiss="offcanvas"
          aria-label="Close"
          ref={closeRef}
          onClick={() => {
            navigate("/subCategory/96");
          }}
        >
          Season Special
        </li>
        <li
          className={styles.listItem}
          data-bs-dismiss="offcanvas"
          aria-label="Close"
          ref={closeRef}
          onClick={handleOrders}
        >
          My Orders
        </li>
        <li
          className={styles.listItem}
          data-bs-dismiss="offcanvas"
          aria-label="Close"
          ref={closeRef}
          onClick={handleWishlist}
        >
          My Wishlist
        </li>
        <li className={`${styles.listItem} ${styles.disableItem}`}>
          Chhaya Purse<span className={styles.comingSoon}>( Coming Soon )</span>
        </li>
        <li className={`${styles.listItem} ${styles.disableItem}`}>
          Share & Earn<span className={styles.comingSoon}>( Coming Soon )</span>
        </li>
        <li className={`${styles.listItem} ${styles.disableItem}`}>
          Donate<span className={styles.comingSoon}>( Coming Soon )</span>
        </li>
        <p className={styles.subHeader}>Help & Support</p>
        <li
          className={styles.listItem}
          data-bs-dismiss="offcanvas"
          aria-label="Close"
          ref={closeRef}
          onClick={() => {
            navigate("/about");
          }}
        >
          About Chayyakart
        </li>
        <li
          className={styles.listItem}
          data-bs-dismiss="offcanvas"
          aria-label="Close"
          ref={closeRef}
          onClick={() => {
            navigate("/terms");
          }}
        >
          Chayyakart Terms
        </li>
        <li
          className={styles.listItem}
          data-bs-dismiss="offcanvas"
          aria-label="Close"
          ref={closeRef}
          onClick={() => {
            navigate("/policy/Privacy_Policy");
          }}
        >
          Chayyakart Policies
        </li>
        <li
          className={styles.listItem}
          data-bs-dismiss="offcanvas"
          aria-label="Close"
          ref={closeRef}
          onClick={() => {
            navigate("/contact");
          }}
        >
          Contact Us
        </li>
        {user.status !== "loading" && (
          <li
            className={styles.listItem}
            onClick={handleLogout}
            data-bs-dismiss="offcanvas"
            aria-label="Close"
            ref={closeRef}
          >
            Logout
          </li>
        )}
      </ul>
      <div className={styles.bottomSection}>
        <div className={styles.downloadAppWrapper}>
          <p className={styles.downloadAppHeader}>Download the App</p>
          <a href="https://play.google.com/store/apps/details?id=com.chayakart">
            <img src={DownloadApp} alt="app-download" />
          </a>
        </div>
        <img
          className={styles.logo}
          src={ChhayakartPinkLogo}
          alt="chayyakart-logo"
        />
      </div>
    </div>
  );
};

export default Sidebar;
