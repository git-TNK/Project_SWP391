import React, { useState, useEffect } from "react";
import Footer from "../../Footer";
import AdminHeader from "./admin-header";
import Sidebar from "./sidebar";
import {
  PlusCircle,
  Pencil,
  Trash2,
  FileText,
  Eye,
  Wrench,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import axios from "axios";

import Notification from "./notification";
import LoadingSpinner from "./loading";

function AdminLab() {
  const [labData, setLabData] = useState([]);
  const [selectedLab, setSelectedLab] = useState(null);
  const [modalContent, setModalContent] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [notification, setNotification] = useState(null);
  const labPerpage = 5;

  const fetchLabData = async () => {
    try {
      const response = await axios.get("http://localhost:5056/Lab");
      setLabData(response.data);
      console.log(response.data);
    } catch (error) {
      setError("Failed to fetch lab data");
    }
  };

  useEffect(() => {
    fetchLabData();
  }, []);

  const handleModalOpen = (lab, contentType) => {
    setSelectedLab(lab);
    setModalContent(contentType);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const renderModalContent = () => {
    if (!selectedLab) return null;

    let title, content;
    switch (modalContent) {
      case "kits":
        title = "Lab Kits";
        content =
          selectedLab.kits && selectedLab.kits.length > 0 ? (
            <ul className="list-disc pl-5 mb-4">
              {selectedLab.kits.map((kit, index) => (
                <li key={index}>{kit}</li>
              ))}
            </ul>
          ) : (
            <p className="mb-4 text-gray-500 italic">No kits available</p>
          );
        break;
      case "description":
        title = "Mô tả của Lab";
        content = <p className="mb-4">{selectedLab.labDescription}</p>;
        break;
      default:
        title = "";
        content = null;
    }

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg max-w-md w-full">
          <h2 className="text-xl font-bold mb-4">{title}</h2>
          {content}
          <button
            onClick={handleModalClose}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 "
          >
            Đóng
          </button>
        </div>
      </div>
    );
  };

  const handleDeleteLab = async (labId, labName) => {
    const labToDelete = labData.find((lab) => lab.labId === labId);

    if (labToDelete) {
      console.log(labToDelete);
    } else {
      console.log("nope");
      return;
    }

    try {
      const response = await axios.delete(
        `http://localhost:5056/Lab/DeleteLab?id=${labId}`
      );
      if (response.status === 200) {
        fetchLabData();
        console.log("Success message: ", response.data);
        setNotification({ message: `Đã xóa: ${labName}`, type: "success" });
      } else {
        throw new Error("Unexpected response status");
      }
    } catch (err) {
      console.error("error while deleting lab: ", err);
      setNotification({ message: "Xóa thất bại", type: "error" });
    }
  };

  const indexOfLastLab = currentPage * labPerpage;
  const indexOfFirstLab = indexOfLastLab - labPerpage;
  const currentLabs = labData.slice(indexOfFirstLab, indexOfLastLab);

  const getDisplayStatus = (status) => {
    switch (status.toLowerCase()) {
      case "new":
        return "Mới";
      case "changed":
        return "Đã sửa";
      case "deleted":
        return "Đã xóa";
      default:
        return status;
    }
  };

  const closeNotification = () => {
    setNotification(null);
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader />
      <hr className="w-full h-px border-0 bg-[#0a0a0a]" />
      <div className="flex-grow flex overflow-hidden">
        <div className="flex flex-grow bg-gray-100 overflow-hidden">
          <Sidebar />

          {/* Main content */}
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Quản lý lab</h1>
              <NavLink to="/admin/addLab">
                <button className="bg-black text-white px-4 py-2 rounded-md flex items-center">
                  <PlusCircle size={20} className="mr-2" />
                  Thêm lab
                </button>
              </NavLink>
            </div>

            {/* Lab Table */}

            <div className="overflow-x-auto">
              <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead className="bg-gray-200 text-gray-700">
                  <tr>
                    <th className="py-3 px-4 text-left">ID</th>
                    <th className="py-3 px-4 text-left">Tên bài lab</th>
                    <th className="py-3 px-4 text-center">Mô tả</th>
                    <th className="py-3 px-4 text-center">Loại</th>
                    <th className="py-3 px-4 text-center">Kits</th>
                    <th className="py-3 px-4 text-left">Ngày tạo</th>
                    <th className="py-3 px-4 text-left">Ngày chỉnh</th>
                    <th className="py-3 px-4 text-center">Trạng thái</th>
                    <th className="py-3 px-4 text-center">Chức năng</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600">
                  {currentLabs.map((lab) => (
                    <tr
                      key={lab.labId}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="py-2 px-4">{lab.labId}</td>
                      <td className="py-2 px-4">{lab.labName}</td>
                      <td className="py-2 px-4 text-center">
                        <button
                          onClick={() => handleModalOpen(lab, "description")}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          Xem mô tả
                        </button>
                      </td>
                      <td className="py-2 px-4 text-center">
                        <div className="p-2 grid grid-cols-2 gap-2">
                          {lab.labTypes.map((type, index) => (
                            <span
                              key={index}
                              className="bg-gray-100 px-2 py-1 rounded truncate"
                            >
                              {type}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-2 px-4 text-center">
                        {lab.kits && lab.kits.length > 0 ? (
                          <button
                            onClick={() => handleModalOpen(lab, "kits")}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            Xem kit
                          </button>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="py-2 px-4 text-center">
                        {lab.dateOfCreationLab}
                      </td>
                      <td className="py-2 px-4 text-center">
                        {lab.dateOfDeletionLab || lab.dateOfChangeLab || (
                          <span className="text-gray-400">Không</span>
                        )}
                      </td>
                      <td className="py-2 px-4 text-center">
                        {getDisplayStatus(lab.status)}
                      </td>
                      <td className="py-2 px-4">
                        <div className="flex items-center justify-center space-x-2">
                          <NavLink to={`/admin/lab/${lab.labId}/updateLab`}>
                            <button
                              className="text-green-500 hover:text-green-700"
                              title="Sửa"
                            >
                              <Wrench size={16} />
                            </button>
                          </NavLink>
                          <button
                            className="text-red-500 hover:text-red-700"
                            title="Xóa"
                            onClick={() =>
                              handleDeleteLab(lab.labId, lab.labName)
                            }
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {isModalOpen && renderModalContent()}
            {/* Pagination */}
            <div className="flex justify-center mt-8">
              {[...Array(Math.ceil(labData.length / labPerpage))].map(
                (_, index) => (
                  <button
                    key={index}
                    onClick={() => paginate(index + 1)}
                    className={`mx-1 px-3 py-1 rounded ${
                      currentPage === index + 1
                        ? "bg-black text-white"
                        : "bg-white text-black"
                    }`}
                  >
                    {index + 1}
                  </button>
                )
              )}
            </div>
            {notification && (
              <Notification
                message={notification.message}
                type={notification.type}
                onClose={closeNotification}
              />
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default AdminLab;
