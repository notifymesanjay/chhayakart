import React from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { ActionTypes } from "../../model/action-type";

const ProductHeader = ({ section }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  return (
    <div className="d-flex product_title_content justify-content-between align-items-center col-md-12">
      <div className="">
        <span className="d-none d-md-block">{section.short_description}</span>
        <p>{section.title}</p>
      </div>
      <div>
        {/* <Link to='/products'>see all</Link> */}
        <Link
          to="/products"
          onClick={() => {
            dispatch({
              type: ActionTypes.SET_FILTER_CATEGORY,
              payload:
                section.title === "All Products"
                  ? section.category_ids
                  : section.products[0].category_id,
            });
            navigate("/products");
          }}
        >
          see all
        </Link>
      </div>
    </div>
  );
};

export default ProductHeader;
