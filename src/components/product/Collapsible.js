import React from "react";
import { useState } from "react";
import styles from "./collapsible.module.scss";
const CollapsibleButton = ({ title, content }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleCollapse = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <div className={isOpen && styles.titleWrapper}>
        <button
          onClick={toggleCollapse}
          className={`${styles.title} ${isOpen && styles.isOpened}`}
        >
          {title}
        </button>
      </div>
      {isOpen && (
        <div
          style={{ overflow: "hidden" }}
          dangerouslySetInnerHTML={{ __html: content }}
        ></div>
      )}
    </div>
  );
};

export default CollapsibleButton;
