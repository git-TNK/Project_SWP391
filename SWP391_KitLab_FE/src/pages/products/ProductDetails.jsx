import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Header from "../Header";
import Footer from "../../Footer";
import Cookies from "js-cookie"; // npm install js-cookie

//Bình thêm
import Notification from "../admin/notification";
import Modal from "./Modal-description";

function ProductDetails() {
  const { id } = useParams(); // Get the product ID from the URL params
  const [product, setProduct] = useState(null);

  //Bình thêm
  const [notification, setNotification] = useState(null);
  const [selectedLab, setSelectedLab] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [account, setAccount] = useState(null);
  const [labList, setLabList] = useState([]);
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

  // Fetch product details from the API
  useEffect(() => {
    async function fetchProductDetails() {
      try {
        const response = await axios.get(`http://localhost:5056/product/${id}`);
        setProduct(response.data);
        setLabList(response.data.labs);
      } catch (err) {
        console.log(err);
      }
    }

    fetchProductDetails();
  }, [id]);

  // Placeholder action for "Mua hàng" button
  const handleBuyNow = () => {
    const cart = Cookies.get("cart") ? JSON.parse(Cookies.get("cart")) : [];

    // Check if product is already in the cart
    const existingProduct = cart.find((item) => item.kitId === product.kitId);

    if (existingProduct) {
      // Check if we can increase the quantity without exceeding available stock
      if (product.quantity > existingProduct.quantity) {
        existingProduct.quantity += 1; // Increment quantity
        //Bình sửa
        // alert(`Đã thêm sản phẩm ${product.name} vào giỏ hàng!`);
        setNotification({
          message: `Đã thêm sản phẩm vào giỏ hàng!`,
          type: "success",
        });
      } else {
        //Bình sửa
        // alert("Bạn đã chọn quá số lượng tồn kho");
        setNotification({
          message: `Bạn đã chọn quá số lượng tồn kho`,
          type: "err",
        });
      }
    } else {
      // If not already in the cart, check stock before adding
      if (product.quantity > 0) {
        cart.push({ ...product, quantity: 1 }); // Add new product to cart
        //Bình sửa
        // alert(`Đã thêm sản phẩm ${product.name} vào giỏ hàng!`);
        setNotification({
          message: `Đã thêm sản phẩm vào giỏ hàng!`,
          type: "success",
        });
      } else {
        //Bình sửa
        // alert("Sản phẩm hiện tại không còn hàng trong kho");
        setNotification({
          message: `Bạn đã chọn quá số lượng tồn kho`,
          type: "err",
        });
      }
    }

    // Update the cart in cookies
    Cookies.set("cart", JSON.stringify(cart), { expires: 2 }); // Cart expires in 2 days
  };

  //Bình thêm
  const closeNotification = () => {
    setNotification(null);
  };

  const openLabModal = (lab) => {
    setSelectedLab(lab);
    setIsModalOpen(true);
  };

  const closeLabModal = () => {
    setIsModalOpen(false);
  };

  if (!product) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Horizontal Layout Container */}
        <div className="flex lg:flex-row gap-8">
          {/* Product Image Fixed on the Left */}
          <div
            className="w-1/2 h-[400px] flex-shrink-0 sticky top-8"
            style={{ position: "sticky", alignSelf: "flex-start" }}
          >
            <img
              className="w-full h-full object-contain rounded-lg shadow-md"
              src={product.picture}
              alt={product.name}
            />
          </div>

          {/* Product Information */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            <p className="text-red-600 font-bold text-2xl mb-4">
              {product.price.toLocaleString()} VND
            </p>
            <p className="mb-6">{product.description}</p>

            {/* Quantity */}
            <div className="mb-4">
              <span className="font-semibold">Số lượng còn lại: </span>
              <span className="text-gray-800">{product.quantity}</span>
            </div>

            {/* Product Types */}
            <div className="mb-4">
              <span className="font-semibold">Nhóm sản phẩm: </span>
              <ul className="list-disc list-inside">
                {product.typeNames.map((type, index) => (
                  <li key={index} className="text-gray-800">
                    {type}
                  </li>
                ))}
              </ul>
            </div>

            {/* Labs */}
            <div className="mb-4">
              <span className="font-semibold">Danh sách Labs: </span>
              {labList.length > 0 ? (
                <ul className="list-none pl-0">
                  {labList.map((lab, index) => (
                    <li key={index} className="flex items-start mb-2">
                      <span className="text-2xl mr-2 leading-none">•</span>
                      <button
                        onClick={() => openLabModal(lab)}
                        className="text-left hover:bg-gray-100 px-2 py-1 rounded text-gray-800"
                      >
                        {lab.name}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <span className="text-gray-800">
                  Không có lab nào được liên kết
                </span>
              )}
            </div>

            {/* Buy Now Button */}
            <button
              onClick={handleBuyNow}
              className="mt-6 w-full bg-black text-white py-2 px-6 rounded hover:bg-gray-900 transition duration-300 font-bold"
            >
              THÊM VÀO GIỎ HÀNG
            </button>
          </div>
          {/* Bình thêm */}
          {notification && (
            <Notification
              message={notification.message}
              type={notification.type}
              onClose={closeNotification}
            />
          )}

          {/* Modal */}
          <Modal
            isOpen={isModalOpen}
            onClose={closeLabModal}
            lab={selectedLab}
          />
        </div>
      </div>
      <Footer />
    </>
  );
}

export default ProductDetails;
