import React from "react";
import styles from "./section-title.module.scss";

const SectionTitle = ({ title = "", linkText = true, className = "" }) => {
  return (
    <div className={`${styles.heading} ${className}`}>
      {linkText && <p>Hello</p>}
      <div className={styles.headingWrapper}>
        <h2 className={styles.header}>{title}</h2>
      </div>
    </div>
  );
};
export default SectionTitle;
