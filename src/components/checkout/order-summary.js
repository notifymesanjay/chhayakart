import React, { useEffect } from "react";
import { FaRupeeSign } from "react-icons/fa";
import { motion } from "framer-motion";
import Loader from "../loader/Loader";
import "./checkout.css";
import GuestLogin from "./guest-login";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faIndianRupee, faPercent } from '@fortawesome/free-solid-svg-icons';
import {useSelector} from 'react-redux'

const OrderSummary = ({
	isUserLoggedIn,
	cart,
	user,
	items,
	paymentMethod,
	handlePlaceOrder = () => {},
	loadingPlaceOrder,
}) => {
	const stateCart = useSelector((state) => state.cart);
	let calculated_final_discount = function(){
		if(stateCart.cart !== null){
			let cartItems = stateCart.cart.data.cart;
			let calculated_final_discount = cart.discount;
			cartItems.forEach((cartItem)=>{
				let disc = cartItem.price - cartItem.discounted_price;
				calculated_final_discount += disc * cartItem.qty;
			})
			return calculated_final_discount;
		}
		return 0;
    }();
	useEffect(() => {
		console.log("xyze", isUserLoggedIn);
	}, [isUserLoggedIn]);
	return (
		<div className="order-summary-wrapper checkout-component">
			<span className="heading">order summary</span>

			<div className="order-details">
				{cart === null ? (
					<Loader screen="full" />
				) : (
					<div className="summary">
						<div className="d-flex justify-content-between">
							<span>Subtotal</span>
							<div className="d-flex align-items-center">
								<FaRupeeSign />
								<span>{parseFloat(cart.sub_total)}</span>
							</div>
						</div>
						<div className="d-flex justify-content-between">
							<span>GST</span>
							<div className="d-flex align-items-center">
								<FaRupeeSign />
								<span>{parseFloat(cart.taxes)}</span>
							</div>
						</div>
						{parseFloat(cart.sub_total) > 4999 && (
							<div className="d-flex justify-content-between">
								<span>Discount</span>
								<div className="d-flex align-items-center">
									-<FaRupeeSign />
									<span>{parseFloat(cart.discount)}</span>
								</div>
							</div>
						)}
						<div className="d-flex justify-content-between">
							<span>Delivery Charges</span>
							<div className="d-flex align-items-center">
								<FaRupeeSign />
								<span>
									{parseFloat(cart.delivery_charge.total_delivery_charge)}
								</span>
							</div>
						</div>
						<div className="d-flex justify-content-between total">
							<span>Total</span>
							<div className="d-flex align-items-center total-amount">
								<FaRupeeSign fill="var(--secondary-color)" />
								<span>{parseFloat(cart.total_amount)}</span>
							</div>
						</div>
						{
							calculated_final_discount > 0 && <div className='discount-message-section d-flex justify-content-center rounded-2 mb-2'>
								<div className='text-center d-flex align-items-center' style={{width: '2.5rem'}}>
									<div id='burst-12'></div>
									<div className='discount-inner-icon-div d-flex align-items-center justify-content-center'><FontAwesomeIcon icon={faPercent} className='discount-inner-icon'/></div>
								</div>
								<span className='ps-2' style={{fontSize: '14px'}}>
									Yay! Your total discount is <FontAwesomeIcon icon={faIndianRupee}/>{calculated_final_discount}
								</span>
								</div>
						}
						{isUserLoggedIn && cart.total_amount > 135 && (
							<>
								{loadingPlaceOrder ? (
									<Loader screen="full" background="none" />
								) : (
									<>
										<div className="button-container">
											{paymentMethod === "Stripe" ? (
												<motion.button
													type="button"
													className="checkout"
													onClick={(e) => {
														e.preventDefault();
														handlePlaceOrder(items);
													}}
													data-bs-toggle="modal"
													data-bs-target="#stripeModal"
												>
													place order
												</motion.button>
											) : (
												<motion.button
													type="button"
													className="checkout"
													onClick={(e) => {
														e.preventDefault();
														handlePlaceOrder(items);
													}}
												>
													place order
												</motion.button>
											)}
										</div>
									</>
								)}
							</>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export default OrderSummary;
