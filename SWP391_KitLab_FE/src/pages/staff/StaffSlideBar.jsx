import { ChevronRight } from "lucide-react";
import React from "react";
import { NavLink } from "react-router-dom"; // Import NavLink

function StaffSlideBar() {
  const menuItems = [
    { label: "Trang chủ", path: "/staff" },
    { label: "Xử Lí Đơn Hàng", path: "/processingOrder" },
    { label: "Hỗ Trợ Kỹ Thuật", path: "/answerQuestion" },
    { label: "Lịch Sử Hỗ Trợ", path: "/historySupport" },
  ];

  return (
    <nav className="w-64 bg-gray-100 h-screen border-r border-gray-200 shadow-md">
      <ul>
        {menuItems.map((item, index) => (
          <li key={index}>
            <NavLink
              to={item.path} // Change href to to
              className={({ isActive }) =>
                `flex items-center justify-between px-4 py-3 text-md ${
                  isActive
                    ? "bg-gray-800 text-white font-semibold rounded-md"
                    : "text-gray-700 hover:bg-gray-200 transition-colors duration-200"
                }`
              }
            >
              <span className="flex-1 text-left">{item.label}</span>
              <ChevronRight
                size={16}
                className={({ isActive }) =>
                  isActive ? "text-white" : "text-gray-400"
                }
              />
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default StaffSlideBar;