import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom"; // Import useLocation
import Header from "../Header";
import Footer from "../../Footer";
import axios from "axios";

function HomePage() {
  const [listProduct, setListProduct] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  const [account, setAccount] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const savedAccount = JSON.parse(localStorage.getItem("account"));
    if (savedAccount) {
      setAccount(savedAccount);
    }
    if (savedAccount && savedAccount.role != "Customer") {
      navigate("*");
    }
  }, [navigate]);

  const location = useLocation(); // Access the location object to get the search state

  // Extract the search term from the location state (if it exists)
  const searchTerm = location.state?.search || "";

  // Fetch products from the API
  async function fetchProduct() {
    try {
      const response = await axios.get(`http://localhost:5056/product`);
      // Filter out products with status 'Deleted'
      const filteredProducts = response.data.filter(
        (item) => item.status !== "Deleted"
      );
      setListProduct(filteredProducts);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    fetchProduct();
  }, []);

  // Filter products based on search term, excluding "Deleted" products
  const filteredProducts = listProduct.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Check if searchTerm is empty or not
  const newProducts = searchTerm
    ? filteredProducts // If there is a search term, show filtered products
    : listProduct.filter((item) => item.status === "New"); // Otherwise, show products with status "New"

  // Calculate total pages
  const totalPages = Math.ceil(newProducts.length / productsPerPage);

  // Get products for the current page
  const currentProducts = newProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <section>
          <h2 className="text-2xl font-bold mb-6">
            {searchTerm ? "Kết Quả Tìm Kiếm" : "Sản Phẩm Mới"}
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {currentProducts.map((item, index) => (
              <li
                key={index}
                className="border border-gray-200 rounded-lg overflow-hidden shadow-md"
              >
                <Link to={`/product/${item.kitId}`}>
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
                      <button className="mt-auto w-full bg-white text-black py-2 px-4 rounded hover:bg-black hover:text-white transition duration-300 font-medium">
                        MUA HÀNG
                      </button>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          {/* Pagination controls */}
          <div className="mt-8 flex justify-center space-x-2">
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
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default HomePage;
