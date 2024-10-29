import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import the useNavigate hook
import Header from "../Header";
import Footer from "../../Footer";

function ChangePassword() {
  const [account, setAccount] = useState(null);
  const navigate = useNavigate(); // Initialize navigate hook

  useEffect(() => {
    const savedAccount = JSON.parse(localStorage.getItem("account"));
    if (savedAccount) {
      setAccount(savedAccount);
    }
  }, []);

  useEffect(() => {
    if (account && account.role !== "Customer") {
      navigate("*");
    }
  }, [account, navigate]);

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
        account.password = passwords.newPassword;
        setAccount(account);
        // Điều hướng sau 2 giây
        setTimeout(() => {
          navigate("/view-profile", {
            state: { message: "Đổi mật khẩu thành công." },
          });
        }, 2000);
      } else {
        const errorData = await response.text();
        setError(errorData || "Sai mật khẩu cũ hoặc có lỗi xảy ra.");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Lỗi kết nối. Vui lòng thử lại sau.");
    }
  };

  return (
    <div>
      <Header />
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
      <Footer />
    </div>
  );
}

export default ChangePassword;
