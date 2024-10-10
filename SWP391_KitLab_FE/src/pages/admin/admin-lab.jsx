import React from "react";
import Footer from "../../Footer";
import AdminHeader from "./admin-header";
import Sidebar from "./sidebar";
import { PlusCircle } from "lucide-react";

function AdminLab() {
  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader />
      <hr className="w-full h-px border-0 bg-[#0a0a0a]" />
      <div className="flex-grow flex overflow-hidden">
        <div className="flex flex-grow bg-gray-100 overflow-hidden">
          <Sidebar />

          {/* Main content */}
          <div className="flex-1 p-8 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Quản lý lab</h1>
              <button className="bg-black text-white px-4 py-2 rounded-md flex items-center">
                <PlusCircle size={20} className="mr-2" />
                Thêm lab
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default AdminLab;
