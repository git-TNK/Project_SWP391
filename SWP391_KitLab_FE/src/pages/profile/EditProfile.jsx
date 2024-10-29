import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Header";
import Footer from "../../Footer";
import axios from "axios";

function EditProfile() {
  const [account, setAccount] = useState(null);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const savedAccount = JSON.parse(localStorage.getItem("account"));
    if (savedAccount) {
      setAccount(savedAccount);
      setFormData({
        name: savedAccount.fullName || "",
        email: savedAccount.email || "",
        phoneNumber: savedAccount.phoneNumber || "",
        address: savedAccount.address || "",
      });
    }
  }, []);

  useEffect(() => {
    if (account && account.role !== "Customer") {
      navigate("*");
    }
  }, [account, navigate]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    const nameRegex = /^[a-zA-ZÀ-ỹ\s]+$/;

    // Name validation
    if (!formData.name) {
      newErrors.name = "Họ và tên là bắt buộc.";
    } else if (formData.name.trim().length === 0) {
      newErrors.name = "Họ và tên không thể chỉ chứa khoảng trắng.";
    } else if (!nameRegex.test(formData.name)) {
      newErrors.name = "Họ và tên chỉ được chứa chữ cái.";
    } else if (formData.name.trim().length > 50) {
      newErrors.name = "Họ và tên không được vượt quá 50 ký tự.";
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email là bắt buộc.";
    } else if (
      !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)
    ) {
      newErrors.email = "Email không hợp lệ.";
    }

    // Phone number validation
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = "Số điện thoại là bắt buộc.";
    } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Số điện thoại phải có 10 chữ số.";
    }

    // Address validation
    if (!formData.address) {
      newErrors.address = "Địa chỉ là bắt buộc.";
    } else if (formData.address.trim().length === 0) {
      newErrors.address = "Địa chỉ không thể chỉ chứa khoảng trắng.";
    } else if (formData.address.trim().length < 5) {
      newErrors.address = "Địa chỉ phải có ít nhất 5 ký tự.";
    } else if (formData.address.trim().length > 200) {
      newErrors.address = "Địa chỉ không được vượt quá 200 ký tự.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:5056/api/Account/EditProfile`,
        {
          accountId: account.accountId,
          fullName: formData.name.trim(),
          email: formData.email.trim(),
          phoneNumber: formData.phoneNumber.trim(),
          address: formData.address.trim(),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        const updatedAccount = {
          ...account,
          fullName: formData.name.trim(),
          email: formData.email.trim(),
          phoneNumber: formData.phoneNumber.trim(),
          address: formData.address.trim(),
        };
        localStorage.setItem("account", JSON.stringify(updatedAccount));
        setAccount(updatedAccount);
        alert("Thông tin đã được cập nhật thành công");
        navigate("/view-profile");
      }
    } catch (error) {
      console.error("Cập nhật thất bại: ", error);
      alert("Cập nhật thất bại. Vui lòng thử lại sau!");
    }
  };

  return (
    <div>
      <Header />
      <div className="max-w-md mx-auto mt-10 bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="text-2xl py-4 px-6 bg-gray-900 text-white text-center font-bold uppercase">
          Chỉnh Sửa Thông Tin Cá Nhân
        </div>
        <form className="py-4 px-6" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="name"
            >
              Họ và tên
            </label>
            <input
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                errors.name ? "border-red-500" : ""
              }`}
              id="name"
              type="text"
              placeholder="Nhập họ và tên"
              value={formData.name}
              onChange={handleInputChange}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                errors.email ? "border-red-500" : ""
              }`}
              id="email"
              type="email"
              placeholder="Nhập email"
              value={formData.email}
              onChange={handleInputChange}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="phoneNumber"
            >
              Số điện thoại
            </label>
            <input
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                errors.phoneNumber ? "border-red-500" : ""
              }`}
              id="phoneNumber"
              type="tel"
              placeholder="Nhập số điện thoại"
              value={formData.phoneNumber}
              onChange={handleInputChange}
            />
            {errors.phoneNumber && (
              <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
            )}
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="address"
            >
              Địa chỉ
            </label>
            <input
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                errors.address ? "border-red-500" : ""
              }`}
              id="address"
              type="text"
              placeholder="Nhập địa chỉ"
              value={formData.address}
              onChange={handleInputChange}
            />
            {errors.address && (
              <p className="text-red-500 text-sm mt-1">{errors.address}</p>
            )}
          </div>

          <div className="flex items-center justify-center mb-4">
            <button
              className="bg-gray-900 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Lưu
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
}

export default EditProfile;
