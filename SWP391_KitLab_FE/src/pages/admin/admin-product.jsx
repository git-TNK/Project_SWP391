import React, { useState } from "react";
import Footer from "../../Footer";
import AdminHeader from "./admin-header";
import { ChevronRight, PlusCircle, Settings } from "lucide-react";
import "../../tailwindstyle.css";
import { useLocation } from "react-router-dom";

const menuItems = [
  { name: "Quản Lý Sản Phẩm" },
  { name: "Quản Lý Lab" },
  { name: "Quản Lý Tài Khoản" },
  { name: "Lịch Sử Đơn Hàng" },
  { name: "Thống Kê" },
];

const AdminProduct = () => {
  const [activeItem, setActiveItem] = useState("Quản Lý Kit");
  const location = useLocation();
  const account = location.state?.account; // Use optional chaining in case state is undefined

  console.log(account); // Now you can use the account object

  return (
    <div>
      <AdminHeader />
      <hr className="h-px border-0 bg-[#0a0a0a]"></hr>
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <div className="w-64 h-96 bg-white shadow-md mt-[50px]">
          <div className="p-4">
            {menuItems.map((item, index) => (
              <div
                key={index}
                className="relative overflow-hidden mb-2 group"
                onClick={() => setActiveItem(item.name)}
              >
                <div
                  className={`
                  p-4 z-10 relative transition-colors duration-300
                  ${
                    activeItem === item.name
                      ? "text-white"
                      : "text-black group-hover:text-white"
                  }
                `}
                >
                  <span className="text-lg">{item.name}</span>
                </div>
                <div
                  className={`
                  absolute inset-0 bg-black
                  transform transition-transform duration-300 ease-out
                  ${
                    activeItem === item.name
                      ? "translate-x-0"
                      : "-translate-x-full group-hover:translate-x-0"
                  }
                `}
                ></div>
              </div>
            ))}
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">{activeItem}</h1>
            <button className="bg-black text-white px-4 py-2 rounded-md flex items-center">
              <PlusCircle size={20} className="mr-2" />
              Thêm Sản Phẩm
            </button>
          </div>

          {/* Placeholder for product grid */}
          <div className="grid grid-cols-5 gap-4">
            {[...Array(10)].map((_, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded-md shadow h-48"
              ></div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminProduct;
