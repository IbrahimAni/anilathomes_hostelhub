"use client";

import { useEffect, useState } from "react";
import toast from 'react-hot-toast';

interface DiscountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DiscountModal = ({ isOpen, onClose }: DiscountModalProps) => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 12,
    minutes: 0,
    seconds: 0,
  });
  const [copied, setCopied] = useState(false);
  const discountCode = "SAVE-NOW-2024";

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(discountCode);
      setCopied(true);
      toast.success(
        () => (
          <span data-testid="toast-success-message">
            Discount code copied to clipboard!
          </span>
        ),
        {
          id: 'copy-success',
          className: 'dark:bg-gray-800'
        }
      );
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
      toast.error(
        () => (
          <span data-testid="toast-error-message">
            Failed to copy code
          </span>
        ),
        {
          id: 'copy-error',
          className: 'dark:bg-gray-800'
        }
      );
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    const endTime = new Date().getTime() + 12 * 60 * 60 * 1000; // 12 hours from now

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = endTime - now;

      if (distance < 0) {
        clearInterval(timer);
        onClose();
        return;
      }

      setTimeLeft({
        hours: Math.floor(distance / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
        data-testid="discount-modal-overlay"
        role="dialog"
        aria-modal="true"
        aria-labelledby="discount-title"
        aria-describedby="discount-description"
      >
        <div
          className="bg-white rounded-lg p-8 max-w-md w-full mx-4 relative"
          data-testid="discount-modal-container"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            data-testid="discount-modal-close"
            aria-label="Close discount offer"
          >
            ×
          </button>

          <div className="text-center">
            <h2
              id="discount-title"
              className="text-2xl font-bold text-gray-800 mb-4"
              data-testid="discount-modal-title"
            >
              🎉 Welcome Offer!
            </h2>
            <div
              id="discount-description"
              className="bg-yellow-100 p-4 rounded-lg mb-4"
            >
              <p
                className="text-4xl font-bold text-yellow-600 mb-2"
                data-testid="discount-amount"
                aria-label="10 percent off discount"
              >
                10% OFF
              </p>
              <p className="text-gray-700">on your first booking</p>
              <div className="mt-4 p-2 bg-white rounded-lg flex items-center justify-between">
                <span className="font-mono font-bold text-lg">
                  {discountCode}
                </span>
                <button
                  onClick={copyToClipboard}
                  data-testid="discount-copy-button"
                  className={`ml-2 p-2 rounded-full hover:bg-blue-100 transition-colors ${
                    copied ? 'text-green-600' : 'text-blue-600'
                  }`}
                  aria-label="Copy discount code to clipboard"
                >
                  {copied ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                      <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z" />
                      <path d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H5a2 2 0 01-2-2V5z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div
              className="text-sm text-gray-600 mb-6"
              data-testid="discount-timer"
              aria-live="polite"
              aria-atomic="true"
            >
              Offer expires in: {String(timeLeft.hours).padStart(2, "0")}:
              {String(timeLeft.minutes).padStart(2, "0")}:
              {String(timeLeft.seconds).padStart(2, "0")}
            </div>

            <button
              onClick={() => {
                // Here you can add logic to apply the discount
                onClose();
              }}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors w-full"
              data-testid="discount-redeem-button"
              aria-label="Redeem 10 percent discount"
            >
              Redeem Discount Now
            </button>

            <p
              className="text-xs text-gray-500 mt-4"
              data-testid="discount-terms"
              aria-label="Terms and conditions: Discount valid for 12 hours"
            >
              *Terms and conditions apply. Discount valid for 12 hours.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default DiscountModal;
