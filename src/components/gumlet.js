import { useEffect } from "react";

const loadGumletScript = () => {
	return new Promise(function (resolve, reject) {
		// Checks if the script is already loaded on the page
		if (document.querySelector("script#gumlet-sdk-script")) {
			resolve();
		} else {
			window.GUMLET_CONFIG = {
				hosts: [
					{
						current: "{{chhayakart.com}}",
						gumlet: "chhayakart.gumlet.io",
					},
				],
				lazy_load: true,
			};
			// Loads the script and appends it on the page
			const script = document.createElement("script");
			script.src =
				"https://cdn.jsdelivr.net/npm/gumlet.js@2.1/dist/gumlet.min.js";
			script.id = "gumlet-sdk-script";
			script.sync = true;
			script.onload = () => resolve();
			document.body.appendChild(script);
		}
	});
};

useEffect(() => {
	loadGumletScript();
});

export default loadGumletScript;
