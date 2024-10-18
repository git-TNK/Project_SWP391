import { useEffect, useState } from "react";
import Footer from "../../Footer";
import Header from "../Header";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Modal } from "antd";

function OrderHistoryPage() {
  const [account, setAccount] = useState(null);
  const [listOrderDetail, setListOrderDetail] = useState([]);
  const [listOrder, setListOrder] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // State quản lý Modal
  const [selectedOrderId, setSelectedOrderId] = useState(null); // Lưu orderId đang chọn

  const navigate = useNavigate();

  const getAccount = () => {
    const savedAccount = JSON.parse(localStorage.getItem("account"));
    if (savedAccount) setAccount(savedAccount);
    return savedAccount;
  };

  // Lấy danh sách đơn hàng dựa trên accountId
  async function fetchListOrder(account) {
    try {
      const response = await axios.get(
        `http://localhost:5056/Order/${account.accountId}`
      );
      setListOrder(response.data);
    } catch (err) {
      console.log(err);
    }
  }

  // Lấy chi tiết đơn hàng dựa trên orderId
  async function fetchListOrderDetail(orderId) {
    try {
      const response = await axios.get(
        `http://localhost:5056/api/OrderDetail/${orderId}`
      );
      setListOrderDetail(response.data);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    fetchListOrder(getAccount());
  }, []);

  useEffect(() => {
    if (account && account.role !== "Customer") {
      navigate("*"); // Redirect nếu người dùng không phải Customer
    }
  }, [account, navigate]);

  // Xử lý khi nhấn "Xem chi tiết đơn hàng"
  const handleViewOrderDetail = (orderId) => {
    setSelectedOrderId(orderId); // Lưu orderId
    fetchListOrderDetail(orderId); // Gọi API để lấy chi tiết đơn hàng
    setIsModalOpen(true); // Mở Modal
  };

  console.log(listOrderDetail);

  return (
    <div>
      <Header />
      <div className="container mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">Lịch sử đặt hàng</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 text-left">Mã đơn hàng</th>
                <th className="py-2 px-4 text-left">Trạng thái</th>
                <th className="py-2 px-4 text-left">Tổng tiền hàng</th>
                <th className="py-2 px-4 text-left">Xác nhận đã nhận hàng</th>
                <th className="py-2 px-4 text-left">Xem chi tiết đơn hàng</th>
              </tr>
            </thead>
            <tbody>
              {listOrder.map((order, index) => (
                <tr key={index} className="border-b">
                  <td className="py-2 px-4">{order.orderId}</td>
                  <td className="py-2 px-4">
                    <span className="bg-green-100 text-green-800 py-1 px-2 rounded-full text-sm">
                      {order.status === "Done"
                        ? "Đã nhận hàng"
                        : order.status === "Processing"
                        ? "Đang chờ xác nhận"
                        : "Đang vận chuyển"}
                    </span>
                  </td>
                  <td className="py-2 px-4">{order.price} đ</td>
                  <td>
                    <button className="bg-green-100 text-green-800 py-1 px-2 rounded-full text-sm">
                      Xác nhận đã nhận hàng
                    </button>
                  </td>
                  <td>
                    <button
                      className="text-blue-500 underline"
                      onClick={() => handleViewOrderDetail(order.orderId)}
                    >
                      Xem chi tiết đơn hàng
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal hiển thị chi tiết đơn hàng */}
      <Modal
        title={`Chi tiết đơn hàng #${selectedOrderId}`}
        visible={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 text-left">Tên Kit</th>
                <th className="py-2 px-4 text-left">Giá Tiền</th>
                <th className="py-2 px-4 text-left">Số Lượng</th>
              </tr>
            </thead>
            <tbody>
              {listOrderDetail.length > 0 ? (
                listOrderDetail.map((detail, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2 px-4">{detail.kitName}</td>
                    <td className="py-2 px-4">{detail.price} đ</td>
                    <td className="py-2 px-4">{detail.kitQuantity}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="py-2 px-4" colSpan="3">
                    Không có chi tiết đơn hàng.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Modal>
      <Footer />
    </div>
  );
}

export default OrderHistoryPage;
