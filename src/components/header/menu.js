import React from "react";
import styles from "./menu.module.scss";

const Menu = ({ children, className = "" }) => {
  return (
    <div className={`${styles.stickyMenu} ${styles.bgWhite} ${className}`}>
      {children}
    </div>
  );
};

export default Menu;
