import React from "react";
import styles from "./bulk-order.module.scss";
import CkModal from "../shared/ck-modal";
import { useState } from "react";
import { useEffect } from "react";
import { toast } from "react-toastify";

const BulkOrder = ({
  isOpenBulk = false,
  setIsOpenBulk = () => {},
  product,
  onSubmit = () => {},
  productVal = 0,
  index = 0
}) => {
  const [bulkVal, setBulkVal] = useState(productVal);
  const inputChange = (e) => {
    setBulkVal(e.target.value);
  };
  const submitVal = () => {
    if(parseInt(bulkVal) > parseInt(product.total_allowed_quantity)){
        toast.error("Entered Quantity is more than Allowed");
    }else{
        onSubmit(parseInt(bulkVal)-1, index)
        setIsOpenBulk(false);
    }
  }
  return (
    <CkModal
      show={isOpenBulk}
      onHide={() => {
        setIsOpenBulk(false);
      }}
    >
      <div className={styles.bulkOrderWrapper}>
        <h1 className={styles.header}>Available in Bulk Quantity</h1>
        <p className={styles.subHeader}>
          {product.name}: {product.variants[0].stock_unit_name}
        </p>
        <div className={styles.inputWrapper}>
          <div>
            <p className={styles.label}>Enter Quantity</p>
            <p className={styles.quantityAllowed}>
              Max allowed quantity: {product.total_allowed_quantity}
            </p>
          </div>
          <input
            type="number"
            className={styles.inputClass}
            value={bulkVal}
            onChange={inputChange}
          />
        </div>
        <div className={styles.btnWrapper}>
          <button className={styles.submitBtn} onClick={submitVal}>Add to cart</button>
        </div>
      </div>
    </CkModal>
  );
};

export default BulkOrder;
