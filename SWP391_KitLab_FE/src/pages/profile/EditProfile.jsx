import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from "../Header";
import Footer from "../../Footer";
import axios from 'axios';

function EditProfile() {
  const [account, setAccount] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const savedAccount = JSON.parse(localStorage.getItem("account"));
    if (savedAccount) {
      setAccount(savedAccount);
      setName(savedAccount.fullName || '');
      setEmail(savedAccount.email || '');
      setPhoneNumber(savedAccount.phoneNumber || '');
      setAddress(savedAccount.address || '');
    }
  }, []);

  useEffect(() => {
    if (account && account.role !== "Customer") {
      navigate("*");
    }
  }, [account, navigate]);

  // Gửi yêu cầu cập nhật tài khoản
  async function fetchEditProfile(e) {
    e.preventDefault(); // Ngăn không cho trang tải lại khi gửi form

    // Kiểm tra các ô nhập liệu, nếu bị bỏ trống thì sử dụng giá trị từ savedAccount
    const updatedName = name.trim() || account.fullName;
    const updatedEmail = email.trim() || account.email;
    const updatedPhoneNumber = phoneNumber.trim() || account.phoneNumber;
    const updatedAddress = address.trim() || account.address;

    try {
      const response = await axios.put(`http://localhost:5056/api/Account/${account.accountId},${updatedPhoneNumber},${updatedAddress},${updatedEmail},${updatedName}`);

      if (response.status === 200) {
        // Cập nhật thông tin tài khoản trong localStorage và điều hướng nếu thành công
        const updatedAccount = { ...account, fullName: updatedName, email: updatedEmail, phoneNumber: updatedPhoneNumber, address: updatedAddress };
        localStorage.setItem("account", JSON.stringify(updatedAccount));
        setAccount(updatedAccount);
        alert("Thông tin đã được cập nhật thành công");
        navigate("/view-profile"); // Điều hướng sau khi cập nhật thành công
      }
    } catch (error) {
      console.error("Cập nhật thất bại: ", error);
      alert("Cập nhật thất bại!");
    }
  }

  return (
    <div>
      <Header />
      <div className="max-w-md mx-auto mt-10 bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="text-2xl py-4 px-6 bg-gray-900 text-white text-center font-bold uppercase">
          Chỉnh Sửa Thông Tin Cá Nhân
        </div>
        <form className="py-4 px-6" onSubmit={fetchEditProfile}>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="name">
              Họ và tên
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="name" type="text" placeholder="Nhập tên"
              value={name} onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email" type="email" placeholder="Nhập email"
              value={email} onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="phone">
              Số điện thoại
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="phone" type="tel" placeholder="Nhập số điện thoại"
              value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="address">
              Địa chỉ
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="address" type="text" placeholder="Nhập địa chỉ"
              value={address} onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center justify-center mb-4">
            <button
              className="bg-gray-900 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:shadow-outline"
              type="submit">
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
