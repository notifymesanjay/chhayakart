import OrderItem from '../order/OrderItem';
import './success_new.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faPhoneVolume, faAngleRight, faArrowUpRightFromSquare, faIndianRupee, faPercent} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { useResponsive } from '../shared/use-responsive';
import {useState, useRef} from 'react'
import api from "../../api/api";
import Cookies from "universal-cookie";
import ReactToPrint from "react-to-print";
import { toast } from "react-toastify";
const SuccessTopSection = ({
    order
}) => {

    const navigate = useNavigate();
    const { isMobile } = useResponsive();
    	const [element, setElement] = useState(null);
    const setHtml = (ID) => {
		setElement(ID);
	};
    const cookies = new Cookies();
    const componentRef = useRef();
    const closeModalRef = useRef();
    const getInvoice = async (Oid) => {
		// var order_id = document.getElementById('invoice').value;
		api
			.getInvoices(cookies.get("jwt_token"), Oid)
			.then((response) => response.json())
			.then((result) => {
				let invoicePage = result.data;
				document.getElementById("mainContent").innerHTML = invoicePage;
			});
	};
    const handlePrint = () => {
		if (closeModalRef.current) {
			closeModalRef.current.click();
			toast.success("Invoice Downloaded Successfully");
		}
	};
    let calculated_final_discount = function(){
        let calculated_final_discount = order.discount;
        order.items.forEach((orderItem)=>{
            let disc = orderItem.price - orderItem.discounted_price;
            calculated_final_discount += disc * orderItem.quantity;
        })
        return calculated_final_discount;
    }();

    return (
        <div style={{backgroundColor: '#f1f1f1', width: isMobile ? null : '70%', margin: isMobile ? null : '0 auto'}}>
            <div className="success-page-section">
                <div className="text-level-3 py-2">Order Id: {order.order_id}</div>
                <div className="text-level-4 pb-2">Payment mode: <span className='text-black'> {order.payment_method !== 'COD' ? 'Onlene' : 'COD'}</span></div>
            </div>
            {/* <div className="success-page-section mt-2 d-flex justify-content-between">
                <div className='text-level-2 py-3'>
                    <span className='pe-3'><FontAwesomeIcon icon={faPhoneVolume}/></span>
                    Help Centre
                </div>
                <div className='my-auto pe-3 fs-3'>
                    <FontAwesomeIcon icon={faAngleRight}></FontAwesomeIcon>
                </div>
            </div> */}
            <div className="success-page-section mt-2 pb-4">
                <div className='text-level-1 pt-4 pb-2'>
                    Product Details
                </div>
                <div className='fs-2'>
                {
                    order.items.map((orderItem)=>{
                        return <OrderItem key={orderItem.id} orderItem={orderItem} showTrackButton={false}/>
                    })
                }
                </div>
                <hr className='mx-3'/>
                <div className='text-level-1 pt-4 pb-4'>
                    Order Tracking
                </div>
                <div className='pb-2'>
                    <button className='text-level-3 border border-dark rounded-2 px-4 py-2' onClick={() => {
							isMobile ? navigate('/orders') :
							navigate("/profile");
						}
                    }>
                        <span className='pe-2'><FontAwesomeIcon icon={faArrowUpRightFromSquare} /></span>
                        Track Order
                    </button>
                </div>
            </div>
            <div className="success-page-section mt-2">
                <button style={{width: '100%'}} 
                id={`invoice-${order.order_id}`} 
                data-bs-toggle="modal" 
                data-bs-target="#invoiceModal"
                value={order.order_id}
                onClick={(e)=>{
                    setHtml(e.target.value);
                    getInvoice(order.order_id);
                }}
                >
                    <div className='d-flex justify-content-between'>
                        <div className='text-level-2 py-4'>
                            Download Invoice
                        </div>
                        <div className='my-auto pe-3 fs-1'>
                            <FontAwesomeIcon icon={faAngleRight}></FontAwesomeIcon>
                        </div>
                    </div>
                </button>
            </div>
            <div className="success-page-section mt-2 pb-4">
                <div className='text-level-1 pt-4 pb-2'>
                    Order Details
                </div>
                <div className='text-level-2 pt-4 pb-2'>
                    Price Details{order.items.length === 1 ? '(1 Item)' : `(${order.items.length} Items)`}
                </div>
                <div className='d-flex justify-content-between lh-lg pe-3'>
                    <div className='text-level-4'>Total Price</div>
                    <div className='text-level-4'>
                        <span className='me-2'><FontAwesomeIcon icon={faIndianRupee}/></span>
                        {function(){
                            let calculated_final_total = 0;
                            order.items.forEach((orderItem)=>{
                                calculated_final_total += orderItem.price * orderItem.quantity;
                            })
                            return calculated_final_total;
                        }()}</div>
                </div>
                <div className='d-flex justify-content-between lh-lg pe-3'>
                    <div className='text-level-4'>Delivery charges</div>
                    <div className='text-level-4'>
                        <span className='me-2'><FontAwesomeIcon icon={faIndianRupee}/></span>
                        {order.delivery_charge}</div>
                </div>
                <div className='d-flex justify-content-between lh-lg pe-3'>
                    <div className='text-level-4'>Taxes</div>
                    <div className='text-level-4'>
                        <span className='me-2'><FontAwesomeIcon icon={faIndianRupee}/></span>
                        {Math.round(order.tax_amount)}</div>
                </div>
                <div className='d-flex justify-content-between lh-lg pe-3 discount-line'>
                    <div className='text-level-4 discount-price-text'>Total Discounts</div>
                    <div className='text-level-4 discount-price-text'>
                        <span className='me-2'><FontAwesomeIcon icon={faIndianRupee}/></span>
                        {calculated_final_discount}</div>
                </div>
                <hr className='mx-3'/>
                <div className='pe-3'>
                    <div className='d-flex justify-content-between'>
                        <div className='text-level-2'>Order Total</div>
                        <div className='text-level-2'>
                            <span className='me-2'><FontAwesomeIcon icon={faIndianRupee}/></span>
                            {order.final_total}</div>
                    </div>
                    {calculated_final_discount > 0 && <div className='discount-message-section d-flex justify-content-center rounded-2'>
                        <div className='text-center d-flex align-items-center' style={{width: '2.5rem'}}>
                            <div id='burst-12'></div>
                            <div className='discount-inner-icon-div d-flex align-items-center justify-content-center'><FontAwesomeIcon icon={faPercent} className='discount-inner-icon'/></div>
                        </div>
                        <span className='ps-2 text-level-3'>
                        Yay! Your total discount is <FontAwesomeIcon icon={faIndianRupee}/>{calculated_final_discount}
                        </span>
                    </div>}
                </div>
            </div>
            <div id="invoice">
				<div
					className="modal fade new-invoice"
					id="invoiceModal"
					aria-labelledby="InvoiceModalLabel"
					aria-hidden="true"
				>
					<button
						type="button"
						className="d-none"
						ref={closeModalRef}
						data-bs-dismiss="modal"
						aria-label="Close"
					></button>
					<div className="modal-dialog">
						<div
							className="modal-content"
							style={{
								borderRadius: "10px",
								maxWidth: "100%",
								padding: "30px 15px",
								zIndex: -2,
							}}
						>
							{/* <button type="button" class="bg-white" data-bs-dismiss="modal" aria-label="Close" ref={closeModalRef} style={{ width: '30px' }}><i class="bi bi-x-octagon"></i></button> */}
							<div id="mainContent" ref={componentRef}></div>
							<ReactToPrint
								trigger={() => (
									<button
										style={{ alignSelf: "center", fontSize: "14px" }}
										className="btn btn-primary w-50"
									>
										{" "}
										Print this out!
									</button>
								)}
								content={() => componentRef.current}
								onAfterPrint={handlePrint}
							/>
						</div>
					</div>
				</div>
			</div>
        </div>
    );
};

export default SuccessTopSection;