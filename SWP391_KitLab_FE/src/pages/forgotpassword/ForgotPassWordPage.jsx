import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // State để lưu thông báo thành công
  const navigate = useNavigate(); // Hook để điều hướng

  async function fetchForgotPassword() {
    try {
      const response = await fetch(
        `http://localhost:5056/api/Email/sendMailForgotPassword/${email}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            To: email,
            Subject: "Reset Your Password",
            Body: "Here is your new password: ",
          }),
        }
      );

      console.log("Response status:", response.status);
      const responseBody = await response.text(); // Lấy phản hồi dưới dạng văn bản
      console.log("Response body:", responseBody); // Log phản hồi

      if (response.ok) {
        setSuccessMessage("Email đã được gửi thành công!");
        // Điều hướng về trang đăng nhập sau 3 giây
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        console.error("Error:", response.statusText);
        setSuccessMessage("Đã xảy ra lỗi. Vui lòng thử lại."); // Thêm thông báo lỗi
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setSuccessMessage("Đã xảy ra lỗi. Vui lòng thử lại."); // Thêm thông báo lỗi
    }
  }

  useEffect(() => {
    document.body.classList.add(
      "bg-gray-100",
      "flex",
      "justify-center",
      "items-center",
      "min-h-screen"
    );
    return () => {
      document.body.classList.remove(
        "bg-gray-100",
        "flex",
        "justify-center",
        "items-center",
        "min-h-screen"
      );
    };
  }, []);

  return (
    <div>
      <div className="bg-white p-10 rounded-lg shadow-md w-96 text-center">
        <h2 className="text-2xl font-bold mb-4">Quên Mật Khẩu</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchForgotPassword();
          }}
        >
          <div className="relative mb-6">
            <label
              htmlFor="contact"
              className="absolute -top-3 left-3 bg-white px-2 text-gray-500 text-sm"
            >
              Nhập Email
            </label>
            <input
              type="email"
              id="contact"
              placeholder="Nhập email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="block bg-black text-white py-3 rounded hover:bg-gray-800 transition duration-300"
          >
            Xác nhận
          </button>
        </form>
        {successMessage && ( // Hiện thông báo thành công nếu có
          <div className="mt-4 text-green-500">{successMessage}</div>
        )}
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
