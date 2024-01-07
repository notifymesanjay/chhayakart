import { useState, useEffect } from 'react';
import api from '../../api/api';
import Cookies from "universal-cookie";
import Loader from '../loader/Loader';
import { useNavigate } from "react-router-dom";
import LoginUser from '../login/login-user';
import { useSelector } from "react-redux";
import { useResponsive } from "../shared/use-responsive";

const Categories = () => {
    const cookies = new Cookies();
    const { isSmScreen } = useResponsive();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(cookies.get("jwt_token"));
    const [showLoginModal, setShowLoginModal] = useState(!isLoggedIn);
    const user = useSelector((state) => state.user);
    if(user.user != null && !user.user.hasRegisteredWholesaleStore){
        //Logged in but not registered wholesale
        window.location = "/wholesale/add_store";
    }
    useEffect(()=>{
        setIsLoggedIn(user.user!=null);
    }, [user]);
    useEffect(()=>{
        setIsLoading(true);
        api.getWholesaleCategories(cookies.get("jwt_token"))
        .then((response)=> response.json())
        .then((result)=>{
            if(result.status === 1){
                setCategories(result.data);
                setIsLoading(false);
            }
        });
    }, []);

    return (
        isLoggedIn ? (<div style={{marginTop: isSmScreen ? '10px' : '70px', fontSize: '17px'}}>
            {
                isLoading ? 
                <Loader /> 
                :
                <div> 
                    { categories.length > 0 ? <div className='d-grid' style={{gridTemplateColumns: isSmScreen ? '1fr 1fr 1fr' : '1fr 1fr 1fr 1fr', width: isSmScreen ? '' : "80%", margin: isSmScreen ? '' : '0 auto'}}>
                        {
                            categories.map((cat, index)=>{
                                return <div key={index} className='d-flex flex-column align-items-center rounded-2 p-2' onClick={(event)=>navigate(`/wholesale/products/category/${cat.id}`)}>
                                    <img src={cat.image_url} alt={cat.name} style={{width: '100%', height: '75%'}}/>
                                    <div>{cat.name}</div>
                                </div>
                            })
                        }
                    </div> : <div className='d-flex flex-column align-items-center' style={{padding: '80px 0'}}>
                            <h2 className='display-3'>Categories coming soon..</h2>
                            <h2 className='display-3'>Please check back later!</h2>
                        </div>}
                </div>
            }
        </div>) : (<LoginUser isOpenModal={showLoginModal} setIsOpenModal={(flag)=>{
            if(!flag && user.user == null){
                setShowLoginModal(flag);
                navigate("/");
            }
        }} />)
    );
}

export default Categories;