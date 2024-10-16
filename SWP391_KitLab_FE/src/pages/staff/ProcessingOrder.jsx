import React, { useEffect, useState } from "react";
import StaffHeader from "./StaffHeader";
import StaffSlideBar from "./StaffSlideBar";
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
        `http://localhost:5056/Order/UpdateOrder/${orderId}`
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

  console.log(listOrders);

  return (
    <div className="flex flex-col min-h-screen">
      <StaffHeader />
      <div className="flex flex-1">
        <StaffSlideBar />
        <div className="flex-1 p-6 overflow-x-auto">
          <h1 className="text-2xl font-bold mb-4 text-gray-800 text-center">
            Danh Sách Đơn Hàng
          </h1>
          <div className="overflow-x-auto rounded-lg shadow-md">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-4 py-2 text-left">ID đơn hàng</th>
                  <th className="border px-4 py-2 text-left">Tài khoản đặt</th>
                  <th className="border px-4 py-2 text-left">Sản phẩm</th>
                  <th className="border px-4 py-2 text-left">Tổng tiền</th>
                  <th className="border px-4 py-2 text-left">Ngày đặt</th>
                  <th className="border px-4 py-2 text-left">Địa chỉ</th>
                  <th className="border px-4 py-2 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {listOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="border px-4 py-2">{order.orderId}</td>
                    <td className="border px-4 py-2">{order.accountId}</td>
                    <td className="border px-4 py-2">
                      <button className="text-blue-500 hover:underline">
                        Bấm vào để xem chi tiết
                      </button>
                    </td>
                    <td className="border px-4 py-2">{order.price}</td>
                    <td className="border px-4 py-2">{order.orderDate}</td>
                    <td className="border px-4 py-2">{order.address}</td>
                    <td className="border px-4 py-2 text-center">
                      <button
                        className={`${
                          order.status === "Shipped"
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-green-500 hover:bg-green-600"
                        } text-white font-bold py-1 px-2 rounded`}
                        onClick={() => handleUpdateOrderStatus(order.orderId)}
                        disabled={order.status === "Shipped"}
                      >
                        {order.status === "Shipped"
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
    </div>
  );
}

export default ProcessingOrder;
