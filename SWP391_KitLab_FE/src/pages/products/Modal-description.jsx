import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

const Modal = ({ isOpen, onClose, lab }) => {
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
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0"
      }`}
      onClick={onClose}
    >
      <div
        className={`bg-white p-6 rounded-lg max-w-md w-full transition-all duration-300 ${
          isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
        onTransitionEnd={handleAnimationEnd}
      >
        <h2 className="text-2xl font-bold mb-4">{lab?.name}</h2>
        <p className="text-gray-700 mb-6">{lab?.description}</p>
        <button
          onClick={onClose}
          className="bg-black text-white py-2 px-4 rounded hover:bg-gray-800 transition duration-300"
        >
          Đóng
        </button>
      </div>
    </div>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  lab: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
  }),
};

export default Modal;
