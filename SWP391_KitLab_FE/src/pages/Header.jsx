import React from "react";
import { NavLink } from "react-router-dom";

function Header() {
  return (
    <div>
      <header>
        <div className="top-bar">
          <h1>KitCentral</h1>
          <input type="text" placeholder="Tìm kiếm sản phẩm" />
          <button>Tìm Kiếm</button>
          <div className="auth-buttons">
            <div>
              <NavLink to="login">Đăng nhập</NavLink>
            </div>
            <div>
              <NavLink to="register"> Đăng Ký </NavLink>
            </div>
          </div>
        </div>
        <nav>
          <NavLink to="/">Trang chủ</NavLink>
          <NavLink>Sản Phẩm</NavLink>
          <NavLink to="/contact">Liên Hệ</NavLink>
          <NavLink to="/service">Yêu Cầu Hỗ Trợ</NavLink>
          <NavLink to="/checkout">Thanh Toán</NavLink>
          <div className="cart">
            <NavLink to="/cart">Giỏ Hàng</NavLink>
          </div>
        </nav>
      </header>
    </div>
  );
}

export default Header;
