import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom"; // Import the useNavigate hook
import Header from "../Header";
import Footer from "../../Footer";
import LoadingSpinner from "../admin/loading";
import FeedbackModal from "../admin/feedback-modal";
import AdminHeader from "../admin/admin-header";
import { ArrowLeft } from "lucide-react";
import StaffHeader from "../staff/StaffHeader";

function ChangePassword() {
  const [account, setAccount] = useState(null);
  const navigate = useNavigate(); // Initialize navigate hook
  const [isLoading, setIsLoading] = useState(false);
  //modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  //role check for page access
  const [roleCheck, setRoleCheck] = useState(true);

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
  }, [account, navigate, roleCheck]);

  const [passwords, setPasswords] = useState({
    accountId: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(""); // State to store success message

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (passwords.oldPassword.length === 0) {
      setError("Khung mật khẩu cũ không được để trống");
      return;
    }

    if (passwords.newPassword.length < 6) {
      setError("Mật khẩu mới phải có ít nhất 6 kí tự");
      return;
    }

    if (passwords.newPassword.length === 0) {
      setError("Khung mật khẩu mới không được để trống");
      return;
    }

    // Kiểm tra mật khẩu mới và cũ giống nhau
    if (passwords.newPassword === passwords.oldPassword) {
      setError("Mật khẩu mới và cũ giống nhau.");
      return;
    }

    // Kiểm tra mật khẩu xác nhận và mật khẩu mới có khớp không
    if (passwords.newPassword !== passwords.confirmPassword) {
      setError("Mật khẩu mới và mật khẩu xác nhận không khớp.");
      return;
    }

    setError(""); // Xóa thông báo lỗi cũ
    setIsLoading(true);
    try {
      const response = await fetch(
        "http://localhost:5056/api/Account/ChangePassword",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            accountId: account.accountId,
            oldPassword: passwords.oldPassword,
            newPassword: passwords.newPassword,
          }),
        }
      );

      if (response.ok) {
        setSuccess("Đổi mật khẩu thành công.");

        setModalMessage("Đổi mật khẩu thành công.");
        setIsSuccess(true);

        // Điều hướng sau 2 giây
        // setTimeout(() => {
        //   navigate("/view-profile", {
        //     state: { message: "Đổi mật khẩu thành công." },
        //   });
        // }, 2000);
      } else {
        const errorData = await response.text();
        setError(errorData || "Sai mật khẩu cũ hoặc có lỗi xảy ra.");
        setModalMessage("Mật khẩu cũ không đúng.");
        setIsSuccess(false);
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Lỗi kết nối. Vui lòng thử lại sau.");
      // setModalMessage("Lỗi kết nối. Vui lòng thử lại sau.");
      // setIsSuccess(false);
    }
    setIsLoading(false);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    if (isSuccess) {
      navigate("/view-profile"); // Replace '/main-page' with your actual main page route
    }
  };

  if (!account) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {account.role === "Customer" ? (
        <Header />
      ) : (
        <div>
          {account.role === "Admin" ? <AdminHeader /> : <StaffHeader />}

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
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-center mt-8 text-gray-800">
            Đổi mật khẩu
          </h1>

          <div className="mt-16 max-w-md mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="oldPassword"
                  className="block text-gray-700 text-lg mb-2"
                >
                  Mật khẩu cũ
                </label>
                <input
                  type="password"
                  id="oldPassword"
                  name="oldPassword"
                  value={passwords.oldPassword}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-gray-700 text-lg mb-2"
                >
                  Mật khẩu mới
                </label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={passwords.newPassword}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-gray-700 text-lg mb-2"
                >
                  Nhập lại mật khẩu mới
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={passwords.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {error && <p className="text-red-500">{error}</p>}
              {success && <p className="text-green-500">{success}</p>}

              <button
                type="submit"
                className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
              >
                Xác nhận
              </button>
            </form>
          </div>
        </div>
      </div>
      <FeedbackModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        message={modalMessage}
        isSuccess={isSuccess}
      />
      {isLoading && <LoadingSpinner />}
      <Footer />
    </div>
  );
}

export default ChangePassword;
