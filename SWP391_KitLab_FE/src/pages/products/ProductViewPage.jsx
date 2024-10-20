import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import Link from react-router-dom
import axios from "axios";
import Header from "../Header";
import Footer from "../../Footer";
import FilterType from "../admin/filter";
import LoadingSpinner from "../admin/loading";

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

function ProductViewPage() {
  const [listProduct, setListProduct] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;
  const [isLoading, setIsLoading] = useState(false);

  //filter
  const [selectedTypes, setSelectedTypes] = useState([]);

  const [account, setAccount] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedAccount = JSON.parse(localStorage.getItem("account"));
    if (savedAccount) {
      setAccount(savedAccount);
    }
  }, []);

  useEffect(() => {
    if (account && account.role !== "Customer") {
      navigate("*"); // Redirect if the user is not a Customer
    }
  }, [account, navigate]);

  // Fetch products from the API
  async function fetchProduct() {
    setIsLoading(true);
    try {
      const response = await axios.get(`http://localhost:5056/product`);
      const filteredProducts = response.data.filter(
        (item) => item.status !== "Deleted"
      );
      setListProduct(filteredProducts);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchProduct();
  }, []);

  const handleBrandClick = (brand) => {
    setSelectedBrand(brand);
    setCurrentPage(1);
  };

  const handleFilterChange = (newSelectedTypes) => {
    setSelectedTypes(newSelectedTypes);
    setCurrentPage(1);
  };

  const filteredProducts = useMemo(() => {
    return listProduct.filter((product) => {
      const brandMatch =
        selectedBrand === "All" || product.brand === selectedBrand;
      const typeMatch =
        selectedTypes.length === 0 ||
        selectedTypes.every(
          (type) => product.typeNames && product.typeNames.includes(type)
        );
      return brandMatch && typeMatch;
    });
  }, [listProduct, selectedBrand, selectedTypes]);

  // const filteredProducts =
  // selectedBrand === "All"
  //   ? listProduct
  //   : listProduct.filter((item) => item.brand === selectedBrand);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Get unique brands and add "All" option
  const brands = ["All", ...new Set(listProduct.map((item) => item.brand))];

  return (
    <>
      <Header />
      <div className="flex p-4">
        <aside className="w-64 p-4 bg-white shadow-lg rounded-lg mr-6">
          <p className="w-full bg-black text-white p-3 mb-4 hover:bg-gray-800 transition-colors duration-200 text-center font-bold rounded-lg">
            Danh mục sản phẩm
          </p>
          <ul className="space-y-2">
            {brands.map((brand, index) => (
              <li
                key={index}
                className={`cursor-pointer hover:bg-black hover:text-white p-3 rounded-lg transition-colors duration-500 font-medium border border-gray-200 ${
                  brand === selectedBrand ? "bg-black text-white" : ""
                }`}
                onClick={() => handleBrandClick(brand)}
              >
                {brand}
              </li>
            ))}
          </ul>
        </aside>

        <div className="flex-1">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Sản phẩm</h2>
            <div className="flex items-center">
              <FilterType
                options={typeOptions}
                onFilterChange={handleFilterChange}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {currentProducts.map((item, index) => (
              <div
                key={index}
                className="border border-gray-300 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <Link to={`/product/${item.kitId}`}>
                  <div className="flex flex-col h-full">
                    <img
                      className="w-full h-full object-contain"
                      src={item.picture}
                      alt={item.name}
                    />
                    <div className="p-4 flex flex-col flex-grow">
                      <p className="text-lg font-semibold mb-2">{item.name}</p>
                      <p className="text-red-600 font-bold mb-4">
                        {item.price.toLocaleString()} VND
                      </p>
                      <button className="mt-auto w-full bg-gray-200 text-black py-2 px-4 rounded hover:bg-black hover:text-white transition duration-300 font-medium">
                        MUA HÀNG
                      </button>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

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
        </div>
      </div>
      <Footer />
      {isLoading && <LoadingSpinner />}
    </>
  );
}

export default ProductViewPage;
