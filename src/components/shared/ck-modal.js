import React from 'react';
import { Modal } from 'react-bootstrap';
import styles from './ck-modal.css';

const CkModal = (props) => {
  return (
    <Modal
      {...props}
      show={props.show}
      size={props.size}
      onHide={() => {
        props.disableBackdropClick && props.onHide();
      }}
      className="dkModal">
      {!props.hideCloseButton && (
        <button
          id='closeBtn'
          type='button'
          className="close"
          aria-hidden='true'
          onClick={props.onHide}>
          ×
        </button>
      )}
      {props.header && (
        <Modal.Header>
          {props.title && <Modal.Title>{props.title}</Modal.Title>}
        </Modal.Header>
      )}
      <Modal.Body>{props.children}</Modal.Body>
      {props.footer && <Modal.Footer>{props.footerContent}</Modal.Footer>}
    </Modal>
  );
};

export default CkModal;
