import React from "react";
import Login from "./Login";
import CkModal from "../shared/ck-modal";
import { useState } from "react";

const LoginUser = ({ isOpenModal, setIsOpenModal = () => {} }) => {
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

  const closeLogin = () => {
    setError("");
    setOTP("");
    setcheckboxSelected(false);
    setisLoading(false);
    setIsOTP(false);
    setIsOpenModal(false);
  };

  return (
    <>
    <CkModal show={isOpenModal} onHide={closeLogin}>
      <Login
        checkboxSelected={checkboxSelected}
        setIsOpenModal={setIsOpenModal}
        setError={setError}
        setIsOTP={setIsOTP}
        setisLoading={setisLoading}
        setOtpVal={setOTP}
        setcheckboxSelected={setcheckboxSelected}
        otpVal={OTP}
        isLoading={isLoading}
        isOTP={isOTP}
        error={error}
      />
    </CkModal>
    </>
  );
};

export default LoginUser;
