import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/api";
import { ActionTypes } from "../../model/action-type";
import coverImg from "../../utils/cover-img.jpg";
import "./category.css";

const ShowAllCategories = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const category = useSelector((state) => state.category);
	const city = useSelector((state) => state.city);

	const [map, setMap] = useState(new Map());

	// const getProductfromApi = async (ctg) => {
	//     console.log('showAllCategories');
	// 	await api
	// 		.getProductbyFilter(
	// 			city.city.id,
	// 			city.city.latitude,
	// 			city.city.longitude,
	// 			{ category_id: ctg.id }
	// 		)
	// 		.then((response) => response.json())
	// 		.then((result) => {
	// 			if (result.status === 1) {
	// 				setMap(new Map(map.set(`category${ctg.id}`, result.total)));
	// 			}
	// 		});
	// };

	//fetch Category
	const fetchCategory = () => {
		api
			.getCategory()
			.then((response) => response.json())
			.then((result) => {
				if (result.status === 1) {
					const dataToBeSorted = result.data;
					//sorting of items lexographically..
					const strAscending = [...dataToBeSorted].sort((a, b) =>
						a.name > b.name ? 1 : -1
					);

					dispatch({ type: ActionTypes.SET_CATEGORY, payload: strAscending });
				}
			})
			.catch((error) => console.log("error ", error));
	};

	useEffect(() => {
		if (category.status === "loading" && category.category === null) {
			fetchCategory();
		}
	}, [category]);

	const selectCategory = (category) => {
		dispatch({ type: ActionTypes.SET_FILTER_CATEGORY, payload: category.id });
		navigate("/products");
	};

	return (
		<section id="allcategories">
			<div className="cover">
				<img src={coverImg} className="img-fluid" alt="cover"></img>
				<div className="page-heading">
					<h5>Categories</h5>
					<p>
						<Link to={"/"}>home / </Link>
						<span>Categories</span>
					</p>
				</div>
			</div>

			<div className="container" style={{ padding: "30px 0" }}>
				{category.status === "loading" ? (
					<div className="d-flex justify-content-center">
						<div className="spinner-border" role="status">
							<span className="visually-hidden">Loading...</span>
						</div>
					</div>
				) : (
					<div className="row justify-content-center">
						{category.category.map((ctg, index) => (
							<div
								className="col-md-2 col-sm-4 col-8  my-3 content"
								key={index}
							>
								<div className="card">
									<div className="imageWrapper">
										<img
											className="card-img-top lazyload"
											data-src={ctg.image_url}
											alt=""
										/>
									</div>
									<div
										className="card-body"
										style={{ cursor: "pointer" }}
										onClick={() => selectCategory(ctg)}
									>
										<p>
											{ctg.name}
											{/* (
						{map.get(`category${ctg.id}`) !== undefined? map.get(`category${ctg.id}`): 0}
						) */}
										</p>
									</div>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</section>
	);
};

export default ShowAllCategories;
