import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import AdminHeader from "./admin-header";
import Sidebar from "./sidebar";
import Footer from "../../Footer";
import axios from "axios";

function AdminViewProduct() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams(); // This will get the id from the URL

  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await axios.get(`http://localhost:5056/Product/${id}`);
        setProduct(response.data);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

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
              <div className="bg-white shadow-lg rounded-lg p-6">
                <img
                  src={product.picture}
                  alt={product.name}
                  className="w-full h-64 object-contain mb-4"
                />
                <h2 className="text-xl font-bold mb-2">{product.name}</h2>
                <p className="text-gray-600 mb-4">{product.description}</p>
                <p className="text-lg font-semibold">
                  {product.price.toLocaleString()} VND
                </p>
                {/* Add more product details as needed */}
              </div>
            ) : (
              <p>Product not found</p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default AdminViewProduct;
