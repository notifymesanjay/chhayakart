import React from "react";
import No_Orders from "../../utils/zero-state-screens/No_Orders.svg";
import ProductListCarousel from "./productlist-carousel";
import styles from "./productlist.module.scss";

const SubCategory = ({
  productTriggered,
  setProductTriggered = () => {},
  selectedFilter,
  setSelectedFilter = () => {},
}) => {
  return (
    <div className={styles.productListWrapper}>
      <ProductListCarousel
        productTriggered={productTriggered}
        setProductTriggered={setProductTriggered}
        No_Orders={No_Orders}
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
      />
    </div>
  );
};

export default SubCategory;
