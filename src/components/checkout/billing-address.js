import React from "react";
import { toast } from "react-toastify";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Address from "../address/Address";
import Loader from "../loader/Loader";
import "./checkout.css";

const BillingAddress = ({
  timeSlots,
  setSelectedAddress = () => {},
  expectedDate,
  setExpectedDate = () => {},
  setExpectedTime = () => {},
}) => {
  return (
    <div className="checkout-util-container">
      <div className="billibg-address-wrapper checkout-component">
        <span className="heading">billing address</span>

        <Address setselectedAddress={setSelectedAddress} />
      </div>

      {/* {timeSlots && timeSlots.time_slots_is_enabled && (
        <>
          <div className="delivery-day-wrapper checkout-component">
            <span className="heading">preferred delivery day</span>
            <div className="d-flex justify-content-center p-3">
              <Calendar
                value={expectedDate}
                onChange={(e) => {
                  if (new Date(e) >= new Date()) {
                    setExpectedDate(new Date(e));
                  } else if (
                    new Date(e).getDate() === new Date().getDate() &&
                    new Date(e).getMonth() === new Date().getMonth() &&
                    new Date(e).getFullYear() === new Date().getFullYear()
                  ) {
                    setExpectedDate(new Date(e));
                  } else {
                    toast.info("Please Select Valid Delivery Day");
                  }
                }}
              />
            </div>
          </div>

          <div className="delivery-time-wrapper checkout-component">
            <span className="heading">preferred delivery time</span>
            <div className="d-flex p-3" style={{ flexWrap: "wrap" }}>
              {timeSlots === null ? (
                <Loader screen="full" />
              ) : (
                <>
                  {timeSlots.time_slots.map((timeslot, index) => (
                    <div key={index} className="time-slot-container">
                      <div>
                        <input
                          type="radio"
                          name="TimeSlotRadio"
                          id={`TimeSlotRadioId${index}`}
                          defaultChecked={index === 0 ? true : false}
                          onChange={() => {
                            setExpectedTime(timeslot);
                          }}
                        />
                      </div>
                      <div>{timeslot.title}</div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </>
      )} */}
    </div>
  );
};

export default BillingAddress;
