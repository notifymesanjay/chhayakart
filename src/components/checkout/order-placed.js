import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button, Modal } from "react-bootstrap";
import Lottie from "lottie-react";
import Cookies from "universal-cookie";
import api from "../../api/api";
import { ActionTypes } from "../../model/action-type";
import animate1 from "../../utils/order_placed_back_animation.json";
import animate2 from "../../utils/order_success_tick_animation.json";
import "./checkout.css";
import Success from "./Success";
const OrderPlaced = ({ city, show, setShow = () => {} }) => {
	const cookies = new Cookies();
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const [loader, setIsLoader] = useState(false);

	const handleClose = async () => {
		if (cookies.get("jwt_token")) {
			setIsLoader(true);
			await api
				.removeCart(cookies.get("jwt_token"))
				.then((response) => response.json())
				.then(async (result) => {
					if (result.status === 1) {
						await api
							.getCart(
								cookies.get("jwt_token"),
								city.city.latitude,
								city.city.longitude
							)
							.then((resp) => resp.json())
							.then((res) => {
								dispatch({ type: ActionTypes.SET_CART, payload: null });
								setIsLoader(false);
							});
					}
				});
			setShow(false);
			navigate("/");
		}
	};

	return (
		<Modal
			show={show}
			onHide={handleClose}
			backdrop="static"
			keyboard={true}
			className="success_modal"
		>
			<Lottie className="lottie-content" animationData={animate1}></Lottie>
			<Modal.Header closeButton className="flex-column-reverse success_header">
				<Modal.Title>
					<Lottie animationData={animate2} loop={true}></Lottie>
				</Modal.Title>
			</Modal.Header>
			<Modal.Body className="success_body">
				Order Placed Successfully
			</Modal.Body>
			<Modal.Footer className="success_footer">
				<Button
					variant="primary"
					onClick={handleClose}
					className="checkout_btn"
				>
					Go to Home Page
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default OrderPlaced;
