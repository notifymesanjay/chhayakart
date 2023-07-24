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
import GuestLogin from "./guest-login";

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
  const [orderSummary, setOrderSummary] = useState({});
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(
    cookies.get("jwt_token")
  );
  const [isLoader, setIsLoader] = useState(false);
  const [productsAddedToCart, setProductsAddedToCart] = useState(false);

  const fetchOrders = () => {
    if (cookies.get("jwt_token")) {
      api
        .getOrders(cookies.get("jwt_token"))
        .then((response) => response.json())
        .then((result) => {
          if (result.status === 1 && result.data > 0) {
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

  const addRazorPayTransaction = (res, order_id) => {
    api
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
              await addRazorPayTransaction(res, order_id);
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

  const addTransaction = (response) => {
    api
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
  };

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
        await addTransaction(response);
      },
    });

    handler.openIframe();
  };

  const placeOrder = (delivery_time) => {
    console.log('xyz', orderSummary.discount)
    api
      .placeOrder(
        cookies.get("jwt_token"),
        orderSummary.product_variant_id,
        orderSummary.quantity,
        orderSummary.sub_total,
        orderSummary.delivery_charge.total_delivery_charge,
        orderSummary.total_amount,
        paymentMethod,
        selectedAddress.id,
        delivery_time,
        orderSummary.discount
      )
      .then((response) => response.json())
      .then(async (result) => {
        if (result.status === 1) {
          if (paymentMethod === "COD") {
            toast.success("Order Successfully Placed!");
            setLoadingPlaceOrder(false);
            setIsOrderPlaced(true);
            setShow(true);
          } else if (paymentMethod === "Razorpay") {
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
          } else if (paymentMethod === "Paystack") {
            setLoadingPlaceOrder(false);

            handlePayStackPayment(
              user.user.email,
              cart.checkout.total_amount,
              setting.payment_setting.paystack_currency_code,
              setting.setting.support_email
            );
          } else if (paymentMethod === "Stripe") {
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
          }
        } else {
          toast.error(result.message);
          setLoadingPlaceOrder(false);
        }
      })
      .catch((error) => console.log(error));
  };

  const handlePlaceOrder = async (e) => {
    if (cookies.get("jwt_token")) {
      const delivery_time = `${expectedDate.getDate()}-${
        expectedDate.getMonth() + 1
      }-${expectedDate.getFullYear()} ${expectedTime.title}`;

      if (selectedAddress === null) {
        toast.error("Please Select Delivery Address");
      } else if (delivery_time === null) {
        toast.error("Please Select Preffered Delivery Time");
      } else {
        setLoadingPlaceOrder(true);
        if (paymentMethod) {
          await placeOrder(delivery_time);
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

  const handleOrderSummary = () => {
    if (cookies.get("jwt_token") === undefined) {
      if (localStorage.getItem("cart")) {
        const cartVal = JSON.parse(localStorage.getItem("cart"));
        if (cartVal.length > 0) {
          let allProductVariantId = "",
            allQuantity = "",
            subTotal = 0;

          for (let i = 0; i < cartVal.length - 1; i++) {
            allProductVariantId +=
              cartVal[i].product_variant_id.toString() + ",";
            allQuantity += cartVal[i].qty.toString() + ",";
            subTotal +=
              parseInt(cartVal[i].qty) * parseInt(cartVal[i].discounted_price);
          }

          allProductVariantId +=
            cartVal[cartVal.length - 1].product_variant_id.toString();
          allQuantity += cartVal[cartVal.length - 1].qty.toString();
          subTotal +=
            parseInt(cartVal[cartVal.length - 1].qty) *
            parseInt(cartVal[cartVal.length - 1].discounted_price);

          let orderVal = {
            product_variant_id: allProductVariantId,
            quantity: allQuantity,
            sub_total: subTotal,
            taxes:
              subTotal > 9999
                ? Math.ceil(0.05 * 0.88 * subTotal)
                : Math.ceil(0.05 * subTotal),
            discount: subTotal > 9999 ? Math.floor(0.12 * subTotal) : 0,
            delivery_charge: { total_delivery_charge: 40 },
            total_amount:
              subTotal > 9999
                ? Math.ceil(
                    subTotal +
                      0.05 * 0.88 * subTotal +
                      40 -
                      Math.floor(0.12 * subTotal)
                  )
                : Math.ceil(subTotal + 0.05 * subTotal + 40),
            cod_allowed: 1,
          };
          setOrderSummary(orderVal);
        }
      }
    } else {
      api
        .getCart(
          cookies.get("jwt_token"),
          city.city.latitude,
          city.city.longitude
        )
        .then((resp) => resp.json())
        .then((res) => {
          if (res.status === 1) {
            setIsLoader(false);
            dispatch({ type: ActionTypes.SET_CART, payload: res });
          }
        });
      if (cart.checkout !== null) {
        let orderVal = {
          product_variant_id: cart.checkout.product_variant_id,
          quantity: cart.checkout.quantity,
          sub_total: cart.checkout.sub_total,
          taxes:
            cart.checkout.sub_total > 9999
              ? Math.ceil(0.05 * 0.88 * cart.checkout.sub_total)
              : Math.ceil(0.05 * cart.checkout.sub_total),
          discount:
            cart.checkout.sub_total > 9999
              ? Math.floor(0.12 * cart.checkout.sub_total)
              : 0,
          delivery_charge: {
            total_delivery_charge:
              cart.checkout.delivery_charge.total_delivery_charge,
          },
          total_amount: Math.ceil(
            cart.checkout.sub_total > 9999
              ? Math.ceil(
                  cart.checkout.sub_total +
                    0.05 * 0.88 * cart.checkout.sub_total +
                    40 -
                    Math.floor(0.12 * cart.checkout.sub_total)
                )
              : Math.ceil(
                  cart.checkout.sub_total + 0.05 * cart.checkout.sub_total + 40
                )
          ),
          cod_allowed: 1,
        };
        setOrderSummary(orderVal);
      }
    }
  };

  useEffect(() => {
    fetchTimeSlot();
    fetchOrders();
  }, []);

  useEffect(() => {
    handleOrderSummary();
  }, [cart, productsAddedToCart]);

  useEffect(() => {
    if (isOrderPlaced) {
      setShow(true);
      setTimeout(() => {
        handleClose();
      }, 10000);
    }
  }, [isOrderPlaced]);

  useEffect(() => {
    if (isUserLoggedIn) {
      const cartVal = JSON.parse(localStorage.getItem("cart"));
      setIsLoader(true);
      if (cartVal) {
        for (let i = 0; i < cartVal.length; i++) {
          api
            .addToCart(
              cookies.get("jwt_token"),
              cartVal[i].product_id,
              cartVal[i].product_variant_id,
              cartVal[i].qty
            )
            .then((response) => response.json())
            .then((result) => {
              if (result.status === 1 && i === cartVal.length - 1) {
                setProductsAddedToCart(true);
              }
            });
        }
      }
    } else {
      setIsLoader(false);
    }
  }, [isUserLoggedIn]);

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

        {setting.payment_setting === null && isLoader ? (
          <Loader />
        ) : (
          <>
            <div className="checkout-container container">
              {isUserLoggedIn ? (
                <BillingAddress
                  timeSlots={timeSlots}
                  setTimeSlots={setTimeSlots}
                  setSelectedAddress={setSelectedAddress}
                  expectedDate={expectedDate}
                  setExpectedDate={setExpectedDate}
                  setExpectedTime={setExpectedTime}
                />
              ) : (
                <GuestLogin setIsUserLoggedIn={setIsUserLoggedIn} />
              )}

              <div className="order-container">
                <PaymentMethod
                  setting={setting}
                  setPaymentMethod={setPaymentMethod}
                />
                {Object.keys(orderSummary).length > 0 && (
                  <OrderSummary
                    cart={orderSummary}
                    isUserLoggedIn={isUserLoggedIn}
                    user={user}
                    paymentMethod={paymentMethod}
                    handlePlaceOrder={handlePlaceOrder}
                    loadingPlaceOrder={loadingPlaceOrder}
                  />
                )}
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
