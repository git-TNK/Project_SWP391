import React, { useEffect, useState } from "react";
import Footer from "../../Footer";
import AdminHeader from "./admin-header";
import { PlusCircle, ShoppingCart, Trash2, Wrench } from "lucide-react";
import "../../tailwindstyle.css";
import axios from "axios";
import Sidebar from "./sidebar";
import PropTypes from "prop-types";

const AdminProduct = () => {
  const [listProduct, setListProduct] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  async function fetchProduct() {
    try {
      const response = await axios.get("http://localhost:5056/Product");
      setListProduct(response.data);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    fetchProduct();
  }, []);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = listProduct.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const ProductItem = ({ item }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className={`w-full h-full object-contain transition-transform duration-300 ease-out ${
            isHovered ? "scale-110" : "scale-95"
          }`}
        >
          <div className="bg-white p-4 rounded-md shadow flex flex-col h-[300px] relative overflow-hidden">
            <div className="h-[200px] overflow-hidden rounded-md mb-2">
              <img
                className="object-contain h-48 w-96"
                src={item.picture}
                alt={item.name}
              />
            </div>
            <h3 className="text-lg font-semibold truncate">{item.name}</h3>
            <p className="text-gray-600 mt-auto">
              {item.price.toLocaleString()} VND
            </p>
            <div
              className={`absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center space-x-4 transition-opacity duration-300 ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
            >
              <button className="p-2 bg-white rounded-full hover:bg-gray-200 transition-colors transform hover:scale-110 duration-200">
                <Wrench className="w-6 h-6 text-gray-800" />
              </button>
              <button className="p-2 bg-white rounded-full hover:bg-gray-200 transition-colors transform hover:scale-110 duration-200">
                <Trash2 className="w-6 h-6 text-gray-800" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  ProductItem.propTypes = {
    item: PropTypes.shape({
      picture: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
    }).isRequired,
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
              <h1 className="text-2xl font-bold">Quản lý sản phẩm</h1>
              <button className="bg-black text-white px-4 py-2 rounded-md flex items-center">
                <PlusCircle size={20} className="mr-2" />
                Thêm Sản Phẩm
              </button>
            </div>

            {/* Product grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {currentProducts.map((item, index) => (
                <ProductItem key={item.kitId || index} item={item} />
              ))}
            </div>
            {/* Pagination */}
            <div className="flex justify-center mt-8">
              {[...Array(Math.ceil(listProduct.length / productsPerPage))].map(
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
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminProduct;
