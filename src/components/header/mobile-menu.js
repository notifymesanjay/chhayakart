import React, { useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faHeart,
	faSearch,
	faStore,
	faUser,
} from "@fortawesome/free-solid-svg-icons";
import { BsBoxSeam } from "react-icons/bs";
import Menu from "./menu";
import styles from "./mobile-menu.module.scss";
import { useNavigate } from "react-router";
import HomeIcon from "../../public/images/menu-icons/home-icon.png";
import CategoriesIcon from "../../public/images/menu-icons/categories-icon.png";
import {
	IoCartOutline,
	IoHeartOutline,
	IoNotificationsOutline,
	IoLogoWhatsapp,
} from "react-icons/io5";
import { WhatsappIcon } from "react-share";
import Cookies from "universal-cookie";
import { toast } from "react-toastify";
// import ChatOnWhatsapp from "../whatsappChatFeature";

const menuItems = [
	{
		id: 1,
		name: "Home",
		tagId: "home",
		icon: (
			<img
				className={`${styles.mobileIcon} lazyload`}
				data-src={HomeIcon}
				alt="chhayakart-logo"
			/>
		),
		link: "/",
	},
	{
		id: 2,
		name: "Catgeories",
		tagId: "categories",
		icon: (
			<img
				className={`${styles.mobileIcon} lazyload`}
				data-src={CategoriesIcon}
				alt="categories-icon"
			/>
		),
		// link: "/subCategory/94",
		link: "/allcategories"
	},
	{
		id: 3,
		name: " Contact Us ",
		tagId: "Contact Us",
		icon: <IoLogoWhatsapp />,
		link: `https://api.whatsapp.com/send?phone=919420920320&text= ${window.location.href}\n I'm interested to know more about chhayakart. Can you help?`,
	},
	// {
	// 	id: 3,
	// 	name: "View Cart",
	// 	tagId: "viewcart",
	// 	icon: <IoLogoWhatsapp />,
	// 	link: "/ChatOnWhatsapp",
	// },
	{
		id: 4,
		name: "Wishlist",
		tagId: "wishlist",
		icon: <IoHeartOutline />,
		link: "/wishlist",
	},
	// {
	// 	id: 5,
	// 	name: "Notifications",
	// 	tagId: "notifications",
	// 	icon: <IoNotificationsOutline />,
	// 	link: "/notification",
	// },
	{
		id: 5,
		name: "My Orders",
		tagId: "orders",
		icon: <BsBoxSeam />,
		link: "/orders",
	},
];

const MobileMenu = ({ selectedMenu = 0 }) => {
	const navigate = useNavigate();
	const cookies = new Cookies();
	const [selectedItem, setSelectedItem] = useState(1);

	return <Menu className={styles.mobileMenu}>
	{menuItems.map((menu) => (
		<div
			key={menu.id}
			className={`${styles.menu} ${selectedItem === menu.id ? styles.active : ''}`}
			id={menu.tagId}
			onClick={() => {
				if (
					cookies.get("jwt_token") === undefined &&
					menu.id !== 1 &&
					menu.id !== 2 &&
					menu.id !== 3
				) {
					if(menu.id === 5){
						toast.error("You have to login first to track your Orders !");
					}else{
						toast.error("OOPS! You have to login first to see your cart!");
					}	
				} else {
					if (menu.id === 3) {
						window.location.href = menu.link;
					}
					setSelectedItem(menu.id);
					navigate(menu.link);
				}
			}}
		>
			<span className={`${styles.menuIcon} ${selectedItem === menu.id ? styles.iconActive : ''}`}>{menu.icon}</span>
			<span className={`${styles.menuName} ${selectedItem === menu.id ? styles.textActive : ''}`}>{menu.name}</span>
		</div>
	))}
</Menu>
	// useMemo(
	// 	() => (
			
		// ),
		// [selectedMenu, navigate]
	// );
};

export default MobileMenu;
