import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    userName: "",
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    document.body.classList.add(
      "bg-gray-100",
      "flex",
      "justify-center",
      "items-center",
      "min-h-screen"
    );
    return () => {
      document.body.classList.remove(
        "bg-gray-100",
        "flex",
        "justify-center",
        "items-center",
        "min-h-screen"
      );
    };
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.userName) newErrors.userName = "Tên đăng ký là bắt buộc.";
    if (!formData.fullName) newErrors.fullName = "Họ và tên là bắt buộc.";
    if (!formData.email) newErrors.email = "Email là bắt buộc.";
    if (!formData.phone) newErrors.phone = "Số điện thoại là bắt buộc.";
    if (!formData.password) newErrors.password = "Mật khẩu là bắt buộc.";
    if (!formData.confirmPassword)
      newErrors.confirmPassword = "Xác nhận mật khẩu là bắt buộc.";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Mật khẩu không khớp.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const { userName, fullName, email, phone, password } = formData;

      const url = `http://localhost:5056/api/Account/Register/${userName}/${password}/${email}/${fullName}/${phone}`;

      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Something went wrong!");
        }

        const data = await response.json();
        console.log("Đăng ký thành công:", data);
        alert("Đăng ký thành công!");
        navigate("/login");
      } catch (error) {
        console.error("Lỗi đăng ký:", error);
        alert("Đăng ký thất bại. Email hoặc tên đăng nhập đã tồn tại.");
      }
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="bg-white p-10 rounded-lg shadow-md w-96 text-center">
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

        {/* Phone Input */}
        <div className="relative mb-6">
          <label
            htmlFor="phone"
            className="absolute -top-3 left-3 bg-white px-2 text-gray-500 text-sm"
          >
            Số điện thoại
          </label>
          <input
            type="tel"
            id="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="Số điện thoại"
            className={`w-full p-4 border ${
              errors.phone ? "border-red-500" : "border-gray-300"
            } rounded focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
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
          className="block w-full bg-black text-white py-3 rounded hover:bg-gray-800 transition duration-300 mb-2"
        >
          Đăng Ký
        </button>

        {/* Back Button */}
        <button
          type="button"
          onClick={handleGoBack}
          className="block w-full bg-gray-300 text-black py-3 rounded hover:bg-gray-400 transition duration-300"
        >
          Quay Lại
        </button>
      </form>
    </div>
  );
}

export default RegisterPage;
