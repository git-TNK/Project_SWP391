import { Button, Form, Input } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import "./LoginPage.css";
import { Navigate, useNavigate } from "react-router-dom";
import AdminProduct from "../admin/admin-product";
import HomePage from "../home/HomePage";

function LoginPage() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [account, setAccount] = useState(null);
  const navigate = useNavigate();

  const onFinish = (e) => {
    e.preventDefault(); // Prevent the form from reloading
    console.log("Username: ", userName);
    console.log("Password: ", password);
    fetchAccount(userName, password);
    if (userName == "" || password == "") {
      alert("Điền đẩy đủ tên đăng nhập và mật khẩu");
    }
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

  console.log(account);

  // Check role and navigate accordingly
  useEffect(() => {
    if (account) {
      if (role === "Admin") {
        navigate("admin/product", { state: { account } }); // Pass the account object
      } else if (role === "Staff") {
        navigate("/", { state: { account } }); // Pass the account object
      } else {
        alert("Hello");
      }
    }
  }, [account, role, navigate]); // Add account, role, and navigate as dependencies

  return (
    <div>
      <div className="login-box">
        <h2>Đăng Nhập</h2>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="user-box">
            <label htmlFor="Tên đăng nhập">Tên đăng nhập</label>
            <input
              type="text"
              id="userName"
              placeholder="Tên đăng nhập"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
          </div>
          <div className="user-box">
            <label htmlFor="password">Mật Khẩu</label>
            <input
              type="password"
              id="password"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <a href="#" className="forgot-password">
            Quên mật khẩu
          </a>
          <button type="submit" className="login-button" onClick={onFinish}>
            Đăng Nhập
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
