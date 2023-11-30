import { useState, useEffect } from 'react';
import Cookies from "universal-cookie";
import api from '../../api/api';
import Loader from '../loader/Loader';
import './order_new.css'
import OrderItem from './OrderItem';
import TrackingModalContent from './TrackingModalContent';
import { useResponsive } from "../shared/use-responsive";

const OrderNew = () => {
    const [isLoader, setisLoader] = useState(false);
    const [orders, setorders] = useState(null);
    const [totalOrders, settotalOrders] = useState(null);
    const [offset, setoffset] = useState(0);
    const total_orders_per_page = 10;
    const cookies = new Cookies();
	const [trackingLoaderFlag, setTrackingLoaderFlag] = useState(null);
	const [trackingDetails, setTrackingDetails] = useState(null);
	const [trackingPercentStatus, setTrackingPercentStatus] = useState(25);
    const {isSmScreen} = useResponsive();

    const fetchOrders = () => {
		api
			.getOrders(cookies.get("jwt_token"), total_orders_per_page, offset)
			.then((response) => response.json())
			.then((result) => {
				if (result.status === 1) {
					setisLoader(false);
					setorders(result.data);
					settotalOrders(result.total);

					// setorders(testData);
					// settotalOrders(1);

					// setCategoryId(result.data.slice(0, 1));
				}
			});
	};

	const getOrderStatus = (trackingId, orderObj) => {
        if(orderObj.active_status === '1'){
            // Cancelled/Not Processed Order
            setTrackingDetails(null);
            setTrackingPercentStatus(-1);
            setTrackingLoaderFlag(false);
            return;
        }

		if(trackingId !== null && trackingId !== ''){
			setTrackingLoaderFlag(true);
			api.trackOrder(cookies.get("jwt_token"), trackingId)
			.then((response) => response.json())
			.then((result)=>{
                let trackingData = result.data;
                if(trackingData.length > 0){
                    setTrackingDetails(trackingData[0].tracking_data);
				    let shipmentStatus = trackingData[0].tracking_data.shipment_status;
                    switch(shipmentStatus){
                        case 21:
                        case 9:
                            // Not Delivered
                            setTrackingPercentStatus(0);
                            break;
                        case 18:
                            // Shipped
                            setTrackingPercentStatus(50);
                            break;
                        case 17:
                            // Out for delivery
                            setTrackingPercentStatus(75);
                            break;
                        case 7:
                            // Delivered
                            setTrackingPercentStatus(100);
                            break;
                        default:
                            setTrackingPercentStatus(25);
                            break;
                    }
                }
				setTrackingLoaderFlag(false);
			});
		}else{
            // Confirmed Order but tracking details not available
			setTrackingPercentStatus(25);
			setTrackingDetails(null);
		}

	};

    useEffect(() => {
		setisLoader(true);
		fetchOrders();
	}, [offset]);

    return(
	<div>
        {
            orders === null ? <Loader width="100%" height="350px"/> : 
			<div className={`order-list px-2 ${isSmScreen ? 'py-2' : 'order-list-desktop'}`}>
				{orders.map((order)=>
					<div className='order-card d-flex flex-column py-3 my-3 border rounded-2 fs-4'>
						<div className='order-top-section pb-2 d-flex flex-row border-bottom px-2'>
							<div className='d-flex flex-column'>
								<div>Order placed on: {new Date(order.created_at).toLocaleDateString("en-IN", {weekday: "short", day: "numeric", month: "short"})}</div>
								<div className='text-black-50'>Order ID: {order.id}</div>
							</div>
							<div className='d-flex flex-column ms-auto pe-2'>
                                <div>{order.items.length === 1 ? '1 item' : `${order.items.length} items`}</div>
                                {order.active_status ==='1' ? <div className='text-danger'>Cancelled</div> : <></>}
                            </div>
						</div>
							{
								order.items.map((item, index)=> <OrderItem orderItem={item} onClickItem={(trackingId)=>{
									getOrderStatus(trackingId, order);
									// getOrderStatus(index, order);
								}}/>)
							}
					</div>
				)}
			</div>
        }
		<div id='track'>
			<div
				className="modal fade"
				id="trackModal"
				aria-labelledby="TrackModalLabel"
				aria-hidden="true">
					<div className='modal-dialog modal-dialog-centered'>
						<div className='modal-content'>
							<div className='d-flex justify-content-end mx-5'>
								<button type='button' className='btn-close mb-5' data-bs-dismiss='modal' aria-label='Close'></button>
							</div>
							<div>
								{trackingLoaderFlag ? <Loader width={"200px"}/> : <TrackingModalContent trackingDetails={trackingDetails} trackingPercentStatus={trackingPercentStatus} cancelledOrder={trackingPercentStatus<0}/>}
							</div>
						</div>
					</div>
			</div>
		</div>
    </div>
	);
};

// let testData = [
// 	{
// 	"id": 1448,
// 	"user_id": 1469,
// 	"delivery_boy_id": 0,
// 	"transaction_id": 0,
// 	"orders_id": "7615362656793",
// 	"otp": 0,
// 	"mobile": "9923815410",
// 	"order_note": "order_MzrZxPPoQ5OKXv",
// 	"total": "145",
// 	"delivery_charge": 40,
// 	"tax_amount": 7.25,
// 	"tax_percentage": 5,
// 	"wallet_balance": 0,
// 	"discount": 0,
// 	"promo_code": "",
// 	"promo_discount": 0,
// 	"final_total": "193",
// 	"payment_method": "Razorpay",
// 	"address": "85/86, Aashirwaad Near Chhatshala Sindhi colony Hinganghat-442301 India",
// 	"latitude": "0",
// 	"longitude": "0",
// 	"delivery_time": "19-11-2023 Morning 9:00 A.M - 1:00 P.M",
// 	"status":
// 	[],
// 	"active_status": "2",
// 	"order_from": 0,
// 	"pincode_id": null,
// 	"address_id": 1108,
// 	"area_id": 0,
// 	"created_at": "2023-11-13T00:00:00.000000Z",
// 	"order_id": 1448,
// 	"bank_transfer_message": "",
// 	"bank_transfer_status": "0",
// 	"user_name": "Gaurav Chandani",
// 	"landmark": "Near Chhatshala",
// 	"area": "Sindhi colony",
// 	"city": "Hinganghat",
// 	"state": "Maharashtra",
// 	"pincode": "442301",
// 	"country": "India",
// 	"discount_rupees": 0,
// 	"items":
// 	[
// 		{
// 			"id": 3281,
// 			"user_id": 1469,
// 			"order_id": 1448,
// 			"orders_id": "7615362656793",
// 			"product_name": "Kanda-Lasun Masala",
// 			"variant_name": "0250 gm",
// 			"product_variant_id": 141,
// 			"delivery_boy_id": 0,
// 			"quantity": 1,
// 			"price": 150,
// 			"discounted_price": 145,
// 			"tax_amount": 0,
// 			"tax_percentage": 0,
// 			"discount": 0,
// 			"sub_total": 145,
// 			"active_status": "1",
// 			"seller_id": 3,
// 			"is_credited": 0,
// 			"created_at": "2023-11-13T00:00:00.000000Z",
// 			"variant_id": 141,
// 			"name": "Kanda-Lasun Masala",
// 			"manufacturer": "null",
// 			"made_in": "",
// 			"return_status": 0,
// 			"return_days": 0,
// 			"cancelable_status": 0,
// 			"till_status": "null",
// 			"measurement": 0,
// 			"unit": "250 gm",
// 			"seller_name": "Chhayakart",
// 			"image_url": "https://admin.chhayakart.com/storage/products/1692442645_71428.webp",
// 			"trackingId": 8334862038
// 		},
// 		{
// 			"id": 3281,
// 			"user_id": 1469,
// 			"order_id": 1448,
// 			"orders_id": "7615362656793",
// 			"product_name": "Kanda-Lasun Masala",
// 			"variant_name": "0250 gm",
// 			"product_variant_id": 141,
// 			"delivery_boy_id": 0,
// 			"quantity": 1,
// 			"price": 150,
// 			"discounted_price": 145,
// 			"tax_amount": 0,
// 			"tax_percentage": 0,
// 			"discount": 0,
// 			"sub_total": 145,
// 			"active_status": "1",
// 			"seller_id": 3,
// 			"is_credited": 0,
// 			"created_at": "2023-11-13T00:00:00.000000Z",
// 			"variant_id": 141,
// 			"name": "Kanda-Lasun Masala",
// 			"manufacturer": "null",
// 			"made_in": "",
// 			"return_status": 0,
// 			"return_days": 0,
// 			"cancelable_status": 0,
// 			"till_status": "null",
// 			"measurement": 0,
// 			"unit": "250 gm",
// 			"seller_name": "Chhayakart",
// 			"image_url": "https://admin.chhayakart.com/storage/products/1692442645_71428.webp",
// 			"trackingId": 8334862038
// 		},
// 		{
// 			"id": 3281,
// 			"user_id": 1469,
// 			"order_id": 1448,
// 			"orders_id": "7615362656793",
// 			"product_name": "Kanda-Lasun Masala",
// 			"variant_name": "0250 gm",
// 			"product_variant_id": 141,
// 			"delivery_boy_id": 0,
// 			"quantity": 1,
// 			"price": 150,
// 			"discounted_price": 145,
// 			"tax_amount": 0,
// 			"tax_percentage": 0,
// 			"discount": 0,
// 			"sub_total": 145,
// 			"active_status": "1",
// 			"seller_id": 3,
// 			"is_credited": 0,
// 			"created_at": "2023-11-13T00:00:00.000000Z",
// 			"variant_id": 141,
// 			"name": "Kanda-Lasun Masala",
// 			"manufacturer": "null",
// 			"made_in": "",
// 			"return_status": 0,
// 			"return_days": 0,
// 			"cancelable_status": 0,
// 			"till_status": "null",
// 			"measurement": 0,
// 			"unit": "250 gm",
// 			"seller_name": "Chhayakart",
// 			"image_url": "https://admin.chhayakart.com/storage/products/1692442645_71428.webp",
// 			"trackingId": 8334862038
// 		},
// 		{
// 			"id": 3281,
// 			"user_id": 1469,
// 			"order_id": 1448,
// 			"orders_id": "7615362656793",
// 			"product_name": "Kanda-Lasun Masala",
// 			"variant_name": "0250 gm",
// 			"product_variant_id": 141,
// 			"delivery_boy_id": 0,
// 			"quantity": 1,
// 			"price": 150,
// 			"discounted_price": 145,
// 			"tax_amount": 0,
// 			"tax_percentage": 0,
// 			"discount": 0,
// 			"sub_total": 145,
// 			"active_status": "1",
// 			"seller_id": 3,
// 			"is_credited": 0,
// 			"created_at": "2023-11-13T00:00:00.000000Z",
// 			"variant_id": 141,
// 			"name": "Kanda-Lasun Masala",
// 			"manufacturer": "null",
// 			"made_in": "",
// 			"return_status": 0,
// 			"return_days": 0,
// 			"cancelable_status": 0,
// 			"till_status": "null",
// 			"measurement": 0,
// 			"unit": "250 gm",
// 			"seller_name": "Chhayakart",
// 			"image_url": "https://admin.chhayakart.com/storage/products/1692442645_71428.webp",
// 			"trackingId": 8334862038
// 		},
// 	],
// 	// "trackingId": 8334862038
// 	},
// 	{
// 		"id": 1448,
// 		"user_id": 1469,
// 		"delivery_boy_id": 0,
// 		"transaction_id": 0,
// 		"orders_id": "7615362656793",
// 		"otp": 0,
// 		"mobile": "9923815410",
// 		"order_note": "order_MzrZxPPoQ5OKXv",
// 		"total": "145",
// 		"delivery_charge": 40,
// 		"tax_amount": 7.25,
// 		"tax_percentage": 5,
// 		"wallet_balance": 0,
// 		"discount": 0,
// 		"promo_code": "",
// 		"promo_discount": 0,
// 		"final_total": "193",
// 		"payment_method": "Razorpay",
// 		"address": "85/86, Aashirwaad Near Chhatshala Sindhi colony Hinganghat-442301 India",
// 		"latitude": "0",
// 		"longitude": "0",
// 		"delivery_time": "19-11-2023 Morning 9:00 A.M - 1:00 P.M",
// 		"status":
// 		[],
// 		"active_status": "1",
// 		"order_from": 0,
// 		"pincode_id": null,
// 		"address_id": 1108,
// 		"area_id": 0,
// 		"created_at": "2023-11-13T00:00:00.000000Z",
// 		"order_id": 1448,
// 		"bank_transfer_message": "",
// 		"bank_transfer_status": "0",
// 		"user_name": "Gaurav Chandani",
// 		"landmark": "Near Chhatshala",
// 		"area": "Sindhi colony",
// 		"city": "Hinganghat",
// 		"state": "Maharashtra",
// 		"pincode": "442301",
// 		"country": "India",
// 		"discount_rupees": 0,
// 		"items":
// 		[
// 			{
// 				"id": 3281,
// 				"user_id": 1469,
// 				"order_id": 1448,
// 				"orders_id": "7615362656793",
// 				"product_name": "Kanda-Lasun Masala",
// 				"variant_name": "0250 gm",
// 				"product_variant_id": 141,
// 				"delivery_boy_id": 0,
// 				"quantity": 1,
// 				"price": 150,
// 				"discounted_price": 145,
// 				"tax_amount": 0,
// 				"tax_percentage": 0,
// 				"discount": 0,
// 				"sub_total": 145,
// 				"active_status": "1",
// 				"seller_id": 3,
// 				"is_credited": 0,
// 				"created_at": "2023-11-13T00:00:00.000000Z",
// 				"variant_id": 141,
// 				"name": "Kanda-Lasun Masala",
// 				"manufacturer": "null",
// 				"made_in": "",
// 				"return_status": 0,
// 				"return_days": 0,
// 				"cancelable_status": 0,
// 				"till_status": "null",
// 				"measurement": 0,
// 				"unit": "250 gm",
// 				"seller_name": "Chhayakart",
// 				"image_url": "https://admin.chhayakart.com/storage/products/1692442645_71428.webp",
// 				"trackingId": 8334862038
// 			},
// 		],
// 		// "trackingId": 8334862038
// 		},
// ];

// let trackingTestData0 = [];

// let trackingTestData1 = [
//     {
//         "tracking_data": {
//             "track_status": 1,
//             "shipment_status": 18,
//             "shipment_track": [
//                 {
//                     "id": 379912768,
//                     "awb_code": "JH003442461IN",
//                     "courier_company_id": 217,
//                     "shipment_id": 430778760,
//                     "order_id": 432603338,
//                     "pickup_date": "2023-11-08 16:20:21",
//                     "delivered_date": null,
//                     "weight": "1",
//                     "packages": 1,
//                     "current_status": "In Transit",
//                     "delivered_to": "East Nimar",
//                     "destination": "East Nimar",
//                     "consignee_name": "N",
//                     "origin": "Dhule",
//                     "courier_agent_details": null,
//                     "courier_name": "India Post - Speed Post",
//                     "edd": "2023-11-17 15:20:21",
//                     "pod": "Available",
//                     "pod_status": "OTP Based delivery",
//                     "rto_delivered_date": "NA"
//                 }
//             ],
//             "shipment_track_activities": [
//                 {
//                     "date": "2023-11-14 02:22:15",
//                     "status": "TMO_RECEIVE",
//                     "activity": "Item ReceivedItem Received At Sagar R.S TMO, TM23352100504",
//                     "location": "Sagar R.S TMO",
//                     "sr-status": 18,
//                     "sr-status-label": "IN TRANSIT"
//                 },
//                 {
//                     "date": "2023-11-08 22:24:42",
//                     "status": "ITEM_RECEIVE",
//                     "activity": "Item ReceivedItem Received At Mumbai PH, PH24252000761",
//                     "location": "Mumbai PH",
//                     "sr-status": 38,
//                     "sr-status-label": "REACHED AT DESTINATION HUB"
//                 },
//                 {
//                     "date": "2023-11-08 16:20:21",
//                     "status": "BAG_DISPATCH",
//                     "activity": "Item DispatchedItem Dispatched At Nashik Road  PH, PH24550000766",
//                     "location": "Nashik Road  PH",
//                     "sr-status": 6,
//                     "sr-status-label": "SHIPPED"
//                 },
//                 {
//                     "date": "2023-11-07 15:32:24",
//                     "status": "ITEM_BOOK",
//                     "activity": "Item BookItem Book At Dhule Jaihind Colony S.O, PO24504112000",
//                     "location": "Dhule Jaihind Colony S.O",
//                     "sr-status": 42,
//                     "sr-status-label": "PICKED UP"
//                 }
//             ],
//             "track_url": "https://shiprocket.co/tracking/JH003442461IN",
//             "etd": "2023-11-13 01:20:21",
//             "qc_response": {
//                 "qc_image": "",
//                 "qc_failed_reason": ""
//             }
//         }
//     }
// ];

// let trackingTestData2 = [
//     {
//         "tracking_data": {
//             "track_status": 1,
//             "shipment_status": 17,
//             "shipment_track": [
//                 {
//                     "id": 381930120,
//                     "awb_code": "7D9128969",
//                     "courier_company_id": 6,
//                     "shipment_id": 435128415,
//                     "order_id": 436953986,
//                     "pickup_date": "2023-11-16 17:26:26",
//                     "delivered_date": null,
//                     "weight": "0.43",
//                     "packages": 1,
//                     "current_status": "Out for Delivery",
//                     "delivered_to": "Mumbai",
//                     "destination": "Mumbai",
//                     "consignee_name": "Rajshree",
//                     "origin": "Dhule",
//                     "courier_agent_details": null,
//                     "courier_name": "DTDC Surface",
//                     "edd": "2023-11-17 16:10:00",
//                     "pod": "Available",
//                     "pod_status": "OTP Based delivery",
//                     "rto_delivered_date": "NA"
//                 }
//             ],
//             "shipment_track_activities": [
//                 {
//                     "date": "2023-11-17 11:37:04",
//                     "status": "OUTDLV",
//                     "activity": "Out For Delivery",
//                     "location": "GHATKOPAR BRANCH , MUMBAI",
//                     "sr-status": 17,
//                     "sr-status-label": "OUT FOR DELIVERY"
//                 },
//                 {
//                     "date": "2023-11-17 10:08:59",
//                     "status": "PREPERD",
//                     "activity": "DRS Prepared",
//                     "location": "GHATKOPAR BRANCH , MUMBAI",
//                     "sr-status": "NA",
//                     "sr-status-label": "NA"
//                 },
//                 {
//                     "date": "2023-11-17 08:29:00",
//                     "status": "IBMN",
//                     "activity": "In Transit",
//                     "location": "MUMBAI SAKINAKA APEX , MUMBAI",
//                     "sr-status": 18,
//                     "sr-status-label": "IN TRANSIT"
//                 },
//                 {
//                     "date": "2023-11-17 08:29:00",
//                     "status": "INSCAN",
//                     "activity": "Reached At Destination",
//                     "location": "MUMBAI SAKINAKA APEX , MUMBAI",
//                     "sr-status": 38,
//                     "sr-status-label": "REACHED AT DESTINATION HUB"
//                 },
//                 {
//                     "date": "2023-11-17 07:36:00",
//                     "status": "CDIN",
//                     "activity": "In Transit",
//                     "location": "MUMBAI SAKINAKA APEX , MUMBAI",
//                     "sr-status": 18,
//                     "sr-status-label": "IN TRANSIT"
//                 },
//                 {
//                     "date": "2023-11-17 06:23:00",
//                     "status": "CDOUT",
//                     "activity": "In Transit",
//                     "location": "MUMBAI SAKINAKA APEX , MUMBAI",
//                     "sr-status": 18,
//                     "sr-status-label": "IN TRANSIT"
//                 },
//                 {
//                     "date": "2023-11-17 04:01:00",
//                     "status": "OBMN",
//                     "activity": "In Transit",
//                     "location": "MUMBAI SAKINAKA APEX , MUMBAI",
//                     "sr-status": 18,
//                     "sr-status-label": "IN TRANSIT"
//                 },
//                 {
//                     "date": "2023-11-17 03:46:00",
//                     "status": "IBMN",
//                     "activity": "In Transit",
//                     "location": "DHULE BRANCH , DHULE",
//                     "sr-status": 18,
//                     "sr-status-label": "IN TRANSIT"
//                 },
//                 {
//                     "date": "2023-11-17 03:23:00",
//                     "status": "CDIN",
//                     "activity": "In Transit",
//                     "location": "DHULE BRANCH , DHULE",
//                     "sr-status": 18,
//                     "sr-status-label": "IN TRANSIT"
//                 },
//                 {
//                     "date": "2023-11-16 18:52:00",
//                     "status": "CDOUT",
//                     "activity": "In Transit",
//                     "location": "DHULE BRANCH , DHULE",
//                     "sr-status": 18,
//                     "sr-status-label": "IN TRANSIT"
//                 },
//                 {
//                     "date": "2023-11-16 18:32:00",
//                     "status": "OBMN",
//                     "activity": "In Transit",
//                     "location": "DHULE BRANCH , DHULE",
//                     "sr-status": 18,
//                     "sr-status-label": "IN TRANSIT"
//                 },
//                 {
//                     "date": "2023-11-16 17:26:26",
//                     "status": "BKD",
//                     "activity": "Booked",
//                     "location": "DHULE BRANCH , DHULE",
//                     "sr-status": 6,
//                     "sr-status-label": "SHIPPED"
//                 },
//                 {
//                     "date": "2023-11-16 16:00:25",
//                     "status": "PCUP",
//                     "activity": "Picked Up",
//                     "location": "DHULE BRANCH , DHULE",
//                     "sr-status": 42,
//                     "sr-status-label": "PICKED UP"
//                 },
//                 {
//                     "date": "2023-11-16 12:01:29",
//                     "status": "PCRA",
//                     "activity": "Pickup Reassigned",
//                     "location": "DHULE BRANCH , DHULE",
//                     "sr-status": "NA",
//                     "sr-status-label": "NA"
//                 },
//                 {
//                     "date": "2023-11-16 09:46:48",
//                     "status": "PCAW",
//                     "activity": "Pickup Awaited",
//                     "location": "DHULE BRANCH , DHULE",
//                     "sr-status": 19,
//                     "sr-status-label": "OUT FOR PICKUP"
//                 },
//                 {
//                     "date": "2023-11-16 09:46:48",
//                     "status": "PCSC",
//                     "activity": "Pickup Scheduled",
//                     "location": "DHULE BRANCH , DHULE",
//                     "sr-status": "NA",
//                     "sr-status-label": "NA"
//                 },
//                 {
//                     "date": "2023-11-16 09:46:48",
//                     "status": "SPL",
//                     "activity": "Softdata Upload",
//                     "location": "DHULE BRANCH , DHULE",
//                     "sr-status": "NA",
//                     "sr-status-label": "NA"
//                 }
//             ],
//             "track_url": "https://shiprocket.co/tracking/7D9128969",
//             "etd": "2023-11-18 03:26:26",
//             "qc_response": {
//                 "qc_image": "",
//                 "qc_failed_reason": ""
//             }
//         }
//     }
// ];

// let trackingTestData3 = [
//     {
//         "tracking_data": {
//             "track_status": 1,
//             "shipment_status": 7,
//             "shipment_track": [
//                 {
//                     "id": 376789100,
//                     "awb_code": "76878391881",
//                     "courier_company_id": 55,
//                     "shipment_id": 427293762,
//                     "order_id": 429117716,
//                     "pickup_date": "2023-11-01 14:47:00",
//                     "delivered_date": "2023-11-06 12:54:00",
//                     "weight": "0.85",
//                     "packages": 1,
//                     "current_status": "Delivered",
//                     "delivered_to": "Sidhi",
//                     "destination": "Sidhi",
//                     "consignee_name": "Shyama",
//                     "origin": "Pune",
//                     "courier_agent_details": null,
//                     "courier_name": "Blue Dart Surface",
//                     "edd": null,
//                     "pod": "Available",
//                     "pod_status": "OTP Based delivery",
//                     "rto_delivered_date": "NA"
//                 }
//             ],
//             "shipment_track_activities": [
//                 {
//                     "date": "2023-11-06 12:54:00",
//                     "status": "000-T-DL",
//                     "activity": "SHIPMENT DELIVERED",
//                     "location": "SIDHI",
//                     "sr-status": "7",
//                     "sr-status-label": "DELIVERED"
//                 },
//                 {
//                     "date": "2023-11-06 11:05:00",
//                     "status": "002-S-UD",
//                     "activity": "SHIPMENT OUTSCAN",
//                     "location": "SIDHI",
//                     "sr-status": "17",
//                     "sr-status-label": "OUT FOR DELIVERY"
//                 },
//                 {
//                     "date": "2023-11-03 23:19:00",
//                     "status": "003-S-UD",
//                     "activity": "SHIPMENT OUTSCANNED TO NETWORK",
//                     "location": "JABALPUR HUB",
//                     "sr-status": "18",
//                     "sr-status-label": "IN TRANSIT"
//                 },
//                 {
//                     "date": "2023-11-03 02:28:00",
//                     "status": "003-S-UD",
//                     "activity": "SHIPMENT OUTSCANNED TO NETWORK",
//                     "location": "VIJAYNAGAR MINI HUB",
//                     "sr-status": "18",
//                     "sr-status-label": "IN TRANSIT"
//                 },
//                 {
//                     "date": "2023-11-02 05:26:00",
//                     "status": "003-S-UD",
//                     "activity": "SHIPMENT OUTSCANNED TO NETWORK",
//                     "location": "BHIWANDI HUB",
//                     "sr-status": "18",
//                     "sr-status-label": "IN TRANSIT"
//                 },
//                 {
//                     "date": "2023-11-02 01:54:00",
//                     "status": "003-S-UD",
//                     "activity": "SHIPMENT OUTSCANNED TO NETWORK",
//                     "location": "MUMBAI ETAIL WAREHOUSE",
//                     "sr-status": "18",
//                     "sr-status-label": "IN TRANSIT"
//                 },
//                 {
//                     "date": "2023-11-01 23:05:00",
//                     "status": "003-S-UD",
//                     "activity": "SHIPMENT OUTSCANNED TO NETWORK",
//                     "location": "PUNE HUB",
//                     "sr-status": "18",
//                     "sr-status-label": "IN TRANSIT"
//                 },
//                 {
//                     "date": "2023-11-01 22:33:00",
//                     "status": "007-S-UD",
//                     "activity": "CANVAS BAG CONSOLIDATED SCAN",
//                     "location": "PUNE HUB",
//                     "sr-status": "18",
//                     "sr-status-label": "IN TRANSIT"
//                 },
//                 {
//                     "date": "2023-11-01 18:36:00",
//                     "status": "003-S-UD",
//                     "activity": "SHIPMENT OUTSCANNED TO NETWORK",
//                     "location": "PARVATI SERVICE CENTER",
//                     "sr-status": "18",
//                     "sr-status-label": "IN TRANSIT"
//                 },
//                 {
//                     "date": "2023-11-01 14:47:00",
//                     "status": "001-S-UD",
//                     "activity": "SHIPMENT INSCAN",
//                     "location": "PARVATI SERVICE CENTER",
//                     "sr-status": "6",
//                     "sr-status-label": "SHIPPED"
//                 },
//                 {
//                     "date": "2023-11-01 12:04:00",
//                     "status": "501-S-PU",
//                     "activity": "PICKUP EMPLOYEE IS OUT TO P/U SHIPMENT",
//                     "location": "PARVATI SERVICE CENTER",
//                     "sr-status": "19",
//                     "sr-status-label": "OUT FOR PICKUP"
//                 },
//                 {
//                     "date": "2023-10-31 17:34:00",
//                     "status": "555-T-PU",
//                     "activity": "RE-SCHEDULED BY CUSTOMER",
//                     "location": "PARVATI SERVICE CENTER",
//                     "sr-status": "20",
//                     "sr-status-label": "PICKUP EXCEPTION"
//                 }
//             ],
//             "track_url": "https://shiprocket.co/tracking/76878391881",
//             "etd": "2023-11-05 01:47:00",
//             "qc_response": {
//                 "qc_image": "",
//                 "qc_failed_reason": ""
//             }
//         }
//     }
// ];

export default OrderNew;