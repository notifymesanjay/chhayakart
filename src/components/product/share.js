import React from "react";
import "./product.css";
import { BsShare } from "react-icons/bs";
import {
	FacebookIcon,
	FacebookShareButton,
	TelegramIcon,
	TelegramShareButton,
	WhatsappIcon,
	WhatsappShareButton,
} from "react-share";
import { toast } from "react-toastify";
import { BiLink } from "react-icons/bi";

const Share = ({ share_url, slug }) => {
	return (
		<div className="dropup share">
			<button
				type="button"
				className="w-100 h-100 "
				data-bs-toggle="dropdown"
				aria-expanded="false"
			>
				<BsShare />
			</button>

			<ul className="dropdown-menu">
				<li className="dropDownLi">
					<WhatsappShareButton url={`${share_url}/product/${slug}`}>
						<WhatsappIcon size={32} round={true} /> <span>WhatsApp</span>
					</WhatsappShareButton>
				</li>
				<li className="dropDownLi">
					<TelegramShareButton url={`${share_url}/product/${slug}`}>
						<TelegramIcon size={32} round={true} /> <span>Telegram</span>
					</TelegramShareButton>
				</li>
				<li className="dropDownLi">
					<FacebookShareButton url={`${share_url}/product/${slug}`}>
						<FacebookIcon size={32} round={true} /> <span>Facebook</span>
					</FacebookShareButton>
				</li>
				<li>
					<button
						type="button"
						onClick={() => {
							navigator.clipboard.writeText(`${share_url}/product/${slug}`);
							toast.success("Copied Succesfully!!");
						}}
						className="react-share__ShareButton"
					>
						{" "}
						<BiLink size={30} /> <span>Copy Link</span>
					</button>
				</li>
			</ul>
		</div>
	);
};

export default Share;
