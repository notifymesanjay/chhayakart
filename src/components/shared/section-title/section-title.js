import React from "react";
import styles from "./section-title.module.scss";

const SectionTitle = ({
  title = "",
  linkText = false,
  className = "",
  linkName = "",
  onLinkClick=() => {},
}) => {
  return (
    <div className={`${styles.heading} ${className}`}>
      <div className={styles.headingWrapper}>
        <h2 className={styles.header}>{title}</h2>
      </div>

      {linkText && <p className={styles.link} onClick={onLinkClick}>{linkName}</p>}
    </div>
  );
};
export default SectionTitle;
