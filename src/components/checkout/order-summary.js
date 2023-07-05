import React, { useEffect } from "react";
import { FaRupeeSign } from "react-icons/fa";
import { motion } from "framer-motion";
import Loader from "../loader/Loader";
import "./checkout.css";
import GuestLogin from "./guest-login";

const OrderSummary = ({
  isUserLoggedIn,
  cart,
  user,
  paymentMethod,
  handlePlaceOrder = () => {},
  loadingPlaceOrder,
}) => {
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

            <div className="d-flex justify-content-between">
              <span>Delivery Charges</span>
              <div className="d-flex align-items-center">
                <FaRupeeSign />
                <span>
                  {parseFloat(
                    cart.delivery_charge.total_delivery_charge
                  )}
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

            {isUserLoggedIn && (
              
              <>
              {loadingPlaceOrder ? (
              <Loader screen="full" background="none" />
            ) : (
              <>
                <div className="button-container">
                  {paymentMethod === "Stripe" ? (
                    <motion.button
                      whileTap={{ scale: 0.8 }}
                      type="button"
                      className="checkout"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePlaceOrder();
                      }}
                      data-bs-toggle="modal"
                      data-bs-target="#stripeModal"
                    >
                      place order
                    </motion.button>
                  ) : (
                    <motion.button
                      whileTap={{ scale: 0.8 }}
                      type="button"
                      className="checkout"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePlaceOrder();
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
