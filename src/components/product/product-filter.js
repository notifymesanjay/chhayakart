import React, { useEffect } from "react";
import Loader from "../loader/Loader";
import { useDispatch, useSelector } from "react-redux";
import { BsPlusCircle } from "react-icons/bs";
import ReactSlider from "react-slider";
import { ActionTypes } from "../../model/action-type";

const ProductFilter = ({
	category,
	closeCanvas,
	brands,
	setcurrPage = () => {},
	setoffset = () => {},
	minmaxTotalPrice,
	brandproductcountmap,
}) => {
	const dispatch = useDispatch();
	const filter = useSelector((state) => state.productFilter);

	const filterbyCategory = (category) => {
		setcurrPage(1);
		setoffset(0);
		if (filter.category_id === category.id) {
			dispatch({ type: ActionTypes.SET_FILTER_CATEGORY, payload: null });
		} else {
			dispatch({ type: ActionTypes.SET_FILTER_CATEGORY, payload: category.id });
		}
	};

	const sort_unique_brand_ids = (int_brand_ids) => {
		if (int_brand_ids.length === 0) return int_brand_ids;
		int_brand_ids = int_brand_ids.sort(function (a, b) {
			return a * 1 - b * 1;
		});
		var ret = [int_brand_ids[0]];
		for (var i = 1; i < int_brand_ids.length; i++) {
			//Start loop at 1: arr[0] can never be a duplicate
			if (int_brand_ids[i - 1] !== int_brand_ids[i]) {
				ret.push(int_brand_ids[i]);
			}
		}
		return ret;
	};

	const filterbyBrands = (brand) => {
		setcurrPage(1);
		setoffset(0);
		var brand_ids = [...filter.brand_ids];

		if (brand_ids.includes(brand.id)) {
			brand_ids.splice(brand_ids.indexOf(brand.id), 1);
		} else {
			brand_ids.push(parseInt(brand.id));
		}

		const sorted_brand_ids = sort_unique_brand_ids(brand_ids);

		dispatch({
			type: ActionTypes.SET_FILTER_BRANDS,
			payload: sorted_brand_ids,
		});
	};
	return (
		<>
			{/* filter section */}

			<div className=" filter-row">
				<h5>Product category</h5>
				{category.status === "loading" ? (
					<Loader screen="full" />
				) : (
					<>
						{category.category.map((ctg, index) => (
							<div
								onClick={() => {
									filterbyCategory(ctg);
									closeCanvas.current.click();
								}}
								className={`d-flex justify-content-between align-items-center filter-bar ${
									filter.category_id !== null &&
									filter.category_id === parseInt(ctg.id)
										? "active"
										: null
								}`}
								key={index}
							>
								<div className="d-flex gap-3">
									<div className="image-container">
										<img
											data-src={ctg.image_url}
											alt="category"
											className="lazyload"
										></img>
									</div>
									<p>{ctg.name}</p>
								</div>

								<BsPlusCircle />
							</div>
						))}
					</>
				)}
			</div>

			<div className="filter-row ">
				<h5>Filter by price</h5>

				{minmaxTotalPrice.total_min_price === 0 ||
				minmaxTotalPrice.total_max_price === null ||
				minmaxTotalPrice.min_price === null ||
				minmaxTotalPrice.max_price === null ? (
					<Loader screen="full" />
				) : (
					<>
						<ReactSlider
							className="slider"
							thumbClassName="thumb"
							trackClassName="track"
							min={minmaxTotalPrice.total_min_price}
							max={minmaxTotalPrice.total_max_price}
							defaultValue={[0, 10000000]}
							ariaLabel={["Lower thumb", "Upper thumb"]}
							ariaValuetext={(state) => `Thumb value ${state.valueNow}`}
							renderThumb={(props, state) => (
								<div {...props}>{state.valueNow}</div>
							)}
							pearling={true}
							withTracks={true}
							minDistance={100}
							onAfterChange={([min, max]) => {
								setcurrPage(1);
								setoffset(0);
								dispatch({
									type: ActionTypes.SET_FILTER_MIN_MAX_PRICE,
									payload: { min_price: min, max_price: max },
								});
								closeCanvas.current.click();
							}}
						/>
					</>
				)}
			</div>

			<div className="filter-row">
				<h5>Brands</h5>
				{brands === null ? (
					<Loader screen="full" />
				) : (
					<>
						{brands.map((brand, index) => (
							<div
								onClick={() => {
									filterbyBrands(brand);
									closeCanvas.current.click();
								}}
								className={`d-flex justify-content-between align-items-center filter-bar ${
									filter.brand_ids !== []
										? filter.brand_ids.includes(brand.id)
											? "active"
											: null
										: null
								}`}
								key={index}
							>
								<div className="d-flex gap-3 align-items-baseline">
									<div className="image-container">
										<img
											data-src={brand.image_url}
											className="lazyload"
											alt="category"
										></img>
									</div>
									<p>{brand.name}</p>
								</div>
								<div className="d-flex align-items-baseline justify-content-center brand-count">
									<p className="m-auto">
										{brandproductcountmap.get(`brand${brand.id}`) !== undefined
											? brandproductcountmap.get(`brand${brand.id}`)
											: 0}
									</p>
								</div>
							</div>
						))}
					</>
				)}
			</div>
		</>
	);
};

export default ProductFilter;
