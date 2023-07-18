import React, { useEffect, useRef, useState } from "react";
import DkCarousel from "../shared/responsive-carousel/dk-carousel";
import styles from "./productlist.module.scss";
import ProductMobile from "./product-list-mobile";
import { useSelector } from "react-redux";

const ProductListCarousel = ({
  productresult = [],
  No_Orders,
  productTriggered = false,
  setProductTriggered = () => {},
  selectedFilter = 0,
  setSelectedFilter= () => {}
}) => {
  const sliderRef = useRef();
  const shop = useSelector((state) => state.shop);
  const [subCategories, setSubCategories] = useState([]);

  useEffect(() => {
    if (shop.shop.sections.length > 0) {
      const currUrl = window.location.href;
      const categoryId = currUrl.split("/")[4];
      const sectionList = shop.shop.sections;
      let finalList = [];
      for (let i = 0; i < sectionList.length; i++) {
        let obj = {};
        if (parseInt(sectionList[i].category_ids) === parseInt(categoryId)) {
          obj = {
            category_id: parseInt(categoryId),
          };
          obj["sub_category"] = [sectionList[i]];
        }
        let flag = Number.MAX_VALUE;
        for (let k = 0; k < finalList.length && obj.category_id; k++) {
          if (parseInt(finalList[k].category_id) === obj.category_id) {
            flag = k;
          }
        }
        if (flag === Number.MAX_VALUE && obj.category_id) {
          finalList.push(obj);
        } else if (flag !== Number.MAX_VALUE && obj.category_id) {
          finalList[flag]["sub_category"].push(obj["sub_category"]);
        }
      }
      setSubCategories(finalList);
    }
  }, [shop.shop]);
  
  return (
    <>
      {subCategories.length > 0 && (
        <DkCarousel
          ref={sliderRef}
          slidesToShow={3}
          gap={24}
          partialVisible={false}
          partialVisibilityGutter={32}
          className={styles.cardCarousel}
        >
          {subCategories[0].sub_category.map((subctg, index1) => (
            <div
              className={`${styles.cardWrapper} ${
                selectedFilter === subctg.id && styles.active
              }`}
              key={index1}
              onClick={() => {
                setSelectedFilter(subctg.id);
              }}
            >
              <p className={styles.title}>{subctg.title}</p>
            </div>
          ))}
        </DkCarousel>
      )}
      <div className={styles.productWrapper}>
        {subCategories.length > 0 ? (
          <ProductMobile
            subCategories={subCategories[0].sub_category}
            productTriggered={productTriggered}
            setProductTriggered={setProductTriggered}
            selectedFilter={selectedFilter}
          />
        ) : (
          <div className="no-product">
            <img
              data-src={No_Orders}
              alt="no-product"
              className="img-fluid lazyloader"
            ></img>
            <p>No Products Found</p>
          </div>
        )}
      </div>
    </>
  );
};

export default ProductListCarousel;
