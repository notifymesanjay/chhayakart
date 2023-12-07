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
import { escapeSelector } from "jquery";
import TrackingService from "../../services/trackingService";
import { useResponsive } from "../shared/use-responsive";

const stripePromise = loadStripe(
  "pk_test_51MKxDESEKxefYE6MZCHxEw4cFKiiLn2mV3Ek4Nx1UfcuNfE1Z6jgQrZrKpqTLju3n5SBjYJcwt1Jkw1bEoPXWRHB00XZ7D2f2F"
);

const Checkout = ({ productTriggered = false }) => {
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
  const [items, setItems] = useState([]);

  const [expectedTime, setExpectedTime] = useState({
    id: 1,
    title: "Morning 9:00 A.M - 1:00 P.M",
    from_time: "09:00:00",
    to_time: "01:00:00",
    last_order_time: "00:00:00",
    status: "1",
  });
  const [show, setShow] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("Razorpay");
  const [loadingPlaceOrder, setLoadingPlaceOrder] = useState(false);
  const [orderID, setOrderID] = useState(null);
  const [stripeOrderId, setStripeOrderId] = useState(null);
  const [stripeClientSecret, setStripeClientSecret] = useState(null);
  const [stripeTransactionId, setStripeTransactionId] = useState(null);
  const [orderSummary, setOrderSummary] = useState({});
  const [isCodAllowed, setIsCodAllowed] = useState(true);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(
    cookies.get("jwt_token")
  );
  const [isLoader, setIsLoader] = useState(false);
  const { isSmScreen } = useResponsive();

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
          // toast.success(result.message);
          setIsOrderPlaced(true);
          setShow(true);
        } else {
          toast.error(result.message);
        }
      })
      .catch((error) => {});
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
        rzpay.on("payment.failed", function (response) {});
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
          // toast.success(result.message);
          setIsOrderPlaced(true);
          setShow(true);
        } else {
          toast.error(result.message);
        }
      })
      .catch((error) => {});
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

  const placeOrder = (items, delivery_time) => {
    try {
      const trackingService = new TrackingService();
      trackingService.initiateCheckout(
        orderSummary,
        items,
        user.status === "loading" ? "" : user.user.email
      );
    } catch (ex) {}
    let orderData = {
      token: cookies.get("jwt_token"),
      productVariants: orderSummary.product_variant_id,
      quantity: orderSummary.quantity,
      subTotal: orderSummary.sub_total,
      deliveryCharge: orderSummary.delivery_charge.total_delivery_charge,
      totalAmount: orderSummary.total_amount,
      paymentMethod: paymentMethod,
      addressId: selectedAddress.id,
      deliveryTime: delivery_time,
      discount: orderSummary.discount,
      taxes: orderSummary.taxes,
    };

    api
      .placeOrder(orderData)
      .then((response) => response.json())
      .then(async (result) => {
        if (result.status === 1) {
          const trackingService = new TrackingService();
          if (paymentMethod === "COD") {
            try {
              trackingService.paymentSuccess(
                orderSummary,
                items,
                "COD",
                result.data,
                user.status === "loading" ? "" : user.user.email
              );
            } catch (ex) {}
            // toast.success("Order Successfully Placed!");
            setLoadingPlaceOrder(false);
            setIsOrderPlaced(true);
            setShow(true);
          } else if (paymentMethod === "Razorpay") {
            try {
              trackingService.paymentSuccess(
                orderSummary,
                items,
                "Razorpay",
                result.data,
                user.status === "loading" ? "" : user.user.email
              );
            } catch (ex) {}
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
                    orderSummary.total_amount,
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
            try {
              trackingService.paymentSuccess(
                orderSummary,
                items,
                "Paystack",
                result.data,
                user.status === "loading" ? "" : user.user.email
              );
            } catch (ex) {}

            handlePayStackPayment(
              user.user.email,
              orderSummary.total_amount,
              setting.payment_setting.paystack_currency_code,
              setting.setting.support_email
            );
          } else if (paymentMethod === "Stripe") {
            const order_id = result.data.order_id;
            try {
              trackingService.paymentSuccess(
                orderSummary,
                items,
                "Stripe",
                result.data,
                user.status === "loading" ? "" : user.user.email
              );
            } catch (ex) {}
            await api
              .initiate_transaction(
                cookies.get("jwt_token"),
                result.data.order_id,
                "Stripe"
              )
              .then((resp) => resp.json())
              .then((res) => {
                setLoadingPlaceOrder(false);
                setStripeOrderId(result.data.order_id);
                setStripeClientSecret(res.data.client_secret);
                setStripeTransactionId(res.data.id);
              })
              .catch((error) => {});
          }
        } else {
          toast.error(result.message);
          setLoadingPlaceOrder(false);
        }
      })
      .catch((error) => {});
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
          await placeOrder(items, delivery_time);
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
                navigate("/Success");
              });
          }
        });
      setShow(false);
    }
  };

  const handleOrderSummary = () => {
    var sub_total = 0;
    var totalDeliveryCharge = 0;
    var iscodAllowed = true;
    var tempItems = [];
    if (cookies.get("jwt_token") === undefined) {
      if (localStorage.getItem("cart")) {
        const cartVal = JSON.parse(localStorage.getItem("cart"));
        if (cartVal.length > 0) {
          let allProductVariantId = "",
            allQuantity = "",
            subTotal = 0,
            taxes = 0;
          for (let i = 0; i < cartVal.length - 1; i++) {
            if (
              cartVal[i].delivery_charges == 0 ||
              cartVal[i].delivery_charges == 50
            ) {
              iscodAllowed = false;
            }
            allProductVariantId +=
              cartVal[i].product_variant_id.toString() + ",";
            allQuantity += cartVal[i].qty.toString() + ",";
            subTotal +=
              parseInt(cartVal[i].qty) * parseInt(cartVal[i].discounted_price);
            totalDeliveryCharge = Math.max(
              totalDeliveryCharge,
              parseInt(cartVal[i].delivery_charges)
            );
            taxes += parseFloat(
              parseInt(cartVal[i].qty) *
                parseInt(cartVal[i].discounted_price) *
                (cartVal[i].taxes / 100)
            );

            tempItems.push({
              item_id: cartVal[i].product_id,
              item_name: cartVal[i].name,
              coupon: "",
              discount:
                (cartVal[i].price - cartVal[i].discounted_price) *
                (100 / cartVal[i].price),
              index: i,
              item_brand: "chhayakart",
              item_variant: cartVal[i].product_variant_id,
              price: cartVal[i].discounted_price,
              quantity: cartVal[i].qty,
            });
          }

          setItems(tempItems);

          allProductVariantId +=
            cartVal[cartVal.length - 1].product_variant_id.toString();
          allQuantity += cartVal[cartVal.length - 1].qty.toString();

          subTotal +=
            parseInt(cartVal[cartVal.length - 1].qty) *
            parseInt(cartVal[cartVal.length - 1].discounted_price);

          totalDeliveryCharge =
            Math.max(
              totalDeliveryCharge,
              parseInt(cartVal[cartVal.length - 1].delivery_charges)
            ) + (cartVal.length > 1 ? (cartVal.length - 1) * 9 : 0);

          if (
            cartVal[cartVal.length - 1].delivery_charges == 0 ||
            cartVal[cartVal.length - 1].delivery_charges == 50
          ) {
            iscodAllowed = false;
          }

          taxes += parseFloat(
            parseInt(cartVal[cartVal.length - 1].qty) *
              parseInt(cartVal[cartVal.length - 1].discounted_price) *
              (cartVal[cartVal.length - 1].taxes / 100)
          );
          let orderVal = {
            product_variant_id: allProductVariantId,
            quantity: allQuantity,
            sub_total: subTotal,
            taxes:
              subTotal > 4999 && subTotal < 9999
                ? Math.ceil(0.92 * taxes)
                : subTotal > 9999
                ? Math.ceil(0.88 * taxes)
                : Math.ceil(taxes),
            discount:
              subTotal > 4999 && subTotal < 9999
                ? Math.floor(0.08 * subTotal)
                : subTotal > 9999
                ? Math.floor(0.12 * subTotal)
                : 0,
            delivery_charge: { total_delivery_charge: totalDeliveryCharge },
            total_amount:
              subTotal > 4999 && subTotal < 9999
                ? Math.ceil(
                    subTotal +
                      0.92 * taxes +
                      totalDeliveryCharge -
                      Math.floor(0.08 * subTotal)
                  )
                : subTotal > 9999
                ? Math.ceil(
                    subTotal +
                      0.88 * taxes +
                      totalDeliveryCharge -
                      Math.floor(0.12 * subTotal)
                  )
                : Math.ceil(subTotal + taxes + totalDeliveryCharge),

            cod_allowed: iscodAllowed ? 1 : 0,
          };
          const trackingService = new TrackingService();
          try {
            trackingService.checkout(
              orderVal,
              items,
              user.status === "loading" ? "" : user.user.email
            );
          } catch (ex) {}
          setOrderSummary(orderVal);
          sub_total = subTotal;
        }
      }

      if (
        sub_total <= 249 ||
        parseInt(totalDeliveryCharge) < 1 ||
        !iscodAllowed
      ) {
        setIsCodAllowed(false);
      } else {
        setIsCodAllowed(true);
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
            var tempItems = [];
            for (let i = 0; i < res.data.cart.length - 1; i++) {
              tempItems.push({
                item_id: res.data.cart[i].product_id,
                item_name: res.data.cart[i].name,
                coupon: "",
                discount:
                  (res.data.cart[i].price - res.data.cart[i].discounted_price) *
                  (100 / res.data.cart[i].price),
                index: i,
                item_brand: "chhayakart",
                item_category: "",
                item_variant: res.data.cart[i].product_variant_id,
                price: res.data.cart[i].discounted_price,
                quantity: res.data.cart[i].qty,
              });

              if (res.data.cart[i].cod_allowed == 0) {
                setIsCodAllowed(false);
              }
            }

            setItems(tempItems);
            setIsLoader(false);
            dispatch({ type: ActionTypes.SET_CART, payload: res });
          }
        });
    }
  };

  useEffect(() => {
    expectedDate.setDate(expectedDate.getDate() + 6);
    fetchOrders();
    handleOrderSummary();
  }, []);

  useEffect(() => {
    handleOrderSummary();
  }, [productTriggered]);

  useEffect(() => {
    if (isOrderPlaced) {
      setShow(true);
      setTimeout(() => {
        handleClose();
      }, 800);
    }
  }, [isOrderPlaced]);

  useEffect(() => {
    var delivery_charges = 0;
    var iscodAllowed = true;
    var taxes = 0;
    if (cart.checkout !== null) {
      var sub_total = 0;
      sub_total = cart.checkout.sub_total;
      if (cart.cart != undefined && cart.cart.data != undefined) {
        for (let i = 0; i < cart.cart.data.cart.length; i++) {
          delivery_charges = Math.max(
            delivery_charges,
            cart.cart.data.cart[i].delivery_charges
          );
          taxes +=
            ((cart.cart.data.cart[i].taxes != null
              ? cart.cart.data.cart[i].taxes
              : 5) /
              100) *
            (parseInt(cart.cart.data.cart[i].qty) *
              parseInt(cart.cart.data.cart[i].discounted_price));
          if (
            cart.cart.data.cart[i].delivery_charges == 0 ||
            cart.cart.data.cart[i].delivery_charges == 50
          ) {
            iscodAllowed = false;
          }
        }

        delivery_charges +=
          cart.cart.data.cart.length > 1
            ? (cart.cart.data.cart.length - 1) * 9
            : 0;
      }
      let orderVal = {
        product_variant_id: cart.checkout.product_variant_id,
        quantity: cart.checkout.quantity,
        sub_total: cart.checkout.sub_total,
        taxes:
          cart.checkout.sub_total > 4999 && cart.checkout.sub_total < 9999
            ? Math.ceil(0.92 * taxes)
            : cart.checkout.sub_total > 9999
            ? Math.ceil(0.88 * taxes)
            : Math.ceil(taxes),
        discount:
          cart.checkout.sub_total > 4999 && cart.checkout.sub_total < 9999
            ? Math.floor(0.08 * cart.checkout.sub_total)
            : cart.checkout.sub_total > 9999
            ? Math.floor(0.12 * cart.checkout.sub_total)
            : 0,
        delivery_charge: {
          total_delivery_charge: delivery_charges,
        },
        total_amount:
          cart.checkout.sub_total > 4999 && cart.checkout.sub_total < 9999
            ? Math.ceil(
                cart.checkout.sub_total +
                  0.92 * taxes +
                  delivery_charges -
                  Math.floor(0.08 * cart.checkout.sub_total)
              )
            : cart.checkout.sub_total > 9999
            ? Math.ceil(
                cart.checkout.sub_total +
                  0.88 * taxes +
                  delivery_charges -
                  Math.floor(0.12 * cart.checkout.sub_total)
              )
            : Math.ceil(cart.checkout.sub_total + taxes + delivery_charges),
        cod_allowed: iscodAllowed ? 1 : 0,
      };
      setOrderSummary(orderVal);

      if (sub_total <= 249 || parseInt(delivery_charges) < 1 || !iscodAllowed) {
        setIsCodAllowed(false);
      } else {
        setIsCodAllowed(true);
      }
    }
  }, [cart]);

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
              if (i === cartVal.length - 1) {
                localStorage.removeItem("cart");
                api
                  .getCart(
                    cookies.get("jwt_token"),
                    city.city.latitude,
                    city.city.longitude
                  )
                  .then((resp) => resp.json())
                  .then((res) => {
                    if (res.status === 1) {
                      var tempItems = [];
                      for (let i = 0; i < res.data.cart.length - 1; i++) {
                        tempItems.push({
                          item_id: res.data.cart[i].product_id,
                          item_name: res.data.cart[i].name,
                          coupon: "",
                          discount:
                            (res.data.cart[i].price -
                              res.data.cart[i].discounted_price) *
                            (100 / res.data.cart[i].price),
                          index: i,
                          item_brand: "chhayakart",
                          item_category: "",
                          item_variant: res.data.cart[i].product_variant_id,
                          price: res.data.cart[i].discounted_price,
                          quantity: res.data.cart[i].qty,
                        });

                        if (res.data.cart[i].cod_allowed === 0) {
                          setIsCodAllowed(false);
                        }
                      }

                      setItems(tempItems);
                      setIsLoader(false);
                      dispatch({ type: ActionTypes.SET_CART, payload: res });
                    }
                  });
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

        {
        // <div className="cover">
        //   <img
        //     data-src={coverImg}
        //     className="img-fluid lazyload"
        //     alt="cover"
        //   ></img>
        //   <div className="title">
        //     {/* <h3>CHECKOUT TOTAL</h3> */}
        //     <span>home / </span>
        //     <span className="active">checkout</span>
        //   </div>
        // </div>
        }

        {setting.payment_setting === null && isLoader ? (
          <Loader />
        ) : (
          <>
            <div className="checkout-container container" style={{paddingTop: isSmScreen ? '0' : '50px'}}>
              {isUserLoggedIn ? (
                <BillingAddress
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
                  isCodAllowed={isCodAllowed}
                  setting={setting}
                  setPaymentMethod={setPaymentMethod}
                />
                {Object.keys(orderSummary).length > 0 && (
                  <OrderSummary
                    cart={orderSummary}
                    isUserLoggedIn={isUserLoggedIn}
                    user={user}
                    items={items}
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
                amount={orderSummary.total_amount}
              >
                <InjectCheckout
                  orderID={stripeOrderId}
                  client_secret={stripeClientSecret}
                  transaction_id={stripeTransactionId}
                  amount={orderSummary.total_amount}
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
