import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./LoginPage.css"; // Make sure to create this file with the CSS from the previous example

function LoginPage() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [account, setAccount] = useState(null);
  const navigate = useNavigate();

  const onFinish = (e) => {
    e.preventDefault();
    console.log("Username: ", userName);
    console.log("Password: ", password);
    fetchAccount(userName, password);
  };

  async function fetchAccount(userName, password) {
    try {
      const response = await axios.get(
        `http://localhost:5056/api/Account/${userName},${password}`
      );
      setAccount(response.data);
      setRole(response.data.role);
    } catch (err) {
      console.log(err);
      alert("Sai tài khoản hoặc mật khẩu");
    }
  }

  useEffect(() => {
    if (account) {
      if (role === "Admin") {
        navigate("/admin/product", { state: { account } });
      } else if (role === "Staff") {
        navigate("/", { state: { account } });
      } else {
        alert("Hello");
      }
    }
  }, [account, role, navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="custom-login-box bg-white p-10 rounded-lg shadow-md text-center">
        <h2 className="custom-login-title text-2xl text-black mb-6">
          Đăng Nhập
        </h2>
        <form onSubmit={onFinish}>
          <div className="custom-user-box mb-6">
            <label htmlFor="userName" className="text-sm text-gray-600">
              Tên đăng nhập
            </label>
            <input
              type="text"
              id="userName"
              className="w-full p-3 border border-gray-300 rounded-md text-base focus:outline-none focus:border-blue-500"
              placeholder="Tên đăng nhập"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
          </div>
          <div className="custom-user-box mb-6">
            <label htmlFor="password" className="text-sm text-gray-600">
              Mật Khẩu
            </label>
            <input
              type="password"
              id="password"
              className="w-full p-3 border border-gray-300 rounded-md text-base focus:outline-none focus:border-blue-500"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <a
            href="#"
            className="custom-forgot-password block text-left mb-4 text-blue-500 text-sm"
          >
            Quên mật khẩu
          </a>
          <button
            type="submit"
            className="custom-login-button w-full bg-black text-white py-3 rounded-md text-base cursor-pointer hover:bg-gray-800 transition-colors"
          >
            Đăng Nhập
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
