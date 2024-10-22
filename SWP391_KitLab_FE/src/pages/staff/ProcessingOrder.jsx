import React, { useEffect, useState } from "react";
import StaffHeader from "./StaffHeader";
import StaffSlideBar from "./StaffSlideBar";
import Footer from "../../Footer";
import axios from "axios";

function ProcessingOrder() {
  const [listOrders, setListOrders] = useState([]);

  // Fetch the list of orders from the API
  async function fetchListOrders() {
    try {
      const response = await axios.get(`http://localhost:5056/Order`);
      setListOrders(response.data);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    }
  }

  // Handle status update of an order
  async function handleUpdateOrderStatus(orderId) {
    try {
      const response = await axios.put(
        `http://localhost:5056/Order/StaffUpdateOrder/${orderId}`
      );

      if (response.status === 200) {
        // If the status is updated successfully, fetch the latest list of orders
        fetchListOrders();
      }
    } catch (err) {
      console.error("Failed to update order status:", err);
    }
  }

  useEffect(() => {
    fetchListOrders();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <StaffHeader />
      <div className="flex flex-1">
        <StaffSlideBar />
        <div className="flex-1 p-10 overflow-x-auto">
          <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
            Danh Sách Đơn Hàng
          </h1>
          <div className="overflow-x-auto rounded-lg shadow-lg">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr className="bg-indigo-500 text-white">
                  <th className="border px-4 py-3 text-left">ID đơn hàng</th>
                  <th className="border px-4 py-3 text-left">Tài khoản đặt</th>
                  <th className="border px-4 py-3 text-left">Sản phẩm</th>
                  <th className="border px-4 py-3 text-left">Tổng tiền</th>
                  <th className="border px-4 py-3 text-left">Ngày đặt</th>
                  <th className="border px-4 py-3 text-left">Địa chỉ</th>
                  <th className="border px-4 py-3 text-center">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {listOrders.map((order) => (
                  <tr
                    key={order.orderId}
                    className="hover:bg-gray-100 transition-colors duration-300"
                  >
                    <td className="border px-4 py-3">{order.orderId}</td>
                    <td className="border px-4 py-3">{order.accountId}</td>
                    <td className="border px-4 py-3">
                      <button className="text-blue-600 hover:underline">
                        Bấm vào để xem chi tiết
                      </button>
                    </td>
                    <td className="border px-4 py-3">{order.price}</td>
                    <td className="border px-4 py-3">{order.orderDate}</td>
                    <td className="border px-4 py-3">{order.address}</td>
                    <td className="border px-4 py-3 text-center">
                      <button
                        className={`${
                          order.status === "Shipping"
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-green-500 hover:bg-green-600"
                        } text-white font-bold py-2 px-4 rounded-full shadow-lg transition-all duration-300`}
                        onClick={() => handleUpdateOrderStatus(order.orderId)}
                        disabled={order.status === "Shipping"}
                      >
                        {order.status === "Shipping"
                          ? "Đã Xác Nhận"
                          : "Xác Nhận"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ProcessingOrder;
