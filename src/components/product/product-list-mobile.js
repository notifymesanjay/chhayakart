import React, { useEffect } from "react";

import { useState } from "react";
import SelectedCategoryProducts from "./selected-category-products";

const ProductMobile = ({
  subCategories = [],
  selectedFilter = 0,
  productTriggered,
  setProductTriggered,
  index,
}) => {
  const [productList, setProductList] = useState([]);

  useEffect(() => {
    if (subCategories.length > 0) {
      if (selectedFilter === 0) {
        let selectCategory = [];
        subCategories.map((sub_ctg) => {
          if (sub_ctg.products.length > 0) {
            sub_ctg.products.map((product) => {
              selectCategory.push(product);
            });
          }
        });
        setProductList(selectCategory);
      } else {
        let selectCategory = [];
        subCategories.map((sub_ctg) => {
          if (sub_ctg.id === selectedFilter) {
            if (sub_ctg.products.length > 0) {
              sub_ctg.products.map((product) => {
                selectCategory.push(product);
              });
            }
          }
        });
        setProductList(selectCategory);
      }
    }
  }, [selectedFilter, subCategories]);

  return (
    <>
      {productList.length > 0 && (
        <>
          {productList.map((product, index) => (
            <SelectedCategoryProducts
              product={product}
              productTriggered={productTriggered}
              setProductTriggered={setProductTriggered}
              index={index}
            />
          ))}
        </>
      )}
    </>
  );
};

export default ProductMobile;
