import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./LoginPage.css";
import { NavLink } from "react-router-dom";

function LoginPage() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [account, setAccount] = useState();
  const navigate = useNavigate();
  const [error, setError] = useState({});

  const onFinish = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      console.log("Form has errors. Please correct them.");
      return;
    }

    console.log("Username: ", userName);
    console.log("Password: ", password);
    fetchAccount(userName, password);
  };

  async function fetchAccount(userName, password) {
    try {
      const response = await fetch(`http://localhost:5056/api/Account/Login`, {
        method: "POST", // Use POST method
        headers: {
          "Content-Type": "application/json", // Specify JSON content type
        },
        body: JSON.stringify({ userName, password }), // Send data in the request body
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.removeItem("account");
        setAccount(data);
        setRole(data.role);
        alert("Đăng nhập thành công!");
        localStorage.setItem("account", JSON.stringify(data));
      } else {
        const errorMessage = await response.text();
        alert(`Error: ${errorMessage}`);
      }
    } catch (err) {
      console.error("Login failed:", err);
    }
  }

  const validateForm = () => {
    let formError = {};

    if (!userName.trim()) formError.userName = "Tên không được để trống";
    if (!password.trim()) formError.password = "Password không được để trống";

    setError(formError);

    return Object.keys(formError).length === 0;
  };

  useEffect(() => {
    if (account) {
      if (role === "Admin") {
        navigate("/admin/product");
      } else if (role === "Staff") {
        navigate("/staff");
      } else if (role === "Customer") {
        navigate("/");
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
              Tên đăng nhập hoặc email
            </label>
            <input
              type="text"
              id="userName"
              className="w-full p-3 border border-gray-300 rounded-md text-base focus:outline-none focus:border-blue-500"
              placeholder="Tên đăng nhập hoặc email"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
            {error.userName && (
              <p className="text-red-500 text-sm mt-1">{error.userName}</p>
            )}
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
            />
            {error.password && (
              <p className="text-red-500 text-sm mt-1">{error.password}</p>
            )}
          </div>
          <NavLink
            to="/forgotpassword"
            className="custom-forgot-password block text-left mb-4 text-blue-500 text-sm"
          >
            Quên mật khẩu
          </NavLink>
          <button
            type="submit"
            className="custom-login-button w-full bg-black text-white py-3 rounded-md text-base cursor-pointer hover:bg-gray-800 transition-colors"
          >
            Đăng Nhập
          </button>
          <NavLink to="/" className="text-white">
            <button className="custom-login-button w-full bg-black text-white py-3 rounded-md text-base cursor-pointer hover:bg-gray-800 transition-colors mt-4">
              Quay về trang chủ
            </button>
          </NavLink>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
