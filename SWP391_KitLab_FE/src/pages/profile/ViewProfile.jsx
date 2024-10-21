import React, { useEffect, useState } from "react";
import Header from "../Header";
import Footer from "../../Footer";
import { Link, useNavigate } from "react-router-dom";

function ViewProfile() {
  const [account, setAccount] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedAccount = JSON.parse(localStorage.getItem("account"));
    if (savedAccount) {
      setAccount(savedAccount);
    }
  }, []);

  useEffect(() => {
    if (account && account.role !== "Customer") {
      navigate("*");
    }
  }, [account, navigate]);

  // Chỉ render giao diện khi account đã được lấy
  if (!account) {
    return <div>Loading...</div>; // Hoặc có thể hiển thị spinner hoặc một thông báo khác
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />

      <div className="flex-grow flex items-center justify-center">
        <div className="bg-white text-black rounded-xl p-8 shadow-md w-full max-w-lg">
          <div className="flex flex-col items-center mb-6">
            <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-gray-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <h2 className="text-2xl font-bold">{account.fullName}</h2>
          </div>

          <div className="space-y-6">
            {/* Name */}
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5.121 17.804A4 4 0 018 16h8a4 4 0 012.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Họ và tên</p>
                <p className="font-bold">{account.fullName}</p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 4h16v16H4z" fill="none" stroke="#000" />
                  <path d="M22 6L12 13 2 6" stroke="#000" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-bold">{account.email}</p>
              </div>
            </div>

            {/* Phone Number */}
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path
                    d="M22 16.92V20a2 2 0 01-2.18 2A19.72 19.72 0 012 4.18 2 2 0 014 2h3.09a2 2 0 012 1.72 12.45 12.45 0 00.65 2.81 2 2 0 01-.45 2.11L7.15 10.85a16 16 0 008 8l2.2-2.2a2 2 0 012.11-.45 12.45 12.45 0 002.81.65 2 2 0 011.72 2.03z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Số điện thoại</p>
                <p className="font-bold">{account.phoneNumber}</p>
              </div>
            </div>

            {/* Address */}
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.94 2.94a1.5 1.5 0 012.12 0l7 7a1.5 1.5 0 01.44 1.06V19.5A1.5 1.5 0 0119 21h-2a1.5 1.5 0 01-1.5-1.5v-3a1.5 1.5 0 00-1.5-1.5h-6A1.5 1.5 0 006 16.5v3A1.5 1.5 0 014.5 21h-2A1.5 1.5 0 011 19.5v-8.5a1.5 1.5 0 01.44-1.06l7-7z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Địa chỉ</p>
                <p className="font-bold">{account.address}</p>
              </div>
            </div>
          </div>

          <button className="mt-6 bg-black hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg w-full">
            <Link to="/edit-profile">Cập nhật Thông tin</Link>
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default ViewProfile;
