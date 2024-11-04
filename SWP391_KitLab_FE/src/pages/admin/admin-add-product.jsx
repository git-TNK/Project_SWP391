import React, { useCallback, useEffect, useMemo, useState } from "react";
import AdminHeader from "./admin-header";
import Sidebar from "./sidebar";
import Footer from "../../Footer";
import { Camera } from "lucide-react";
import FeedbackModal from "./feedback-modal";
import { NavLink, useNavigate } from "react-router-dom";
import LoadingSpinner from "./loading";
import axios from "axios";

const brandOptions = ["Arduino", "Rasberry pi", "KEYESTUDIO", "OSOYOO"];
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
  "Sensor",
];

function AddProduct() {
  //attributes of form
  const [kitName, setKitName] = useState("");
  const [brand, setBrand] = useState("");
  const [description, setDescription] = useState("");
  const [picture, setPicture] = useState(null);
  const [picturePreview, setPicturePreview] = useState(null);
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  //type selector
  const [types, setTypes] = useState([]);
  //error handler
  const [errors, setErrors] = useState({});
  //navigate back to page
  const navigate = useNavigate();
  //modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  //loading
  const [isLoading, setIsLoading] = useState(false);
  //list lab for reference
  const [listOfLab, setListOfLab] = useState([]);

  //Xử lý upload ảnh
  const handlePictureUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setPicture(file);
      const reader = new FileReader();
      reader.onload = (e) => setPicturePreview(e.target.result);
      reader.readAsDataURL(file);
    } else {
      alert("Chỉ được chọn ảnh");
    }
  };

  //Xử lý chọn type
  const handleToggleType = (type) => {
    setTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  //Set up form xác minh
  const validateForm = () => {
    let formErrors = {};

    if (!kitName.trim()) formErrors.kitName = "Tên kit không được để trống";
    if (!brand) formErrors.brand = "Hãy chọn hãng";
    if (!description.trim())
      formErrors.description = "Mô tả không được để trống";
    if (!picture) formErrors.picture = "Ảnh không được để trống";
    if (!price || price <= 0) formErrors.price = "Giá không hợp lệ";
    if (!quantity || quantity <= 0)
      formErrors.quantity = "Số lượng không hợp lệ";
    if (types.length === 0) formErrors.types = "Ít nhất 1 loại phải được chọn";

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  //Xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    //Check coi có lỗi nào trong form validate không
    if (!validateForm()) {
      console.log("Form has errors. Please correct them.");
      return;
    }

    setIsLoading(true);

    //Nạp data vào request
    const formData = new FormData();
    formData.append("kitName", kitName);
    formData.append("brand", brand);
    formData.append("description", description);
    formData.append("picture", picture);
    formData.append("price", price);
    formData.append("quantity", quantity);
    types.forEach((type, index) => {
      formData.append(`types[${index}]`, type);
    });

    //Gửi request
    try {
      const response = await fetch("http://localhost:5056/Product/AddProduct", {
        method: "POST",
        body: formData,
      });
      const responseText = await response.text();
      if (response.ok) {
        setIsLoading(false);
        setModalMessage("Thành công!");
        setIsSuccess(true);
      } else if (responseText === "Existed name") {
        setIsLoading(false);
        setModalMessage(`Thất bại. Tên đã tồn tại!`);
        setIsSuccess(false);
      } else {
        setIsLoading(false);
        setModalMessage("Thất bại,hãy thử lại.");
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

  //Xử lý đóng modal khi có thông báo kết quả add
  const handleModalClose = () => {
    setIsModalOpen(false);
    if (isSuccess) {
      navigate("/admin"); // Replace '/main-page' with your actual main page route
    }
  };

  //Xử lý fetch lab data để khi chọn type thì hiển thị lab tương ứng
  const fetchLabData = async () => {
    try {
      const response = await axios.get("http://localhost:5056/Lab/GetLab");
      if (response.status === 200) {
        setListOfLab(response.data);
        console.log(response.data);
      }
    } catch (err) {
      console.log(`Messup line 147: ${err}`);
    }
  };

  //Khi vào trang thì sẽ fetch data của lab 1 lần
  useEffect(() => {
    fetchLabData();
  }, []);

  //Tính toán useMemo dùng để lưu các kết quả tính toán phức tạp
  //Trả về listOfLab sau khi đã lọc
  const filterListLab = useMemo(() => {
    return listOfLab.filter((lab) =>
      types.some((type) => lab.labTypes.includes(type))
    );
  }, [listOfLab, types]);

  const handleStatusTranslate = (status) => {
    switch (status) {
      case "Changed":
        return "Đã sửa";
      default:
        return "Mới";
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader />
      <hr className="w-full h-px border-0 bg-[#0a0a0a]" />
      <div className="flex-grow flex overflow-hidden">
        <div className="flex flex-grow bg-gray-100 overflow-hidden">
          <Sidebar />

          <div className="flex-1 p-8 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Thêm sản phẩm</h1>
            </div>

            <form
              onSubmit={handleSubmit}
              className="max-w-6xl mx-auto flex gap-4"
            >
              <div className="w-1/3">
                <div
                  className="border-2 border-dashed border-black rounded-lg flex items-center justify-center h-64 cursor-pointer"
                  style={{
                    height: "450px",
                  }}
                  onClick={() =>
                    document.getElementById("pictureUpload").click()
                  }
                >
                  {picturePreview ? (
                    <img
                      src={picturePreview}
                      alt="Product preview"
                      className="object-fill w-full h-full rounded-lg"
                    />
                  ) : (
                    <div className="text-center">
                      <Camera className="mx-auto text-gray-400" size={48} />
                      <p className="mt-2 text-sm text-gray-500">THÊM ẢNH</p>
                    </div>
                  )}
                  <input
                    id="pictureUpload"
                    type="file"
                    className="hidden"
                    onChange={handlePictureUpload}
                    accept="image/*"
                  />
                </div>
                {errors.picture && (
                  <p className="text-red-500 text-sm mt-1">{errors.picture}</p>
                )}
              </div>
              <div className="w-2/3 space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Tên của kit..."
                    className={`w-full p-2 border ${
                      errors.kitName ? "border-red-500" : "border-black"
                    } rounded-lg font-semibold text-xl`}
                    value={kitName}
                    style={{ width: "760px", height: "50px" }}
                    onChange={(e) => setKitName(e.target.value)}
                  />
                  {errors.kitName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.kitName}
                    </p>
                  )}
                </div>
                <div className="flex gap-4">
                  <div className="w-1/2">
                    <input
                      type="number"
                      placeholder="Số lượng"
                      className={`w-full p-2 border ${
                        errors.quantity ? "border-red-500" : "border-black"
                      } rounded-lg`}
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      min="1"
                      max="100000"
                      onWheel={(e) => e.target.blur()}
                    />
                    {errors.quantity && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.quantity}
                      </p>
                    )}
                  </div>
                  <div className="w-1/2">
                    <input
                      type="number"
                      placeholder="Giá"
                      className={`w-full p-2 border ${
                        errors.price ? "border-red-500" : "border-black"
                      } rounded-lg`}
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      min="1000"
                      max="100000000"
                      onWheel={(e) => e.target.blur()}
                    />
                    {errors.price && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.price}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex">
                  <div className="w-1/2">
                    {/* Hãng */}
                    <div>
                      <p className="font-bold mb-2">Hãng</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {brandOptions.map((option) => (
                          <button
                            key={option}
                            type="button"
                            onClick={() => setBrand(option)}
                            className={`px-4 py-2 rounded-full text-sm ${
                              brand === option
                                ? "bg-black text-white"
                                : "bg-gray-200 text-black"
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                      {errors.brand && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.brand}
                        </p>
                      )}
                    </div>
                    {/* Loại */}
                    <div>
                      <p className="font-bold mb-2">Loại</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {typeOptions.map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => handleToggleType(type)}
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
                        <p className="text-red-500 text-sm mt-1">
                          {errors.types}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* List các bài lab khi chọn loại */}
                  <div className="w-1/2">
                    <p className="font-bold mb-2">Các bài lab</p>
                    {/* table */}
                    <div className="overflow-y-auto h-56">
                      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                        <thead className="bg-gray-200 text-gray-700">
                          <tr>
                            <th className="w-2/3 py-2 px-4 text-left">
                              Tên lab
                            </th>
                            <th className="w-1/3 py-2 text-left">Trạng thái</th>
                          </tr>
                        </thead>
                        <tbody className="text-gray-600">
                          {filterListLab.map((lab) => (
                            <tr
                              key={lab.labId}
                              className="border-b border-gray-200 hover:bg-gray-50"
                            >
                              {lab.status !== "Deleted" && (
                                <>
                                  <td className="py-2 px-4 text-left">
                                    {lab.labName}
                                  </td>
                                  <td
                                    className={`w-20 inline-block my-3 py-2 text-center text-white rounded text-sm ${
                                      lab.status === "Changed"
                                        ? "bg-yellow-300"
                                        : "bg-green-500"
                                    }`}
                                  >
                                    {handleStatusTranslate(lab.status)}
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

                {/* Nhập mô tả */}
                <div>
                  <p className="font-bold mb-2">Nhập mô tả</p>
                  <textarea
                    placeholder="Mô tả..."
                    className={`w-full h-32 resize-none focus:outline-none p-2 border ${
                      errors.description ? "border-red-500" : "border-black"
                    } rounded-lg`}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.description}
                    </p>
                  )}
                </div>
                <div className="flex justify-end mt-4 gap-4">
                  <button
                    type="submit"
                    className="bg-black text-white px-6 py-2 rounded-lg"
                  >
                    Xác Nhận
                  </button>
                  <NavLink to="/admin">
                    <button
                      type="button"
                      className="bg-white text-black px-6 py-2 rounded-lg border border-black"
                    >
                      Hủy
                    </button>
                  </NavLink>
                </div>
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

export default AddProduct;
