import React, { useEffect, useState } from "react";
import Footer from "../../Footer";
import Header from "../Header";
import Cookies from "js-cookie";
import { Link, NavLink } from "react-router-dom";
import axios from "axios";

function CheckoutPage() {
  const cart = Cookies.get("cart") ? JSON.parse(Cookies.get("cart")) : [];
  const [listProvince, setListProvince] = useState([]);

  async function fetchProvince() {
    try {
      const response = await axios.get(
        `https://provinces.open-api.vn/api/?depth=2`
      );
      setListProvince(response.data);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    fetchProvince();
  }, []);

  // Use useState to manage account state if necessary, otherwise just read from localStorage directly
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
    const account = JSON.parse(localStorage.getItem("account")); // Move this inside useEffect to prevent triggering on every render
    if (account) {
      setFormData({
        email: account.email || "",
        name: account.fullName || "",
        phone: account.phone || "",
        address: account.address || "",
        city: account.city || "",
        district: account.district || "",
        notes: account.notes || "",
      });
    }
  }, []); // Only run once on component mount

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <>
      <Header />
      <div className="flex flex-col md:flex-row gap-8 p-4 bg-gray-100">
        {/* Check if cart is empty */}
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 text-center">
            <h2 className="text-xl font-bold mb-4">Giỏ hàng trống</h2>
            <NavLink to="/" className="bg-black text-white px-4 py-2 rounded">
              TIẾP TỤC MUA HÀNG
            </NavLink>
          </div>
        ) : (
          <>
            {/* Customer Information */}
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-4">Thông tin nhận hàng</h2>
              <form className="space-y-4">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="w-full p-2 border rounded"
                  value={formData.email}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="name"
                  placeholder="Họ và tên"
                  className="w-full p-2 border rounded"
                  value={formData.name}
                  onChange={handleInputChange}
                />
                <div className="flex">
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Số điện thoại"
                    className="flex-1 p-2 border rounded-r"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
                <input
                  type="text"
                  name="address"
                  placeholder="Địa chỉ"
                  className="w-full p-2 border rounded"
                  value={formData.address}
                  onChange={handleInputChange}
                />
                <div className="flex gap-4">
                  <select
                    name="city"
                    className="flex-1 p-2 border rounded"
                    onChange={handleInputChange}
                  >
                    {listProvince.map((province) => (
                      <option key={province.code} value={province.name}>
                        {province.name}
                      </option>
                    ))}
                  </select>
                </div>
                <textarea
                  name="notes"
                  placeholder="Ghi chú (tùy chọn)"
                  className="w-full p-2 border rounded"
                  rows="3"
                  value={formData.notes}
                  onChange={handleInputChange}
                ></textarea>
              </form>
            </div>

            {/* Payment and Order Summary */}
            <div className="flex-1 space-y-8">
              <div>
                <h2 className="text-xl font-bold mb-4">Thanh Toán</h2>
                <div className="flex items-center p-2 bg-white rounded border">
                  <input
                    type="radio"
                    id="bank-transfer"
                    name="payment"
                    className="mr-2"
                  />
                  <label htmlFor="bank-transfer">
                    Chuyển khoản qua ngân hàng
                  </label>
                </div>
                <div className="flex items-center p-2 bg-white rounded border">
                  <input
                    type="radio"
                    id="COD-transfer"
                    name="payment"
                    className="mr-2"
                  />
                  <label htmlFor="COD-transfer">Thanh toán khi nhận hàng</label>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold mb-4">Đơn Hàng</h2>
                <div className="bg-white p-4 rounded border">
                  {cart.map((productCart, index) => (
                    <div className="flex items-center mb-4" key={index}>
                      <img
                        src={productCart.picture}
                        className="w-12 h-12 bg-gray-200 rounded mr-4"
                      ></img>
                      <div>
                        <p className="font-bold">{productCart.name}</p>
                        <p>{productCart.price}₫</p>
                      </div>
                      <div className="ml-auto bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                        {productCart.quantity}
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center mb-4">
                    <input
                      type="text"
                      placeholder="Nhập mã giảm giá"
                      className="flex-1 p-2 border rounded-l"
                    />
                    <button className="bg-blue-500 text-white p-2 rounded-r">
                      Áp dụng
                    </button>
                  </div>
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
                    <button className="bg-black text-white px-4 py-2 rounded">
                      Thanh Toán
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      <Footer />
    </>
  );
}

export default CheckoutPage;
