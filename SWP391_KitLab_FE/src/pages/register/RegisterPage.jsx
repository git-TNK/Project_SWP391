import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../../Footer";
import LoadingSpinner from "../admin/loading";
import FeedbackModal from "../admin/feedback-modal";

function RegisterPage() {
  const navigate = useNavigate();
  const apiKeyVerifyMail = "a5be82b41cedacd749a299e392f313329496442b";
  const [isEmailVerified, setIsEmailVerified] = useState(false); // Trạng thái kiểm tra email

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    userName: "",
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.userName) {
      newErrors.userName = "Tên đăng ký là bắt buộc.";
    } else if (formData.userName.trim().length === 0) {
      newErrors.userName = "Tên đăng ký không thể chỉ chứa khoảng trắng.";
    }

    if (!formData.fullName) {
      newErrors.fullName = "Họ và tên là bắt buộc.";
    } else if (formData.fullName.trim().length === 0) {
      newErrors.fullName = "Họ và tên không thể chỉ chứa khoảng trắng.";
    }

    if (!formData.email) {
      newErrors.email = "Email là bắt buộc.";
    } else if (
      !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)
    ) {
      newErrors.email = "Email không hợp lệ.";
    }

    if (!formData.phoneNumber) {
      newErrors.phoneNumber = "Số điện thoại là bắt buộc.";
    } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Số điện thoại phải có 10 chữ số.";
    }

    if (!formData.password) {
      newErrors.password = "Mật khẩu là bắt buộc.";
    } else if (formData.password.trim().length === 0) {
      newErrors.password = "Mật khẩu không thể chỉ chứa khoảng trắng.";
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự.";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Xác nhận mật khẩu là bắt buộc.";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu không khớp.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    if (isSuccess) {
      navigate("/login");
    }
  };

  const handleVerifiedEmail = async () => {
    try {
      const response = await fetch(
        `https://api.hunter.io/v2/email-verifier?email=${formData.email}&api_key=${apiKeyVerifyMail}`
      );
      const data = await response.json();
      return data.data.result === "deliverable";
    } catch (error) {
      console.error("Lỗi xác thực email:", error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        // Kiểm tra xem email có hợp lệ không
        const emailVerified = await handleVerifiedEmail();
        if (!emailVerified) {
          setModalMessage("Email không tồn tại hoặc không hợp lệ.");
          setIsModalOpen(true);
          return;
        }

        setIsLoading(true);

        const requestData = {
          userName: formData.userName.trim(),
          fullName: formData.fullName.trim(),
          email: formData.email.trim(),
          phoneNumber: formData.phoneNumber.trim(),
          password: formData.password.trim(),
        };

        console.log("Sending request data:", requestData);

        const response = await fetch(
          "http://localhost:5056/api/Account/Register",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestData),
          }
        );

        const responseText = await response.text();

        if (response.ok && responseText === "Success") {
          setModalMessage("Đăng ký thành công!");
          setIsSuccess(true);
        } else if (responseText === "Both existed") {
          setModalMessage("Thất bại. Tên người dùng và email đã tồn tại.");
        } else if (responseText === "Email existed") {
          setModalMessage("Thất bại. Email đã tồn tại!");
        } else if (responseText === "Username existed") {
          setModalMessage("Thất bại. Tên người dùng đã tồn tại!");
        } else {
          setModalMessage("Thất bại. Thử lại sau.");
        }
      } catch (error) {
        console.error("Lỗi đăng ký:", error);
        setModalMessage("Đăng ký thất bại. Vui lòng thử lại sau.");
      } finally {
        setIsLoading(false);
        setIsModalOpen(true);
      }
    }
  };

  return (
    <div>
      <div className="bg-white p-10 rounded-lg ml-[590px] shadow-md w-96 text-center">
        <h2 className="text-2xl font-bold mb-4">Đăng Ký</h2>
        <form onSubmit={handleSubmit}>
          {/* UserName Input */}
          <div className="relative mb-6">
            <label
              htmlFor="userName"
              className="absolute -top-3 left-3 bg-white px-2 text-gray-500 text-sm"
            >
              Tên đăng ký
            </label>
            <input
              type="text"
              id="userName"
              value={formData.userName}
              onChange={handleInputChange}
              placeholder="Tên đăng ký"
              className={`w-full p-4 border ${
                errors.userName ? "border-red-500" : "border-gray-300"
              } rounded focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.userName && (
              <p className="text-red-500 text-sm mt-1">{errors.userName}</p>
            )}
          </div>

          {/* Full Name Input */}
          <div className="relative mb-6">
            <label
              htmlFor="fullName"
              className="absolute -top-3 left-3 bg-white px-2 text-gray-500 text-sm"
            >
              Họ và Tên
            </label>
            <input
              type="text"
              id="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="Họ và Tên"
              className={`w-full p-4 border ${
                errors.fullName ? "border-red-500" : "border-gray-300"
              } rounded focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
            )}
          </div>

          {/* Email Input */}
          <div className="relative mb-6">
            <label
              htmlFor="email"
              className="absolute -top-3 left-3 bg-white px-2 text-gray-500 text-sm"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email"
              className={`w-full p-4 border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } rounded focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Phone Number Input */}
          <div className="relative mb-6">
            <label
              htmlFor="phoneNumber"
              className="absolute -top-3 left-3 bg-white px-2 text-gray-500 text-sm"
            >
              Số điện thoại
            </label>
            <input
              type="tel"
              id="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              placeholder="Số điện thoại"
              className={`w-full p-4 border ${
                errors.phoneNumber ? "border-red-500" : "border-gray-300"
              } rounded focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.phoneNumber && (
              <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
            )}
          </div>

          {/* Password Input */}
          <div className="relative mb-6">
            <label
              htmlFor="password"
              className="absolute -top-3 left-3 bg-white px-2 text-gray-500 text-sm"
            >
              Mật Khẩu
            </label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Nhập mật khẩu"
              className={`w-full p-4 border ${
                errors.password ? "border-red-500" : "border-gray-300"
              } rounded focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password Input */}
          <div className="relative mb-6">
            <label
              htmlFor="confirmPassword"
              className="absolute -top-3 left-3 bg-white px-2 text-gray-500 text-sm"
            >
              Xác nhận Mật Khẩu
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Nhập lại mật khẩu"
              className={`w-full p-4 border ${
                errors.confirmPassword ? "border-red-500" : "border-gray-300"
              } rounded focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`block w-full ${
              isLoading ? "bg-gray-400" : "bg-black hover:bg-gray-800"
            } text-white py-3 rounded transition duration-300 mb-2`}
          >
            {isLoading ? "Đang xử lý..." : "Đăng Ký"}
          </button>

          {/* Back Button */}
          <button
            type="button"
            onClick={() => navigate(-1)}
            disabled={isLoading}
            className="block w-full bg-gray-300 text-black py-3 rounded hover:bg-gray-400 transition duration-300"
          >
            Quay Lại
          </button>
        </form>
      </div>
      <Footer />
      <FeedbackModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        message={modalMessage}
        isSuccess={isSuccess}
      />
      {isLoading && <LoadingSpinner />}
    </div>
  );
}

export default RegisterPage;
