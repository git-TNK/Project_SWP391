import React, { useEffect, useState } from "react";
import Header from "../Header";
import Footer from "../../Footer";
import { useNavigate } from "react-router-dom";

function ServicePage() {
  const [account, setAccount] = useState(null);
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
      navigate("*"); // Redirect if the user is not a Customer
    }
  }, [account, navigate]);

  const [applicationType, setApplicationType] = useState("");
  const [reason, setReason] = useState("");
  const [file, setFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log({ applicationType, reason, file });
  };

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
              Application type:
            </label>
            <select
              id="applicationType"
              value={applicationType}
              onChange={(e) => setApplicationType(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Choose Application Type (Chọn loại đơn)</option>
              {/* Add other options here */}
            </select>
          </div>

          <div className="mb-4">
            <label
              htmlFor="reason"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Reason (Lý do):
            </label>
            <textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="fileAttach"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              File Attach:
            </label>
            <div className="flex items-center">
              <input
                type="file"
                id="fileAttach"
                onChange={(e) => setFile(e.target.files[0])}
                className="hidden"
              />
              <label
                htmlFor="fileAttach"
                className="cursor-pointer bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Choose File
              </label>
              <span className="ml-3 text-sm text-gray-500">
                {file ? file.name : "No file chosen"}
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Extension File: &quot;pdf&quot;
            </p>
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
