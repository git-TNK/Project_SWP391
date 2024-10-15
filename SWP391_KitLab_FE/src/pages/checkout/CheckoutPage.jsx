import React, { useEffect, useState } from "react";
import Footer from "../../Footer";
import Header from "../Header";
import Cookies from "js-cookie";
import { Link, NavLink, useNavigate } from "react-router-dom";
import axios from "axios";

function CheckoutPage() {
  const cart = Cookies.get("cart") ? JSON.parse(Cookies.get("cart")) : [];
  const [listProvince, setListProvince] = useState([]);
  const [account, setAccount] = useState(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    name: "",
    phone: "",
    address: "",
    city: "",
    district: "",
    notes: "",
  });

  useEffect(() => {
    const savedAccount = JSON.parse(localStorage.getItem("account"));
    if (savedAccount) {
      setAccount(savedAccount);
      setFormData({
        email: savedAccount.email || "",
        name: savedAccount.fullName || "",
        phone: savedAccount.phoneNumber || "",
        address: savedAccount.address || "",
        city: savedAccount.city || "",
        district: savedAccount.district || "",
        notes: savedAccount.notes || "",
      });
    } else {
      navigate("*");
    }
  }, [navigate]);

  useEffect(() => {
    if (account && account.role !== "Customer") {
      navigate("*"); // Redirect if the user is not a Customer
    }
  }, [account, navigate]);

  const fetchProvince = async () => {
    try {
      const response = await axios.get(
        `https://provinces.open-api.vn/api/?depth=2`
      );
      setListProvince(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProvince();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add submission logic here
    console.log("Submitting order:", formData);
    // For example, navigate to a confirmation page or handle payment processing
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
                    className="w-full p-2 border rounded"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                  <input
                    type="text"
                    name="address"
                    placeholder="Địa chỉ"
                    className="w-full p-2 border rounded"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  />
                  <select
                    name="city"
                    className="flex-1 p-2 border rounded"
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Chọn tỉnh/thành phố</option>
                    {listProvince.map((province) => (
                      <option key={province.code} value={province.name}>
                        {province.name}
                      </option>
                    ))}
                  </select>
                  <textarea
                    name="notes"
                    placeholder="Ghi chú (tùy chọn)"
                    className="w-full p-2 border rounded"
                    rows="3"
                    value={formData.notes}
                    onChange={handleInputChange}
                  />
                  <button
                    type="submit"
                    className="bg-black text-white px-4 py-2 rounded"
                  >
                    Xác nhận thông tin
                  </button>
                </form>
              </div>
              {/* Order Summary */}
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
                        <p>{productCart.price}₫</p>
                      </div>
                      <div className="ml-auto bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                        {productCart.quantity}
                      </div>
                    </div>
                  ))}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Tạm tính</span>
                      <span>
                        {cart.reduce(
                          (total, product) =>
                            total + product.price * product.quantity,
                          0
                        )}
                        ₫
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Phí vận chuyển</span>
                      <span>Miễn phí</span>
                    </div>
                    <div className="flex justify-between font-bold">
                      <span>Tổng cộng</span>
                      <span>
                        {cart.reduce(
                          (total, product) =>
                            total + product.price * product.quantity,
                          0
                        )}
                        ₫
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <Link to="/cart" className="text-blue-500">
                      ‹ Quay về giỏ hàng
                    </Link>
                  </div>
                  <div className="ml-auto">
                    {" "}
                    {/* Added this div */}
                    <Link to="/banking">
                      <button className="bg-black text-white px-4 py-2 rounded">
                        Thanh toán
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default CheckoutPage;
