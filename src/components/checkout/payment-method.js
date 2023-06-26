import React from "react";
import rozerpay from "../../utils/payments/rozerpay.png";
import cod from "../../utils/payments/cod.png";
import paystack from "../../utils/payments/paystack.png";
import Stripe from "../../utils/payments/Stripe.png";
import "./checkout.css";

const PaymentMethod = ({ setting, setPaymentMethod = () => {} }) => {
  return (
    <div className="payment-wrapper checkout-component">
      <span className="heading">payment-method</span>

      {setting.payment_setting.razorpay_payment_method === "1" ? (
        <div>
          <label className="form-check-label" htmlFor="razorpay">
            <img src={rozerpay} alt="cod" />
            <span>UPI / CARD / NET BANKING</span>
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
            <img src={cod} alt="cod" />
            <span>Cash On Delivery</span>
          </label>
          <input
            type="radio"
            name="payment-method"
            id="cod"
            onChange={() => {
              setPaymentMethod("COD");
            }}
          />
        </div>
      ) : null}

      {setting.payment_setting.paystack_payment_method === "1" ? (
        <div>
          <label className="form-check-label" htmlFor="paystack">
            <img src={paystack} alt="cod" />
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
            <img src={Stripe} alt="stripe" />
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
