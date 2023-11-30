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

// export default Order;
