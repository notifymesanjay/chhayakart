import React from "react";
import AppImg from "../../public/images/home-page/phone.png";
import DownloadApp from "../../public/images/logo/app-logo.svg";
import styles from "./get-app.module.scss";

const GetApp = () => {
  return (
    <div className="container">
      <div className={styles.cardWrapper}>
        <div className={styles.imageWrapper}>
          <img className={styles.appImg} src={AppImg} alt="app-img" />
        </div>
        <div className={styles.bodyWrapper}>
          <h3 className={styles.header}>Get CHHAYAKART App</h3>
          <a href="https://play.google.com/store/apps/details?id=com.chayakart">
            <img
              data-src={DownloadApp}
              className={`lazyload ${styles.appLogo}`}
              alt="app-download"
            />
          </a>
        </div>
      </div>
    </div>
  );
};

export default GetApp;
