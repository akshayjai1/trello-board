import React from 'react';
import styles from './Modal.module.css';

import Backdrop from '../../components/Modal/backdrop/backdrop';

export const Modal = (props) => {
  const { closeModal, content, isModalVisible, children } = props;
  return (
    isModalVisible && (
      <div>
        <Backdrop />
        <span className={styles.Close} onClick={closeModal}>
          X
        </span>
        <div className={styles.Modal}>{children}</div>
      </div>
    )
  );
};
