import React, { useState, useRef } from "react";
import "./login.css";
import { AiOutlineCloseCircle } from "react-icons/ai";
import api from "../../api/api";
import { useDispatch } from "react-redux";
import { ActionTypes } from "../../model/action-type";
import { toast } from "react-toastify";
import Loader from "../loader/Loader";

//phone number input
import PhoneInput from "react-phone-number-input";
import { parsePhoneNumber } from "react-phone-number-input";
import validator from "validator";

//otp
import OTPInput from "otp-input-react";

//firebase
import { authentication } from "../../utils/firebase/firebase-config";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

import Cookies from "universal-cookie";
import jwt from "jwt-decode";
import { setlocalstorageOTP } from "../../utils/manageLocalStorage";
import { Link, Navigate, useNavigate } from "react-router-dom";
import CkModal from "../shared/ck-modal";

const Login = ({ isOpenModal, setIsOpenModal = () => {} }) => {
  //initialize Cookies
  const cookies = new Cookies();
  const Navigate = useNavigate();
  const closeModalRef = useRef();

  const dispatch = useDispatch();

  const [phonenum, setPhonenum] = useState();
  const [checkboxSelected, setcheckboxSelected] = useState(false);
  const [error, setError] = useState(
    "",
    setTimeout(() => {
      if (error !== "") setError("");
    }, 5000)
  );
  const [isOTP, setIsOTP] = useState(false);
  const [Uid, setUid] = useState("");
  const [OTP, setOTP] = useState("");
  const [isLoading, setisLoading] = useState(false);

  const generateRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response) => {
            // reCAPTCHA solved, allow signInWithPhoneNumber.
          },
        },
        authentication
      );
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!checkboxSelected) {
      setError("Accept Terms and Policies!");
    } else {
      if (phonenum === undefined) {
        setError("Please enter phone number!");
      } else if (validator.isMobilePhone(phonenum)) {
        setIsOTP(true);
        // setOTP("");

        //OTP Generation
        generateRecaptcha();
        let appVerifier = window.recaptchaVerifier;
        signInWithPhoneNumber(authentication, phonenum, appVerifier)
          .then((confirmationResult) => {
            console.log(confirmationResult);
            window.confirmationResult = confirmationResult;
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        setPhonenum();
        setError("Enter a valid phone number");
      }
    }
  };

  const getCurrentUser = (token) => {
    api
      .getUser(token)
      .then((response) => response.json())
      .then((result) => {
        if (result.status === 1) {
          dispatch({
            type: ActionTypes.SET_CURRENT_USER,
            payload: result.user,
          });
          setIsOpenModal(false);
          setisLoading(true);
          toast.success("You're successfully Logged In");
        }
      });
  };
  //otp verification
  const verifyOTP = async (e) => {
    e.preventDefault();
    setisLoading(true);

    let confirmationResult = window.confirmationResult;

    await confirmationResult
      .confirm(OTP)
      .then((result) => {
        // User verified successfully.
        setUid(result.user.uid);
        const countrycode = parsePhoneNumber(phonenum).countryCallingCode;
        const num = parsePhoneNumber(phonenum).nationalNumber;

        //login call
        loginApiCall(num, result.user.uid, countrycode);
      })
      .catch(() => {
        // User couldn't sign in (bad verification code?)
        setisLoading(false);
        setError("Invalid Code");
      });

    // const countrycode = parsePhoneNumber(phonenum).countryCallingCode;
    // const num = parsePhoneNumber(phonenum).nationalNumber;

    // //login call
    // loginApiCall(num, OTP, countrycode)
  };
  const loginApiCall = async (num, Uid, countrycode) => {
    await api
      .login(num, Uid, countrycode)
      .then((response) => response.json())
      .then((result) => {
        if (result.status === 1) {
          const decoded = jwt(result.data.access_token);

          const tomorrow = new Date();
          tomorrow.setDate(new Date().getDate() + 1);
          cookies.set("jwt_token", result.data.access_token, {
            expire: new Date(tomorrow),
          });

          getCurrentUser(result.data.access_token);
          setlocalstorageOTP(Uid);
          closeModalRef.current.click();
        } else {
          setError(result.message);
          setOTP("");
        }

        setisLoading(false);
      })
      .catch((error) => console.log("error ", error));
  };
  const handleTerms = () => {
    if (closeModalRef.current) {
      Navigate("/terms");
      closeModalRef.current.click();
    }
  };
  const handlePolicy = () => {
    if (closeModalRef.current) {
      Navigate("/policy/Privacy_Policy");
      closeModalRef.current.click();
    }
  };

  const closeLogin = () => {
    setError("");
        setOTP("");
        setcheckboxSelected(false);
        setisLoading(false);
        setIsOTP(false);
        setIsOpenModal(false);
  }

  return (
    <CkModal
      show={isOpenModal}
      onHide={closeLogin}
    >
      <div>
        <div>
          <h5 className="header">Login</h5>
          <div className="bodyWrapper">
            <img
              className="ck-logo"
              src="https://admin.chhayakart.com/storage/logo/1680098508_37047.png"
              alt="logo"
            ></img>

            {isOTP ? (
              <>
                <h5 className="header">enter verification code</h5>
                <span className="description">
                  we have sent verification code to{" "}
                  <p className="phoneNumber">{phonenum}</p>
                </span>
              </>
            ) : (
              <>
                <h5 className="header">Welcome!</h5>
                <span className="description">
                  Enter phone number to continue and we will send a verification
                  code to this number.
                </span>
              </>
            )}

            {error === "" ? "" : <span className="error-msg">{error}</span>}

            {isOTP ? (
              <form className="formWrapper" onSubmit={verifyOTP}>
                {isLoading ? <Loader width="100%" height="auto" /> : null}
                <OTPInput
                  className="otp-container"
                  value={OTP}
                  onChange={setOTP}
                  autoFocus
                  OTPLength={6}
                  otpType="number"
                  disabled={false}
                  secure
                />
                <span className="description">
                  <input
                    type="checkbox"
                    className="mx-2"
                    checked={checkboxSelected}
                    required
                    onChange={() => {
                      setcheckboxSelected(!checkboxSelected);
                    }}
                  />
                  I Agree to the <a onClick={handleTerms}>terms & condition</a>{" "}
                  and <a onClick={handlePolicy}>Privacy & policy</a>
                </span>
                <button
                  whileTap={{ scale: 0.6 }}
                  type="submit"
                  className="login-btn"
                >
                  Verify
                </button>
              </form>
            ) : (
              <form className="formWrapper" onSubmit={handleLogin}>
                <div className="inputWrapper">
                  <PhoneInput
                    value={phonenum}
                    defaultCountry="IN"
                    onChange={setPhonenum}
                  />
                </div>

                <span className="description">
                  <input
                    type="checkbox"
                    className="mx-2"
                    required
                    checked={checkboxSelected}
                    onChange={() => {
                      setcheckboxSelected(!checkboxSelected);
                    }}
                  />
                  {/* I Agree to the <Link to={'/terms'}>terms & condition</Link> and <Link to={'/policy/Privacy_Policy'}>Privacy & policy</Link> */}
                  I Agree to the{" "}
                  <span className="terms-and-policy" onClick={handleTerms}>
                    terms & condition
                  </span>{" "}
                  and{" "}
                  <span className="terms-and-policy" onClick={handlePolicy}>
                    Privacy & policy
                  </span>
                </span>
                <button whileTap={{ scale: 0.6 }} type="submit">
                  {" "}
                  Login to Continue
                </button>
              </form>
            )}
          </div>
        </div>
        <div id="recaptcha-container" style={{ display: "none" }}></div>
      </div>
    </CkModal>
  );
};

export default Login;
