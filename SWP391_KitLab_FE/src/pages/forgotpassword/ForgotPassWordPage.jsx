import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import LoadingSpinner from "../admin/loading";
import FeedbackModal from "../admin/feedback-modal";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  async function fetchForgotPassword() {
    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5056/api/Email/sendMailForgotPassword/${email}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            To: email,
            Subject: "Reset Your Password",
            Body: "Here is your new password: ",
          }),
        }
      );

      console.log("Response status:", response.status);
      const responseBody = await response.text();
      console.log("Response body:", responseBody);

      if (response.ok) {
        setSuccessMessage("Email đã được gửi thành công!");
        // Điều hướng về trang đăng nhập sau 3 giây
        setTimeout(() => {
          navigate("/login");
        }, 1500);
        setModalMessage("Email đã được gửi thành công");
        setIsSuccess(true);
      } else {
        console.error("Error:", response.statusText);
        setSuccessMessage("Đã xảy ra lỗi. Vui lòng thử lại.");
        setModalMessage("Đã xảy ra lỗi, xin thử lại sau");
        setIsSuccess(false);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setSuccessMessage("Đã xảy ra lỗi. Vui lòng thử lại.");
      setModalMessage("Đã xảy ra lỗi, xin thử lại sau");
      setIsSuccess(false);
    }
    setIsModalOpen(true);
    setIsLoading(false);
  }

  const handleModalClose = () => {
    setIsModalOpen(false);
    if (isSuccess) {
      navigate("/login");
    }
  };

  return (
    // Applied the styling directly here instead of using useEffect
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="bg-white p-10 rounded-lg shadow-md w-96 text-center">
        <h2 className="text-2xl font-bold mb-4">Quên Mật Khẩu</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchForgotPassword();
          }}
        >
          <div className="relative mb-6">
            <label
              htmlFor="contact"
              className="absolute -top-3 left-3 bg-white px-2 text-gray-500 text-sm"
            >
              Nhập Email
            </label>
            <input
              type="email"
              id="contact"
              placeholder="Nhập email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="custom-login-button w-full bg-black text-white py-3 rounded-md text-base cursor-pointer hover:bg-gray-800 transition-colors mt-4"
          >
            Xác nhận
          </button>
        </form>
        <NavLink to="/login" className="text-white">
          <button className="custom-login-button w-full bg-black text-white py-3 rounded-md text-base cursor-pointer hover:bg-gray-800 transition-colors mt-4">
            Quay về trang đăng nhập
          </button>
        </NavLink>
        {successMessage && (
          <div className="mt-4 text-green-500">{successMessage}</div>
        )}
      </div>
      {isLoading && <LoadingSpinner />}
      <FeedbackModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        message={modalMessage}
        isSuccess={isSuccess}
      />
    </div>
  );
}

export default ForgotPasswordPage;
