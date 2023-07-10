import React from "react";
import { ActionTypes } from "../../model/action-type";
import { useDispatch } from "react-redux";
import "./product.css";

const ProductFilterDropDown = ({ totalProducts }) => {
	const dispatch = useDispatch();

	return (
		<div className="d-flex col-12 flex-row justify-content-between align-items-center filter-view">
			<div className="d-flex gap-3">
				{/* 2nd Phase feature - List View */}
				{/* <div className={`icon ${!filter.grid_view ? 'active' : null}`} onClick={() => {
                                        dispatch({ type: ActionTypes.SET_FILTER_VIEW, payload: false });
                                    }}>
                                        <BsListUl fontSize={"2rem"} />
                                    </div>
                                    <div className={`icon ${filter.grid_view ? 'active' : null}`} onClick={() => {
                                        dispatch({ type: ActionTypes.SET_FILTER_VIEW, payload: true });
                                    }}>
                                        <BsGrid fontSize={"2rem"} />
                                    </div> */}
				<span className="total_product_count">
					{totalProducts} - Products Found
				</span>
			</div>

			<div className="select">
				<select
					className="form-select"
					aria-label="Default select example"
					onChange={(e) => {
						dispatch({
							type: ActionTypes.SET_FILTER_SORT,
							payload: e.target.value,
						});
					}}
				>
					<option value="new">New Products</option>
					<option value="old">Old Products</option>
					<option value="high">High to Low Price</option>
					<option value="low">Low to High Price</option>
					<option value="discount">Discounted Products</option>
					<option value="popular">Popular Products</option>
				</select>
			</div>
		</div>
	);
};

export default ProductFilterDropDown;
