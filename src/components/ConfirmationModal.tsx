import React from 'react';
import { ConfirmationModalProps } from '../types';
import styles from './ConfirmationModal.module.css';

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, message }) => {
    if (!isOpen) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <p className={styles.message}>{message}</p>
                <div className={styles.actions}>
                    <button className={styles.cancelButton} onClick={onClose}>
                        Cancel
                    </button>
                    <button className={styles.confirmButton} onClick={onConfirm}>
                        Yes, Clear All
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
