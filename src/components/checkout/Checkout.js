import React, { useState, useEffect, useCallback } from "react";
import useRazorpay from "react-razorpay";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Cookies from "universal-cookie";
import PaystackPop from "@paystack/inline-js";
import coverImg from "../../utils/cover-img.jpg";
import Loader from "../loader/Loader";
import api from "../../api/api";
import OrderPlaced from "./order-placed";
import BillingAddress from "./billing-address";
import PaymentMethod from "./payment-method";
import OrderSummary from "./order-summary";
import InjectCheckout from "./StripeModal";
import { useNavigate } from "react-router-dom";
import { ActionTypes } from "../../model/action-type";
import "./checkout.css";

const stripePromise = loadStripe(
	"pk_test_51MKxDESEKxefYE6MZCHxEw4cFKiiLn2mV3Ek4Nx1UfcuNfE1Z6jgQrZrKpqTLju3n5SBjYJcwt1Jkw1bEoPXWRHB00XZ7D2f2F"
  );

const Checkout = () => {
  const cart = useSelector((state) => state.cart);
  const user = useSelector((state) => state.user);
  const setting = useSelector((state) => state.setting);
  const city = useSelector((state) => state.city);

  const cookies = new Cookies();
  const Razorpay = useRazorpay();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [timeSlots, setTimeSlots] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [expectedDate, setExpectedDate] = useState(new Date());
  const [expectedTime, setExpectedTime] = useState(null);
  const [show, setShow] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("Razorpay");
  const [loadingPlaceOrder, setLoadingPlaceOrder] = useState(false);
  const [orderID, setOrderID] = useState(null);
  const [stripeOrderId, setStripeOrderId] = useState(null);
  const [stripeClientSecret, setStripeClientSecret] = useState(null);
  const [stripeTransactionId, setStripeTransactionId] = useState(null);

  const fetchOrders = () => {
    if (cookies.get("jwt_token")) {
      api
        .getOrders(cookies.get("jwt_token"))
        .then((response) => response.json())
        .then((result) => {
          if (result.status === 1) {
            setOrderID(result.data[0].id);
          }
        });
    }
  };

  const fetchTimeSlot = () => {
    api
      .fetchTimeSlot()
      .then((response) => response.json())
      .then((result) => {
        if (result.status === 1) {
          setTimeSlots(result.data);
          setExpectedTime(result.data.time_slots[0]);
        }
      })
      .catch((error) => console.log(error));
  };

  const handleRozarpayPayment = useCallback(
    (
      order_id,
      razorpay_transaction_id,
      amount,
      name,
      email,
      mobile,
      app_name
    ) => {
      if (cookies.get("jwt_token")) {
        const key = "rzp_live_t7yOUA2fwGjaEX";
        const options = {
          key: key,
          amount: amount * 100,
          // currency: "INR",
          name: name,
          description: app_name,
          image:
            "https://admin.chhayakart.com/storage/logo/1680098508_37047.png",
          order_id: razorpay_transaction_id,
          handler: async (res) => {
            if (res.razorpay_payment_id) {
              setLoadingPlaceOrder(true);
              await api
                .addRazorpayTransaction(
                  cookies.get("jwt_token"),
                  order_id,
                  res.razorpay_payment_id,
                  res.razorpay_order_id,
                  res.razorpay_payment_id,
                  res.razorpay_signature
                )
                .then((response) => response.json())
                .then((result) => {
                  setLoadingPlaceOrder(false);
                  if (result.status === 1) {
                    toast.success(result.message);
                    setIsOrderPlaced(true);
                    setShow(true);
                  } else {
                    toast.error(result.message);
                  }
                })
                .catch((error) => console.log(error));
              //Add Transaction
            }
          },
          prefill: {
            name: name,
            email: email,
            contact: mobile,
          },
          notes: {
            address: "Razorpay Corporate Office",
          },
          theme: {
            color: "#51BD88",
          },
        };

        const rzpay = new Razorpay(options);
        rzpay.on("payment.failed", function (response) {
          console.log(response.error);
        });
        rzpay.open();
      }
    },
    [Razorpay]
  );

  const handlePayStackPayment = (email, amount, currency, support_email) => {
    let handler = PaystackPop.setup({
      key: "pk_test_05ee04d1597f21a3b1a2f8fe3b59ec657454c1c0",
      email: email,
      amount: parseFloat(amount) * 100,
      currency: currency === "ZAR" ? currency : "ZAR",
      ref: new Date().getTime().toString(),
      label: support_email,
      onClose: function () {
        alert("Window closed.");
      },
      callback: async function (response) {
        setLoadingPlaceOrder(true);
        await api
          .addTransaction(
            cookies.get("jwt_token"),
            orderID,
            response.reference,
            paymentMethod
          )
          .then((response) => response.json())
          .then((result) => {
            setLoadingPlaceOrder(false);
            if (result.status === 1) {
              toast.success(result.message);
              setIsOrderPlaced(true);
              setShow(true);
            } else {
              toast.error(result.message);
            }
          })
          .catch((error) => console.log(error));
      },
    });

    handler.openIframe();
  };

  const handlePlaceOrder = async (e) => {
    if (cookies.get("jwt_token")) {
      const delivery_time = `${expectedDate.getDate()}-${
        expectedDate.getMonth() + 1
      }-${expectedDate.getFullYear()} ${expectedTime.title}`;

      //place order

      if (selectedAddress === null) {
        toast.error("Please Select Delivery Address");
      } else if (delivery_time === null) {
        toast.error("Please Select Preffered Delivery Time");
      } else {
        setLoadingPlaceOrder(true);

        if (paymentMethod === "COD") {
          // place order

          await api
            .placeOrder(
              cookies.get("jwt_token"),
              cart.checkout.product_variant_id,
              cart.checkout.quantity,
              cart.checkout.sub_total,
              cart.checkout.delivery_charge.total_delivery_charge,
              cart.checkout.total_amount,
              paymentMethod,
              selectedAddress.id,
              delivery_time
            )
            .then((response) => response.json())
            .then((result) => {
              if (result.status === 1) {
                toast.success("Order Successfully Placed!");
                setLoadingPlaceOrder(false);
                setIsOrderPlaced(true);
                setShow(true);
              } else {
                toast.error(result.message);
                setLoadingPlaceOrder(false);
              }
            })
            .catch((error) => console.log(error));
        } else if (paymentMethod === "Razorpay") {
          await api
            .placeOrder(
              cookies.get("jwt_token"),
              cart.checkout.product_variant_id,
              cart.checkout.quantity,
              cart.checkout.sub_total,
              cart.checkout.delivery_charge.total_delivery_charge,
              cart.checkout.total_amount,
              paymentMethod,
              selectedAddress.id,
              delivery_time
            )
            .then((response) => response.json())
            .then(async (result) => {
              // fetchOrders();
              if (result.status === 1) {
                await api
                  .initiate_transaction(
                    cookies.get("jwt_token"),
                    result.data.order_id,
                    "Razorpay"
                  )
                  .then((resp) => resp.json())
                  .then((res) => {
                    if (res.status === 1) {
                      setLoadingPlaceOrder(false);
                      handleRozarpayPayment(
                        result.data.order_id,
                        res.data.transaction_id,
                        cart.checkout.total_amount,
                        user.user.name,
                        user.user.email,
                        user.user.mobile,
                        setting.setting.app_name
                      );
                    } else {
                      toast.error(res.message);
                      setLoadingPlaceOrder(false);
                    }
                  })
                  .catch((error) => console.error(error));
              } else {
                toast.error(result.message);
                setLoadingPlaceOrder(false);
              }
            })
            .catch((error) => console.log(error));
        } else if (paymentMethod === "Paystack") {
          await api
            .placeOrder(
              cookies.get("jwt_token"),
              cart.checkout.product_variant_id,
              cart.checkout.quantity,
              cart.checkout.sub_total,
              cart.checkout.delivery_charge.total_delivery_charge,
              cart.checkout.total_amount,
              paymentMethod,
              selectedAddress.id,
              delivery_time
            )
            .then((response) => response.json())
            .then((result) => {
              // fetchOrders();
              if (result.status === 1) {
                setLoadingPlaceOrder(false);

                handlePayStackPayment(
                  user.user.email,
                  cart.checkout.total_amount,
                  setting.payment_setting.paystack_currency_code,
                  setting.setting.support_email
                );
              } else {
                toast.error(result.message);
                setLoadingPlaceOrder(false);
              }
            })
            .catch((error) => console.log(error));
        } else if (paymentMethod === "Stripe") {
          await api
            .placeOrder(
              cookies.get("jwt_token"),
              cart.checkout.product_variant_id,
              cart.checkout.quantity,
              cart.checkout.sub_total,
              cart.checkout.delivery_charge.total_delivery_charge,
              cart.checkout.total_amount,
              paymentMethod,
              selectedAddress.id,
              delivery_time
            )
            .then((response) => response.json())
            .then(async (result) => {
              if (result.status === 1) {
                const order_id = result.data.order_id;

                await api
                  .initiate_transaction(
                    cookies.get("jwt_token"),
                    result.data.order_id,
                    "Stripe"
                  )
                  .then((resp) => resp.json())
                  .then((res) => {
                    console.log(res);
                    setLoadingPlaceOrder(false);
                    setStripeOrderId(result.data.order_id);
                    setStripeClientSecret(res.data.client_secret);
                    setStripeTransactionId(res.data.id);
                  })
                  .catch((error) => console.log(error));
                // fetchOrders();
              } else {
                toast.error(result.message);
                setLoadingPlaceOrder(false);
              }
            })
            .catch((error) => console.log(error));

          // setstripeOrderId(400)

          setLoadingPlaceOrder(false);
        }
      }
    }
  };

  const handleClose = async () => {
    if (cookies.get("jwt_token")) {
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
              });
          }
        });
      setShow(false);
      navigate("/");
    }
  };

  useEffect(() => {
    fetchTimeSlot();
	fetchOrders();
  }, []);

  useEffect(() => {
    if (isOrderPlaced) {
      setShow(true);
      setTimeout(() => {
        handleClose();
      }, 10000);
    }
  }, [isOrderPlaced]);

  useEffect(() => {
	console.log('xyz', setting);
  }, [setting])

  return (
    <div>
      <div id="checkout">
        {isOrderPlaced && (
          <OrderPlaced city={city} show={show} setShow={setShow} />
        )}
		<div className="cover">
        <img src={coverImg} className="img-fluid" alt="cover"></img>
        <div className="title">
          <h3>Checkout</h3>
          <span>home / </span>
          <span className="active">checkout</span>
        </div>
      </div>

      {setting.payment_setting === null ? (
        <Loader />
      ) : (
        <>
          <div className="checkout-container container">
            <BillingAddress
              timeSlots={timeSlots}
              setTimeSlots={setTimeSlots}
              setSelectedAddress={setSelectedAddress}
              expectedDate={expectedDate}
              setExpectedDate={setExpectedDate}
              setExpectedTime={setExpectedTime}
            />
            <div className="order-container">
              <PaymentMethod
                setting={setting}
                setPaymentMethod={setPaymentMethod}
              />
              <OrderSummary
                cart={cart}
                user={user}
                paymentMethod={paymentMethod}
                handlePlaceOrder={handlePlaceOrder}
                loadingPlaceOrder={loadingPlaceOrder}
              />
            </div>
          </div>
        </>
      )}
      </div>

	  <div
        className="modal fade"
        id="stripeModal"
        data-bs-backdrop="static"
        tabIndex="-1"
        aria-labelledby="stripeModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content" style={{ minWidth: "100%" }}>
            {stripeOrderId === null ||
            stripeClientSecret === null ||
            stripeTransactionId === null ? (
              <Loader width="100%" height="100%" />
            ) : (
              <Elements
                stripe={stripePromise}
                orderID={stripeOrderId}
                client_secret={stripeClientSecret}
                transaction_id={stripeTransactionId}
                amount={cart.checkout.total_amount}
              >
                <InjectCheckout
                  orderID={stripeOrderId}
                  client_secret={stripeClientSecret}
                  transaction_id={stripeTransactionId}
                  amount={cart.checkout.total_amount}
                />
              </Elements>
            )}
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default Checkout;
