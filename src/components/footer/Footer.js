import React, { useState, useEffect } from 'react';
import './footer.css';
import { Link, useNavigate } from 'react-router-dom';
import googleplay from '../../utils/google-play.jpg'
import appstore from '../../utils/app-store.png'
import rozerpay from '../../utils/payments/rozerpay.png'
import paystack from '../../utils/payments/paystack.png'
import cod from '../../utils/payments/cod.png'
import { useDispatch, useSelector } from 'react-redux';
import api from '../../api/api'
import { ActionTypes } from '../../model/action-type';
import Loader from '../loader/Loader';
import Cookies from 'universal-cookie';

export const Footer = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const setting = useSelector(state => (state.setting))
    console.log(setting)
    const user = useSelector(state => (state.user))
    //fetch Category
    const fetchCategory = () => {
        api.getCategory()
            .then(response => response.json())
            .then(result => {
                if (result.status === 1) {
                    setcategory(result.data)
                    dispatch({ type: ActionTypes.SET_CATEGORY, payload: result.data });
                }
            })
            .catch(error => console.log("error ", error))
    }
    

    useEffect(() => {
        fetchCategory();
    }, [])

    const [category, setcategory] = useState(null);

    const selectCategory = (ctg) => {
        dispatch({ type: ActionTypes.SET_FILTER_CATEGORY, payload: ctg.id })
        navigate('/products')
    }

    return (
        <section id="footer">
           
            <div className="copyright">
                <div className="col-xs-12 col-sm-12 col-md-12 mt-2 mt-sm-2 text-center text-white">
                    <p className="h2">Copyright © {new Date().getFullYear()}.All right Reserved By <span className='company_name'>{user.status === 'fulfill' && setting.setting !== null ?setting.setting.app_name:"ChhayaKart"}</span>.</p>
                </div>
                <hr />
            </div>
        </section>
    );
};