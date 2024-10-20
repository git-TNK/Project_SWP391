import React, { useEffect, useMemo, useState } from "react";
import AdminHeader from "./admin-header";
import Footer from "../../Footer";
import Sidebar from "./sidebar";
import axios from "axios";
import LoadingSpinner from "./loading";

function AdminOrder() {
  const [orderList, setOrderList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const orderPerpage = 5;
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalContent, setModalContent] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [listAccount, setListAccount] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchOrderList = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("http://localhost:5056/Order");
      if (response.status === 200) {
        console.log(response.data);
        setOrderList(response.data);
        setIsLoading(false);
      }
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      console.log(`Error line 13: ${err}`);
    }
  };

  const fetchListOfAccount = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("http://localhost:5056/api/Account");
      if (response.status === 200) {
        console.log(response.data);
        setListAccount(response.data);
        setIsLoading(false);
      }
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      console.log(`Error line 31: ${err}`);
    }
  };

  //Cần có useMemo vì nếu ko có useMemo thì sẽ lỗi, chưa render mà đã đọc userName
  const findAccById = (id) => {
    const account = listAccount.find((acc) => acc.accountId === id);
    return account ? account.userName : "Unknown User";
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchOrderList();
      await fetchListOfAccount();
    };
    fetchData();
  }, []);

  const handleModalOpen = (order, contentType) => {
    setSelectedOrder(order);
    setModalContent(contentType);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const indexOfLastOrder = currentPage * orderPerpage;
  const indexOfFirstOrder = indexOfLastOrder - orderPerpage;
  const currentOrder = orderList.slice(indexOfFirstOrder, indexOfLastOrder);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleGetTime = (dateTake) => {
    const finalDate = dateTake.split("T")[0];
    return finalDate;
  };

  const handleTranslateStatus = (status) => {
    switch (status) {
      case "Done":
        return "Đã xong";
      default:
        return "Đang xử lí";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Done":
        return "bg-green-500";
      default:
        return "bg-yellow-500";
    }
  };

  //render nội dung nạp vô modal
  const renderModalContent = () => {
    if (!selectedOrder) return null;

    let title, content;
    switch (modalContent) {
      case "detail":
        title = "Chi tiết đơn hàng";
        content = (
          <div className="overflow-y-auto h-48">
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
              <thead className="bg-gray-200 text-gray-700">
                <tr>
                  <th className="w-2/4 py-2 px-3 text-left">Tên kit</th>
                  <th className="w-1/4 py-2 px-2 text-right">Số lượng</th>
                  <th className="w-1/4 py-2 px-2 text-right">Giá</th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                {selectedOrder.orderDetailTbls.map((detail) => (
                  <tr
                    key={detail.kitId}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="py-2 px-4 text-left">{detail.kitName}</td>
                    <td className="py-2 px-2 text-right">
                      {detail.kitQuantity}
                    </td>
                    <td className="py-2 px-2 text-right">
                      {(detail.price * detail.kitQuantity).toLocaleString()}đ
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        break;
      case "note":
        title = "Ghi chú đơn hàng";
        content = <p className="mb-4">{selectedOrder.note}</p>;
        break;
      case "address":
        title = "Địa chỉ";
        content = <p className="mb-4">{selectedOrder.address}</p>;
        break;
      default:
        title = "";
        content = null;
    }

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg max-w-md w-full">
          <h2 className="text-xl font-bold mb-4">{title}</h2>
          {content}
          <button
            onClick={handleModalClose}
            className="bg-gray-200 text-black px-4 py-2 rounded hover:bg-black hover:text-white "
          >
            Đóng
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader />
      <hr className="w-full h-px border-0 bg-[#0a0a0a]" />
      <div className="flex-grow flex overflow-hidden">
        <div className="flex flex-grow bg-gray-100 overflow-hidden">
          <Sidebar />

          {/* Main content */}
          <div className="flex-1 p-8 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Đơn hàng</h1>
            </div>
            <div className="overflow-y-auto">
              <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead className="bg-gray-200 text-gray-700">
                  <tr>
                    <th className="py-3 px-4 text-left">OrderID</th>
                    <th className="py-3 px-4 text-left">Tài khoản</th>
                    <th className="py-3 px-4 text-left">Đơn hàng</th>
                    <th className="py-3 px-4 text-right">Tổng tiền</th>
                    <th className="py-3 px-4 text-left">Ghi chú</th>
                    <th className="py-3 px-4 text-left">Địa chỉ</th>
                    <th className="py-3 px-4 text-left">Ngày đặt</th>
                    <th className="py-3 px-4 text-left">Ngày nhận</th>
                    <th className="py-3 px-4 text-center">Tình trạng</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600">
                  {orderList.map((order) => (
                    <tr
                      key={order.orderId}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="py-2 px-4">{order.orderId}</td>
                      <td className="py-2 px-4">
                        {findAccById(order.accountId)}
                      </td>
                      <td className="py-2 px-4">
                        <button
                          onClick={() => handleModalOpen(order, "detail")}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          Xem chi tiết
                        </button>
                      </td>
                      <td className="py-2 px-4 text-right">
                        {order.price.toLocaleString()}đ
                      </td>
                      <td className="py-2 px-4">
                        <button
                          onClick={() => handleModalOpen(order, "note")}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          Xem ghi chú
                        </button>
                      </td>
                      <td className="py-2 px-4">
                        <button
                          onClick={() => handleModalOpen(order, "address")}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          Xem địa chỉ
                        </button>
                      </td>
                      <td className="py-2 px-4">
                        {handleGetTime(order.orderDate)}
                      </td>
                      {order.receiveDate ? (
                        <td className="py-2 px-4">
                          {handleGetTime(order.receiveDate)}
                        </td>
                      ) : (
                        <td className="py-2 px-4">-</td>
                      )}

                      <td className="py-2 px-4">
                        <div className="flex items-center justify-center">
                          <span
                            className={`${getStatusColor(
                              order.status
                            )} w-28 inline-block py-2 px-4 rounded-lg text-sm text-center text-white`}
                          >
                            {handleTranslateStatus(order.status)}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {isModalOpen && renderModalContent()}
            {/* Pagination */}
            <div className="flex justify-center mt-8">
              {[...Array(Math.ceil(currentOrder.length / orderPerpage))].map(
                (_, index) => (
                  <button
                    key={index}
                    onClick={() => paginate(index + 1)}
                    className={`mx-1 px-3 py-1 rounded ${
                      currentPage === index + 1
                        ? "bg-black text-white"
                        : "bg-white text-black"
                    }`}
                  >
                    {index + 1}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
      {isLoading && <LoadingSpinner />}
    </div>
  );
}

export default AdminOrder;
