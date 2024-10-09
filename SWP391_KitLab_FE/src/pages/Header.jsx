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
<<<<<<< HEAD
=======
                borderBlockColor: "black",
>>>>>>> a69df4a975ba52df774d317f28c188b4a8642803
                borderRadius: "10px",
                marginRight: "10px",
                width: "600px",
                height: "35px",
<<<<<<< HEAD
                borderColor: "black",
                borderStyle: "solid",
                borderWidth: "2px",
=======
>>>>>>> a69df4a975ba52df774d317f28c188b4a8642803
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
            style={{
              color: "white",
              textDecoration: "none",
              margin: "0 15px",
              fontSize: "16px",
              fontWeight: "500",
            }}
          >
            Trang chủ
          </NavLink>
          <NavLink
            to="/products"
            style={{
              color: "white",
              textDecoration: "none",
              margin: "0 15px",
              fontSize: "16px",
              fontWeight: "500",
            }}
          >
            Sản Phẩm
          </NavLink>
          <NavLink
            to="/contact"
            style={{
              color: "white",
              textDecoration: "none",
              margin: "0 15px",
              fontSize: "16px",
              fontWeight: "500",
            }}
          >
            Liên Hệ
          </NavLink>
          <NavLink
            to="/service"
            style={{
              color: "white",
              textDecoration: "none",
              margin: "0 15px",
              fontSize: "16px",
              fontWeight: "500",
            }}
          >
            Yêu Cầu Hỗ Trợ
          </NavLink>
          <NavLink
            to="/checkout"
            style={{
              color: "white",
              textDecoration: "none",
              margin: "0 15px",
              fontSize: "16px",
              fontWeight: "500",
            }}
          >
            Thanh Toán
          </NavLink>

          <div style={{ marginLeft: "auto" }}>
            <NavLink
              to="/cart"
              style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "#333",
                padding: "10px 15px",
                borderRadius: "5px",
                color: "white",
                textDecoration: "none",
              }}
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
