import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";

function ForgotPasswordPage() {
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

  return (
    <div>
      <div className="bg-white p-10 rounded-lg shadow-md w-96 text-center">
        <h2 className="text-2xl font-bold mb-4">Quên Mật Khẩu</h2>
        <form>
          <div className="relative mb-6">
            <label
              htmlFor="contact"
              className="absolute -top-3 left-3 bg-white px-2 text-gray-500 text-sm"
            >
              Số điện thoại hoặc Email
            </label>
            <input
              type="text"
              id="contact"
              placeholder="Nhập số điện thoại hoặc email"
              className="w-full p-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <NavLink
            to="/resetpassword"
            className="block bg-black text-white py-3 rounded hover:bg-gray-800 transition duration-300"
          >
            Xác nhận
          </NavLink>
        </form>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
