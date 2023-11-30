const TrackingModalContent = ({trackingDetails, trackingPercentStatus, cancelledOrder = false})=>{ 
    const dateTimeOptions = {
		weekday: "short",
		year: "numeric",
		month: "short",
		day: "numeric",
		hour: "numeric",
		minute: "numeric",
	  };

    return(
        <div class="container pb-5 mb-sm-4 fs-5">
            {/* <!-- Details--> */}
            <div class="row mb-3 justify-content-center">
                {trackingDetails != null ? <div class="col-sm-4 mb-2">
                    <div class="bg-light bg-gradient p-4 text-dark text-center"><span class="font-weight-semibold mr-2">Shipped via:</span> {trackingDetails.shipment_track[0].courier_name}</div>
                </div> : <></>}
                <div class="col-sm-4 mb-2">
                    <div class="bg-light bg-gradient p-4 p-4 text-dark text-center"><span class="font-weight-semibold mr-2">Status:</span> {cancelledOrder ? 'Order Cancelled' : (trackingDetails == null || trackingPercentStatus <=25) ? trackingPercentStatus === 0 ? 'Not Delivered' : 'Order Confirmed' : trackingPercentStatus <= 50 ? 'Shipped' : trackingPercentStatus <= 75 ? 'Out for delivery' : 'Delivered'} </div>
                </div>
                {(trackingDetails != null && trackingPercentStatus!==0) ? <div class="col-sm-4 mb-2">
                    <div class="bg-light bg-gradient p-4 p-4 text-dark text-center"><span class="font-weight-semibold mr-2">
                        {trackingDetails.shipment_track[0].delivered_date !== null ? 'Delivered on: ' : 'Expected date: '}
                        </span>
                        {
                            trackingDetails.shipment_track[0].delivered_date !== null ? new Date(trackingDetails.shipment_track[0].delivered_date).toLocaleString("en-IN", dateTimeOptions) : new Date(trackingDetails.shipment_track[0].edd).toDateString()
                        }
                    </div>
                </div> : <></>}
            </div>
            {/* <!-- Progress--> */}
            { cancelledOrder ? <></> :
            <div class="steps">
                <div class="steps-header">
                    <div class="progress">
                        <div class="progress-bar" role="progressbar" style={{width: `${trackingPercentStatus}%`}} aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                </div>
                <div class="steps-body">
                    <div class="step step-completed">
                        <span class="step-indicator"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-check"><polyline points="20 6 9 17 4 12"></polyline></svg></span><span class="step-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-check-circle"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg></span>
                        Order confirmed
                    </div>
                    <div class={`step ${trackingPercentStatus >= 50 ? 'step-completed' : 'step-active'}`}>
                        { trackingPercentStatus >= 50 ?
                        <span class="step-indicator"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-check"><polyline points="20 6 9 17 4 12"></polyline></svg></span>
                        : <></>
                        }
                        <span class="step-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-truck"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg></span>
                        Shipped
                        {trackingDetails != null ? <div className="small text-black-50">
                            {(trackingPercentStatus < 25) ? <></> : function (){
                                if(trackingPercentStatus <= 50){
                                    let shipedActivity = trackingDetails.shipment_track_activities[0];
                                    return `${shipedActivity.activity} | ${shipedActivity.location}`;
                                }
                                let shipedActivity = trackingDetails.shipment_track_activities.filter((el)=> el['sr-status'] == "6")[0];
                                return `${shipedActivity.location} | ${new Date(shipedActivity.date).toLocaleString("en-IN", dateTimeOptions)}`;
                            }()}
                        </div> : <></>}
                    </div>
                    <div class={`step ${trackingPercentStatus >= 75 ? 'step-completed' : ''}`}>
                        { trackingPercentStatus >= 75 ?
                            <span class="step-indicator"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-check"><polyline points="20 6 9 17 4 12"></polyline></svg></span>
                            : <></>
                        }
                        <span class="step-icon"><svg width="24" height="24" viewBox="0 0 400 400" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M252.644 56.915C295.342 38.4482 320.69 113.363 271.651 123.522C231.551 131.832 216.845 78.0154 247.144 58.0544" stroke="#000000" stroke-opacity="1" stroke-width="22" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M330.482 265.712C341.911 277.397 345.967 295.564 330.334 311.241C305.977 335.671 271.834 312.649 271.756 285.037" stroke="#000000" stroke-opacity="1" stroke-width="22" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M192.293 285.199C193.35 293.668 190.602 302.807 182.127 311.229C159.576 333.641 128.721 316.163 123.655 291.812" stroke="#000000" stroke-opacity="1" stroke-width="22" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M231 133C206.612 161.128 194.495 179.606 187 209" stroke="#000000" stroke-opacity="1" stroke-width="22" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M231.268 139C230.078 174.935 230.842 200.382 278 181.706" stroke="#000000" stroke-opacity="1" stroke-width="22" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M270.454 181.27C277.648 203.747 292.95 234.179 296.436 257.918" stroke="#000000" stroke-opacity="1" stroke-width="22" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M198.698 209.851C179.8 211.119 147.038 219.427 133.916 234.11C126.125 242.825 100.697 270.714 108.106 285.446C112.07 293.339 163.502 289.662 170.276 288.7C200.718 284.374 240.691 289.662 270.337 285.446C276.764 284.532 267.42 277.198 275.865 277.198C288.469 277.198 350.064 262.896 339.366 250.123C314.559 220.523 257.393 244.451 266.097 274.746" stroke="#000000" stroke-opacity="1" stroke-width="22" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M200.303 212.449C207.9 229.886 214.057 274.576 214.593 278.703" stroke="#000000" stroke-opacity="1" stroke-width="22" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M200.303 208.553C255.045 208.309 257.332 233.927 223.294 274.806" stroke="#000000" stroke-opacity="1" stroke-width="22" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M169.124 213.748C142.024 230.768 99.6067 221.459 67.7939 231.936" stroke="#000000" stroke-opacity="1" stroke-width="22" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M60 128.007C68.4342 143.576 60 224.334 63.5625 228.038" stroke="#000000" stroke-opacity="1" stroke-width="22" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M63.8965 128.233C105.69 123.275 132.857 122.22 136.014 128.233C139.17 134.247 139.17 171.658 130.567 218.945" stroke="#000000" stroke-opacity="1" stroke-width="22" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg></span>
                        Out for delivery
                        {
                            trackingDetails != null ? 
                            <div className="small text-black-50">
                                {
                                    trackingPercentStatus >= 75 ? function (){
                                        let outForDeliveryActivity = trackingDetails.shipment_track_activities.filter((ele)=>ele['sr-status'] == 17)[0];
                                        if(outForDeliveryActivity !== undefined){
                                            // return new Date(outForDeliveryActivity.date).toLocaleString();
                                            return new Date(outForDeliveryActivity.date).toLocaleString("en-IN",dateTimeOptions);
                                        }
                                    } () : ""
                                }
                            </div> : <></>
                        }
                    </div>
                    <div class={`step ${trackingPercentStatus >= 100 ? 'step-completed' : ''}`}>
                        { trackingPercentStatus >= 100 ?
                            <span class="step-indicator"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-check"><polyline points="20 6 9 17 4 12"></polyline></svg></span>
                            : <></>
                        }
                        <span class="step-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-home"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg></span>
                        Product delivered
                    </div>
                </div>
            </div>
            }
            {/* <!-- Footer--> */}
            { cancelledOrder ? <></> :
            <div class="d-sm-flex flex-wrap justify-content-end align-items-center text-center pt-4">

                {
                    trackingPercentStatus === 0 ? 
                    <div className="mx-auto">
                        Last activity: {trackingDetails.shipment_track_activities[0].activity +', '+ trackingDetails.shipment_track_activities[0].location}
                    </div>
                    : <></>
                }
                
                { trackingDetails != null ?
                <button type="button" className="btn btn-link fs-4" onClick={()=>{
											window.open(trackingDetails.track_url, "_blank");
										}}>
                    View more details
                </button> : <></>}
            </div>
            }
        </div>
    );
}

export default TrackingModalContent;