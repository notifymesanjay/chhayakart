import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import { ActionTypes } from "../../model/action-type";
import styles from "./new-footer.module.scss";

const Footer = ({ setSelectedFilter = () => {} }) => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const fetchCategory = () => {
		api
			.getCategory()
			.then((response) => response.json())
			.then((result) => {
				if (result.status === 1) {
					const dataToBeSorted = result.data;
					//sorting of items lexographically..
					result.data = [...dataToBeSorted].sort((a, b) =>
						a.name > b.name ? 1 : -1
					);
					dispatch({ type: ActionTypes.SET_CATEGORY, payload: result.data });
				}
			})
			.catch((error) => {});
	};

	useEffect(() => {
		fetchCategory();
	}, []);
	
	return (
		<div className={styles.footerWrapper}>
			<div className={styles.subFooter1}>
				<p className={styles.text}>
					Chhayakart: Empowered Minds, Flourishing Enterprises: Cultivating
					Success, Growing Together
				</p>
			</div>
			<div className="container">
				<div className={styles.linksWrapper}>
					<div>
						<p
							className={styles.links}
							onClick={() => {
								navigate("/about");
							}}
						>
							About Us
						</p>
						<p
							className={styles.links}
							onClick={() => {
								navigate("/contact");
							}}
						>
							Contact Us
						</p>
						<p
							className={styles.links}
							onClick={() => {
								navigate("/terms");
							}}
						>
							Chhayakart Terms
						</p>
						<p
							className={styles.links}
							onClick={() => {
								navigate("/policy/Privacy_Policy");
							}}
						>
							Chhayakart Policies
						</p>
					</div>
					<div>
						<p
							className={styles.links}
							onClick={() => {
								navigate("/subCategory/96");
								setSelectedFilter(0);
							}}
						>
							Season Special
						</p>
						<p
							className={styles.links}
							onClick={() => {
								navigate("/subCategory/94");
								setSelectedFilter(0);
							}}
						>
							Papad & More
						</p>
						<p
							className={styles.links}
							onClick={() => {
								navigate("/subCategory/97");
								setSelectedFilter(0);
							}}
						>
							Instant Food
						</p>
						<p
							className={styles.links}
							onClick={() => {
								navigate("/subCategory/98");
								setSelectedFilter(0);
							}}
						>
							Puja & Prasad
						</p>
					</div>
					<div>
						<p
							className={styles.links}
							onClick={() => {
								navigate("/subCategory/99");
								setSelectedFilter(0);
							}}
						>
							Millet Superfood
						</p>
						<p
							className={styles.links}
							onClick={() => {
								navigate("/subCategory/100");
								setSelectedFilter(0);
							}}
						>
							Snacks & Namkeen
						</p>
						<p
							className={styles.links}
							onClick={() => {
								navigate("/subCategory/101");
								setSelectedFilter(0);
							}}
						>
							Pickels
						</p>
						<p
							className={styles.links}
							onClick={() => {
								navigate("/subCategory/102");
								setSelectedFilter(0);
							}}
						>
							Chutney & Masala
						</p>
					</div>

					<div>
						<p
							className={styles.links}
							onClick={() => {
								navigate("/subCategory/103");
								setSelectedFilter(0);
							}}
						>
							Sweets
						</p>
						<p
							className={styles.links}
							onClick={() => {
								navigate("/subCategory/104");
								setSelectedFilter(0);
							}}
						>
							Organic Foodgrain
						</p>
						<p
							className={styles.links}
							onClick={() => {
								navigate("/subCategory/105");
								setSelectedFilter(0);
							}}
						>
							Household
						</p>
						<p
							className={styles.links}
							onClick={() => {
								navigate("/subCategory/106");
								setSelectedFilter(0);
							}}
						>
							Mom's Essential
						</p>
					</div>
				</div>
			</div>
			<div className={styles.subFooter}>
				<p className={styles.copyRight}>
					Copyright © 2023. All Right Reserved By{" "}
					<span className={styles.chhayakartTxt}>Chhayakart</span>
				</p>
			</div>
		</div>
	);
};

export default Footer;
