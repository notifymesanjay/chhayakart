import React from "react";
import styles from "./success-order.module.scss";

const SuccessOrder = ({
  order,
  cardRef,
  show = false,
  id = 0,
  setCardToShow = () => {},
}) => {
  return (
    <div className={styles.cardWrapper} ref={cardRef}>
      <h1
        className={styles.transactionHeader}
        onClick={() => {
          setCardToShow(id);
        }}
      >
        Order Id: {order.order_id} ({order.created_at.substring(0, 10)})
      </h1>
      {show && (
        <>
          <p className={styles.border}></p>
          {order.items.map((item, index) => (
            <div className={styles.orderWrapper}>
              <img
                src={item.image_url}
                className={styles.orderImg}
                alt="order-img"
              />
              <div className={styles.details}>
                <p className={styles.detailVal}>
                  Product Name: {item.product_name}
                </p>
                <p className={styles.detailVal}>
                  Order Quantity: {item.quantity}
                </p>
                <p className={styles.detailVal}>Date: {item.created_at.substring(0, 10)}</p>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default SuccessOrder;
