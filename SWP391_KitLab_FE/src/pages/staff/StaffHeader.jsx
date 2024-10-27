import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function StaffHeader() {
  const [account, setAccount] = useState(null);
  const navigate = useNavigate();

  // if (account == null || account.role !== "Staff") {
  //   navigate("*");
  // }

  useEffect(() => {
    const savedAccount = JSON.parse(localStorage.getItem("account"));
    if (savedAccount) {
      setAccount(savedAccount);
    }
    if (savedAccount && savedAccount.role !== "Staff") {
      navigate("*");
    }
  }, [navigate]);

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("account");
    setAccount(null);
    navigate("/");
  };

  return (
    <header
      className="shadow-md"
      style={{ backgroundColor: "black", color: "white" }}
    >
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {/* Logo hình vuông bo cạnh tròn với màu nền gray */}
          <div className="w-20 h-20 bg-gray-500 rounded-lg flex items-center justify-center">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/swp391-2004.appspot.com/o/Logo%2Flogo.jpg?alt=media&token=7ec2c0f7-bebb-4c69-ab1d-0e70fc821d99"
              alt="KitCentral Logo"
              className="rounded-lg shadow-md w-full h-full object-cover"
            />
          </div>
          {/* Tên và Slogan */}
          <div className="pl-3">
            <span className="text-xl font-bold">KitCentral</span>
            <span className="block text-sm text-white">Linh Kiện Điện Tử</span>
          </div>
        </div>

        {/* Thông tin tài khoản và Đăng xuất */}
        <div className="flex items-center space-x-2">
          <button className="px-4 py-1 bg-gray-700 rounded hover:bg-gray-600 transition-colors">
            {account ? account.fullName : <img src="" alt="Avatar" />}
          </button>
          <span className="text-gray-400">hoặc</span>
          <button
            className="px-4 py-1 bg-gray-700 rounded hover:bg-gray-600 transition-colors"
            onClick={handleLogout}
          >
            Đăng xuất
          </button>
        </div>
      </div>
    </header>
  );
}

export default StaffHeader;
