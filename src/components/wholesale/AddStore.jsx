import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import api from '../../api/api';
import Cookies from "universal-cookie";
import LoginUser from '../login/login-user';
import { useResponsive } from "../shared/use-responsive";
import { toast } from "react-toastify";
import { ActionTypes } from "../../model/action-type";

const AddStore = ()=>{
    const { isSmScreen } = useResponsive();
    const dispatch = useDispatch();
    const hasRegisteredWholesaleStore = useSelector((state)=>{
        if(state.user.user != null){
            return state.user.user.hasRegisteredWholesaleStore;
        }
        return null;
    });
    if(hasRegisteredWholesaleStore){
        window.location = "/wholesale/categories";
    }
    const cookies = new Cookies();
    const [storeName, setStoreName] = useState("");
    const [ownerName, setOwnerName] = useState("");
    const [address, setAddress] = useState("");
    const [addressLine2, setAddressLine2] = useState(null);
    const [city, setCity] = useState(null);
    const [addressState, setAddressState] = useState(null);
    const [pinCode, setPinCode] = useState(0);
    const [mobile, setMobile] = useState("");
    const [gstOrPan, setGstOrPan] = useState(null);
    const [registerAs, setRegisterAs] = useState("");
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(
        cookies.get("jwt_token")
    );
    const [productsInterestedIn, setProductsInterestedIn] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);

    const addWholesaleStore = (e) => {
        e.preventDefault();
        api.addWholesaleStoreDetails(cookies.get("jwt_token"), storeName, ownerName, address, addressLine2, city, addressState, pinCode, mobile, gstOrPan, registerAs, selectedProducts.join())
        .then(res=>res.json())
        .then((response)=>{
            if(response.status){
                dispatch({
                    type: ActionTypes.SET_WHOLESALE_STORE_FLAG,
                    payload: true
                })
            }else{
                toast.error("Something went wrong");
            }
        });
    }

    useEffect(()=>{
        api.getWholesaleCategories(cookies.get("jwt_token"))
        .then((res)=>res.json())
        .then((response)=>{
            if(response.status){
                setProductsInterestedIn(response.data);
            }
        });
    }, []);
    return (
        <div style={{marginTop: isSmScreen ? '10px' : '70px', fontSize: '17px'}}>
            {
                isUserLoggedIn ? 
            (<div>
                <form className="d-flex flex-column align-items-center" onSubmit={addWholesaleStore}>
                    <h1 className='py-4 display-2'>Register your store details</h1>
                    <div className="d-flex py-3">
                        <div>Store name <i className="text-danger">*</i></div>
                        <input type="text" className="ms-4 px-2" value={storeName} onChange={event => {
                            setStoreName(event.target.value);
                            }} required/>
                    </div>
                    <div className="py-3">
                        Owner name <i className="text-danger">*</i>
                        <input type="text" className="ms-4 px-2" value={ownerName} onChange={event => {
                            setOwnerName(event.target.value);
                        }} required/>
                    </div>
                    <div className="py-3">
                        Address Line 1<i className="text-danger">*</i>
                        <input type="text" className="ms-4 px-2" value={address} onChange={event => {
                            setAddress(event.target.value);
                        }} required/>
                    </div>
                    <div className="py-3">
                        Address Line 2
                        <input type="text" className="ms-4 px-2" value={addressLine2} onChange={event => {
                            setAddressLine2(event.target.value);
                        }}/>
                    </div>
                    <div className="py-3">
                        City<i className="text-danger">*</i>
                        <input type="text" className="ms-4 px-2" value={city} onChange={event => {
                            setCity(event.target.value);
                        }} required/>
                    </div>
                    <div className="py-3">
                        State<i className="text-danger">*</i>
                        <input type="text" className="ms-4 px-2" value={addressState} onChange={event => {
                            setAddressState(event.target.value);
                        }} required/>
                    </div>
                    <div className="py-3">
                        Pin code <i className="text-danger">*</i>
                        <input type="text" pattern="[0-9]{5,7}" maxLength="7" className="ms-4 px-2" value={pinCode} onChange={event => {
                            setPinCode(event.target.value);
                        }} required/>
                    </div>
                    <div className="py-3">
                        Mobile <i className="text-danger">*</i>
                        <input type="tel" pattern="[+]{0,1}[0-9]{10,12}" maxLength="13" className="ms-4 px-2" value={mobile} onChange={event => {
                            setMobile(event.target.value);
                        }} required/>
                    </div>
                    <div className="py-3">
                        GST/PAN<i className="text-danger">*</i>
                        <input type="text" maxLength="15" minLength="10" className="ms-4 px-2" value={gstOrPan} onChange={event => {
                            setGstOrPan(event.target.value);
                        }} required/>
                    </div>
                    <div className="py-3">
                        Register As<i className="text-danger">*</i>
                        <select name='register_as' id='register_as' className='ms-3 px-4' onChange={e=>setRegisterAs(e.target.value)} required>
                            <option value="">--Select--</option>
                            <option value="buyer">Buyer</option>
                            <option value="seller">Seller</option>
                        </select>
                    </div>
                    {productsInterestedIn.length > 0 && <div className='py-3'>
                        Products interested in
                        <div className='d-grid' style={{gridTemplateColumns: isSmScreen ? "1fr 1fr" : "1fr 1fr 1fr 1fr"}}>
                            {
                                productsInterestedIn.map((item)=>{
                                    return <div key={item.id} className='me-3'>
                                            <input className="form-check-input" type="checkbox" value={item.id} id="flexCheckbox" onChange={(e)=>{
                                                if(e.target.checked){
                                                    if(!selectedProducts.includes(item.id)){
                                                        selectedProducts.push(item.id);
                                                    }
                                                }else{
                                                    if(selectedProducts.includes(item.id)){
                                                        selectedProducts.splice(selectedProducts.indexOf(item.id), 1);
                                                    }
                                                }
                                            }} /> {item.name}
                                        </div>
                                })
                            }
                        </div>
                    </div>}
                    <button className="my-4 py-3 px-4 border rounded-2" type="submit">Save</button>
                </form>
            </div> ) : (<LoginUser isOpenModal={!isUserLoggedIn} setIsOpenModal={setIsUserLoggedIn} />)
            }
        </div>
    );
}

export default AddStore;