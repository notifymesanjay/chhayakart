// import React, { useEffect, useRef, useState } from "react";
// import "./order.css";
// import api from "../../api/api";
// import Cookies from "universal-cookie";
// import { FaRupeeSign } from "react-icons/fa";
// import { AiOutlineCloseCircle } from "react-icons/ai";
// import Loader from "../loader/Loader";
// import Pagination from "react-js-pagination";
// import No_Orders from "../../utils/zero-state-screens/No_Orders.svg";
// import ReactToPrint from "react-to-print";
// import { toast } from "react-toastify";

// const Order = ({ displayAll = true, setCategoryId = () => {} }) => {
// 	const [orderId, setOrderId] = useState();
// 	const [totalOrders, settotalOrders] = useState(null);
// 	const [offset, setoffset] = useState(0);
// 	const [currPage, setcurrPage] = useState(1);
// 	const [isLoader, setisLoader] = useState(false);
// 	//initialize Cookies
// 	const cookies = new Cookies();
// 	const componentRef = useRef();
// 	const total_orders_per_page = 10;
// 	const [orderInvoiceId, setOrderinvoiceId] = useState(null);
// 	const [trackingLoaderFlag, setTrackingLoaderFlag] = useState(false);
// 	const [trackingDetails, setTrackingDetails] = useState(null);
// 	const [trackingPercentStatus, setTrackingPercentStatus] = useState(25);
// 	const dateTimeOptions = {
// 		weekday: "short",
// 		year: "numeric",
// 		month: "short",
// 		day: "numeric",
// 		hour: "numeric",
// 		minute: "numeric",
// 	  };

// 	const fetchOrders = () => {
// 		api
// 			.getOrders(cookies.get("jwt_token"), total_orders_per_page, offset)
// 			.then((response) => response.json())
// 			.then((result) => {
// 				if (result.status === 1) {
// 					setisLoader(false);
// 					// setorders(result.data);
// 					// settotalOrders(result.total);
// 					setorders(testData);
// 					settotalOrders(1);

// 					// setCategoryId(result.data.slice(0, 1));
// 				}
// 			});
// 	};

// 	useEffect(() => {
// 		setisLoader(true);
// 		fetchOrders();
// 	}, [offset]);

// 	//page change
// 	const handlePageChange = (pageNum) => {
// 		setcurrPage(pageNum);
// 		setoffset(pageNum * total_orders_per_page - total_orders_per_page);
// 	};

// 	const getInvoice = async (Oid) => {
// 		// var order_id = document.getElementById('invoice').value;
// 		api
// 			.getInvoices(cookies.get("jwt_token"), Oid)
// 			.then((response) => response.json())
// 			.then((result) => {
// 				let invoicePage = result.data;
// 				document.getElementById("mainContent").innerHTML = invoicePage;
// 			});
// 	};

// 	const closeModalRef = useRef();
// 	const getOrderStatus = (pid) => {
// 		// for (let i = 0; i < orders.length; i++) {
// 		// 	const element = orders[i];
// 		// 	// if (element.id == pid) {
// 		// 	//     let html = `

// 		// 	//                         `;
// 		// 	//     document.getElementById('mainContentTrack').innerHTML = html;

// 		// 	// }
// 		// 	closeModalRef.current.click();
// 		// }
// 		if(pid !== undefined && pid != ''){
// 			setTrackingLoaderFlag(true);
// 			// api.trackOrder(pid)
// 			// .then((response) => response.json())
// 			// .then((result)=>{
// 			// 	let shipmentStatus = result[0].tracking_data.shipment_status;
// 			// 	if(shipmentStatus === 18){
// 			// 		setTrackingPercentStatus(50);
// 			// 	}else if(shipmentStatus === 17){
// 			// 		setTrackingPercentStatus(75);
// 			// 	}else if(shipmentStatus === 7){
// 			// 		setTrackingPercentStatus(100);
// 			// 	}
// 			// 	setTrackingLoaderFlag(false);
// 			// });
// 			setTimeout(()=>{
// 				if(trackingTestData.length > 0){
// 					setTrackingDetails(trackingTestData[0].tracking_data);
// 					let shipmentStatus = trackingTestData[0].tracking_data.shipment_status;
// 					if(shipmentStatus === 18){
// 						setTrackingPercentStatus(50);
// 					}else if(shipmentStatus === 17){
// 						setTrackingPercentStatus(75);
// 					}else if(shipmentStatus === 7){
// 						setTrackingPercentStatus(100);
// 					}	
// 				}
// 				setTrackingLoaderFlag(false);
// 			}, 1000)
// 		}else{
// 			setTrackingPercentStatus(25);
// 			setTrackingDetails(null);
// 		}

// 	};
// 	const [orders, setorders] = useState(null);
// 	const [element, setElement] = useState(null);
// 	const setHtml = (ID) => {
// 		orders.map((obj, index) => {
// 			if (obj.id == ID) {
// 				setElement(ID);
// 			}
// 		});
// 	};
// 	const handlePrint = () => {
// 		if (closeModalRef.current) {
// 			closeModalRef.current.click();
// 			toast.success("Invoice Downloaded Successfully");
// 		}
// 	};
// 	return (
// 		<div className="order-list">
// 			<div className="heading"> </div>

// 			{orders === null ? (
// 				<div className="my-5">
// 					<Loader width="100%" height="350px" />
// 				</div>
// 			) : (
// 				<>
// 					{isLoader ? (
// 						<div className="my-5">
// 							<Loader width="100%" height="350px" />
// 						</div>
// 					) : (
// 						<table className="order-list-table">
// 							<thead>
// 								<tr>
// 									<th>order</th>
// 									<th>product name</th>
// 									<th>date</th>
// 									<th>total</th>
// 									{/* <th>action</th> */}
// 								</tr>
// 							</thead>
// 							<tbody>
// 								{orders.length === 0 ? (
// 									<div className="d-flex align-items-center p-4 no-orders">
// 										<img
// 											data-src={No_Orders}
// 											className="lazyload"
// 											alt="no-orders"
// 										></img>
// 										<p>No Orders Found!!</p>
// 									</div>
// 								) : (
// 									<>
// 										{(displayAll ? orders : orders.slice(0, 1)).map(
// 											(order, index) => (
// 												<tr
// 													key={index}
// 													className={
// 														index === orders.length - 1 ? "last-column" : ""
// 													}
// 												>
// 													<th>{`#${order.order_id} `}</th>
// 													<th className="product-name d-table-cell verticall-center flex-column justify-content-center">
// 														{order.items.map((item, ind) => (
// 															<div className="column-container">
// 																<span key={ind}>{item.product_name},</span>
// 															</div>
// 														))}
// 													</th>
// 													<th>{order.created_at.substring(0, 10)}</th>
// 													<th className="total">
// 														<FaRupeeSign fontSize={"1.7rem"} />{" "}
// 														{order.final_total}
// 													</th>
// 													<th className="button-container">
// 													<button
// 														type="button"
// 														id={`track - ${order.order_id} `}
// 														data-bs-toggle="modal"
// 														data-bs-target="#trackModal"
// 														className="track"
// 														// value={order.order_id}
// 														value={order.trackingId}
// 														onClick={(e) => {
// 															getOrderStatus(e.target.value);
// 														}}
// 													>
// 														track order
// 													</button>
// 													<button
// 														type="button"
// 														id={`invoice - ${order.order_id} `}
// 														data-bs-toggle="modal"
// 														data-bs-target="#invoiceModal"
// 														className="Invoice"
// 														value={order.order_id}
// 														onClick={(e) => {
// 															setHtml(e.target.value);
// 															getInvoice(e.target.value);
// 														}}
// 													>
// 														Get Invoice
// 													</button>
// 												</th>
// 												</tr>
// 											)
// 										)}
// 									</>
// 								)}
// 							</tbody>
// 						</table>
// 					)}

// 					{displayAll && orders.length !== 0 ? (
// 						<Pagination
// 							activePage={currPage}
// 							itemsCountPerPage={total_orders_per_page}
// 							totalItemsCount={totalOrders}
// 							pageRangeDisplayed={5}
// 							onChange={handlePageChange.bind(this)}
// 						/>
// 					) : null}
// 				</>
// 			)}
// 			<div id="invoice">
// 				<div
// 					className="modal fade new-invoice"
// 					id="invoiceModal"
// 					aria-labelledby="InvoiceModalLabel"
// 					aria-hidden="true"
// 				>
// 					<button
// 						type="button"
// 						className="d-none"
// 						ref={closeModalRef}
// 						data-bs-dismiss="modal"
// 						aria-label="Close"
// 					></button>
// 					<div className="modal-dialog">
// 						<div
// 							className="modal-content"
// 							style={{
// 								borderRadius: "10px",
// 								maxWidth: "100%",
// 								padding: "30px 15px",
// 								zIndex: -2,
// 							}}
// 						>
// 							{/* <button type="button" class="bg-white" data-bs-dismiss="modal" aria-label="Close" ref={closeModalRef} style={{ width: '30px' }}><i class="bi bi-x-octagon"></i></button> */}
// 							<div id="mainContent" ref={componentRef}></div>
// 							<ReactToPrint
// 								trigger={() => (
// 									<button
// 										style={{ alignSelf: "center", fontSize: "14px" }}
// 										className="btn btn-primary w-50"
// 									>
// 										{" "}
// 										Print this out!
// 									</button>
// 								)}
// 								content={() => componentRef.current}
// 								onAfterPrint={handlePrint}
// 							/>
// 						</div>
// 					</div>
// 				</div>
// 			</div>
// 			<div id="track">
// 				<div
// 					className="modal fade new-track"
// 					id="trackModal"
// 					aria-labelledby="TrackModalLabel"
// 					aria-hidden="true"
// 				>
// 					<div className="modal-dialog">
// 						<div
// 							className="modal-content"
// 							style={{
// 								borderRadius: "10px",
// 								maxWidth: "100%",
// 								padding: "30px 15px",
// 								zIndex: -2,
// 							}}
// 						>
// 							{
// 								trackingLoaderFlag ? 
// 								(
// 									<Loader width="100%" height="250px" />
// 								) :
// 							(<div id="mainContentTrack">
// 								<section class="track" id="printMe">
// 									<div class="d-flex justify-content-end align-items-center mx-5">
// 										{/* <h5 class="page-header">eGrocer</h5>
// 										<h5 class="page-header">
// 											Mo. +${element && element.mobile}
// 										</h5> */}
// 										<button
// 											type="button"
// 											class="bg-white"
// 											data-bs-dismiss="modal"
// 											aria-label="Close"
// 											ref={closeModalRef}
// 											style={{ width: "30px" }}
// 										>
// 											<i class="bi bi-x-octagon"></i>
// 										</button>
// 									</div>
// 									<div class="d-flex flex-column">
// 										<div class="d-flex flex-column mx-5 justify-content-around">
// 											<div class="d-flex my-4">
// 												<div class="bg-white track-col">
// 													{" "}
// 													<span class="rounded-circle px-3 pt-2 fs-2 border-outline-success bg-subtle btn btn-outline-success">
// 														<i class="bi bi-cart "></i>
// 													</span>
// 												</div>
// 												<div className="d-flex flex-column mx-1 justify-content-center">
// 													<span class=""> Accepted</span>
// 													{trackingPercentStatus <= 25 ? <div className="small text-black-50"> Once the order is shipped, We'll let you know</div> : <></>}
// 												</div>
// 											</div>
// 											<div
// 												class="progress flex-column"
// 												role="progressbar"
// 												aria-label="Basic example"
// 												aria-valuenow="50"
// 												aria-valuemin="0"
// 												aria-valuemax="100"
// 											>
// 												<div
// 													class="progress-bar bg-success"
// 													style={{
// 														height:
// 															// element &&
// 															// (element.active_status == 2
// 															// 	? "23%;"
// 															// 	: element.active_status == 5
// 															// 	? "77%;"
// 															// 	: element.active_status == 4
// 															// 	? "57;"
// 															// 	: element.active_status == 6
// 															// 	? "100%;"
// 															// 	: "50%"),
// 															`${trackingPercentStatus}%`
// 													}}
// 												></div>
// 											</div>
// 											<div class="d-flex my-4">
// 												<div class="bg-white track-col">
// 													{" "}
// 													<span class="rounded-circle px-3 pt-2 fs-2 btn btn-outline-success">
// 														<i class="bi bi-truck "></i>
// 													</span>
// 												</div>
// 												<div className="d-flex flex-column mx-1 justify-content-center">
// 													<div className={trackingPercentStatus >= 50 ? 'text-black' : 'text-black-50'}> Shipped</div>
// 													{trackingDetails !== null ?
// 													<div className="small text-black-50">
// 														{(trackingPercentStatus < 25) ? <></> : function (){
// 															if(trackingPercentStatus <= 50){
// 																let shipedActivity = trackingDetails.shipment_track_activities[0];
// 																return `${shipedActivity.activity} | ${shipedActivity.location}`;
// 															}
// 															let shipedActivity = trackingDetails.shipment_track_activities.filter((el)=> el['sr-status'] == "6")[0];
// 															return `${shipedActivity.location} | ${new Date(shipedActivity.date).toLocaleString("en-IN", dateTimeOptions)}`;
// 														}()}
// 													</div> : <></>
// 													}
// 												</div>
// 											</div>
// 											<div class="d-flex my-4">
// 												<div class="bg-white track-col">
// 													{" "}
// 													<span class="rounded-circle px-3 pt-2 fs-2 btn btn-outline-success">
// 														<i class="bi bi-bus-front "></i>
// 													</span>
// 												</div>
// 												<div className="d-flex flex-column mx-1 justify-content-center">
// 													<div className={trackingPercentStatus >= 75 ? 'text-black' : 'text-black-50'}>Out for Delivery</div>
// 													{ trackingDetails !== null ?
// 														<div className="small text-black-50">{
// 														trackingPercentStatus >= 75 ? function (){
// 															let outForDeliveryActivity = trackingDetails.shipment_track_activities.filter((ele)=>ele['sr-status'] == 17)[0];
// 															if(outForDeliveryActivity !== undefined){
// 																// return new Date(outForDeliveryActivity.date).toLocaleString();
// 																return new Date(outForDeliveryActivity.date).toLocaleString("en-IN",dateTimeOptions);
// 															}
// 														} () : ""
// 													}
// 													</div> : <></>}
// 												</div>
// 											</div>
// 											<div class="d-flex my-4">
// 												<div class="bg-white track-col">
// 													{" "}
// 													<span class="rounded-circle px-3 pt-2 fs-2 btn btn-outline-success">
// 														<i class="bi bi-check "></i>
// 													</span>
// 												</div>
// 												<div className="d-flex flex-column mx-1 justify-content-center">
// 													<div className={trackingPercentStatus >= 100 ? 'text-black' : 'text-black-50'}>Delivered</div>
// 													{trackingDetails !== null ?
// 														<div className="small text-black-50">{
// 															(trackingDetails.shipment_track[0].delivered_date !== null ? `${new Date(trackingDetails.shipment_track[0].delivered_date).toLocaleString("en-IN", dateTimeOptions)}` : `Estimated delivery date: ${new Date(trackingDetails.etd).toDateString()}`)
// 														}
// 														</div>	: <></>
// 													}
// 												</div>
// 											</div>
// 										</div>
// 									</div>
// 									{ trackingDetails !== null ?
// 										<div className="d-flex justify-content-end">
// 										<button type="button" className="btn btn-link" onClick={()=>{
// 											window.open(trackingDetails.track_url, "_blank");
// 										}}>View more details</button>
// 									</div> : <></>}
// 								</section>
// 							</div>)}
// 						</div>
// 					</div>
// 				</div>
// 			</div>
// 		</div>
// 	);
// };

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
// 	"active_status": "1",
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
// 			"image_url": "https://admin.chhayakart.com/storage/products/1692442645_71428.webp"
// 		}
// 	],
// 	"trackingId": 8334862038
// 	},
// ];

// // let trackingTestData = [];

// // let trackingTestData = [
// //     {
// //         "tracking_data": {
// //             "track_status": 1,
// //             "shipment_status": 18,
// //             "shipment_track": [
// //                 {
// //                     "id": 379912768,
// //                     "awb_code": "JH003442461IN",
// //                     "courier_company_id": 217,
// //                     "shipment_id": 430778760,
// //                     "order_id": 432603338,
// //                     "pickup_date": "2023-11-08 16:20:21",
// //                     "delivered_date": null,
// //                     "weight": "1",
// //                     "packages": 1,
// //                     "current_status": "In Transit",
// //                     "delivered_to": "East Nimar",
// //                     "destination": "East Nimar",
// //                     "consignee_name": "N",
// //                     "origin": "Dhule",
// //                     "courier_agent_details": null,
// //                     "courier_name": "India Post - Speed Post",
// //                     "edd": "2023-11-17 15:20:21",
// //                     "pod": "Available",
// //                     "pod_status": "OTP Based delivery",
// //                     "rto_delivered_date": "NA"
// //                 }
// //             ],
// //             "shipment_track_activities": [
// //                 {
// //                     "date": "2023-11-14 02:22:15",
// //                     "status": "TMO_RECEIVE",
// //                     "activity": "Item ReceivedItem Received At Sagar R.S TMO, TM23352100504",
// //                     "location": "Sagar R.S TMO",
// //                     "sr-status": 18,
// //                     "sr-status-label": "IN TRANSIT"
// //                 },
// //                 {
// //                     "date": "2023-11-08 22:24:42",
// //                     "status": "ITEM_RECEIVE",
// //                     "activity": "Item ReceivedItem Received At Mumbai PH, PH24252000761",
// //                     "location": "Mumbai PH",
// //                     "sr-status": 38,
// //                     "sr-status-label": "REACHED AT DESTINATION HUB"
// //                 },
// //                 {
// //                     "date": "2023-11-08 16:20:21",
// //                     "status": "BAG_DISPATCH",
// //                     "activity": "Item DispatchedItem Dispatched At Nashik Road  PH, PH24550000766",
// //                     "location": "Nashik Road  PH",
// //                     "sr-status": 6,
// //                     "sr-status-label": "SHIPPED"
// //                 },
// //                 {
// //                     "date": "2023-11-07 15:32:24",
// //                     "status": "ITEM_BOOK",
// //                     "activity": "Item BookItem Book At Dhule Jaihind Colony S.O, PO24504112000",
// //                     "location": "Dhule Jaihind Colony S.O",
// //                     "sr-status": 42,
// //                     "sr-status-label": "PICKED UP"
// //                 }
// //             ],
// //             "track_url": "https://shiprocket.co/tracking/JH003442461IN",
// //             "etd": "2023-11-13 01:20:21",
// //             "qc_response": {
// //                 "qc_image": "",
// //                 "qc_failed_reason": ""
// //             }
// //         }
// //     }
// // ];

// // let trackingTestData = [
// //     {
// //         "tracking_data": {
// //             "track_status": 1,
// //             "shipment_status": 17,
// //             "shipment_track": [
// //                 {
// //                     "id": 381930120,
// //                     "awb_code": "7D9128969",
// //                     "courier_company_id": 6,
// //                     "shipment_id": 435128415,
// //                     "order_id": 436953986,
// //                     "pickup_date": "2023-11-16 17:26:26",
// //                     "delivered_date": null,
// //                     "weight": "0.43",
// //                     "packages": 1,
// //                     "current_status": "Out for Delivery",
// //                     "delivered_to": "Mumbai",
// //                     "destination": "Mumbai",
// //                     "consignee_name": "Rajshree",
// //                     "origin": "Dhule",
// //                     "courier_agent_details": null,
// //                     "courier_name": "DTDC Surface",
// //                     "edd": "2023-11-17 16:10:00",
// //                     "pod": "Available",
// //                     "pod_status": "OTP Based delivery",
// //                     "rto_delivered_date": "NA"
// //                 }
// //             ],
// //             "shipment_track_activities": [
// //                 {
// //                     "date": "2023-11-17 11:37:04",
// //                     "status": "OUTDLV",
// //                     "activity": "Out For Delivery",
// //                     "location": "GHATKOPAR BRANCH , MUMBAI",
// //                     "sr-status": 17,
// //                     "sr-status-label": "OUT FOR DELIVERY"
// //                 },
// //                 {
// //                     "date": "2023-11-17 10:08:59",
// //                     "status": "PREPERD",
// //                     "activity": "DRS Prepared",
// //                     "location": "GHATKOPAR BRANCH , MUMBAI",
// //                     "sr-status": "NA",
// //                     "sr-status-label": "NA"
// //                 },
// //                 {
// //                     "date": "2023-11-17 08:29:00",
// //                     "status": "IBMN",
// //                     "activity": "In Transit",
// //                     "location": "MUMBAI SAKINAKA APEX , MUMBAI",
// //                     "sr-status": 18,
// //                     "sr-status-label": "IN TRANSIT"
// //                 },
// //                 {
// //                     "date": "2023-11-17 08:29:00",
// //                     "status": "INSCAN",
// //                     "activity": "Reached At Destination",
// //                     "location": "MUMBAI SAKINAKA APEX , MUMBAI",
// //                     "sr-status": 38,
// //                     "sr-status-label": "REACHED AT DESTINATION HUB"
// //                 },
// //                 {
// //                     "date": "2023-11-17 07:36:00",
// //                     "status": "CDIN",
// //                     "activity": "In Transit",
// //                     "location": "MUMBAI SAKINAKA APEX , MUMBAI",
// //                     "sr-status": 18,
// //                     "sr-status-label": "IN TRANSIT"
// //                 },
// //                 {
// //                     "date": "2023-11-17 06:23:00",
// //                     "status": "CDOUT",
// //                     "activity": "In Transit",
// //                     "location": "MUMBAI SAKINAKA APEX , MUMBAI",
// //                     "sr-status": 18,
// //                     "sr-status-label": "IN TRANSIT"
// //                 },
// //                 {
// //                     "date": "2023-11-17 04:01:00",
// //                     "status": "OBMN",
// //                     "activity": "In Transit",
// //                     "location": "MUMBAI SAKINAKA APEX , MUMBAI",
// //                     "sr-status": 18,
// //                     "sr-status-label": "IN TRANSIT"
// //                 },
// //                 {
// //                     "date": "2023-11-17 03:46:00",
// //                     "status": "IBMN",
// //                     "activity": "In Transit",
// //                     "location": "DHULE BRANCH , DHULE",
// //                     "sr-status": 18,
// //                     "sr-status-label": "IN TRANSIT"
// //                 },
// //                 {
// //                     "date": "2023-11-17 03:23:00",
// //                     "status": "CDIN",
// //                     "activity": "In Transit",
// //                     "location": "DHULE BRANCH , DHULE",
// //                     "sr-status": 18,
// //                     "sr-status-label": "IN TRANSIT"
// //                 },
// //                 {
// //                     "date": "2023-11-16 18:52:00",
// //                     "status": "CDOUT",
// //                     "activity": "In Transit",
// //                     "location": "DHULE BRANCH , DHULE",
// //                     "sr-status": 18,
// //                     "sr-status-label": "IN TRANSIT"
// //                 },
// //                 {
// //                     "date": "2023-11-16 18:32:00",
// //                     "status": "OBMN",
// //                     "activity": "In Transit",
// //                     "location": "DHULE BRANCH , DHULE",
// //                     "sr-status": 18,
// //                     "sr-status-label": "IN TRANSIT"
// //                 },
// //                 {
// //                     "date": "2023-11-16 17:26:26",
// //                     "status": "BKD",
// //                     "activity": "Booked",
// //                     "location": "DHULE BRANCH , DHULE",
// //                     "sr-status": 6,
// //                     "sr-status-label": "SHIPPED"
// //                 },
// //                 {
// //                     "date": "2023-11-16 16:00:25",
// //                     "status": "PCUP",
// //                     "activity": "Picked Up",
// //                     "location": "DHULE BRANCH , DHULE",
// //                     "sr-status": 42,
// //                     "sr-status-label": "PICKED UP"
// //                 },
// //                 {
// //                     "date": "2023-11-16 12:01:29",
// //                     "status": "PCRA",
// //                     "activity": "Pickup Reassigned",
// //                     "location": "DHULE BRANCH , DHULE",
// //                     "sr-status": "NA",
// //                     "sr-status-label": "NA"
// //                 },
// //                 {
// //                     "date": "2023-11-16 09:46:48",
// //                     "status": "PCAW",
// //                     "activity": "Pickup Awaited",
// //                     "location": "DHULE BRANCH , DHULE",
// //                     "sr-status": 19,
// //                     "sr-status-label": "OUT FOR PICKUP"
// //                 },
// //                 {
// //                     "date": "2023-11-16 09:46:48",
// //                     "status": "PCSC",
// //                     "activity": "Pickup Scheduled",
// //                     "location": "DHULE BRANCH , DHULE",
// //                     "sr-status": "NA",
// //                     "sr-status-label": "NA"
// //                 },
// //                 {
// //                     "date": "2023-11-16 09:46:48",
// //                     "status": "SPL",
// //                     "activity": "Softdata Upload",
// //                     "location": "DHULE BRANCH , DHULE",
// //                     "sr-status": "NA",
// //                     "sr-status-label": "NA"
// //                 }
// //             ],
// //             "track_url": "https://shiprocket.co/tracking/7D9128969",
// //             "etd": "2023-11-18 03:26:26",
// //             "qc_response": {
// //                 "qc_image": "",
// //                 "qc_failed_reason": ""
// //             }
// //         }
// //     }
// // ];

// let trackingTestData = [
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

// export default Order;
