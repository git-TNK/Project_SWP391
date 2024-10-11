import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import axios from "axios";
import Header from "../Header";

function ProductViewPage() {
  const [listProduct, setListProduct] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(""); // Track the selected brand
  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const productsPerPage = 8; // Limit to 8 products per page

  // Fetch products from the API
  async function fetchProduct() {
    try {
      const response = await axios.get(`http://localhost:5056/product`);
      setListProduct(response.data);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    fetchProduct();
  }, []);

  // Function to handle brand selection
  const handleBrandClick = (brand) => {
    setSelectedBrand(brand); // Update the selected brand
    setCurrentPage(1); // Reset to the first page when a brand is selected
  };

  // Filter products based on the selected brand
  const filteredProducts = selectedBrand
    ? listProduct.filter((item) => item.brand === selectedBrand)
    : listProduct;

  // Calculate the total pages based on the filtered products
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // Get the products for the current page
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <Header />
      <div className="flex p-4">
        {/* Sidebar */}
        <aside className="w-64 p-4 bg-white shadow-lg rounded-lg mr-6">
          <p className="w-full bg-black text-white p-3 mb-4 hover:bg-gray-800 transition-colors duration-200 text-center font-bold rounded-lg">
            Danh mục sản phẩm
          </p>
          <ul className="space-y-2">
            {[...new Set(listProduct.map((item) => item.brand))].map(
              (brand, index) => (
                <li
                  key={index}
                  className={`cursor-pointer hover:bg-gray-100 p-3 rounded-lg transition-colors duration-200 font-medium border border-gray-200 ${
                    brand === selectedBrand ? "bg-gray-200" : ""
                  }`}
                  onClick={() => handleBrandClick(brand)}
                >
                  {brand}
                </li>
              )
            )}
          </ul>
        </aside>

        {/* Product list */}
        <div className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {currentProducts.map((item, index) => (
              <div
                key={index}
                className="border border-gray-300 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <Link to={`/product/${item.kitId}`}>
                  {" "}
                  {/* Link to ProductDetails with kitId */}
                  <div className="flex flex-col h-full">
                    <img
                      className="w-full h-48 object-cover"
                      src={item.picture}
                      alt={item.name}
                    />
                    <div className="p-4 flex flex-col flex-grow">
                      <p className="text-lg font-semibold mb-2">{item.name}</p>
                      <p className="text-red-600 font-bold mb-4">
                        {item.price}
                      </p>
                      <button className="mt-auto w-full bg-black text-white py-2 px-4 rounded hover:bg-gray-900 transition duration-300 font-medium">
                        MUA HÀNG
                      </button>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          {/* Pagination controls */}
          <div className="mt-8 flex justify-center space-x-2">
            {/* Previous Button */}
            <button
              className={`px-4 py-2 rounded-lg border ${
                currentPage === 1
                  ? "bg-gray-300 text-gray-600"
                  : "bg-black text-white hover:bg-gray-700"
              }`}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>

            {/* Page Numbers */}
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                className={`px-4 py-2 rounded-lg border ${
                  currentPage === index + 1
                    ? "bg-black text-white"
                    : "bg-white text-black hover:bg-gray-200"
                }`}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}

            {/* Next Button */}
            <button
              className={`px-4 py-2 rounded-lg border ${
                currentPage === totalPages
                  ? "bg-gray-300 text-gray-600"
                  : "bg-black text-white hover:bg-gray-700"
              }`}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductViewPage;
