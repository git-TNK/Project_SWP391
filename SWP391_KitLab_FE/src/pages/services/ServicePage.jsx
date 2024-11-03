import React, { useEffect, useState } from "react";
import Header from "../Header";
import Footer from "../../Footer";
import { useNavigate } from "react-router-dom";

function ServicePage() {
  const [account, setAccount] = useState(null);
  const [applicationType, setApplicationType] = useState("");
  const [reason, setReason] = useState("");
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const savedAccount = JSON.parse(localStorage.getItem("account"));
    if (savedAccount) {
      setAccount(savedAccount);
    } else {
      navigate("*");
    }
  }, [navigate]);

  useEffect(() => {
    if (account && account.role !== "Customer") {
      navigate("*");
    }
  }, [account, navigate]);

  const validateForm = () => {
    const newErrors = {};
    if (!applicationType) newErrors.applicationType = "Vui lòng chọn bài lab.";
    if (!reason) newErrors.reason = "Vui lòng nhập câu hỏi.";
    if (!file) newErrors.file = "Vui lòng đính kèm file PDF.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type !== "application/pdf") {
      setErrors({ ...errors, file: "Chỉ được phép chọn file PDF." });
      setFile(null);
    } else {
      setErrors({ ...errors, file: "" });
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const formData = new FormData();
        formData.append("accounId", account.accountId);
        formData.append("question", reason);
        formData.append("labName", applicationType);
        formData.append("File", file);

        const response = await fetch(
          "http://localhost:5056/api/Question/AddQuestion",
          {
            method: "POST",
            body: formData,
          }
        );

        if (response.ok) {
          alert("Gửi yêu cầu thành công!");
          navigate("/");
        } else {
          const errorMessage = await response.text();
          alert(`Gửi yêu cầu thất bại: ${errorMessage}`);
        }
      } catch (err) {
        console.error("Lỗi:", err);
        alert("Có lỗi xảy ra. Vui lòng thử lại sau.");
      }
    }
  };

  const savedLabNames = JSON.parse(localStorage.getItem("labNames") || "[]");

  return (
    <div>
      <Header />
      <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold mb-6">Gửi yêu cầu hỗ trợ</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="applicationType"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Chọn bài lab cần hỏi
            </label>
            <select
              id="applicationType"
              value={applicationType}
              onChange={(e) => setApplicationType(e.target.value)}
              className={`w-full p-2 border ${
                errors.applicationType ? "border-red-500" : "border-gray-300"
              } rounded-md focus:ring-blue-500 focus:border-blue-500`}
            >
              <option value="">Chọn bài lab</option>
              {savedLabNames.map((labName, index) => (
                <option key={index} value={labName}>
                  {labName.name || labName}
                </option>
              ))}
            </select>
            {errors.applicationType && (
              <p className="text-sm text-red-500 mt-1">
                {errors.applicationType}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="reason"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Câu hỏi:
            </label>
            <textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              className={`w-full p-2 border ${
                errors.reason ? "border-red-500" : "border-gray-300"
              } rounded-md focus:ring-blue-500 focus:border-blue-500`}
            />
            {errors.reason && (
              <p className="text-sm text-red-500 mt-1">{errors.reason}</p>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="fileAttach"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Chọn File đính kèm:
            </label>
            <div className="flex items-center">
              <input
                type="file"
                id="fileAttach"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="fileAttach"
                className="cursor-pointer bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Chọn File
              </label>
              <span className="ml-3 text-sm text-gray-500">
                {file ? file.name : "Chưa chọn file"}
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Chỉ chấp nhận File: &quot;pdf&quot;
            </p>
            {errors.file && (
              <p className="text-sm text-red-500 mt-1">{errors.file}</p>
            )}
          </div>

          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-gray-200 text-black rounded-md hover:bg-black hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 font-medium"
          >
            Gửi yêu cầu
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
}

export default ServicePage;
