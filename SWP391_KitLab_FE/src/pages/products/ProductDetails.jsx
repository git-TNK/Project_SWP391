import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../Header";
import Footer from "../../Footer";
import Notification from "../admin/notification"; // Bình thêm
import Modal from "./Modal-description";

function ProductDetails() {
  const { id } = useParams(); // Get the product ID from the URL params
  const [product, setProduct] = useState(null);

  // Bình thêm
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
        const response = await fetch(`http://localhost:5056/product/${id}`);
        const data = await response.json();
        setProduct(data);
        setLabList(data.labs);
      } catch (err) {
        console.error(err);
      }
    }

    fetchProductDetails();
  }, [id]);

  const filteredLabs = useMemo(() => {
    return labList.filter((lab) => lab.status != "Deleted");
  }, [labList]);

  // Placeholder action for "Mua hàng" button
  const handleBuyNow = () => {
    const cart = sessionStorage.getItem("cart")
      ? JSON.parse(sessionStorage.getItem("cart"))
      : [];

    // Check if the product is already in the cart
    const existingProduct = cart.find((item) => item.kitId === product.kitId);

    if (existingProduct) {
      // Check if we can increase the quantity without exceeding available stock
      if (product.quantity > existingProduct.quantity) {
        existingProduct.quantity += 1; // Increment quantity
        setNotification({
          message: `Đã thêm sản phẩm vào giỏ hàng!`,
          type: "success",
        });
      } else {
        setNotification({
          message: `Bạn đã chọn quá số lượng tồn kho`,
          type: "error",
        });
      }
    } else {
      // If not already in the cart, check stock before adding
      if (product.quantity > 0) {
        cart.push({ ...product, quantity: 1 }); // Add new product to cart
        setNotification({
          message: `Đã thêm sản phẩm vào giỏ hàng!`,
          type: "success",
        });
      } else {
        setNotification({
          message: `Sản phẩm hiện tại không còn hàng trong kho`,
          type: "error",
        });
      }
    }

    // Update the cart in sessionStorage
    sessionStorage.setItem("cart", JSON.stringify(cart));
  };

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
        <div className="flex lg:flex-row gap-8">
          <div
            className="w-1/2 h-[400px] flex-shrink-0 top-8"
            // style={{ position: "sticky", alignSelf: "flex-start" }}
          >
            <img
              className="w-full h-full object-contain rounded-lg shadow-md"
              src={product.picture}
              alt={product.name}
            />
          </div>

          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            <p className="text-red-600 font-bold text-2xl mb-4">
              {product.price.toLocaleString()} đ
            </p>

            <div className="mb-4">
              <span className="font-semibold">Hãng: </span>
              <span className="mb-6">{product.brand}</span>
            </div>

            <div className="mb-4">
              <span className="font-semibold">Mô tả: </span>
              <p className="mb-6">{product.description}</p>
            </div>
            <div className="mb-4">
              <span className="font-semibold">Số lượng còn lại: </span>
              <span className="text-gray-800">{product.quantity}</span>
            </div>

            <div className="mb-4">
              <p className="font-semibold mb-2">Nhóm sản phẩm: </p>
              <div className="flex flex-wrap gap-2">
                {product.typeNames.map((type, index) => (
                  <span
                    key={index}
                    className="inline-block bg-black text-white rounded-lg px-3 py-1 text-sm font-semibold min-w-[80px] text-center"
                  >
                    {type}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <span className="font-semibold">Danh sách Labs: </span>
              {filteredLabs.length > 0 ? (
                <ul className="list-none pl-0">
                  {filteredLabs
                    // .filter((lab) => lab.status !== "Deleted") // Lọc các lab có trạng thái khác "Deleted"
                    .map((lab, index) => (
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
                <p className="text-gray-800">Không có lab nào được liên kết</p>
              )}
            </div>

            <button
              onClick={handleBuyNow}
              className="mt-6 w-full bg-black text-white py-2 px-6 rounded hover:bg-gray-900 transition duration-300 font-bold"
            >
              THÊM VÀO GIỎ HÀNG
            </button>
          </div>

          {notification && (
            <Notification
              message={notification.message}
              type={notification.type}
              onClose={closeNotification}
            />
          )}

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
