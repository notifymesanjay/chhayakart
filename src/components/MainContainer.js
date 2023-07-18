import React, { useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineClose } from "react-icons/ai";
import { ActionTypes } from "../model/action-type";
import api from "../api/api";
import HomeContainer from "./homecontainer/HomeContainer";
import ProductContainer from "./product/ProductContainer";
import Loader from "./loader/Loader";

const MainContainer = ({
  productTriggered,
  setProductTriggered = () => {},
  setSelectedFilter = () => {},
}) => {
  const dispatch = useDispatch();

  const modalRef = useRef();

  const city = useSelector((state) => state.city);
  const shop = useSelector((state) => state.shop);
  const setting = useSelector((state) => state.setting);

  const fetchShop = (city_id, latitude, longitude) => {
    api
      .getShop(city_id, latitude, longitude)
      .then((response) => response.json())
      .then((result) => {
        debugger;
        if (result.status === 1) {
          const dataToBeSorted = result.data.category;
          //sorting of items lexographically..
          result.data.category = [...dataToBeSorted].sort((a, b) =>
            a.name > b.name ? 1 : -1
          );
          dispatch({ type: ActionTypes.SET_SHOP, payload: result.data });
        }
      });
  };
  useEffect(() => {
    if (city.city !== null && shop.shop === null) {
      fetchShop(city.city.id, city.city.latitude, city.city.longitude);
    }
  }, [city]);

  useEffect(() => {
    if (modalRef.current && setting.setting !== null) {
      modalRef.current.click();
    }
  }, [setting]);
  return (
    <>
      {setting.setting === null ? (
        <Loader screen="full" />
      ) : (
        <>
          <div
            className="home-page content"
            style={{ paddingBottom: "5px", minHeight: "75vh" }}
          >
            <HomeContainer setSelectedFilter={setSelectedFilter} />
            <ProductContainer
              productTriggered={productTriggered}
              setProductTriggered={setProductTriggered}
              setSelectedFilter={setSelectedFilter}
            />
          </div>

          {parseInt(setting.setting.popup_enabled) === 1 ? (
            <>
              <button
                type="button"
                className="d-none"
                ref={modalRef}
                data-bs-toggle="modal"
                data-bs-target="#myModal"
              ></button>
              <div id="myModal" className="modal fade" role="dialog">
                <div className="modal-dialog modal-dialog-centered">
                  <div
                    className="modal-content"
                    style={{ padding: "0", minWidth: "30vw" }}
                  >
                    <button
                      type="button"
                      className=""
                      data-bs-dismiss="modal"
                      aria-label="Close"
                      style={{
                        position: "absolute",
                        top: "-30px",
                        right: "0",
                        background: "none",
                      }}
                    >
                      <AiOutlineClose fill="white" fontSize={"3.5rem"} />
                    </button>
                    <img
                      src={setting.setting.popup_image}
                      alt="image"
                      onClick={() => {
                        window.location = setting.setting.popup_url;
                      }}
                      style={{ width: "100%", height: "100%" }}
                    ></img>
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </>
      )}
    </>
  );
};

export default MainContainer;
