import React from "react";
import { NavLink, useLocation } from "react-router-dom";

const menuItems = [
  { name: "Quản Lý Sản Phẩm", route: "/admin/product" },
  { name: "Quản Lý Lab", route: "/admin/lab" },
  { name: "Quản Lý Tài Khoản", route: "/admin/account" },
  { name: "Đơn Hàng", route: "/admin/order" },
  { name: "Thống Kê", route: "/admin/dashboard" },
];

function Sidebar() {
  const location = useLocation();

  return (
    <div className="w-64 bg-white shadow-md">
      <div className="p-4">
        {menuItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.route}
            className={({ isActive }) => `
              relative overflow-hidden mb-2 group block
              ${isActive ? "text-white" : "text-black hover:text-white"}
            `}
          >
            {({ isActive }) => (
              <>
                <div className="p-4 z-10 relative transition-colors duration-300">
                  <span className="text-lg">{item.name}</span>
                </div>
                <div
                  className={`
                    absolute inset-0 bg-black
                    transform transition-transform duration-300 ease-out
                    ${
                      isActive
                        ? "translate-x-0"
                        : "-translate-x-full group-hover:translate-x-0"
                    }
                  `}
                ></div>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
