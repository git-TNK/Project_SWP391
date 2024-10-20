import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate, NavLink } from "react-router-dom";
import AdminHeader from "./admin-header";
import Sidebar from "./sidebar";
import Footer from "../../Footer";
import { File } from "lucide-react";
import FeedbackModal from "./feedback-modal";
import LoadingSpinner from "./loading";
import axios from "axios";

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

function UpdateLab() {
  const { labId } = useParams();
  const navigate = useNavigate();

  const [labName, setLabName] = useState("");
  const [types, setTypes] = useState([]);
  const [description, setDescription] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
  const [documentUrl, setDocumentUrl] = useState("");
  const [documentName, setDocumentName] = useState("");
  const [kits, setKits] = useState([]);
  const [dateOfCreation, setDateOfCreation] = useState("");
  const [dateOfDeletion, setDateOfDeletion] = useState("");
  const [dateOfChange, setDateOfChange] = useState("");
  const [status, setStatus] = useState("");
  const [errors, setErrors] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [listOfKit, setListOfKit] = useState([]);

  //Lấy tên của document để cho vô ô add
  const extractDocumentName = (url) => {
    //https://firebasestorage.googleapis.com/v0/b/swp391-2004.appspot.com/o/Images%2Fkit18.jpg_08052920241011?alt=media&token=1ed84150-6366-4ab0-bb5e-051b7fbd3b47

    //chẻ từ các / và cho vô array string
    const parts = url.split("/");

    //Lấy giá trị cuối: Images%2Fkit18.jpg_08052920241011?alt=media&token=1ed84150-6366-4ab0-bb5e-051b7fbd3b47
    const fileNameWithParams = parts[parts.length - 1];

    //Cắt từ ? và lấy giá trị đầu: Images%2Fkit18.jpg_08052920241011
    const fileName = fileNameWithParams.split("?")[0];

    //Decode cái %2F thành / từ Images%2Fkit18.jpg_08052920241011 thành Images/kit18.jpg_08052920241011
    const decodedFileName = decodeURIComponent(fileName);

    //Cắt từ _ và lấy giá trị đầu: Images/kit18.jpg
    const nameWithoutTimestamp = decodedFileName.split("_")[0];

    //Cắt từ / và lấy giá trị cuối (pop()): kit18.jpg
    const finalName = nameWithoutTimestamp.split("/").pop();

    return finalName;
  };

  //Lấy dữ liệu kit để show
  const fetchListOfKit = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:5056/Product/GetKit");
      if (response.status === 200) {
        setListOfKit(response.data);
        console.log(response.data);
      }
    } catch (err) {
      console.log(err);
    }
  }, []);

  //lọc kit liên quan
  const filteredList = useMemo(() => {
    return listOfKit.filter((kit) =>
      types.some((type) => kit.typeNames.includes(type))
    );
  }, [listOfKit, types]);

  //Lấy dữ liệu lab hiện tại để show
  const fetchLabData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`http://localhost:5056/Lab/${labId}`);
      if (response.status === 200) {
        const labData = response.data;
        setLabName(labData.labName);
        setDescription(labData.labDescription);
        setTypes(labData.labTypes || []);
        setDocumentUrl(labData.document);
        setDocumentName(extractDocumentName(labData.document));
        setKits(labData.kits || []);
        setDateOfCreation(labData.dateOfCreationLab);
        setDateOfDeletion(labData.dateOfDeletionLab);
        setDateOfChange(labData.dateOfChangeLab);
        setStatus(labData.status);
      } else {
        throw new Error("Failed to fetch lab data");
      }
    } catch (error) {
      console.error("Error fetching lab data:", error);
      setModalMessage("Failed to load lab data. Please try again.");
      setIsSuccess(false);
      setIsModalOpen(true);
    } finally {
      setIsLoading(false);
    }
  }, [labId]);

  //thực hiện 2 thằng fetch trong lượt chạy đầu
  useEffect(() => {
    fetchLabData();
    fetchListOfKit();
  }, [fetchLabData, fetchListOfKit]);

  //xử lí chọn type
  const handleTypeToggle = (type) => {
    setTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  //xử lý up file
  const handlePdfUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
      setDocumentName(file.name);
    } else {
      alert("Hãy cho file pdf vào");
    }
  };

  //dịch status
  const handleStatusTranslate = (status) => {
    switch (status) {
      case "Changed":
        return "Đã sửa";
      default:
        return "Mới";
    }
  };

  //check lỗi
  const validateForm = () => {
    let formErrors = {};
    if (!labName.trim()) formErrors.labName = "Tên Lab không được để trống";
    if (!description.trim())
      formErrors.description = "Mô tả không được để trống";
    if (types.length === 0) formErrors.types = "Ít nhất phải chọn 1 loại";
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  //xử lí submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      console.log("Form lỗi.");
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("labName", labName);
    formData.append("description", description);
    if (pdfFile) {
      formData.append("document", pdfFile);
    }
    types.forEach((type, index) => {
      formData.append(`labTypes[${index}]`, type);
    });
    kits.forEach((kit, index) => {
      formData.append(`kits[${index}]`, kit);
    });

    try {
      const response = await axios.put(
        `http://localhost:5056/Lab/${labId}/UpdateLab`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        setModalMessage("Cập nhật thành công!");
        setIsSuccess(true);
      }
    } catch (error) {
      console.error("Error:", error);
      if (error.response && error.response.data) {
        if (error.response.data === "Lab is deleted") {
          setModalMessage("Cập nhật thất bại. Lab đã bị xóa");
        } else if (error.response.data === "Existed name") {
          setModalMessage("Cập nhật thất bại. Tên đã tồn tại");
        }
      } else {
        setModalMessage(`An error occurred. ${error}.`);
      }
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
      setIsModalOpen(true);
    }
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
            <h1 className="text-2xl font-bold mb-6">Cập Nhật Lab</h1>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <p className="block text-gray-700 text-sm font-bold mb-2">
                  Tên của lab
                </p>
                <input
                  type="text"
                  id="labName"
                  className={`border ${
                    errors.labName ? "border-red-500" : "border-gray-500"
                  } rounded w-full py-2 px-3 text-gray-700 font-medium`}
                  value={labName}
                  onChange={(e) => setLabName(e.target.value)}
                  placeholder="Tên của lab..."
                />
                {errors.labName && (
                  <p className="text-red-500 text-sm">{errors.labName}</p>
                )}
              </div>

              <div className="flex mb-4">
                <div className="w-1/2">
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

                {/* kit table */}
                <div className="w-1/2">
                  <p className="font-semibold mb-2">Kit</p>
                  <div className="overflow-y-auto h-48">
                    <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                      <thead className="bg-gray-200 text-gray-700">
                        <tr>
                          <th className="w-2/3 py-2 px-4 text-left">Tên kit</th>
                          <th className="w-1/3 py-2 text-left">Trạng thái</th>
                        </tr>
                      </thead>
                      <tbody className="text-gray-600">
                        {filteredList.map((kit) => (
                          <tr
                            key={kit.kitId}
                            className="border-b border-gray-200 hover:bg-gray-50"
                          >
                            {kit.status !== "Deleted" && (
                              <>
                                <td className="py-2 px-4 text-left">
                                  {kit.name}
                                </td>
                                <td
                                  className={`w-20 inline-block my-3 py-2 text-center text-white rounded text-sm ${
                                    kit.status === "Changed"
                                      ? "bg-yellow-300"
                                      : "bg-green-500"
                                  }`}
                                >
                                  {handleStatusTranslate(kit.status)}
                                </td>
                              </>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="mb-4">
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
                {errors.description && (
                  <p className="text-red-500 text-sm">{errors.description}</p>
                )}
              </div>

              <div className="mb-4">
                <p className="block text-gray-700 text-sm font-bold mb-2">
                  Tài liệu PDF
                </p>
                <div
                  className="border-[1px] border-black rounded w-full py-2 px-3 cursor-pointer"
                  onClick={() => document.getElementById("pdfUpload").click()}
                >
                  {documentName ? (
                    <div className="flex items-center justify-center space-x-2 text-black font-semibold">
                      <span>{documentName}</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2 text-black font-semibold">
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

              <div className="mt-8 flex items-center justify-between">
                <button
                  type="submit"
                  className="bg-black text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Cập Nhật
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
}

export default UpdateLab;
