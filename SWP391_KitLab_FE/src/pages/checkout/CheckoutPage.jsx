import React, { useEffect, useState } from "react";
import Footer from "../../Footer";
import Header from "../Header";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Notification from "../admin/notification";

function CheckoutPage() {
  const [cart, setCart] = useState([]);
  const [account, setAccount] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false); // Track form submission
  const navigate = useNavigate();
  const shippingFee = 30000; // Example shipping fee
  const [notification, setNotification] = useState(null);

  const [formData, setFormData] = useState({
    email: "",
    name: "",
    phone: "",
    address: "",
    city: "",
    district: "",
    notes: "",
    totalCart: "",
  });

  const [errors, setErrors] = useState({});

  // Store buyer's data in session storage
  useEffect(() => {
    sessionStorage.setItem("dataBuyer", JSON.stringify(formData));
  }, [formData]);

  // Calculate subtotal
  const calculateTotalCart = (cartItems) =>
    cartItems.reduce(
      (total, product) => total + product.price * product.quantity,
      0
    );

  // Retrieve cart data and calculate totals
  useEffect(() => {
    const cartData = sessionStorage.getItem("cart");
    const parsedCart = cartData ? JSON.parse(cartData) : [];
    setCart(parsedCart);

    const subtotal = calculateTotalCart(parsedCart);
    setFormData((prevData) => ({
      ...prevData,
      totalCart: subtotal,
    }));
  }, []);

  // Retrieve account details from localStorage
  useEffect(() => {
    const savedAccount = JSON.parse(localStorage.getItem("account"));
    if (savedAccount) {
      setAccount(savedAccount);
      setFormData((prevData) => ({
        ...prevData,
        email: savedAccount.email || "",
        name: savedAccount.fullName || "",
        phone: savedAccount.phoneNumber || "",
        address: savedAccount.address || "",
        city: savedAccount.city || "",
        district: savedAccount.district || "",
        notes: savedAccount.notes || "",
      }));
    } else {
      navigate("*");
    }
  }, [navigate]);

  // Ensure only 'Customer' role users can access the page
  useEffect(() => {
    if (account && account.role !== "Customer") {
      navigate("*");
    }
  }, [account, navigate]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Validate form input
  const validateForm = () => {
    const newErrors = {};
    if (!formData.phone) newErrors.phone = "Số điện thoại là bắt buộc.";
    if (!formData.address) newErrors.address = "Địa chỉ là bắt buộc.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      console.log("Submitting order:", formData);
      setFormSubmitted(true);
      setNotification({ message: "Xác nhận thành công", type: "success" }); // Mark form as submitted
    }
  };

  const closeNotification = () => {
    setNotification(null);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-gray-100">
        <div className="flex flex-col md:flex-row gap-8 p-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center flex-1 text-center">
              <h2 className="text-xl font-bold mb-4">Giỏ hàng trống</h2>
              <NavLink to="/" className="bg-black text-white px-4 py-2 rounded">
                TIẾP TỤC MUA HÀNG
              </NavLink>
            </div>
          ) : (
            <>
              <div className="flex-1">
                <h2 className="text-xl font-bold mb-4">Thông tin nhận hàng</h2>
                <form className="space-y-4" onSubmit={handleSubmit}>
                  {/* Input fields */}
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="w-full p-2 border rounded"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                  <input
                    type="text"
                    name="name"
                    placeholder="Họ và tên"
                    className="w-full p-2 border rounded"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                  <input
                    type="text"
                    name="phone"
                    placeholder="Số điện thoại"
                    className={`w-full p-2 border rounded ${
                      errors.phone ? "border-red-500" : ""
                    }`}
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm">{errors.phone}</p>
                  )}
                  <input
                    type="text"
                    name="address"
                    placeholder="Địa chỉ"
                    className={`w-full p-2 border rounded ${
                      errors.address ? "border-red-500" : ""
                    }`}
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm">{errors.address}</p>
                  )}
                  <textarea
                    type="text"
                    name="notes"
                    placeholder="Ghi chú (Bắt buộc) nếu không thì ghi `không`"
                    className="w-full p-2 border rounded"
                    rows="3"
                    value={formData.notes}
                    onChange={handleInputChange}
                    required
                  />
                  <div className="font-bold">
                    Tạm Tính: {formData.totalCart.toLocaleString()}₫
                  </div>
                  <div className="font-bold">
                    Phí Vận Chuyển: {shippingFee.toLocaleString()}₫
                  </div>
                  <div className="font-bold">
                    Tổng Cộng:{" "}
                    {(formData.totalCart + shippingFee).toLocaleString()}₫
                  </div>
                  <button
                    type="submit"
                    className="bg-black text-white px-4 py-2 rounded"
                  >
                    Xác nhận thông tin
                  </button>
                </form>
              </div>

              {/* Cart Summary */}
              <div className="flex-1 space-y-8">
                <h2 className="text-xl font-bold mb-4">Đơn Hàng</h2>
                <div className="bg-white p-4 rounded border">
                  {cart.map((productCart, index) => (
                    <div className="flex items-center mb-4" key={index}>
                      <img
                        src={productCart.picture}
                        className="w-12 h-12 bg-gray-200 rounded mr-4"
                        alt={productCart.name}
                      />
                      <div>
                        <p className="font-bold">{productCart.name}</p>
                        <p>{productCart.price.toLocaleString()}₫</p>
                      </div>
                      <div className="ml-auto bg-black text-white rounded-md w-6 h-6 flex items-center justify-center">
                        {productCart.quantity}
                      </div>
                    </div>
                  ))}
                  <div className="mt-8 space-y-6 text-center">
                    <h2 className="text-xl text-gray-850">
                      Số lượt hỏi của bạn sẽ bằng{" "}
                      <span className="text-blue-600">
                        số lượng sản phẩm × 2
                      </span>
                    </h2>

                    <Link to="/banking">
                      <button
                        className={`w-full sm:w-auto bg-black hover:bg-gray-800 text-white font-medium px-6 py-3 rounded-lg 
      transition-colors duration-300 ${
        !formSubmitted ? "opacity-50 cursor-not-allowed" : ""
      }`}
                        disabled={!formSubmitted}
                      >
                        Thanh toán
                      </button>
                    </Link>

                    <NavLink
                      to="/"
                      className="block mt-4 text-blue-500 hover:text-blue-700 transition-colors duration-300"
                    >
                      Quay về trang chủ
                    </NavLink>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />

      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={closeNotification}
        />
      )}
    </div>
  );
}

export default CheckoutPage;
