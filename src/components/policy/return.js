import styles from "./return.module.scss";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import coverImg from "../../utils/cover-img.jpg";
import { AiOutlineMail } from "react-icons/ai";
import { BiPhoneCall, BiTimeFive } from "react-icons/bi";
import { GoLocation } from "react-icons/go";
import Loader from "../loader/Loader";
import { Link } from "react-router-dom";

const Return = () => {
	const setting = useSelector((state) => state.setting);

	return (
		<section id="contact-us" className="contact-us">
			{setting.setting === null ? (
				<Loader screen="full" />
			) : (
				<>
					<div className="cover">
						<img
							data-src={coverImg}
							className="img-fluid lazyload"
							alt="cover"
						></img>
						<div className="title">
							<h3>Return</h3>
							<span>
								<Link to={"/"}>home / </Link>
							</span>
							<span className="active">return</span>
						</div>
					</div>
					<div className="container">
						<div
							className="contact-wrapper"
							dangerouslySetInnerHTML={{ __html: setting.setting.contact_us }}
						></div>
					</div>
				</>
			)}
		</section>
	);
};

export default Return;
