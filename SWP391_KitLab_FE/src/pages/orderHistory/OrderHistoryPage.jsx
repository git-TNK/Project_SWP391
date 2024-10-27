import { useCallback, useEffect, useState } from "react";
import Footer from "../../Footer";
import Header from "../Header";
import { Link, useNavigate } from "react-router-dom";

function OrderHistoryPage() {
  const [account, setAccount] = useState(null);
  const [listOrderDetail, setListOrderDetail] = useState([]);
  const [listOrder, setListOrder] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [productDetails, setProductDetails] = useState(null);

  const navigate = useNavigate();

  const getAccount = () => {
    const savedAccount = JSON.parse(localStorage.getItem("account"));
    setAccount(savedAccount);
    return savedAccount;
  };

  useEffect(() => {
    if (account && account.role !== "Customer") {
      navigate("*"); // Redirect if the user is not a Customer
    }
  }, [account, navigate]);

  const fetchListOrder = useCallback(async (account) => {
    try {
      const response = await fetch(
        `http://localhost:5056/Order/${account.accountId}`
      );
      let data = await response.json();
      data.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
      setListOrder(data);

      // Fetch order details for each order
      for (const order of data) {
        await fetchListOrderDetail(order.orderId); // Call to fetch details for each order
      }
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    fetchListOrder(getAccount());
  }, [fetchListOrder]);

  async function fetchListOrderDetail(orderId) {
    try {
      const response = await fetch(
        `http://localhost:5056/api/OrderDetail/${orderId}`
      );
      const data = await response.json();
      setListOrderDetail(data);

      // Fetch product details for each kit in the order details
      if (data.length > 0) {
        const productResponse = await fetch(
          `http://localhost:5056/Product/${data[0].kitId}`
        );
        const productData = await productResponse.json();
        setProductDetails(productData);

        const existingLabNames = JSON.parse(
          localStorage.getItem("labNames") || "[]"
        );

        const newLabNames = productData.labs.map((lab) => lab.name);
        const uniqueLabNames = Array.from(
          new Set([...existingLabNames, ...newLabNames])
        );

        localStorage.setItem("labNames", JSON.stringify(uniqueLabNames));
      }
    } catch (err) {
      console.log(err);
    }
  }

  const handleViewOrderDetail = (orderId) => {
    setSelectedOrderId(orderId);
    fetchListOrderDetail(orderId);
    setIsModalOpen(true);
  };

  async function handleConfirmReceived(orderId) {
    try {
      const response = await fetch(
        `http://localhost:5056/Order/CustomerUpdateOrder/${orderId}`,
        { method: "PUT" }
      );
      if (response.ok) {
        // Update order list after confirmation
        fetchListOrder(getAccount());
        alert("Đã xác nhận nhận hàng thành công!");
      }
    } catch (error) {
      console.error("Error confirming order:", error);
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
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
                <th className="py-2 px-4 text-left">Ngày đặt hàng</th>
                <th className="py-2 px-4 text-left">Xác nhận đã nhận hàng</th>
                <th className="py-2 px-4 text-left">Xem chi tiết đơn hàng</th>
              </tr>
            </thead>
            <tbody>
              {listOrder.map((order, index) => (
                <tr key={index} className="border-b">
                  <td className="py-2 px-4">{order.orderId}</td>
                  <td className="py-2 px-4">
                    <span
                      className={`py-1 px-2 rounded-full text-sm ${
                        order.status === "Done"
                          ? "bg-green-100 text-green-800"
                          : order.status === "Processing"
                          ? "bg-red-100 text-white-800"
                          : "bg-yellow-100 text-black-800"
                      }`}
                    >
                      {order.status === "Done"
                        ? "Đã nhận hàng"
                        : order.status === "Processing"
                        ? "Đang chờ xác nhận"
                        : "Đang vận chuyển"}
                    </span>
                  </td>
                  <td className="py-2 px-4">{order.price} đ</td>
                  <td className="py-2 px-4">{order.orderDate.split("T", 1)}</td>
                  <td>
                    <button
                      className={`${
                        order.status === "Shipping"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      } py-1 px-2 rounded-full text-sm`}
                      disabled={order.status !== "Shipping"}
                      onClick={() => handleConfirmReceived(order.orderId)}
                    >
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

      {/* Modal Tailwind */}
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
                        <p className="font-bold">
                          {lab.name}{" "}
                          {lab.status === "Changed"
                            ? "(Lab đã được chỉnh sửa)"
                            : lab.status === "Deleted"
                            ? "(Lab đã bị xóa)"
                            : ""}
                        </p>
                        <p>{lab.description}</p>
                        {lab.status === "Deleted" ? (
                          <span className="text-gray-400 underline cursor-not-allowed">
                            Xem tài liệu
                          </span>
                        ) : (
                          <Link
                            to={lab.document}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 underline"
                          >
                            Xem tài liệu
                          </Link>
                        )}
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

export default OrderHistoryPage;
