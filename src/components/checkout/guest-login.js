import React, { useState } from "react";
import Login from "../login/Login";
import "../login/login.css";
import "./checkout.css";

const GuestLogin = ({ setIsUserLoggedIn = () => {} }) => {
  const [checkboxSelected, setcheckboxSelected] = useState(false);
  const [error, setError] = useState(
    "",
    setTimeout(() => {
      if (error !== "") setError("");
    }, 5000)
  );
  const [isOTP, setIsOTP] = useState(false);
  const [OTP, setOTP] = useState("");
  const [isLoading, setisLoading] = useState(false);

  return (
    <div className="checkout-util-container">
      <div className="billibg-address-wrapper checkout-component">
        <span className="heading">Guest Login</span>

        <div className="order-details">
          <div className="login-summary">
            <Login
              isCheckout={true}
              checkboxSelected={checkboxSelected}
              setError={setError}
              setIsOTP={setIsOTP}
              setisLoading={setisLoading}
              setOTP={setOTP}
              setcheckboxSelected={setcheckboxSelected}
              OTP={OTP}
              isLoading={isLoading}
              isOTP={isOTP}
              error={error}
              setIsUserLoggedIn={setIsUserLoggedIn}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestLogin;
