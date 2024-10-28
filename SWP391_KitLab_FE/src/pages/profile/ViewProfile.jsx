import React, { useEffect, useState } from "react";
import Header from "../Header";
import Footer from "../../Footer";
import { Link, NavLink, useNavigate } from "react-router-dom";
import AdminHeader from "../admin/admin-header";
import Sidebar from "../admin/sidebar";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Home,
  UserCircle,
  Lock,
  Edit,
  UserCheck,
  EyeOff,
  EyeClosed,
  Eye,
} from "lucide-react";

function ViewProfile() {
  const [account, setAccount] = useState(null);
  const navigate = useNavigate();
  const [roleCheck, setRoleCheck] = useState(true);
  const [passwordReveal, setPasswordReveal] = useState(false);
  // const [passwordState, setPasswodState] = useState("hide");

  useEffect(() => {
    const savedAccount = JSON.parse(localStorage.getItem("account"));
    if (savedAccount) {
      setAccount(savedAccount);
      setRoleCheck(false);
    }
  }, []);

  useEffect(() => {
    if (account && roleCheck) {
      navigate("*");
    }
  }, [roleCheck, account, navigate]);

  if (!account) {
    return <div>Loading...</div>;
  }

  const handleViewPassword = () => {
    if (passwordReveal === true) {
      setPasswordReveal(false);
    } else {
      setPasswordReveal(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {account.role === "Customer" ? (
        <Header />
      ) : (
        <div>
          <AdminHeader />
          <hr className="w-full h-px border-0 bg-[#0a0a0a]" />
          <NavLink
            to={account.role === "Admin" ? "/admin/product" : "/staff"}
            className="mt-3 flex items-center rounded-lg cursor-pointer bg-gray-300 text-black font-bold hover:bg-black hover:text-white h-8 w-56 text-base px-2"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="ml-2">Quay về trang chính</span>
          </NavLink>
        </div>
      )}

      <div className="pt-6 flex-grow flex items-center justify-center pb-10">
        <div className="bg-white text-black rounded-xl p-8 shadow-md w-full max-w-lg">
          <div className="flex flex-col items-center mb-6">
            <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center mb-4">
              <UserCircle className="h-16 w-16 text-gray-600" />
            </div>
            <h2 className="text-2xl font-bold">{account.fullName}</h2>
          </div>

          <div className="space-y-6">
            {/* Name */}
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-4">
                <UserCheck className="h-6 w-6 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Tên tài khoản</p>
                <p className="font-bold">{account.userName}</p>
              </div>
            </div>

            {/* Name */}
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-4">
                <Lock className="h-6 w-6 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Mật khẩu</p>
                {passwordReveal === true ? (
                  <div className="flex gap-2 w-96">
                    <p
                      className="font-bold truncate"
                      title={`${account.password}`}
                    >
                      {account.password}
                    </p>
                    <button onClick={() => handleViewPassword()}>
                      <Eye className="h-6 w-6 text-gray-600" />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2 w-96">
                    <p>******</p>
                    <button onClick={() => handleViewPassword()}>
                      <EyeClosed className="h-6 w-6 text-gray-600" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Name */}
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-4">
                <User className="h-6 w-6 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Họ và tên</p>
                <p className="font-bold">{account.fullName}</p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-4">
                <Mail className="h-6 w-6 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-bold">{account.email}</p>
              </div>
            </div>

            {/* Phone Number */}
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-4">
                <Phone className="h-6 w-6 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Số điện thoại</p>
                <p className="font-bold">{account.phoneNumber}</p>
              </div>
            </div>

            {/* Address */}
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-4">
                <Home className="h-6 w-6 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Địa chỉ</p>
                <p className="font-bold">{account.address}</p>
              </div>
            </div>
          </div>

          <NavLink to="/changepassword">
            <button className="mt-6 bg-black hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg w-full flex items-center justify-center">
              <Lock className="h-5 w-5 mr-2" />
              Đổi mật khẩu
            </button>
          </NavLink>

          {/* edit profile */}
          {/* <NavLink to="/edit-profile">
            <button className="mt-6 bg-black hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg w-full flex items-center justify-center">
              <Edit className="h-5 w-5 mr-2" />
              Cập nhật Thông tin
            </button>
          </NavLink> */}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default ViewProfile;
