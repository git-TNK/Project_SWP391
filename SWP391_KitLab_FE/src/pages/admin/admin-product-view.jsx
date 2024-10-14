import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import AdminHeader from "./admin-header";
import Sidebar from "./sidebar";
import Footer from "../../Footer";
import axios from "axios";
import AdminNotFound from "./admin-not-found-page";

function AdminViewProduct() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await axios.get(`http://localhost:5056/Product/${id}`);
        setProduct(response.data);
        console.log(response.data);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "changed":
        return "bg-yellow-500";
      case "deleted":
        return "bg-red-500";
      default:
        return "bg-green-500";
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader />
      <hr className="w-full h-px border-0 bg-[#0a0a0a]" />
      <div className="flex-grow flex overflow-hidden">
        <div className="flex flex-grow bg-gray-100 overflow-hidden">
          <Sidebar />

          {/* Main content */}
          <div className="flex-1 p-8 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Chi tiết sản phẩm</h1>
            </div>
            {loading ? (
              <p>Loading...</p>
            ) : product ? (
              <div className="bg-white shadow-lg rounded-lg overflow-hidden flex">
                <div className="w-1/2">
                  <img
                    src={product.picture}
                    alt={product.name}
                    className="object-fill w-full h-full"
                  />
                </div>
                <div className="w-2/3 p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">{product.name}</h2>
                    <span
                      className={`${getStatusColor(
                        product.status
                      )} text-white px-3 py-1 rounded text-sm`}
                    >
                      {product.status}
                    </span>
                  </div>
                  <h3 className="font-semibold mb-2">Hãng:</h3>
                  <p className="text-gray-600 mb-2">{product.brand}</p>
                  <h3 className="font-semibold mb-2">Mô tả:</h3>
                  <p className="text-gray-700 mb-4">{product.description}</p>
                  <h3 className="font-semibold mb-2">Giá:</h3>
                  <p className="text-2xl font-bold text-indigo-600 mb-4">
                    {product.price.toLocaleString()} VND
                  </p>
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">
                      Số lượng: {product.quantity}
                    </p>
                    <p className="mt-5 text-sm text-gray-600">
                      Ngày tạo: {product.dateOfCreation}
                    </p>
                    <p className="text-sm text-gray-600">
                      Ngày sửa: {product.dateOfChange}
                    </p>
                    <p className="text-sm text-gray-600">
                      Ngày xóa: {product.dateOfDeletion}
                    </p>
                  </div>
                  {product.typeNames && (
                    <div className="mb-4">
                      <h3 className="font-semibold mb-2">Loại:</h3>
                      <div className="flex flex-wrap gap-2">
                        {product.typeNames.map((type, index) => (
                          <span
                            key={index}
                            className="bg-gray-200 px-2 py-1 rounded text-sm"
                          >
                            {type}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {product.labNames && (
                    <div>
                      <h3 className="font-semibold mb-2">Lab kèm theo:</h3>
                      {product.labNames && product.labNames.length > 0 ? (
                        <ul className="list-disc list-inside text-sm text-gray-700">
                          {product.labNames.map((lab, index) => (
                            <li key={index}>{lab}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-gray-600">
                          Không có lab hợp với kit.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <AdminNotFound />
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default AdminViewProduct;
