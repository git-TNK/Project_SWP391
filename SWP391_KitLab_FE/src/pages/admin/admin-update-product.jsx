import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, NavLink } from "react-router-dom";
import AdminHeader from "./admin-header";
import Sidebar from "./sidebar";
import Footer from "../../Footer";
import { Camera } from "lucide-react";
import FeedbackModal from "./feedback-modal";
import LoadingSpinner from "./loading";
import axios from "axios";

const brandOptions = ["Arduino", "Rasberry pi", "Nanode"];
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

function UpdateProduct() {
  const { kitId } = useParams();
  const navigate = useNavigate();

  const [kitName, setKitName] = useState("");
  const [brand, setBrand] = useState("");
  const [description, setDescription] = useState("");
  const [pictureUrl, setPictureUrl] = useState(""); // For existing Firebase URL
  const [newPicture, setNewPicture] = useState(null); // For newly uploaded file
  const [picturePreview, setPicturePreview] = useState(null);
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [types, setTypes] = useState([]);
  const [errors, setErrors] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchProductData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:5056/Product/${kitId}`
      );
      if (response.status === 200) {
        const productData = response.data;
        console.log("Fetched product data:", productData); // Debug log
        setKitName(productData.name);
        setBrand(productData.brand);
        setDescription(productData.description);
        setPictureUrl(productData.picture);
        setPicturePreview(productData.picture);
        setPrice(productData.price.toString());
        setQuantity(productData.quantity.toString());
        setTypes(productData.typeNames || []); // Use typeNames instead of types
        console.log("Set types:", productData.typeNames); // Debug log for types
      } else {
        throw new Error("Failed to fetch product data");
      }
    } catch (error) {
      console.error("Error fetching product data:", error);
      setModalMessage("Failed to load product data. Please try again.");
      setIsSuccess(false);
      setIsModalOpen(true);
    } finally {
      setIsLoading(false);
    }
  }, [kitId]);

  useEffect(() => {
    fetchProductData();
  }, [fetchProductData]);

  const handlePictureUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewPicture(file);
      const reader = new FileReader();
      reader.onload = (e) => setPicturePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const toggleType = (type) => {
    setTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const validateForm = () => {
    let formErrors = {};

    if (!kitName.trim()) formErrors.kitName = "Kit name is required";
    if (!brand) formErrors.brand = "Brand is required";
    if (!description.trim()) formErrors.description = "Description is required";
    if (!price || price <= 0) formErrors.price = "Valid price is required";
    if (!quantity || quantity <= 0)
      formErrors.quantity = "Valid quantity is required";
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
    formData.append("kitName", kitName);
    formData.append("brand", brand);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("quantity", quantity);
    types.forEach((type) => {
      formData.append("types", type);
    });

    if (newPicture) {
      formData.append("picture", newPicture);
    }

    try {
      const response = await axios.put(
        `http://localhost:5056/Product/${kitId}/UpdateProduct`,
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
        if (error.response.data === "Product is deleted")
          setModalMessage("Cập nhật thất bại: Sản phậm đã bị xóa");
        if (error.response.data === "Existed name")
          setModalMessage("Cập nhất thất bại: Tên đã tồn tại");
      } else {
        setModalMessage("An error occurred. Please try again.");
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
      navigate("/admin");
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
              <h1 className="text-2xl font-bold">Cập nhật sản phẩm</h1>
            </div>

            <form
              onSubmit={handleSubmit}
              className="max-w-6xl mx-auto flex gap-4"
            >
              {/* Image upload section */}
              <div className="w-1/3">
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center h-64 cursor-pointer"
                  style={{ height: "450px" }}
                  onClick={() =>
                    document.getElementById("pictureUpload").click()
                  }
                >
                  {newPicture ? (
                    <img
                      src={picturePreview}
                      alt="New product preview"
                      className="object-fill rounded-lg w-full h-full"
                    />
                  ) : (
                    <img
                      src={pictureUrl}
                      alt="No picture"
                      className="object-fill rounded-lg w-full h-full"
                    />
                  )}
                  <input
                    id="pictureUpload"
                    type="file"
                    className="hidden"
                    onChange={handlePictureUpload}
                    accept="image/*"
                  />
                </div>
              </div>

              {/* Form fields */}
              <div className="w-2/3 space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Kit name..."
                    className={`w-full p-2 border ${
                      errors.kitName ? "border-red-500" : "border-gray-300"
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
                      placeholder="Quantity"
                      className={`w-full p-2 border ${
                        errors.quantity ? "border-red-500" : "border-gray-300"
                      } rounded-lg`}
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      min="1"
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
                      placeholder="Price"
                      className={`w-full p-2 border ${
                        errors.price ? "border-red-500" : "border-gray-300"
                      } rounded-lg`}
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      min="1000"
                    />
                    {errors.price && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.price}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <p className="font-semibold mb-2">Brand</p>
                  <div className="flex gap-2">
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
                    <p className="text-red-500 text-sm mt-1">{errors.brand}</p>
                  )}
                </div>

                <div>
                  <p className="font-semibold mb-2">Types</p>
                  <div className="flex flex-wrap gap-2">
                    {typeOptions.map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => toggleType(type)}
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
                  <textarea
                    placeholder="Description..."
                    className={`w-full h-32 resize-none focus:outline-none p-2 border ${
                      errors.description ? "border-red-500" : "border-gray-300"
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
                    Cập nhật
                  </button>
                  <NavLink to="/admin">
                    <button
                      type="button"
                      className="bg-white text-black px-6 py-2 rounded-lg border border-gray-300"
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

export default UpdateProduct;
