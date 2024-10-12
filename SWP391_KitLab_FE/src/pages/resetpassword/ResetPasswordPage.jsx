import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";

function ResetPasswordPage() {
  useEffect(() => {
    document.body.classList.add("bg-gray-100", "flex", "justify-center", "items-center", "min-h-screen");
    return () => {
      document.body.classList.remove("bg-gray-100", "flex", "justify-center", "items-center", "min-h-screen");
    };
  }, []);

  return (
    <div>
      <div className="bg-white p-10 rounded-lg shadow-md w-96 text-center">
        <h2 className="text-2xl font-bold mb-4">Đặt Lại Mật Khẩu</h2>
        <form>
          <div className="relative mb-6">
            <label htmlFor="new-password" className="absolute -top-3 left-3 bg-white px-2 text-gray-500 text-sm">Mật Khẩu Mới</label>
            <input type="password" id="new-password" placeholder="Nhập mật khẩu mới" className="w-full p-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>
          <div className="relative mb-6">
            <label htmlFor="confirm-password" className="absolute -top-3 left-3 bg-white px-2 text-gray-500 text-sm">Xác Nhận Mật Khẩu</label>
            <input type="password" id="confirm-password" placeholder="Nhập lại mật khẩu" className="w-full p-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>
          <NavLink to="/login" className="block bg-black text-white py-3 rounded hover:bg-gray-800 transition duration-300">
            Xác nhận
          </NavLink>
        </form>
      </div>
    </div>
  );
}

export default ResetPasswordPage;
