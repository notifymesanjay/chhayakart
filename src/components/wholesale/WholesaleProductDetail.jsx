import { useState, useEffect } from 'react';
import api from '../../api/api';
import Cookies from "universal-cookie";
import Loader from '../loader/Loader';
import ResponsiveCarousel from "../shared/responsive-carousel/responsive-carousel";
import styles from "./wholesale_productlist.module.scss";
import { IoCall, IoChatboxOutline } from "react-icons/io5";
import { useSelector } from "react-redux";
import { faIndianRupeeSign } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useResponsive } from "../shared/use-responsive";

const WholesaleProductDetail = () => {
    const cookies = new Cookies();
    const { isSmScreen } = useResponsive();
    const [productId, setProductId] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [productData, setProductData] = useState(null);
    const [mainImage, setMainImage] = useState('');
    const [images, setImages] = useState([]);
    const [descriptionHeight, setDescriptionHeight] = useState({
		height: "50px",
		overflow: "hidden",
	});
	const [viewMore, setViewMore] = useState({
		description: true,
		feature: true,
	});
    const [whatsappUrl, setWhatsappUrl] = useState("");
    const expandDetails = (type = "") => {
        if (type === "description") {
          if (viewMore.description) {
            setDescriptionHeight({ height: "100%", overflow: "auto" });
          } else {
            setDescriptionHeight({ height: "50px", overflow: "hidden" });
          }
          setViewMore((prev) => ({ ...prev, description: !viewMore.description }));
        }
      };
    const user = useSelector((state) => state.user);
    if(user.user != null && !user.user.hasRegisteredWholesaleStore){
        //Logged in but not registered wholesale
        window.location = "/wholesale/add_store";
    }

    useEffect(() => {
		const message = encodeURI(
			window.location.href +
				"\n I'm interested to know more about this product. Can you help?"
		);

		setWhatsappUrl(
			"https://api.whatsapp.com/send?phone=" +
				"+919420920320" +
				"&text=" +
				message
		);
	}, []);

    function getCarouselArrayItems(){
        let arr = images.map((image, index) => (
          <div key={index}>
            <div
              className={`d-flex justify-content-center border ${
                mainImage === image ? "active" : ""
              }`}
            >
              <img
                data-src={image}
                className="col-12 imgZoom lazyload "
                alt="product"
                onClick={() => {
                  setMainImage(image);
                }}
              ></img>
            </div>
          </div>
          ));
          return arr;
        }
    
    function addOrderItemTracking(eventType){
        //1 - Visit | 2 - Call now | 3 - Get best price
        if(productId){
            api.addWholesaleOrderItemTracking(cookies.get("jwt_token"), productId, eventType);
        }
    }

    useEffect(()=>{
        function getLastUrlSegment(url) {
            return new URL(url).pathname.split('/').filter(Boolean).pop();
        }
        setProductId(parseInt(getLastUrlSegment(window.location.href)));
    }, [productId]);

    useEffect(()=>{
        if(productId){
            setIsLoading(true);
            api.getWholesaleProductDetailsById(cookies.get("jwt_token"), productId)
            .then((response)=> response.json())
            .then((res)=>{
                if(res.status === 1){
                    setProductData(res.data);
                    setMainImage(res.data.image_url);
                    setImages([res.data.image_url, ...res.data.other_images]);
                }
                setIsLoading(false);
            })
            addOrderItemTracking(1);
        }
    }, [productId]);
    return(
        <div style={{marginTop: isSmScreen ? '10px' : '70px', marginBottom: isSmScreen ? '50px' : '30px'}}>
        {
            isLoading ? <Loader /> :
            <div className='container'>
                {productData &&
                    <div className="row">
                        <div style={{height: '350px'}}>
                            <ResponsiveCarousel
                                items={5}
                                itemsInTablet={3}
                                infinite={true}
                                autoPlay={false}
                                autoPlaySpeed={4000}
                                showArrows={false}
                                showDots={true}
                                className="carousel"
                            >
                                {getCarouselArrayItems()}
                            </ResponsiveCarousel>
                        </div>
                        <div className={styles.detailsSection}>
                            <p className={styles.productTitle}>{productData.name}</p>
                            {productData.supplier_name && <p className={styles.supplierName}>By: {productData.supplier_name}</p>}
                            <div className={styles.wholesalePrice}>
                                <FontAwesomeIcon
                                    icon={faIndianRupeeSign}
                                    className="me-2"
                                />
                                {productData.discounted_price} / {productData.unit.toUpperCase()}
                            </div>
                            <div className={styles.minOrderQty}>Minimum Order Quantity: {productData.minimum_order_quantity} {productData.unit.toUpperCase()}</div>
                        </div>
                        <div className={styles.wholesaleBtnSection}>
                            <a href="tel:+919420920320" className={styles.wholesaleCallBtn} onClick={e=>addOrderItemTracking(2)}>
                                <IoCall fill='#F25CC5' size={"16px"} className='me-2'/> Call Now
                            </a>
                            <a href={whatsappUrl} className={styles.bestPriceBtn} onClick={e=>addOrderItemTracking(3)}>
                                <IoChatboxOutline stroke='#fff' size={"16px"} className='me-2'/> Get Best Price
                            </a>
                        </div>
                        <table className={styles.tableDetailsSection} style={{tableLayout: 'fixed', fontSize: isSmScreen ? '14px' : '16px'}}>
                            <tbody>
                            {productData.packaging_size && <tr>
                                <td>Packaging Size</td>
                                <td>{productData.packaging_size}</td>
                            </tr>}
                            {productData.quality && <tr>
                                <td>Quality</td>
                                <td>{productData.quality}</td>
                            </tr>}
                            {productData.packaging_type && <tr>
                                <td>Packaging Type</td>
                                <td>{productData.packaging_type}</td>
                            </tr>}
                            {productData.storage_instruction && <tr>
                                <td>Storage Instruction</td>
                                <td>{productData.storage_instruction}</td>
                            </tr>}
                            {productData.manufacturer && <tr>
                                <td>Manufacturer</td>
                                <td>{productData.manufacturer}</td>
                            </tr>}
                            {productData.indicator && <tr>
                                <td>Product Type</td>
                                <td>{productData.indicator}</td>
                            </tr>}
                            </tbody>
                        </table>
                        <div className={styles.descriptionWrapper}>
                            <hr/>
                            <div className={styles.productDetailsContainer}>
                                <h2 className={styles.subHeader}>Description</h2>
                                <div className={styles.innerBodyWrapper} style={{
                                                        height: descriptionHeight.height,
                                                        overflow: descriptionHeight.overflow,
                                                    }}>
                                    <div dangerouslySetInnerHTML={{ __html: productData.description }}></div>
                                </div>
                                <button
                                    className={styles.viewMoreBtn}
                                    onClick={() => {
                                        expandDetails("description");
                                    }}
                                >
                                    {viewMore.description ? "Show More" : "Show Less"}
                                </button>
                            </div>
                        </div>
                    </div>
                }
            </div>
        }
        </div>
    );  
}

export default WholesaleProductDetail;