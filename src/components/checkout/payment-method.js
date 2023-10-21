import React from "react";
import rozerpay from "../../utils/payments/rozerpay.png";
import cod from "../../utils/payments/cod.png";
import paystack from "../../utils/payments/paystack.png";
import Stripe from "../../utils/payments/Stripe.png";
import gpay from "../gpay.png";
import phonepay from "../phonepay.png";
import payt from "../payt.png";
import cardPayment from "../cardPayment.png";
import OTPInput from "otp-input-react";
import "./checkout.css";
import { useState } from "react";

//const [enableCod, setEnableCod] = useState();

const PaymentMethod = ({
	isCodAllowed,
	setting,
	setPaymentMethod = () => {},
}) => {
	return (
		<div className="payment-wrapper checkout-component">
			<span className="heading">payment-method</span>
			{setting.payment_setting.razorpay_payment_method === "1" ? (
				<div>
					<label className="form-check-label" htmlFor="razorpay">
						<img data-src={gpay} className="lazyload" alt="ANY UPI" />
						<img data-src={phonepay} className="lazyload" alt="ANY UPI" />
						<img data-src={payt} className="lazyload" alt="ANY UPI" />
						<span> GPAY / Phonepay / Paytm </span>
					</label>
					<input
						type="radio"
						name="payment-method"
						id="razorpay"
						defaultChecked={true}
						onChange={() => {
							setPaymentMethod("Razorpay");
						}}
					/>
				</div>
			) : null}
			{setting.payment_setting.razorpay_payment_method === "1" ? (
				<div>
					<label className="form-check-label" htmlFor="razorpay">
						<img
							data-src={cardPayment}
							className="lazyload"
							alt=" DEBIT/CREDIT CARD"
						/>
						<span> CARD PAYMENT</span>
					</label>
					<input
						type="radio"
						name="payment-method"
						id="razorpay"
						defaultChecked={true}
						onChange={() => {
							setPaymentMethod("Razorpay");
						}}
					/>
				</div>
			) : null}
			{setting.payment_setting.razorpay_payment_method === "1" ? (
				<div>
					<label className="form-check-label" htmlFor="razorpay">
						<img data-src={rozerpay} className="lazyload" alt="NETBANKING" />
						<span> NETBANKING</span>
					</label>
					<input
						type="radio"
						name="payment-method"
						id="razorpay"
						defaultChecked={true}
						onChange={() => {
							setPaymentMethod("Razorpay");
						}}
					/>
				</div>
			) : null}
			{setting.payment_setting.cod_payment_method === "1" ? (
				<div>
					<label className="form-check-label" htmlFor="cod">
						<img data-src={cod} className="lazyload" alt="Cash On Delivery" />
						<span>Cash On Delivery</span>
					</label>
					<input
						disabled={!isCodAllowed}
						type="radio"
						name="payment-method"
						id="cod"
						onChange={() => {
							setPaymentMethod("COD");
						}}
					/>
				</div>
			) : null}{" "}
			<h1 className="below199">
				{" "}
				{/* COD not available for Navratri-Kit & order below ₹249 and minimum order
				value for all purchases is ₹136. */}
				COD not available for order value below ₹249 and FESTIVE KITS
			</h1>
			{setting.payment_setting.paystack_payment_method === "1" ? (
				<div>
					<label className="form-check-label" htmlFor="paystack">
						<img data-src={paystack} className="lazyload" alt="cod" />
						<span>Paystack</span>
					</label>
					<input
						type="radio"
						name="payment-method"
						id="paystack"
						onChange={() => {
							setPaymentMethod("Paystack");
						}}
					/>
				</div>
			) : null}
			{setting.payment_setting.stripe_payment_method === "1" ? (
				<div>
					<label className="form-check-label" htmlFor="stripe">
						<img data-src={Stripe} className="lazyload" alt="stripe" />
						<span>Stripe</span>
					</label>
					<input
						type="radio"
						name="payment-method"
						id="stripe"
						onChange={() => {
							setPaymentMethod("Stripe");
						}}
					/>
				</div>
			) : null}
		</div>
	);
};

export default PaymentMethod;
