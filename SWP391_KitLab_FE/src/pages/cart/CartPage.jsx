import React, { useEffect, useState } from "react";
import Header from "../Header";
import Footer from "../../Footer";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";

// Bình thêm
import Notification from "../admin/notification";
import { CircleX } from "lucide-react";

function CartPage() {
  const [account, setAccount] = useState(null);
  const navigate = useNavigate();

  const [notification, setNotification] = useState(null);
  const [listProductsInCart, setListProductsInCart] = useState([]);
  const [listProduct, setListProduct] = useState([]);

  useEffect(() => {
    const savedAccount = JSON.parse(localStorage.getItem("account"));
    if (savedAccount) {
      setAccount(savedAccount);
    }
  }, []);

  useEffect(() => {
    if (account && account.role !== "Customer") {
      navigate("*");
    }
  }, [account, navigate]);

  async function fetchProduct() {
    try {
      const response = await axios.get(`http://localhost:5056/product`);
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

  useEffect(() => {
    const cart = sessionStorage.getItem("cart")
      ? JSON.parse(sessionStorage.getItem("cart"))
      : [];
    setListProductsInCart(cart);
  }, []);

  const handleQuantityChange = (productId, change) => {
    const productInDb = listProduct.find((item) => item.kitId === productId);

    setListProductsInCart((prevCart) => {
      const updatedCart = prevCart.map((productCart) => {
        if (productCart.kitId === productId) {
          const newQuantity = productCart.quantity + change;

          if (newQuantity > productInDb.quantity) {
            setNotification({
              message: "Vượt quá hàng tồn kho!",
              type: "error",
            });
            return productCart;
          }
          return { ...productCart, quantity: Math.max(1, newQuantity) };
        }
        return productCart;
      });

      sessionStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  const closeNotification = () => {
    setNotification(null);
  };

  const handleRemoveProduct = (productId) => {
    setListProductsInCart((prevCart) => {
      const updatedCart = prevCart.filter(
        (productCart) => productCart.kitId !== productId
      );

      sessionStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  const handleCheckout = () => {
    if (!account) {
      alert("Đăng nhập để thanh toán");
      navigate("/login");
    } else {
      navigate("/checkout");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-gray-100 py-6">
        <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg">
          <h1 className="text-2xl font-bold mb-4 text-center p-4">Giỏ Hàng</h1>
          <div className="overflow-x-auto">
            <table className="w-full mb-4">
              <thead>
                <tr className="bg-gray-800 text-white">
                  <th className="p-3 text-left">XÓA</th>
                  <th className="p-3 text-left">ẢNH SẢN PHẨM</th>
                  <th className="p-3 text-left">TÊN SẢN PHẨM</th>
                  <th className="p-3 text-right">GIÁ</th>
                  <th className="p-3 text-center">SỐ LƯỢNG</th>
                  <th className="p-3 text-right">THÀNH TIỀN</th>
                </tr>
              </thead>
              <tbody>
                {listProductsInCart.length > 0 ? (
                  listProductsInCart.map((productCart, index) => (
                    <tr className="border-b" key={index}>
                      <td className="p-2 text-center">
                        <button
                          className="text-gray-500 hover:text-red-500 transition duration-300"
                          onClick={() => handleRemoveProduct(productCart.kitId)}
                        >
                          <CircleX />
                        </button>
                      </td>
                      <td className="p-2">
                        <img
                          src={productCart.picture || "/api/placeholder/50/50"}
                          alt={productCart.name}
                          className="w-12 h-12 object-contain"
                        />
                      </td>
                      <td className="p-2">{productCart.name}</td>
                      <td className="p-2 text-right">
                        {productCart.price.toLocaleString()}đ
                      </td>
                      <td className="p-2">
                        <div className="flex items-center justify-center">
                          <button
                            className="bg-gray-200 px-2 py-1 hover:bg-gray-300 transition duration-200"
                            onClick={() =>
                              handleQuantityChange(productCart.kitId, -1)
                            }
                          >
                            -
                          </button>
                          <input
                            type="number"
                            value={productCart.quantity}
                            className="w-12 text-center mx-1 border"
                            readOnly
                          />
                          <button
                            className="bg-gray-200 px-2 py-1 hover:bg-gray-300 transition duration-200"
                            onClick={() =>
                              handleQuantityChange(productCart.kitId, 1)
                            }
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="p-2 text-right">
                        {(
                          productCart.price * productCart.quantity
                        ).toLocaleString()}
                        đ
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="p-4 text-center text-red-500">
                      Giỏ hàng còn trống
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="p-4">
            <div className="flex flex-col md:flex-row justify-between items-center mb-4">
              <button className="bg-black text-white px-4 py-2 mb-2 md:mb-0">
                <NavLink to="/">TIẾP TỤC MUA HÀNG</NavLink>
              </button>
              <div className="text-right">
                <p className="text-sm text-gray-600">
                  Tiền vận chuyển: Tính khi thanh toán
                </p>
                <p className="font-bold text-lg">
                  TỔNG TIỀN THANH TOÁN:{" "}
                  {listProductsInCart
                    .reduce(
                      (total, productCart) =>
                        total + productCart.price * productCart.quantity,
                      0
                    )
                    .toLocaleString()}
                  đ
                </p>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full bg-black text-white py-2 text-lg font-bold"
            >
              THANH TOÁN NGAY
            </button>
          </div>
        </div>
      </main>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={closeNotification}
        />
      )}
      <Footer />
    </div>
  );
}

export default CartPage;
