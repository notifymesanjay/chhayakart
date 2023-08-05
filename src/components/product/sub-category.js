import React from "react";
import No_Orders from "../../utils/zero-state-screens/No_Orders.svg";
import ProductListCarousel from "./productlist-carousel";
import styles from "./productlist.module.scss";
import { useParams } from "react-router-dom";
import { useEffect } from "react";

const SubCategory = ({
  productTriggered,
  setProductTriggered = () => {},
  selectedFilter,
  setSelectedFilter = () => {},
}) => {
  const { slug,title } =  useParams();

useEffect(()=>{
  if(title)
  var subCatrId= title.split("_")[0];
  if(subCatrId)
{  setSelectedFilter(parseInt(subCatrId));
}
  
},[])

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
