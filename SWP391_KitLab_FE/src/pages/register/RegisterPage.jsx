import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../../Footer";
import LoadingSpinner from "../admin/loading";
import FeedbackModal from "../admin/feedback-modal";

function RegisterPage() {
  const navigate = useNavigate();
  const apiKeyVerifyMail = "a5be82b41cedacd749a299e392f313329496442b";

  const [formData, setFormData] = useState({
    userName: "",
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.userName) newErrors.userName = "Tên đăng ký là bắt buộc.";
    if (!formData.fullName) newErrors.fullName = "Họ và tên là bắt buộc.";
    if (!formData.email) newErrors.email = "Email là bắt buộc.";
    else if (
      !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)
    ) {
      newErrors.email = "Email không hợp lệ.";
    }

    if (!formData.phoneNumber)
      newErrors.phoneNumber = "Số điện thoại là bắt buộc.";
    else if (!/^\d{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Số điện thoại phải có 10 chữ số.";
    }

    if (!formData.password) newErrors.password = "Mật khẩu là bắt buộc.";
    else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự.";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu không khớp.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const sendOtp = async () => {
    try {
      const subject = "MÃ OTP"; // Define the subject of the email
      const body = `Mã OTP của bạn: `; // Define the body of the email

      console.log("Sending OTP to:", formData.email); // Log email for debugging
      const response = await fetch("http://localhost:5056/api/Email/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          To: formData.email,
          Subject: subject, // Add subject
          Body: body, // Add body
        }),
      });

      if (response.ok) {
        const { otp, message } = await response.json(); // Destructure the response
        setGeneratedOtp(otp); // Store the OTP received from the server
        setIsOtpModalOpen(true);
        console.log(message); // Log the success message
      } else {
        const errorMessage = await response.text(); // Capture error message
        console.error("Gửi OTP thất bại:", errorMessage);
        alert("Gửi OTP thất bại: " + errorMessage); // Alert the user
      }
    } catch (error) {
      console.error("Lỗi:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      await sendOtp(); // Directly send OTP if the form is valid.
    }
  };

  const verifyOtp = async () => {
    if (otpCode === generatedOtp) {
      try {
        setIsLoading(true);
        const requestData = {
          userName: formData.userName.trim(),
          fullName: formData.fullName.trim(),
          email: formData.email.trim(),
          phoneNumber: formData.phoneNumber.trim(),
          password: formData.password.trim(),
        };

        const response = await fetch(
          "http://localhost:5056/api/Account/Register",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestData),
          }
        );

        const responseText = await response.text();
        if (response.ok && responseText === "Success") {
          setModalMessage("Đăng ký thành công!");
          setIsSuccess(true);
        } else {
          setModalMessage("Thất bại. Thử lại sau.");
        }
      } catch (error) {
        console.error("Lỗi đăng ký:", error);
        setModalMessage("Đăng ký thất bại. Vui lòng thử lại sau.");
      } finally {
        setIsLoading(false);
        setIsOtpModalOpen(false);
        setIsModalOpen(true);
      }
    } else {
      alert("Mã OTP không đúng, vui lòng thử lại.");
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    if (isSuccess) navigate("/login");
  };

  const placeholders = {
    userName: "Tên đăng ký",
    fullName: "Họ và tên",
    email: "Email",
    phoneNumber: "Số điện thoại",
    password: "Mật khẩu",
    confirmPassword: "Xác nhận mật khẩu",
  };

  return (
    <div>
      <div className="bg-white p-10 rounded-lg ml-[590px] shadow-md w-96 text-center">
        <h2 className="text-2xl font-bold mb-4">Đăng Ký</h2>
        <form onSubmit={handleSubmit}>
          {/* Input fields */}
          {[
            "userName",
            "fullName",
            "email",
            "phoneNumber",
            "password",
            "confirmPassword",
          ].map((field) => (
            <div key={field} className="relative mb-6">
              <input
                type={
                  field.includes("password")
                    ? "password"
                    : field.includes("confirmPassword")
                    ? "password"
                    : "text"
                }
                id={field}
                value={formData[field]}
                onChange={handleInputChange}
                placeholder={placeholders[field]}
                className={`w-full p-4 border ${
                  errors[field] ? "border-red-500" : "border-gray-300"
                } rounded focus:outline-none`}
              />
              {errors[field] && (
                <p className="text-red-500 text-sm mt-1">{errors[field]}</p>
              )}
            </div>
          ))}

          <button
            type="submit"
            disabled={isLoading}
            className="bg-black text-white w-full py-3 rounded"
          >
            {isLoading ? "Đang xử lý..." : "Đăng Ký"}
          </button>
        </form>
      </div>

      {/* OTP Modal */}
      {isOtpModalOpen && (
        <div className="otp-modal fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-lg font-bold mb-4 text-center">Nhập mã OTP</h2>
            <input
              type="text"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              placeholder="Nhập mã OTP"
              className="w-full p-2 border border-gray-300 rounded mb-4 focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={verifyOtp}
              className="bg-black text-white w-full py-2 rounded hover:bg-gray-800"
            >
              Xác Nhận
            </button>
          </div>
        </div>
      )}

      <Footer />
      <FeedbackModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        message={modalMessage}
        isSuccess={isSuccess}
      />
      {isLoading && <LoadingSpinner />}
    </div>
  );
}

export default RegisterPage;
