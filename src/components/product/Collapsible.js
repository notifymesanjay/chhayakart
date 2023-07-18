import React from "react";
import { useState } from "react";
const CollapsibleButton = ({ title, content }) => {
	const [isOpen, setIsOpen] = useState(false);

	const toggleCollapse = () => {
		setIsOpen(!isOpen);
	};

	return (
		<div>
			<button onClick={toggleCollapse}>{title}</button>
			{isOpen && (
				<div
					style={{ overflow: "hidden" }}
					dangerouslySetInnerHTML={{ __html: content }}
				></div>
			)}
		</div>
	);
};

export default CollapsibleButton;
