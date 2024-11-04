import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Check, X } from "lucide-react"; // Import Lucide icons

const FeedbackModal = ({ isOpen, onClose, message, isSuccess }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    }
  }, [isOpen]);

  const handleAnimationEnd = () => {
    if (!isOpen) {
      setIsAnimating(false);
    }
  };

  if (!isOpen && !isAnimating) return null;

  return (
    <div
      className={`fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full transition-opacity duration-900 ease-in-out ${
        isOpen ? "opacity-100" : "opacity-0"
      } z-[100]`}
      onClick={onClose}
    >
      <div
        className={`relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white transition-all duration-900 ease-in-out ${
          isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
        onTransitionEnd={handleAnimationEnd}
      >
        <div className="mt-3 text-center">
          <div
            className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full ${
              isSuccess ? "bg-green-100" : "bg-red-100"
            }`}
          >
            {isSuccess ? (
              <Check className="h-6 w-6 text-green-600" strokeWidth={2} />
            ) : (
              <X className="h-6 w-6 text-red-600" strokeWidth={2} />
            )}
          </div>
          <h3
            className={`text-lg leading-6 font-medium ${
              isSuccess ? "text-green-900" : "text-red-900"
            }`}
          >
            {message}
          </h3>
          <div className="mt-2 px-7 py-3">
            <button
              onClick={onClose}
              className={`px-4 py-2 ${
                isSuccess
                  ? "bg-green-500 hover:bg-green-600 focus:ring-green-300"
                  : "bg-red-500 hover:bg-red-600 focus:ring-red-300"
              } text-white text-base font-medium rounded-md w-full shadow-sm focus:outline-none focus:ring-2`}
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

FeedbackModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
  isSuccess: PropTypes.bool.isRequired,
};

export default FeedbackModal;
