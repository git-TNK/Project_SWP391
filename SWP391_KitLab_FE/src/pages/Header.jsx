import React from "react";
import { NavLink } from "react-router-dom";

function Header() {
  return (
    <div>
      <header
        style={{
          backgroundColor: "white",
          padding: "0px",
        }}
      >
        {/* Top Bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px 20px",
            backgroundColor: "white",
          }}
        >
          <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "black" }}>
            KitCentral{" "}
            <span
              style={{
                display: "block",
                fontSize: "12px",
                fontWeight: "normal",
                marginTop: "-5px",
                color: "black",
              }}
            >
              Linh Kiện Điện Tử
            </span>
          </h1>

          <div style={{ display: "flex", alignItems: "center" }}>
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm"
              style={{
                padding: "8px",

                borderBlockColor: "black",
                borderRadius: "10px",
                marginRight: "10px",
                width: "600px",
                height: "35px",
                borderColor: "black",
                borderStyle: "solid",
                borderWidth: "2px",
                color: "black", // Set the text color
                backgroundColor: "white", // Set the background color
              }}
            />
            <button
              style={{
                padding: "8px 16px",
                backgroundColor: "black",
                color: "white",
                border: "none",
                borderRadius: "10px",
                cursor: "pointer",
              }}
            >
              Tìm Kiếm
            </button>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <NavLink
              to="/login"
              style={{
                padding: "8px 16px",
                backgroundColor: "black",
                color: "white",
                border: "none",
                borderRadius: "10px",
                cursor: "pointer",
                textDecoration: "none",
              }}
            >
              Đăng nhập
            </NavLink>
            <span style={{ color: "black" }}>hoặc</span>
            <NavLink
              to="/register"
              style={{
                padding: "8px 16px",
                backgroundColor: "black",
                color: "white",
                border: "none",
                borderRadius: "10px",
                cursor: "pointer",
                textDecoration: "none",
              }}
            >
              Đăng Ký
            </NavLink>
          </div>
        </div>

        {/* Navigation Bar */}
        <nav
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#222",
            padding: "10px 20px",
            color: "white",
          }}
        >
          <NavLink
            to="/"
            style={({ isActive }) => ({
              color: isActive ? "yellow" : "white", // Change color when active
              textDecoration: "none",
              margin: "0 15px",
              fontSize: "16px",
              fontWeight: "500",
            })}
          >
            Trang chủ
          </NavLink>
          <NavLink
            to="/products"
            style={({ isActive }) => ({
              color: isActive ? "yellow" : "white", // Change color when active
              textDecoration: "none",
              margin: "0 15px",
              fontSize: "16px",
              fontWeight: "500",
            })}
          >
            Sản Phẩm
          </NavLink>
          <NavLink
            to="/contact"
            style={({ isActive }) => ({
              color: isActive ? "yellow" : "white", // Change color when active
              textDecoration: "none",
              margin: "0 15px",
              fontSize: "16px",
              fontWeight: "500",
            })}
          >
            Liên Hệ
          </NavLink>
          <NavLink
            to="/service"
            style={({ isActive }) => ({
              color: isActive ? "yellow" : "white", // Change color when active
              textDecoration: "none",
              margin: "0 15px",
              fontSize: "16px",
              fontWeight: "500",
            })}
          >
            Yêu Cầu Hỗ Trợ
          </NavLink>
          <NavLink
            to="/checkout"
            style={({ isActive }) => ({
              color: isActive ? "yellow" : "white", // Change color when active
              textDecoration: "none",
              margin: "0 15px",
              fontSize: "16px",
              fontWeight: "500",
            })}
          >
            Thanh Toán
          </NavLink>

          <div style={{ marginLeft: "auto" }}>
            <NavLink
              to="/cart"
              style={({ isActive }) => ({
                color: isActive ? "yellow" : "white", // Change color when active
                textDecoration: "none",
                margin: "0 15px",
                fontSize: "16px",
                fontWeight: "500",
              })}
            >
              Giỏ Hàng
            </NavLink>
          </div>
        </nav>
      </header>
    </div>
  );
}

export default Header;
