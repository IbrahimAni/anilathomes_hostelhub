"use client";

import React from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  danger?: boolean;
  confirmButtonColor?: string; // Added for backward compatibility
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmButtonText = "Confirm",
  cancelButtonText = "Cancel",
  danger = false,
  confirmButtonColor
}) => {
  // If confirmButtonColor is provided, use it to determine danger status
  const isDanger = danger || confirmButtonColor === "red";
  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
        data-testid="confirmation-modal-overlay"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirmation-modal-title"
      >
        <div
          className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl"
          data-testid="confirmation-modal-container"
        >
          <h2
            id="confirmation-modal-title"
            className="text-xl font-semibold text-gray-800 mb-4"
            data-testid="confirmation-modal-title"
          >
            {title}
          </h2>
          
          <p className="text-gray-600 mb-6" data-testid="confirmation-modal-message">
            {message}
          </p>
          
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              data-testid="confirmation-modal-cancel"
            >
              {cancelButtonText}
            </button>            <button
              onClick={onConfirm}
              className={`px-4 py-2 rounded-md text-white transition-colors ${
                isDanger 
                  ? "bg-red-600 hover:bg-red-700" 
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
              data-testid="confirmation-modal-confirm"
            >
              {confirmButtonText}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmationModal;
