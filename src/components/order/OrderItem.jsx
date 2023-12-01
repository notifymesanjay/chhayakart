import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { useResponsive } from "../shared/use-responsive";
const OrderItem = ({orderItem, showTrackButton = true, onClickItem = (string) => {}}) => {
    const {isSmScreen} = useResponsive();
    return (
    <button type='button' id={`track - ${orderItem.id}`} data-bs-toggle="modal" data-bs-target="#trackModal" value={orderItem.trackingId} onClick={(e)=>onClickItem(orderItem.tracking_id)}>
        <div className='order-item-section d-flex flex-column p-2 rounded-2 m-2 text-start'>
            <div className='d-flex px-2 py-2 align-items-center'>
                <img className={`lazyload ${isSmScreen ? 'col-2' : 'col-1'} p-1`} data-src={orderItem.image_url} alt={orderItem.product_name}></img>
                <div className='mx-3' style={{flexBasis: '60%'}}>
                    <div className='fw-bold my-1'>{orderItem.product_name}</div>
                    <div className='my-1'>Size: {orderItem.unit}</div>
                    <div className='my-1'>Quantity: {orderItem.quantity}</div>
                </div>
                {showTrackButton && <div className='ms-auto me-2 align-self-center'>
                    <span className='text-black-50'>Track</span> <FontAwesomeIcon icon={faAngleRight}/>
                </div>}
            </div>
        </div>
    </button>
    );
}

export default OrderItem;