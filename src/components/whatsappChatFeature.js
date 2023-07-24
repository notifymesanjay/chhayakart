import { useEffect, useState } from "react";
import { WhatsappIcon } from "react-share";

const ChatOnWhatsapp = ({ imgSrc, height }) => {
	const [url, setUrl] = useState("");

	useEffect(() => {
		const message = encodeURI(
			window.location.href +
				"\n I'm interested to know more about this product. Can you help?"
		);

		setUrl(
			"https://api.whatsapp.com/send?phone=" +
				"+919420920320" +
				"&text=" +
				message
		);
	}, []);

	return (
		<a
			id="whatsappChatIcon"
			href={url}
			styles=" text-decoration: none; color:grey;"
		>
			<WhatsappIcon
				className="lazyload"
				height={height}
				size={32}
				round={true}
				alt="Chat With Chhayakart Support"
			/>{" "}
			Chhayakart Helpline
		</a>
	);
};

export default ChatOnWhatsapp;
