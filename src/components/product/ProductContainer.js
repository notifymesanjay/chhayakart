import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import api from "../../api/api";
import { ActionTypes } from "../../model/action-type";
import Offers from "../offer/Offers";
import LoginUser from "../login/login-user";
import ProductHeader from "./product-header";
import "./product.css";
import ResponsiveCarousel from "../shared/responsive-carousel/responsive-carousel";
import ProductCard from "../shared/card/product-card";
import CategoryCard from "./category-card";
import ShopByRegion from "./region";

const ProductContainer = ({
  productTriggered,
  setProductTriggered = () => {},
  setSelectedFilter = () => {},
}) => {
  const dispatch = useDispatch();

  const city = useSelector((state) => state.city);
  const shop = useSelector((state) => state.shop);
  const sizes = useSelector((state) => state.productSizes);

  const [productSizes, setproductSizes] = useState(null);
  const [offerConatiner, setOfferContainer] = useState(0);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  useEffect(() => {
    if (sizes.sizes === null || sizes.status === "loading") {
      if (city.city !== null) {
        api
          .getProductbyFilter(
            city.city.id,
            city.city.latitude,
            city.city.longitude
          )
          .then((response) => response.json())
          .then((result) => {
            if (result.status === 1) {
              setproductSizes(result.sizes);
              dispatch({
                type: ActionTypes.SET_PRODUCT_SIZES,
                payload: result.sizes,
              });
            }
          });
      }
    } else {
      setproductSizes(sizes.sizes);
    }
  }, [city, sizes]);

  useEffect(() => {
    if (shop.shop.category.length > 0) {
      const categoryList = shop.shop.category;
      let finalCategoryList = [];
      categoryList.map((category) => {
        if (category.has_child) {
          finalCategoryList.push(category);
        }
      });
      setCategories(finalCategoryList);
    }
  }, [shop.shop]);

  useEffect(() => {
    if (shop.shop.sections.length > 0 && categories.length > 0) {
      const sectionList = shop.shop.sections;
      let finalSectionList = [];
      for (let i = 0; i < sectionList.length; i++) {
        let obj = {};
        for (let j = 0; j < categories.length; j++) {
          if (
            parseInt(sectionList[i].category_ids) === parseInt(categories[j].id)
          ) {
            obj = {
              category_id: parseInt(categories[j].id),
              category_name: categories[j].name,
            };
            obj["sub_category"] = [sectionList[i]];
          }
        }
        let flag = Number.MAX_VALUE;
        for (let k = 0; k < finalSectionList.length && obj.category_id; k++) {
          if (parseInt(finalSectionList[k].category_id) === obj.category_id) {
            flag = k;
          }
        }
        if (flag === Number.MAX_VALUE && obj.category_id) {
          finalSectionList.push(obj);
        } else if (flag !== Number.MAX_VALUE && obj.category_id) {
          finalSectionList[flag]["sub_category"].push(obj["sub_category"][0]);
        }
      }
      const categoryList = shop.shop.category;
      if (categoryList.length > 0) {
        for (let i = 0; i < finalSectionList.length; i++) {
          for (let j = 0; j < finalSectionList[i].sub_category.length; j++) {
            for (let k = 0; k < categoryList.length; k++) {
              if (
                (finalSectionList[i].sub_category[j].title).toLowerCase() ===
                (categoryList[k].name).toLowerCase()
              ) {
                finalSectionList[i].sub_category[j]["image_url"] =
                  categoryList[k].image_url;
              }
            }
          }
        }
      }
      setSubCategories(finalSectionList);
    }
  }, [shop.shop, categories]);

  return (
    <section id="products">
      <div className="container">
        {shop.shop === null || productSizes === null ? (
          <>
            <div className="d-flex justify-content-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* <ShopByRegion /> */}
            {subCategories.length > 0 && (
              <CategoryCard
                subCategories={subCategories}
                setSelectedFilter={setSelectedFilter}
              />
            )}
          </>
        )}
        {offerConatiner === 1 ? <Offers /> : null}
      </div>
    </section>
  );
};

export default ProductContainer;
