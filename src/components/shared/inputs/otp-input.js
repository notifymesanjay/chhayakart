import React, { useEffect, useMemo, useRef, useState } from 'react';
import styles from './otp-input.module.scss';

const OtpInput = ({ name, otp, setOtp, digits = 6, label = 'Enter OTP' }) => {
  const inputRef = useRef();
  const [isFocused, setIsFocused] = useState(true);

  const handleOtpInput = (e) => {
    const value = e.target.value.trim();
    if (value.length <= digits && !isNaN(Number(value))) {
      setOtp({ target: { name, value } });
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef.current]);

  return useMemo(
    () => (
      <div className={styles.otpcontainer}>
        <div className={styles.inputWrapper}>
          <div className={styles.boxWrapper}>
            {Array(digits)
              .fill()
              .map((_, index) => (
                <span
                  key={index}
                  className={`${styles.inputBox} ${
                    isFocused && index === otp.length ? styles.active : ''
                  }`}>
                  {otp[index]
                    ? otp[index]
                    : isFocused && index === otp.length
                    ? '|'
                    : ''}
                </span>
              ))}
          </div>
          <input
            ref={inputRef}
            type='number'
            min='0'
            max='999999'
            value={otp}
            onChange={handleOtpInput}
            className={styles.orgInput}
            autoComplete='off'
            autoFocus={true}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        </div>
      </div>
    ),
    [name, otp, setOtp, digits, isFocused]
  );
};
export default OtpInput;
