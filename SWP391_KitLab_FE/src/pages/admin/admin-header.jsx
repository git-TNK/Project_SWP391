import React from "react";
import { NavLink } from "react-router-dom";

function AdminHeader() {
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

          {/* <div style={{ display: "flex", alignItems: "center" }}>
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm"
              style={{
                padding: "8px",
                borderRadius: "10px",
                marginRight: "10px",
                width: "600px",
                height: "35px",
                borderColor: "black",
                borderStyle: "solid",
                borderWidth: "2px",
                color: "black",
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
          </div> */}

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <NavLink
              to="/"
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
              Đăng xuất
            </NavLink>

            <NavLink>
              <img
                src="https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png"
                style={{
                  width: "100%",
                  height: "50px",
                }}
              />
            </NavLink>
          </div>
        </div>
      </header>
    </div>
  );
}

export default AdminHeader;
