import React, { useEffect, useState, useMemo } from "react";
import Footer from "../../Footer";
import AdminHeader from "./admin-header";
import {
  Filter,
  PlusCircle,
  Wrench,
  Trash2,
  Eye,
  ChevronDown,
} from "lucide-react";
import "../../tailwindstyle.css";
import axios from "axios";
import Sidebar from "./sidebar";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import Notification from "./notification";
import LoadingSpinner from "./loading";

const AdminProduct = () => {
  const [listProduct, setListProduct] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [notification, setNotification] = useState(null);
  const [filterStatus, setFilterStatus] = useState("All");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const productsPerPage = 12;

  async function fetchProduct() {
    setIsLoading(true);
    try {
      const response = await axios.get("http://localhost:5056/Product");
      setListProduct(response.data);
      console.log(response.data);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  }

  const handleDelete = async (kitId, name) => {
    try {
      const response = await axios.delete(
        `http://localhost:5056/Product/DeleteProduct?id=${kitId}`
      );
      if (response.status === 200) {
        fetchProduct(); // Refresh the product list
        setNotification({ message: `Đã xóa ${name}`, type: "success" });
      } else {
        throw new Error("Unexpected response status");
      }
    } catch (err) {
      console.error("Error deleting product:", err);
      setNotification({
        message: "Xóa thất bại",
        type: "error",
      });
    }
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  const filteredProducts = useMemo(() => {
    return listProduct.filter((product) => {
      const nameMatch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const statusMatch =
        filterStatus === "All" || product.status === filterStatus;
      return nameMatch && statusMatch;
    });
  }, [listProduct, searchTerm, filterStatus]);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const closeNotification = () => {
    setNotification(null);
  };
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleFilterClick = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const handleFilterSelect = (status) => {
    setFilterStatus(status);
    setIsFilterOpen(false);
    setCurrentPage(1);
  };

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
              <NavLink to={`/admin/product/${item.kitId}`}>
                <button
                  className="p-2 bg-white rounded-full hover:bg-gray-200 transition-colors transform hover:scale-110 duration-200"
                  title="Xem"
                >
                  <Eye className="w-6 h-6 text-gray-800" />
                </button>
              </NavLink>

              <NavLink to={`/admin/product/${item.kitId}/update`}>
                <button
                  className="p-2 bg-white rounded-full hover:bg-gray-200 transition-colors transform hover:scale-110 duration-200"
                  title="Sửa"
                >
                  <Wrench className="w-6 h-6 text-gray-800" />
                </button>
              </NavLink>

              <button
                title="Xóa"
                onClick={() => handleDelete(item.kitId, item.name)}
                className="p-2 bg-white rounded-full hover:bg-gray-200 transition-colors transform hover:scale-110 duration-200"
              >
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
      kitId: PropTypes.string.isRequired,
      picture: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      status: PropTypes.string.isRequired,
    }).isRequired,
  };
  const handleStatusTranslate = (status) => {
    switch (status.toLowerCase()) {
      case "all":
        return "Tất cả";
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
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm"
                value={searchTerm}
                onChange={handleSearch}
                style={{ width: "600px" }}
                className="py-2 px-3 rounded-lg mr-[30px]  h-[35px] border-2 border-black text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              />

              <div className="relative z-50">
                <button
                  onClick={handleFilterClick}
                  className="bg-black text-white px-4 py-2 rounded-md flex items-center"
                >
                  <Filter size={20} className="mr-2" />
                  Lọc
                  <ChevronDown size={20} className="ml-2" />
                </button>
                {isFilterOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 overflow-hidden">
                    <div
                      className="py-1"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="options-menu"
                    >
                      {["All", "New", "Changed", "Deleted"].map((status) => (
                        <button
                          key={status}
                          onClick={() => handleFilterSelect(status)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
                          role="menuitem"
                        >
                          {handleStatusTranslate(status)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <NavLink to="/admin/addProduct">
                <button className="bg-black text-white px-4 py-2 rounded-md flex items-center">
                  <PlusCircle size={20} className="mr-2" />
                  Thêm Sản Phẩm
                </button>
              </NavLink>
            </div>

            {/* Product grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {currentProducts.map((item, index) => (
                <ProductItem key={item.kitId || index} item={item} />
              ))}
            </div>
            {/* Pagination */}
            <div className="flex justify-center mt-8">
              {[
                ...Array(Math.ceil(filteredProducts.length / productsPerPage)),
              ].map((_, index) => (
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
              ))}
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
      {isLoading && <LoadingSpinner />}
    </div>
  );
};

export default AdminProduct;
