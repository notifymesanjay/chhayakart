import React from "react";
import styles from "./search-input.module.scss";

const SearchInput = ({
	inputClass = "",
	placeholder = "Delivering 1000+ Products ",
	searchText = "",
	onSearchText = () => {},
	onBtnClick = () => {},
}) => {
	return (
		<div className={styles.searchWrapper}>
			<div className={styles.AllIndWrapper}>
				<p className={styles.AllInd}>All India </p>
			</div>
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
