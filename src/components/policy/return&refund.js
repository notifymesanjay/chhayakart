import styles from "./return.module.scss";
import { useSelector } from "react-redux";
import returnImg from "./returnImg.png";
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
						<img src={returnImg} className={styles.coverImg} alt="cover"></img>
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
							dangerouslySetInnerHTML={{
								__html: setting.setting.returns_and_exchanges_policy,
							}}
						></div>
					</div>
				</>
			)}
		</section>
	);
};

export default Return;
