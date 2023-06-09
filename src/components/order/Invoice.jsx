import React from 'react'

function Invoice() {
    return (
        <>
         <div className="modal fade new-address" id="invoiceModal"  aria-labelledby="InvoiceModalLabel" aria-hidden="true">
            
            <div className='modal-dialog'>
                <div className="modal-content" style={{ borderRadius: "10px", maxWidth: "100%", padding: "30px 15px" }}>

                    <div className="d-flex flex-row justify-content-between header">
                        <h5>New Address</h5>
                        <button type="button" className="" data-bs-dismiss="modal" aria-label="Close" ref={closeModalRef}><AiOutlineCloseCircle /></button>
                    </div>

                    <form onSubmit={(e) => handleAddnewAddress(e)} className='address-details-wrapper'>
                        <div className='contact-detail-container'>
                            <h3>contact details</h3>
                            <div className='contact-details'>
                                <input type='text' placeholder='Name' value={addressDetails.name} required onChange={(e) => {
                                    setaddressDetails(state => ({ ...state, name: e.target.value }));
                                }}></input>
                                <input type='tel' placeholder='Mobile Number' value={addressDetails.mobile_num} required onChange={(e) => {
                                    setaddressDetails(state => ({ ...state, mobile_num: e.target.value }));
                                }} ></input>
                                <input type='tel' placeholder='Alternate Mobile Number' value={addressDetails.alternate_mobile_num} onChange={(e) => {
                                    setaddressDetails(state => ({ ...state, alternate_mobile_num: e.target.value }));
                                }} ></input>
                            </div>
                        </div>

                        <div className='address-detail-container'>
                            <h3>address details</h3>
                            <div className='address-details'>
                                <input type='text' placeholder='Addres' value={addressDetails.address} onChange={(e) => {
                                    setaddressDetails(state => ({ ...state, address: e.target.value }));
                                }} required></input>
                                <input type='text' placeholder='Landmark' value={addressDetails.landmark} onChange={(e) => {
                                    setaddressDetails(state => ({ ...state, landmark: e.target.value }));
                                }} required></input>
                                <input type='text' placeholder='City' value={addressDetails.city} onChange={(e) => {
                                    setaddressDetails(state => ({ ...state, city: e.target.value }));
                                }} required></input>
                                <input type='text' placeholder='Area' value={addressDetails.area} onChange={(e) => {
                                    setaddressDetails(state => ({ ...state, area: e.target.value }));
                                }} required></input>
                                <input type='text' placeholder='PinCode' value={addressDetails.pincode} onChange={(e) => {
                                    setaddressDetails(state => ({ ...state, pincode: e.target.value }));
                                }} required></input>
                                <input type='text' placeholder='State' value={addressDetails.state} onChange={(e) => {
                                    setaddressDetails(state => ({ ...state, state: e.target.value }));
                                }} required></input>
                                <input type='text' placeholder='Country' value={addressDetails.country} onChange={(e) => {
                                    setaddressDetails(state => ({ ...state, country: e.target.value }));
                                }} required></input>
                            </div>
                        </div>

                        <div className='address-type-container'>
                            <h3>address type</h3>
                            <div className='address-type'>
                                <input type='radio' name='address-type' id='home-address' onChange={() => {
                                    setaddressDetails(state => ({ ...state, address_type: 'Home' }));
                                }} autoComplete='off' defaultChecked={true} />
                                <label htmlFor='home-address'>Home</label>


                                <input type='radio' name='address-type' id='office-address' onChange={() => {
                                    setaddressDetails(state => ({ ...state, address_type: 'Office' }));
                                }} autoComplete='off' />
                                <label htmlFor='office-address'>Office</label>


                                <input type='radio' name='address-type' id='other-address' onChange={() => {
                                    setaddressDetails(state => ({ ...state, address_type: 'Other' }));
                                }} autoComplete='off' />
                                <label htmlFor='other-address'>Other</label>
                            </div>
                            <div className='default-address'>
                                <input type="checkbox" className='mx-2' onChange={() => {
                                    setaddressDetails(state => ({ ...state, is_default: !addressDetails.is_default }));

                                }} />
                                Set as a default address
                            </div>
                        </div>

                        <button type='submit'>Add New Address</button>

                    </form>
                </div>
            </div>
        </div>
        </>
    )
}

export default Invoice
