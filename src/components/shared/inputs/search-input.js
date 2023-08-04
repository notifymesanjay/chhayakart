import React from "react";
import styles from "./search-input.module.scss";

const SearchInput = ({
  inputClass = "",
  placeholder = "Delivering 1000+ Products Across India",
  searchText = "",
  onSearchText = () => {},
  onBtnClick = () => {}
}) => {
  return (
    <div className={styles.searchWrapper}>
      <input
        type="text"
        id="searchBar"
        className={`${styles.searchInput} ${inputClass}`}
        placeholder={placeholder}
        value={searchText}
        onChange={onSearchText}
        autoComplete="off"
      />
      <div className={styles.searchBtnWrapper} onClick={onBtnClick}>
        <p className={styles.searchBtn}>Search</p>
      </div>
    </div>
  );
};

export default SearchInput;
