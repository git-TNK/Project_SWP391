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
  // const [productDetails, setProductDetails] = useState([]);
  const [allLabs, setAllLabs] = useState([]);
  const [isLabModalOpen, setIsLabModalOpen] = useState(false);

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

  const fetchListOrderDetail = useCallback(async (orderId) => {
    if (!orderId) return;

    try {
      const response = await fetch(
        `http://localhost:5056/api/OrderDetail/${orderId}`
      );
      const data = await response.json();
      setListOrderDetail(data);

      // if (data.length > 0) {
      //   const existingLabNames = new Set(
      //     JSON.parse(localStorage.getItem("labNames") || "[]")
      //   );
      //   const orderDate = new Date(
      //     listOrder.find((o) => o.orderId === orderId).orderDate
      //   );

      //   // Changed: Fetch all products at once using Promise.all
      //   const products = await Promise.all(
      //     data.map(async (item) => {
      //       const productResponse = await fetch(
      //         `http://localhost:5056/Product/${item.kitId}`
      //       );
      //       return productResponse.json();
      //     })
      //   );

      //   // Store all products
      //   setProductDetails(products);

      //   // Update labNames
      //   products.forEach((product) => {
      //     const filteredLabs = product.labs.filter((lab) => {
      //       const isNotDeleted =
      //         !lab.dateOfDeletion || new Date(lab.dateOfDeletion) > orderDate;
      //       const isCreatedBeforeOrder =
      //         new Date(lab.dateOfCreation) < orderDate;

      //       return isNotDeleted && isCreatedBeforeOrder;
      //     });
      //     filteredLabs.forEach((lab) => existingLabNames.add(lab.name));
      //   });

      //   localStorage.setItem(
      //     "labNames",
      //     JSON.stringify([...existingLabNames])
      //   );
      // }
    } catch (err) {
      console.log(err);
    }
  }, []);

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

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setListOrderDetail([]); // Clear order details when closing
  };

  const handleCloseLabModal = () => {
    setIsLabModalOpen(false);
    setAllLabs([]); // Clear labs when closing
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

  // New function to fetch all labs
  const fetchAllLabs = useCallback(async () => {
    try {
      const labs = new Set();
      const labNames = new Set();

      for (const order of listOrder) {
        const response = await fetch(
          `http://localhost:5056/api/OrderDetail/${order.orderId}`
        );
        const orderDetails = await response.json();

        for (const detail of orderDetails) {
          const productResponse = await fetch(
            `http://localhost:5056/Product/${detail.kitId}`
          );
          const productData = await productResponse.json();

          productData.labs.forEach((lab) => {
            const orderDate = new Date(order.orderDate);
            const isNotDeleted =
              !lab.dateOfDeletion || new Date(lab.dateOfDeletion) > orderDate;
            const isCreatedBeforeOrder =
              new Date(lab.dateOfCreation) < orderDate;

            if (isNotDeleted && isCreatedBeforeOrder) {
              labs.add(JSON.stringify(lab)); // Convert lab to string to ensure uniqueness
              labNames.add(lab.name);
            }
          });
        }
      }

      // Convert the Set to an array of lab objects
      const uniqueLabNames = Array.from(labNames);
      const uniqueLabShow = Array.from(labs).map((lab) => JSON.parse(lab));
      localStorage.setItem("labNames", JSON.stringify(uniqueLabNames));

      setAllLabs(uniqueLabShow);
      setIsLabModalOpen(true);
    } catch (error) {
      console.error("Error fetching labs:", error);
    }
  }, [listOrder]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="container mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">Lịch sử đặt hàng</h2>
        <button
          onClick={fetchAllLabs}
          className="bg-gray-200 p-2 rounded text-center text-lg mt-4"
        >
          Xem các bài lab
        </button>

        {/* Lab Modal */}
        {isLabModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg w-3/4 md:w-1/2">
              <div className="flex justify-between items-center p-4 border-b">
                <h3 className="text-lg font-bold">Tất cả các bài lab</h3>
                <button
                  className="text-gray-500 hover:text-gray-800"
                  onClick={handleCloseLabModal}
                >
                  &times;
                </button>
              </div>
              <div className="p-4 overflow-y-auto max-h-96 bg-gray-100 rounded-lg shadow-md border border-gray-200">
                <ul>
                  {(allLabs || []).map((lab, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center p-2 bg-white hover:bg-gray-50 rounded-lg shadow-sm transition-all duration-200 mb-2 last:mb-0"
                    >
                      <span className="text-gray-800 font-medium">
                        {lab.name}
                      </span>
                      <a
                        href={lab.document}
                        className="text-blue-500 hover:text-blue-700 underline transition-colors duration-200"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Xem bài lab
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-end p-4 border-t">
                <button
                  className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                  onClick={handleCloseLabModal}
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}

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
              {(listOrder || []).map((order, index) => (
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
                onClick={handleCloseModal}
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
                  {(listOrderDetail || []).map((detail, index) => (
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

              {/* {productDetails.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-lg font-bold mb-2">Labs:</h4>
                  {(() => {
                    // Create a Set to store unique labs based on labId
                    const uniqueLabs = new Set();
                    const labsByProduct = new Map(); // Map to group labs by product name

                    // Collect and organize labs by product
                    productDetails.forEach((product) => {
                      const filteredLabs = product.labs.filter((lab) => {
                        const orderDate = new Date(
                          listOrder.find(
                            (o) => o.orderId === selectedOrderId
                          ).orderDate
                        );

                        const isNotDeleted =
                          !lab.dateOfDeletion ||
                          new Date(lab.dateOfDeletion) > orderDate;
                        const isCreatedBeforeOrder =
                          new Date(lab.dateOfCreation) < orderDate;

                        return isNotDeleted && isCreatedBeforeOrder;
                      });

                      // Only add unique labs
                      filteredLabs.forEach((lab) => {
                        if (!uniqueLabs.has(lab.labId)) {
                          uniqueLabs.add(lab.labId);
                          if (!labsByProduct.has(product.name)) {
                            labsByProduct.set(product.name, []);
                          }
                          labsByProduct.get(product.name).push(lab);
                        }
                      });
                    });

                    // Convert Map to Array for rendering
                    const productEntries = Array.from(labsByProduct.entries());

                    // Return the organized labs list
                    return (
                      <div>
                        {productEntries.map(([productName, labs]) => (
                          <div key={productName} className="mb-4">
                            <ul>
                              {labs.map((lab) => (
                                <li key={lab.labId} className="mb-2">
                                  <div>{lab.name}</div>
                                  {lab.document && (
                                    <a
                                      href={lab.document}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-500 hover:text-blue-700"
                                    >
                                      Xem tài liệu
                                    </a>
                                  )}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              )} */}
            </div>
            <div className="flex justify-end p-4 border-t">
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                onClick={handleCloseModal}
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
