import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function StaffHeader() {
  const [account, setAccount] = useState(null);
  const navigate = useNavigate();

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
    setAccount(null); // Update state to remove account
    navigate("/"); // Navigate immediately
  };

  return (
    <header className="bg-gray-900 text-white shadow-md">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <span className="text-gray-800 text-xl font-bold">◯</span>
          </div>
          <span className="text-xl font-bold">KitCentral</span>
          <span className="text-sm">Linh Kiện Điện Tử</span>
        </div>
        <div className="flex items-center space-x-2">
          <button className="px-4 py-1 bg-gray-700 rounded hover:bg-gray-600 transition-colors">
            Nhân viên
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
