import { useState, useEffect } from 'react';
import api from '../../api/api';
import Cookies from "universal-cookie";
import styles from "./wholesale_productlist.module.scss";
import { faIndianRupeeSign } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import Loader from '../loader/Loader';
import { useSelector } from "react-redux";
import { useResponsive } from "../shared/use-responsive";

const WholesaleProductList = () =>{
    const cookies = new Cookies();
    const { isSmScreen } = useResponsive();
    const [categoryId, setCategoryId] = useState(0);
    const [products, setProducts] = useState([]);
    const [categoryName, setCategoryName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const user = useSelector((state) => state.user);
    if(user.user != null && !user.user.hasRegisteredWholesaleStore){
        //Logged in but not registered wholesale
        window.location = "/wholesale/add_store";
    }
    useEffect(()=>{
        function getLastUrlSegment(url) {
            return new URL(url).pathname.split('/').filter(Boolean).pop();
        }
        setCategoryId(parseInt(getLastUrlSegment(window.location.href)));
    }, [categoryId]);

    useEffect(()=>{
        if(categoryId){
            setIsLoading(true);
            api.getWholesaleProductsByCategory(cookies.get("jwt_token"), categoryId)
            .then((response)=> response.json())
            .then((res)=>{
                setIsLoading(false);
                if(res.status === 1){
                    setCategoryName(res.category_name);
                    setProducts(res.data);
                }
            })
        }
    }, [categoryId]);
    return (
        <>
            {
                isLoading ? <Loader /> :
                <div>
                    { products.length > 0 ? <div className={styles.productListWrapper}>
                        <div className={styles.wholesaleCategoryName}>
                            <h2>{categoryName}</h2>
                        </div>
                            <div className={styles.productCardWrapper}>
                                {
                                    products.map((product, index)=>{
                                        return <div className={`${styles.productCard} ${styles.cardWrapper}`} key={index} onClick={(e)=>{
                                            navigate(`/wholesale/product/${product.id}`);
                                        }}>
                                            <div
                                                className={styles.imageWrapper}
                                            >
                                                <img src={product.image_url} alt={product.name} className={`${styles.productImg} w-100`} />
                                            </div>
                                            <div className={styles.productBody}>
                                                <h3 className={styles.productName}>{product.name}</h3>
                                                <div className={styles.priceWrapper}>
                                                    <p className={`${styles.wholesalePrice}`}>
                                                        <FontAwesomeIcon
                                                            icon={faIndianRupeeSign}
                                                            className={styles.rupeeIcon}
                                                        />
                                                        {" " + parseFloat(product.discounted_price) + " / " +(product.unit).toUpperCase()}
                                                    </p>
                                                </div>
                                                <div className={styles.packagingSize}>
                                                    Size: {product.packaging_size + product.unit}
                                                </div>
                                            </div>
                                        </div>
                                    })
                                }
                            </div>
                    </div> : 
                    <div className='d-flex justify-content-center' style={{padding: isSmScreen ? '10px 0' : '100px 0'}}>
                        <h2 className='display-4'>No Products here</h2>
                    </div>
                        }
                </div>
            }
        </>
    );
}

export default WholesaleProductList;