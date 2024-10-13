import React, { useState } from "react";
import { Navigate, NavLink, useNavigate } from "react-router-dom";
import AdminHeader from "./admin-header";
import Sidebar from "./sidebar";
import Footer from "../../Footer";
import { File } from "lucide-react";
import LoadingSpinner from "./loading";
import FeedbackModal from "./feedback-modal";

const AdminAddLab = () => {
  const [labName, setLabName] = useState("");
  const [types, setTypes] = useState([]);
  const [description, setDescription] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewPdf, setPreviewPdf] = useState(null);
  const navigate = useNavigate();

  const typeOptions = [
    "Wifi",
    "Wireless",
    "Bluetooth",
    "Led",
    "Actuator",
    "AI",
    "Automatic",
    "Connector",
    "Controller",
    "Memory",
    "Manual",
  ];

  const handleTypeToggle = (type) => {
    setTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handlePdfUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
      setPreviewPdf(file.name);
    } else {
      alert("Please upload a PDF file");
    }
  };

  const validateForm = () => {
    let formErrors = {};

    if (!labName.trim()) formErrors.labName = "Lab name is required";
    if (!description.trim()) formErrors.description = "Description is required";
    if (!pdfFile) formErrors.pdfFile = "PDF file is required";
    if (types.length === 0)
      formErrors.types = "At least one type must be selected";

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      console.log("Form has errors. Please correct them.");
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("labName", labName);
    formData.append("description", description);
    formData.append("document", pdfFile);
    types.forEach((type, index) => {
      formData.append(`labTypes[${index}]`, type);
    });
    console.log(formData);

    try {
      const response = await fetch("http://localhost:5056/Lab/AddLab", {
        method: "POST",
        body: formData,
      });
      const responseText = await response.text();
      if (response.ok) {
        setIsLoading(false);
        setModalMessage("Thành công!");
        setIsSuccess(true);
      } else if (responseText === "Name existed") {
        setIsLoading(false);
        setModalMessage(`Thất bại. Tên đã tồn tại!`);
        setIsSuccess(false);
      } else {
        setIsLoading(false);
        setModalMessage("Thất bại, hãy thử lại.");
        setIsSuccess(false);
      }
    } catch (error) {
      console.error("Error:", error);
      setIsLoading(false);
      setModalMessage("An error occurred. Please try again.");
      setIsSuccess(false);
    }
    setIsLoading(false);
    setIsModalOpen(true);
  };
  const handleModalClose = () => {
    setIsModalOpen(false);
    if (isSuccess) {
      navigate("/admin/lab");
    }
  };
  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader />
      <hr className="w-full h-px border-0 bg-[#0a0a0a]" />
      <div className="flex-grow flex overflow-hidden">
        <Sidebar />
        <div className="flex-1 p-4 overflow-y-auto">
          <div>
            <h1 className="text-2xl font-bold mb-6">Thêm Lab Mới</h1>
            <form onSubmit={handleSubmit}>
              <div>
                <p className="block text-gray-700 text-sm font-bold mb-2">
                  Tên của lab
                </p>
                <input
                  type="text"
                  id="labName"
                  className={` border  ${
                    errors.labName ? "border-red-500" : "border-gray-500"
                  } rounded w-full py-2 px-3 text-gray-700 font-medium`}
                  value={labName}
                  onChange={(e) => setLabName(e.target.value)}
                  placeholder="Tên của lab..."
                />
              </div>
              {errors.labName && (
                <p className="text-red-500 text-sm">{errors.labName}</p>
              )}
              <div className="mb-4">
                <p className="font-semibold mb-2">Loại</p>
                <div className="flex flex-wrap gap-2">
                  {typeOptions.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleTypeToggle(type)}
                      className={`px-4 py-2 rounded-full text-sm ${
                        types.includes(type)
                          ? "bg-black text-white"
                          : "bg-gray-200 text-black"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
                {errors.types && (
                  <p className="text-red-500 text-sm mt-1">{errors.types}</p>
                )}
              </div>
              <div>
                <p className="block text-gray-700 text-sm font-bold mb-2">
                  Mô tả
                </p>
                <textarea
                  id="description"
                  className={`border ${
                    errors.description ? "border-red-500" : "border-gray-500"
                  } rounded w-full py-2 px-3 text-gray-700`}
                  rows="4"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Mô tả..."
                ></textarea>
              </div>
              {errors.description && (
                <p className="text-red-500 text-sm">{errors.description}</p>
              )}
              <div>
                <p className="block text-gray-700 text-sm font-bold mb-2">
                  Tải lên PDF
                </p>
                <div
                  className={
                    "border-[1px] border-black rounded w-full py-2 px-3 cursor-pointer"
                  }
                  onClick={() => document.getElementById("pdfUpload").click()}
                >
                  {previewPdf ? (
                    <div className="flex items-center justify-center space-x-2 text-black font-semibold">
                      {previewPdf}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2 text-black font-medium">
                      <File size={24} />
                      <p>Chưa có file</p>
                    </div>
                  )}
                  <input
                    type="file"
                    id="pdfUpload"
                    accept=".pdf"
                    onChange={handlePdfUpload}
                    className="hidden"
                  />
                </div>
              </div>
              {errors.pdfFile && (
                <p className="text-red-500 text-sm">{errors.pdfFile}</p>
              )}
              <div className="mt-8 flex items-center justify-between">
                <button
                  type="submit"
                  className="bg-black text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline "
                >
                  Xác Nhận
                </button>
                <NavLink
                  to="/admin/lab"
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Hủy
                </NavLink>
              </div>
            </form>
          </div>
        </div>
      </div>
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
};

export default AdminAddLab;
