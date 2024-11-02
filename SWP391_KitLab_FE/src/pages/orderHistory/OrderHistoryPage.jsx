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

  const fetchListOrderDetail = useCallback(
    async (orderId) => {
      if (!orderId) return; // Tránh gọi nếu không có orderId

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

          // Filter and store lab names
          const filteredLabs = productData.labs.filter((lab) => {
            const orderDate = new Date(
              listOrder.find((o) => o.orderId === orderId).orderDate
            );

            const isNotDeleted =
              !lab.dateOfDeletion || new Date(lab.dateOfDeletion) > orderDate;
            const isCreatedBeforeOrder =
              new Date(lab.dateOfCreation) < orderDate;

            // Lưu tên lab nếu không bị xóa và được tạo trước ngày đặt hàng
            if (isNotDeleted && isCreatedBeforeOrder) {
              return true; // Bao gồm lab này
            }
            return false; // Không bao gồm lab này
          });

          // Lưu tên lab đã lọc vào localStorage
          const newLabNames = filteredLabs.map((lab) => lab.name);
          const uniqueLabNames = Array.from(
            new Set([...existingLabNames, ...newLabNames])
          );

          localStorage.setItem("labNames", JSON.stringify(uniqueLabNames));
        }
      } catch (err) {
        console.log(err);
      }
    },
    [listOrder]
  );

  const fetchListOrder = useCallback(async (account) => {
    try {
      const response = await fetch(
        `http://localhost:5056/Order/${account.accountId}`
      );
      let data = await response.json();
      data.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
      setListOrder(data);
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    const account = getAccount();
    if (account) {
      fetchListOrder(account);
    }
  }, [fetchListOrder]);

  const handleViewOrderDetail = (orderId, e) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedOrderId(orderId);
    fetchListOrderDetail(orderId); // Fetch order details here
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
                <th className="py-2 px-4 text-right">Tổng tiền hàng</th>
                <th className="py-2 px-4 text-right">Ngày đặt hàng</th>
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
                  <td className="py-2 px-4 text-right">
                    {order.price.toLocaleString()} đ
                  </td>
                  <td className="py-2 px-4 text-right">
                    {order.orderDate.split("T", 1)}
                  </td>
                  <td>
                    <button
                      className={`${
                        order.status === "Shipping"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      } py-1 px-2 rounded-full text-sm ml-4`}
                      disabled={order.status !== "Shipping"}
                      onClick={() => handleConfirmReceived(order.orderId)}
                    >
                      Xác nhận đã nhận hàng
                    </button>
                  </td>
                  <td>
                    <button
                      className="text-blue-500 underline pl-4"
                      onClick={(e) => handleViewOrderDetail(order.orderId, e)}
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
                    <th className="py-2 px-4 text-right">Giá Tiền</th>
                    <th className="py-2 px-4 text-right">Số Lượng</th>
                  </tr>
                </thead>
                <tbody>
                  {listOrderDetail.map((detail, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-2 px-4">
                        <p className="w-96 truncate" title={detail.kitName}>
                          {detail.kitName}
                        </p>
                      </td>
                      <td className="py-2 px-4 text-right">
                        {detail.price.toLocaleString()} đ
                      </td>
                      <td className="py-2 px-4 text-right">
                        {detail.kitQuantity.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {productDetails && (
                <div className="mt-6">
                  <h4 className="text-lg font-bold mb-2">Labs:</h4>
                  <ul>
                    {productDetails.labs
                      .filter((lab) => {
                        const orderDate = new Date(
                          listOrder.find(
                            (o) => o.orderId === selectedOrderId
                          ).orderDate
                        );

                        const isNotDeleted =
                          !lab.dateOfDeletion ||
                          new Date(lab.dateOfDeletion) > orderDate;
                        const isCreatedAfterOrder =
                          new Date(lab.dateOfCreation) < orderDate;

                        return isNotDeleted && isCreatedAfterOrder;
                      })
                      .map((lab) => (
                        <li key={lab.labId} className="mb-1">
                          <span>{lab.name}</span>
                          {lab.document && (
                            <a
                              href={lab.document}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="ml-2 text-blue-500 underline"
                            >
                              <p className="underlined">Xem tài liệu</p>
                            </a>
                          )}
                        </li>
                      ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="flex justify-end p-4 border-t">
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
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
