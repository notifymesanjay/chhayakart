import React, { useEffect, useState } from 'react'
import './product.css'
import { AiOutlineCloseCircle } from 'react-icons/ai'
import { BsHeart, BsShare, BsPlus, BsHeartFill } from "react-icons/bs";
import { BiMinus, BiLink, BiDollar } from 'react-icons/bi'
import { FaChevronLeft, FaChevronRight, FaRupeeSign } from 'react-icons/fa'
import { toast } from 'react-toastify'
import api from '../../api/api';
import Cookies from 'universal-cookie'
import { useDispatch, useSelector } from 'react-redux';
import { ActionTypes } from '../../model/action-type';
import { FacebookIcon, FacebookShareButton, TelegramIcon, TelegramShareButton, WhatsappIcon, WhatsappShareButton } from 'react-share';
import Loader from '../loader/Loader';
import CryptoJS from "crypto-js";
import Slider from 'react-slick';



const QuickViewModal = (props) => {

    const cookies = new Cookies()
    const dispatch = useDispatch()

    const city = useSelector(state => state.city);
    const sizes = useSelector(state => state.productSizes);
    const favorite = useSelector(state => state.favorite);
    const setting = useSelector(state => state.setting)

    const secret_key = 'Xyredg$5g'
    const share_parent_url = 'https://chhayakart.com/product'



    useEffect(() => {
        return () => {
            props.setselectedProduct({})
            setproductcategory({})
            setproductbrand({})
            setproduct({})
        };
    }, [])


    const fetchProduct = async (product_id) => {
        await api.getProductbyId(city.city.id, city.city.latitude, city.city.longitude, product_id)
            .then(response => response.json())
            .then(result => {
                if (result.status === 1) {
                    setproduct(result.data)
                    setmainimage(result.data.image_url)
                }
            })
            .catch(error => console.log(error))
    }

    useEffect(() => {

        if (Object.keys(props.selectedProduct).length > 0 && city.city !== null) {
            fetchProduct(props.selectedProduct.id);

            getCategoryDetails()
            getBrandDetails()
        }
    }, [props.selectedProduct, city])

    useEffect(() => {
        if (sizes.sizes === null || sizes.status === 'loading') {
            if (city.city !== null) {
                api.getProductbyFilter(city.city.id, city.city.latitude, city.city.longitude)
                    .then(response => response.json())
                    .then(result => {
                        if (result.status === 1) {
                            setproductSizes(result.sizes)
                            dispatch({ type: ActionTypes.SET_PRODUCT_SIZES, payload: result.sizes })
                        }
                    })
            }
        }
        else {
            setproductSizes(sizes.sizes)
        }
    }, [city, sizes])

    const [mainimage, setmainimage] = useState("")
    const [productcategory, setproductcategory] = useState({})
    const [productbrand, setproductbrand] = useState({})
    const [product, setproduct] = useState({})
    const [productSizes, setproductSizes] = useState(null)
    const [isLoader, setisLoader] = useState(false)

    //for product variants dropdown in product card
    const getProductSizeUnit = (variant) => {
        return productSizes.map(psize => {
            if (parseInt(psize.size) === parseInt(variant.measurement) && psize.short_code === variant.stock_unit_name) {
                return psize.unit_id;
            }
        });

    }


    const getProductVariants = (product) => {
        return product.variants.map((variant, ind) => (
            <option key={ind} value={JSON.stringify(variant)} >
                {variant.measurement} {variant.stock_unit_name} Rs.{variant.price}
            </option>
        ))
    }


    const getCategoryDetails = () => {
        api.getCategory()
            .then(response => response.json())
            .then(result => {
                if (result.status === 1) {
                    result.data.forEach(ctg => {
                        if (ctg.id === props.selectedProduct.category_id) {
                            setproductcategory(ctg);
                        }
                    });
                }
            })
            .catch((error) => console.log(error))
    }

    const getBrandDetails = () => {
        api.getBrands()
            .then(response => response.json())
            .then(result => {
                if (result.status === 1) {
                    result.data.forEach(brnd => {
                        if (brnd.id === props.selectedProduct.brand_id) {
                            setproductbrand(brnd);
                        }
                    });
                }
            })
            .catch((error) => console.log(error))
    }


    //Add to Cart
    const addtoCart = async (product_id, product_variant_id, qty) => {
        setisLoader(true)
        await api.addToCart(cookies.get('jwt_token'), product_id, product_variant_id, qty)
            .then(response => response.json())
            .then(async (result) => {
                if (result.status === 1) {
                    toast.success(result.message)
                    await api.getCart(cookies.get('jwt_token'), city.city.latitude, city.city.longitude)
                        .then(resp => resp.json())
                        .then(res => {
                            if (res.status === 1)
                                dispatch({ type: ActionTypes.SET_CART, payload: res })
                        })
                    await api.getCart(cookies.get('jwt_token'), city.city.latitude, city.city.longitude, 1)
                        .then(resp => resp.json())
                        .then(res => {
                            setisLoader(false)
                            if (res.status === 1)
                                dispatch({ type: ActionTypes.SET_CART_CHECKOUT, payload: res.data })


                        })
                        .catch(error => console.log(error))
                }
                else {
                    toast.error(result.message)
                }
            })
    }

    //remove from Cart
    const removefromCart = async (product_id, product_variant_id) => {
        setisLoader(true)
        await api.removeFromCart(cookies.get('jwt_token'), product_id, product_variant_id)
            .then(response => response.json())
            .then(async (result) => {
                if (result.status === 1) {
                    toast.success(result.message)
                    await api.getCart(cookies.get('jwt_token'), city.city.latitude, city.city.longitude)
                        .then(resp => resp.json())
                        .then(res => {

                            if (res.status === 1)
                                dispatch({ type: ActionTypes.SET_CART, payload: res })
                            else
                                dispatch({ type: ActionTypes.SET_CART, payload: null })
                        })
                    await api.getCart(cookies.get('jwt_token'), city.city.latitude, city.city.longitude, 1)
                        .then(resp => resp.json())
                        .then(res => {
                            setisLoader(false)
                            if (res.status === 1)
                                dispatch({ type: ActionTypes.SET_CART_CHECKOUT, payload: res.data })


                        })
                        .catch(error => console.log(error))
                }
                else {
                    toast.error(result.message)
                }
            })
    }

    //Add to favorite
    const addToFavorite = async (product_id) => {
        setisLoader(true)

        await api.addToFavotite(cookies.get('jwt_token'), product_id)
            .then(response => response.json())
            .then(async (result) => {
                if (result.status === 1) {
                    toast.success(result.message)
                    await api.getFavorite(cookies.get('jwt_token'), city.city.latitude, city.city.longitude)
                        .then(resp => resp.json())
                        .then(res => {
                            setisLoader(false)
                            if (res.status === 1)
                                dispatch({ type: ActionTypes.SET_FAVORITE, payload: res })
                        })
                }
                else {
                    setisLoader(false)
                    toast.error(result.message)
                }
            })
    }
    const removefromFavorite = async (product_id) => {
        await api.removeFromFavorite(cookies.get('jwt_token'), product_id)
            .then(response => response.json())
            .then(async (result) => {
                if (result.status === 1) {
                    toast.success(result.message)
                    await api.getFavorite(cookies.get('jwt_token'), city.city.latitude, city.city.longitude)
                        .then(resp => resp.json())
                        .then(res => {
                            if (res.status === 1)
                                dispatch({ type: ActionTypes.SET_FAVORITE, payload: res })
                            else
                                dispatch({ type: ActionTypes.SET_FAVORITE, payload: null })
                        })
                }
                else {
                    setisLoader(false)
                    toast.error(result.message)
                }
            })
    }
    const settings_subImage = {

        infinite: false,
        slidesToShow: 3,
        initialSlide: 0,
        // centerMargin: "10px",
        margin: "20px",
        prevArrow: (
            <button
                type="button"
                className="slick-prev"
                onClick={(e) => {
                    setmainimage(e.target.value);
                }}
            >
                <FaChevronLeft size={30} className="prev-arrow" />
            </button>
        ),
        nextArrow: (
            <button
                type="button"
                className="slick-next"
                onClick={(e) => {
                    setmainimage(e.target.value);
                }}
            >
                <FaChevronRight color="#f7f7f7" size={30} className="next-arrow" />
            </button>
        ),
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 1,
                    infinite: true,
                },
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                },
            },
        ],
    }


    return (
        <div className='product-details-view'>
            <div className="modal fade" id="quickviewModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="loginLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content" style={{ borderRadius: "10px", minWidth: "80vw" }}>

                        <div className="d-flex flex-row justify-content-end header">
                            <button type="button" data-bs-dismiss="modal" aria-label="Close" onClick={() => {
                                props.setselectedProduct({})
                                setproductcategory({})
                                setproductbrand({})
                                setproduct({})
                            }} className="bg-white"><AiOutlineCloseCircle size={30} /></button>
                        </div>

                        <div className="modal-body">
                            {Object.keys(product).length === 0 || productSizes === null
                                ? (
                                    <Loader />
                                )
                                : (
                                    <div className="top-wrapper">

                                        <div className='row body-wrapper'>
                                            <div className="col-xl-4 col-lg-6 col-md-12 col-12">
                                                <div className='image-wrapper'>
                                                    <div className='main-image col-12 border'>
                                                        <img src={mainimage} alt='main-product' className='col-12' style={{ width: '85%' }} />
                                                    </div>


                                                    <div className='sub-images-container row'>
                                                        {/* {product.images.map((image, index) => (
                                                                <div key={index} className={`col-4 col-lg-3 m-3 sub-image border ${mainimage === image ? 'active' : ''}`}>
                                                                    <img src={image} alt="product" onClick={() => {
                                                                        setmainimage(image)
                                                                    }} className="col-12" />
                                                                </div>
                                                            ))} */}

                                                        {product.images.length >= 4 ?
                                                            <>
                                                                <Slider {...settings_subImage}>
                                                                    {product.images.map((image, index) => (
                                                                        <div key={index} >
                                                                            <div className={`sub-image border ${mainimage === image ? 'active' : ''}`}>

                                                                                <img src={image} className='col-12' alt="product" onClick={() => {
                                                                                    setmainimage(image)
                                                                                }}></img>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </Slider>


                                                            </> :
                                                            <>
                                                                {product.images.map((image, index) => (
                                                                    <div key={index} className={`sub-image border ${mainimage === image ? 'active' : ''}`}>
                                                                        <img src={image} className='col-12 ' alt="product" onClick={() => {
                                                                            setmainimage(image)
                                                                        }}></img>
                                                                    </div>
                                                                ))}
                                                            </>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-xl-8 col-lg-6 col-md-12 col-12">

                                                <div className='detail-wrapper'>
                                                    <div className='top-section'>
                                                        <p className='product_name'>{product.name}</p>
                                                        <div className='product-brand'>
                                                            {/* <span className='price green-text' id={`price-quickview`}>
                                                                {setting.setting.currency_code === "INR" ? <FaRupeeSign fill='var(--secondary-color)' fontSize={"18px"} /> : <BiDollar fill='var(--secondary-color)' fontSize={"18px"} />}
                                                                {parseFloat(product.variants[0].price)} 
                                                                </span> */}
                                                            {Object.keys(productbrand).length === 0
                                                                ? null
                                                                : (
                                                                    <div className='product-brand'>
                                                                        <span className='brand-title'>Brand:</span>
                                                                        <span className='brand-name'>
                                                                            {productbrand.name}
                                                                        </span>
                                                                    </div>
                                                                )}
                                                        </div>
                                                        <div className="d-flex flex-row gap-2 align-items-center my-1">
                                                            <span className="price green-text" >
                                                                {setting.setting.currency_code === "INR" ? <FaRupeeSign fill='var(--secondary-color)' fontSize={"18px"} /> : <BiDollar fill='var(--secondary-color)' fontSize={"18px"} />} <span className="green-text" id="price-productdetail">{parseFloat(product.variants[0].price)}</span>  </span>
                                                        </div>




                                                    </div>
                                                    <div className='bottom-section'>
                                                        <p>Product Variants</p>

                                                        <div className='d-flex gap-3 bottom-section-content '>
                                                            <select id={`select-product-variant-quickview`} onChange={(e) => {
                                                                document.getElementById(`price-productdetail`).innerHTML = parseFloat(JSON.parse(e.target.value).price);
                                                                if (document.getElementById(`input-cart-quickview`).classList.contains('active')) {
                                                                    document.getElementById(`input-cart-quickview`).classList.remove('active')
                                                                    document.getElementById(`Add-to-cart-quickview`).classList.add('active')
                                                                }
                                                            }} defaultValue={JSON.stringify(product.variants[0])} >
                                                                {getProductVariants(product)}
                                                            </select>

                                                            <button type='button' id={`Add-to-cart-quickview`} className='add-to-cart active'
                                                                onClick={() => {
                                                                    if (cookies.get('jwt_token') !== undefined) {
                                                                        document.getElementById(`Add-to-cart-quickview`).classList.toggle('visually-hidden')
                                                                        document.getElementById(`input-cart-quickview`).classList.toggle('visually-hidden')
                                                                        document.getElementById(`input-quickview`).innerHTML = 1
                                                                        addtoCart(product.id, JSON.parse(document.getElementById(`select-product-variant-quickview`).value).id, document.getElementById(`input-quickview`).innerHTML)
                                                                    }
                                                                    else {
                                                                        toast.error("OOps! You need to login first to access the cart!")
                                                                    }
                                                                }}>Add to Cart</button>

                                                            {isLoader ? <Loader screen='full' background='none' /> : null}

                                                            <div id={`input-cart-quickview`} className="input-to-cart visually-hidden">
                                                                <button type='button' onClick={() => {

                                                                    var val = parseInt(document.getElementById(`input-quickview`).innerHTML);
                                                                    if (val === 1) {
                                                                        document.getElementById(`input-quickview`).innerHTML = 0;
                                                                        document.getElementById(`input-cart-quickview`).classList.toggle('visually-hidden')
                                                                        document.getElementById(`Add-to-cart-quickview`).classList.toggle('visually-hidden')
                                                                        removefromCart(product.id, JSON.parse(document.getElementById(`select-product-variant-quickview`).value).id)
                                                                    }
                                                                    else {
                                                                        document.getElementById(`input-quickview`).innerHTML = val - 1;
                                                                        addtoCart(product.id, JSON.parse(document.getElementById(`select-product-variant-quickview`).value).id, document.getElementById(`input-quickview`).innerHTML)
                                                                    }

                                                                }} className="wishlist-button"><BiMinus fill='#fff' /></button>
                                                                <span id={`input-quickview`} ></span>
                                                                <button type='button' onClick={() => {
                                                                    var val = document.getElementById(`input-quickview`).innerHTML;
                                                                    if (val < product.total_allowed_quantity) {
                                                                        document.getElementById(`input-quickview`).innerHTML = parseInt(val) + 1;
                                                                        addtoCart(product.id, JSON.parse(document.getElementById(`select-product-variant-quickview`).value).id, document.getElementById(`input-quickview`).innerHTML)
                                                                    }
                                                                }} className="wishlist-button"><BsPlus fill='#fff' /> </button>


                                                            </div>

                                                            {favorite.favorite && favorite.favorite.data.some(element => element.id === product.id) ? (
                                                                <button type="button" className='wishlist-product' onClick={() => {
                                                                    if (cookies.get('jwt_token') !== undefined) {
                                                                        removefromFavorite(product.id)
                                                                    } else {
                                                                        toast.error('OOps! You need to login first to add to favourites')
                                                                    }
                                                                }}>
                                                                    <BsHeartFill fill='green' />
                                                                </button>
                                                            ) : (
                                                                <button key={product.id} type="button" className='wishlist-product' onClick={() => {
                                                                    if (cookies.get('jwt_token') !== undefined) {
                                                                        removefromFavorite(product.id)
                                                                    } else {
                                                                        toast.error('OOps! You need to login first to add to favourites')
                                                                    }
                                                                }}><BsHeart /></button>
                                                            )}

                                                        </div>
                                                        <div className='product-overview'>


                                                            {productbrand !== "" ? (

                                                                <div className='product-tags'>
                                                                    <span className='tag-title'>Brand :</span>
                                                                    <span className='tag-name'>{productbrand.name} </span>
                                                                </div>
                                                            ) : ""}
                                                            {product.tags !== "" ? (

                                                                <div className='product-tags'>
                                                                    <span className='tag-title'>Product Tags:</span>
                                                                    <span className='tag-name'>{product.tags} </span>
                                                                </div>
                                                            ) : ""}


                                                        </div>
                                                        <div className='share-product-container'>
                                                            <span>Share Product :</span>

                                                            <ul className='share-product'>
                                                                <li className='share-product-icon'><WhatsappShareButton url={`${share_parent_url}/${product.slug}`}><WhatsappIcon size={32} round={true} /></WhatsappShareButton></li>
                                                                <li className='share-product-icon'><TelegramShareButton url={`${share_parent_url}/${product.slug}`}><TelegramIcon size={32} round={true} /></TelegramShareButton></li>
                                                                <li className='share-product-icon'><FacebookShareButton url={`${share_parent_url}/${product.slug}`}><FacebookIcon size={32} round={true} /></FacebookShareButton></li>
                                                                <li className='share-product-icon'>
                                                                    <button type='button' onClick={() => {
                                                                        navigator.clipboard.writeText(`${share_parent_url}/${product.slug}`)
                                                                        toast.success("Copied Succesfully!!")
                                                                    }}> <BiLink size={30} /></button>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>

                                                    {/* <div className='key-feature'>
                                                <p>Key Features</p>
                                            </div> */}


                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default QuickViewModal
