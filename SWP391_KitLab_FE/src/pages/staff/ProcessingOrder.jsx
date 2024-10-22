import React, { useEffect, useState } from "react";
import StaffHeader from "./StaffHeader";
import StaffSlideBar from "./StaffSlideBar";
import Footer from "../../Footer";
import axios from "axios";
import { Link } from "react-router-dom";

function ProcessingOrder() {
  const [listOrders, setListOrders] = useState([]);
  const [listOrderDetail, setListOrderDetail] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [productDetails, setProductDetails] = useState(null);

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

  async function fetchListOrderDetail(orderId) {
    try {
      const response = await fetch(
        `http://localhost:5056/api/OrderDetail/${orderId}`
      );
      const data = await response.json();
      setListOrderDetail(data);
      if (data.length > 0) {
        const productResponse = await fetch(
          `http://localhost:5056/Product/${data[0].kitId}`
        );
        const productData = await productResponse.json();
        setProductDetails(productData);
    }
  }
    catch(err)
    {
      console.log(err);
      
    }
  }


  const handleViewOrderDetail = (orderId) => {
    fetchListOrderDetail(orderId);
    setIsModalOpen(true);
    setSelectedOrderId(orderId);
  };



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
                      <button className="text-blue-600 hover:underline"  onClick={() => handleViewOrderDetail(order.orderId)}>

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
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-3/4 md:w-1/2">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-bold">
                Chi tiết đơn hàng {selectedOrderId}
              </h3>
              <button
                className="text-gray-500 hover:text-gray-800"
                onClick={() => setIsModalOpen(false)}
              >
                &times;
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-96">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-2 px-4 text-left">Tên Kit</th>
                    <th className="py-2 px-4 text-left">Giá Tiền</th>
                    <th className="py-2 px-4 text-left">Số Lượng</th>
                  </tr>
                </thead>
                <tbody>
                  {listOrderDetail.map((detail, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-2 px-4">{detail.kitName}</td>
                      <td className="py-2 px-4">{detail.price} đ</td>
                      <td className="py-2 px-4">{detail.kitQuantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {productDetails && (
                <div className="mt-6">
                  <h4 className="text-lg font-bold mb-2">Labs:</h4>
                  <ul>
                    {productDetails.labs.map((lab) => (
                      <li key={lab.labId} className="mb-2">
                        <p className="font-bold">{lab.name}</p>
                        <p>{lab.description}</p>
                        <Link
                          to={lab.document}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 underline"
                        >
                          Xem tài liệu
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="p-4 border-t flex justify-end">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={() => setIsModalOpen(false)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}

export default ProcessingOrder;
