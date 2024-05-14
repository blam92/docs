"use client";

import { FC } from 'react';
import styles from '../styles/NotificationModal.module.css';

interface NotificationModalProps {
  message: string;
}

const NotificationModal: FC<NotificationModalProps> = ({ message }) => {
  return (
    <div className={styles.notificationModal}>
      <p>{message}</p>
    </div>
  );
};

export default NotificationModal;
