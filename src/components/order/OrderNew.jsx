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
					<div key={order.id} className='order-card d-flex flex-column py-3 my-3 border rounded-2 fs-4'>
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
								order.items.map((item, index)=> <OrderItem key={item.id} orderItem={item} onClickItem={(trackingId)=>{
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

export default OrderNew;