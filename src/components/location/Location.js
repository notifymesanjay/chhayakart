import React, { useState, useRef, useMemo } from "react";
import "./location.css";
import { motion } from "framer-motion";
import {
	LoadScript,
	StandaloneSearchBox,
	GoogleMap,
	MarkerF,
} from "@react-google-maps/api";
import api from "../../api/api";
import { setLocation } from "../../utils/manageLocalStorage";
import { useDispatch, useSelector } from "react-redux";
import { ActionTypes } from "../../model/action-type";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { BiCurrentLocation } from "react-icons/bi";
import { toast } from "react-toastify";
import Loader from "../loader/Loader";

const libraries = ["places"];

const Location = (props) => {
	const dispatch = useDispatch();

	const setting = useSelector((state) => state.setting);

	const [isloading, setisloading] = useState(false);
	const [currLocationClick, setcurrLocationClick] = useState(false);
	const [isInputFields, setisInputFields] = useState(false);
	const [errorMsg, seterrorMsg] = useState("");
	const [isAddressLoading, setisAddressLoading] = useState(false);
	const [localLocation, setlocalLocation] = useState({
		city: "",
		formatted_address: "",
		lat: parseFloat(0),
		lng: parseFloat(0),
	});

	const center = useMemo(
		() => ({
			lat: localLocation.lat,
			lng: localLocation.lng,
		}),
		[localLocation.lat, localLocation.lng]
	);

	const inputRef = useRef();
	const closeModalRef = useRef();

	// By Selecting place from input field

	const handlePlaceChanged = () => {
		setisloading(true);

		const [place] = inputRef.current.getPlaces();
		if (place) {
			let city_name = place.address_components[0].long_name;
			let loc_lat = place.geometry.location.lat();
			let loc_lng = place.geometry.location.lng();

			fetchCity(city_name, loc_lat, loc_lng)
				.then((res) => {
					if (res.status === 1) {
						setLocation({
							city: res.data.name,
							formatted_address: res.data.formatted_address,
							lat: res.data.latitude,
							lng: res.data.longitude,
						});
						dispatch({ type: ActionTypes.SET_CITY, payload: res.data });

						setisloading(false);
						closeModalRef.current.click();
					} else {
						setisloading(false);
						seterrorMsg(res.message);
					}
				})
				.catch((error) => {
					console.log(error);
				});
			props.setisLocationPresent(true);
			// closeModalRef.current.click();
		}
	};
	//fetching city from server
	const fetchCity = async (city_name, loc_lat, loc_lng) => {
		const response = await api.getCity(city_name, loc_lat, loc_lng);
		const res = await response.json();
		return res;
	};

	//Select Current Location
	const handleCurrentLocationClick = () => {
		setisloading(true);
		setisInputFields(false);
		setcurrLocationClick(true);

		if (!("geolocation" in navigator)) {
			onError({
				code: 0,
				message: "Geolocation not supported",
			});
		}
		navigator.geolocation.getCurrentPosition(onSuccess, onError);
	};

	const onSuccess = (location) => {
		const geocoder = new window.google.maps.Geocoder();

		geocoder
			.geocode({
				location: {
					lat: location.coords.latitude,
					lng: location.coords.longitude,
				},
			})
			.then((response) => {
				if (response.results[0]) {
					//get city
					getAvailableCity(response)
						.then((res) => {
							if (res.status === 1) {
								// setLocation({
								//   city: res.data.name,
								//   formatted_address: res.data.formatted_address,
								//   latitude: res.data.latitude,
								//   longitude: res.data.longitude,
								// })

								setlocalLocation({
									city: res.data.name,
									formatted_address: res.data.formatted_address,
									lat: parseFloat(res.data.latitude),
									lng: parseFloat(res.data.longitude),
								});

								// dispatch({ type: ActionTypes.SET_CITY, payload: res.data });
							} else {
								console.log(res.message);
							}
						})
						.catch((error) => console.log("error " + error));
					setisloading(false);
				} else {
					console.log("No result found");
				}
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const onError = (error) => {
		console.log(error);
	};

	//get available delivery location city
	const getAvailableCity = async (response) => {
		var results = response.results;
		var c, lc, component;
		var found = false,
			message = "";
		for (var r = 0, rl = results.length; r < rl; r += 1) {
			var flag = false;
			var result = results[r];
			for (c = 0, lc = result.address_components.length; c < lc; c += 1) {
				component = result.address_components[c];

				//confirm city from server
				const response = await api
					.getCity(
						component.long_name,
						result.geometry.location.lat(),
						result.geometry.location.lng()
					)
					.catch((error) => console.log("error: ", error));
				const res = await response.json();
				if (res.status === 1) {
					flag = true;
					found = true;
					return res;
				} else {
					found = false;
					message = res.message;
				}
				if (flag === true) {
					break;
				}
			}
			if (flag === true) {
				break;
			}
		}
		if (found === false) {
			return {
				status: 0,
				message: message,
			};
		}
	};

	const onMarkerDragStart = () => {
		setisAddressLoading(true);
	};

	const onMarkerDragEnd = (e) => {
		const geocoder = new window.google.maps.Geocoder();

		geocoder
			.geocode({
				location: {
					lat: e.latLng.lat(),
					lng: e.latLng.lng(),
				},
			})
			.then((response) => {
				if (response.results[0]) {
					//get city
					getAvailableCity(response)
						.then((res) => {
							if (res.status === 1) {
								setlocalLocation({
									city: res.data.name,
									formatted_address: res.data.formatted_address,
									lat: parseFloat(res.data.latitude),
									lng: parseFloat(res.data.longitude),
								});
								setisAddressLoading(false);
							} else {
								seterrorMsg(res.message);
							}
						})
						.catch((error) => console.log("error " + error));
				} else {
					console.log("No result found");
				}
			})
			.catch((error) => {
				console.log(error);
			});
	};

	//handle Confirm current location
	const confirmCurrentLocation = () => {
		setisloading(true);

		setLocation({
			city: localLocation.city,
			formatted_address: localLocation.formatted_address,
			lat: localLocation.lat,
			lng: localLocation.lng,
		});

		fetchCity(localLocation.city, localLocation.lat, localLocation.lng)
			.then((result) => {
				if (result.status === 1) {
					dispatch({ type: ActionTypes.SET_CITY, payload: result.data });
					setisloading(false);
					props.setisLocationPresent(true);
					closeModalRef.current.click();
				} else {
					seterrorMsg(result.message);
				}
			})
			.catch((error) => console.log("error ", error));
	};

	return (
		<LoadScript
			googleMapsApiKey={"AIzaSyA0B2eTsnUMMG4SN6Agjz7JD3w_gCDj1lE"}
			libraries={libraries}
		>
			<div className="d-flex flex-row justify-content-between header">
				<h5>set delivery location</h5>
				<button
					type="button"
					className=""
					data-bs-dismiss="modal"
					aria-label="Close"
					ref={closeModalRef}
					onClick={() => {
						if (!props.isLocationPresent) {
							const name = setting.setting.default_city.name;
							const lat = setting.setting.default_city.latitude;
							const lng = setting.setting.default_city.longitude;

							setLocation({
								city: name,
								formatted_address:
									setting.setting.default_city.formatted_address,
								lat: lat,
								lng: lng,
							});
							fetchCity(name, lat, lng)
								.then((result) => {
									if (result.status === 1) {
										dispatch({
											type: ActionTypes.SET_CITY,
											payload: result.data,
										});
										props.setisLocationPresent(true);
									} else {
										console.log(result.message);
									}
								})
								.catch((error) => console.log("error ", error));
							//GuestLogin fuctionality need to be done
							// toast.info('Default Delivery Location is Selected!!')
						} else {
							seterrorMsg("");
							setisloading(false);
							setcurrLocationClick(false);
							setisInputFields(false);
							setisAddressLoading(false);
						}
					}}
				>
					<AiOutlineCloseCircle />
				</button>
			</div>

			<div className="modal-body d-flex flex-column gap-3 align-items-center body">
				{isloading ? (
					<Loader />
				) : (
					<>
						{!currLocationClick ? (
							<>
								<img
									src="https://admin.chhayakart.com/storage/logo/1680098508_37047.png"
									alt="location"
								></img>
								<h5>select your delivery location</h5>
								<span>
									Implementation of technologies to store unchanged data base on
									specific.
								</span>

								<button
									onClick={handleCurrentLocationClick}
									disabled={isInputFields}
									style={isInputFields ? { opacity: "0.5" } : null}
								>
									<BiCurrentLocation className="mx-3" />
									Use my Current location
								</button>

								<div className="oval-continer">
									<div className="oval">
										<span className="separator-text">
											<div className="or">OR</div>
										</span>
									</div>
								</div>

								<div className="input-container">
									<StandaloneSearchBox
										onLoad={(ref) => (inputRef.current = ref)}
										onPlacesChanged={handlePlaceChanged}
									>
										<input
											type="text"
											id="text-places"
											className="border-bottom"
											placeholder="Type location manually"
											onFocus={() => {
												setcurrLocationClick(false);
												setisInputFields(true);
											}}
											onBlur={() => {
												setisInputFields(false);
											}}
										/>
									</StandaloneSearchBox>
								</div>
							</>
						) : (
							<>
								<div className="w-100">
									<GoogleMap
										zoom={11}
										center={center}
										mapContainerStyle={{ height: "400px" }}
									>
										<MarkerF
											position={center}
											draggable={true}
											onDragStart={onMarkerDragStart}
											onDragEnd={onMarkerDragEnd}
										></MarkerF>
									</GoogleMap>
								</div>

								{errorMsg === "" ? (
									<div className="map-content">
										<p>
											<b>Address : </b>
											{isAddressLoading
												? "...."
												: localLocation.formatted_address}
										</p>
										<button
											type="button"
											className="btn-confirm-location"
											onClick={confirmCurrentLocation}
											disabled={localLocation.formatted_address === ""}
										>
											Confirm
										</button>
									</div>
								) : null}
							</>
						)}
						<p className="text-danger" style={{ fontSize: "2rem" }}>
							{errorMsg}
						</p>
					</>
				)}
			</div>
		</LoadScript>
	);
};

export default Location;
