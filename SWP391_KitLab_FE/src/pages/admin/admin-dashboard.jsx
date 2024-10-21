import React, { useCallback, useEffect, useMemo, useState } from "react";
import AdminHeader from "./admin-header";
import Sidebar from "./sidebar";
import Footer from "../../Footer";
import axios from "axios";

function AdminDashboard() {
  // const [listOfOrder, setOrderList] = useState([]);
  const [listOfKit, setListOfKit] = useState([]);
  const [listOfOrderDetail, setListOfOrderDetail] = useState([]);

  //Lấy data của orderDetail cho bảng
  const fetchOrderDetail = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5056/api/OrderDetail/AllOrderDetail"
      );
      if (response.status === 200) {
        console.log(response.data);
        setListOfOrderDetail(response.data);
      }
    } catch (err) {
      console.log(`Error line 45: ${err}`);
    }
  };

  //Tính toán tổng số lượng bán của mỗi kit, dựa trên list của OrderDetail
  const listOfSaleKit = useMemo(() => {
    if (listOfOrderDetail.length === 0) {
      console.log("Detail empty");
      return [];
    }

    const kitSales = {};
    listOfOrderDetail.forEach((orderDetail) => {
      const { kitId, kitName, kitQuantity, price } = orderDetail;
      if (kitSales[kitId]) {
        kitSales[kitId].totalQuantity += kitQuantity;
        kitSales[kitId].totalPrice += price * kitQuantity;
        kitSales[kitId].orders.push({
          orderId: orderDetail.orderId,
          quantity: kitQuantity,
          price,
        });
      } else {
        kitSales[kitId] = {
          kitId,
          kitName,
          totalQuantity: kitQuantity,
          totalPrice: price * kitQuantity,
          orders: [
            { orderId: orderDetail.orderId, quantity: kitQuantity, price },
          ],
        };
      }
    });

    return Object.values(kitSales);
  }, [listOfOrderDetail]);

  //Lấy data của kit cho bảng
  const fetchKitData = async () => {
    try {
      const response = await axios.get("http://localhost:5056/Product");
      if (response.status === 200) {
        console.log(response.data);
        setListOfKit(response.data);
      }
    } catch (err) {
      console.log(`Error line 27: ${err}`);
    }
  };

  const handleGetKitStatus = useCallback(
    (kitId) => {
      let status = null;
      listOfKit.forEach((kit) => {
        if (kit.kitId === kitId) {
          status = kit.status;
        }
      });
      return status;
    },
    [listOfKit]
  );

  const getStatusColor = (status) => {
    if (status === null) {
      return;
    }

    switch (status.toLowerCase()) {
      case "changed":
        return "bg-yellow-500";
      case "deleted":
        return "bg-red-500";
      default:
        return "bg-green-500";
    }
  };

  //Fetch các data 1 lần duy nhất
  useEffect(() => {
    const fetchData = async () => {
      await fetchOrderDetail();
      await fetchKitData();
    };
    fetchData();
  }, []);

  const handleStatusTranslate = (status) => {
    if (status === null) {
      return;
    }

    switch (status) {
      case "New":
        return "Mới";
      case "Changed":
        return "Đã sửa";
      default:
        return "Đã xóa";
    }
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
              <h1 className="text-2xl font-bold">Thống kê</h1>
            </div>

            {/* Table content */}
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead className="bg-gray-200 text-gray-700">
                  <tr>
                    <th className="py-3 pl-4 text-left">KitId</th>
                    <th className="py-3 px-7 text-left">Tên kit</th>
                    {/* <th className="py-3 px-4 text-left">Đơn</th> */}
                    <th className="py-3 px-1 text-right">Số lượng bán</th>
                    <th className="py-3 pr-5 text-right">Tổng tiền</th>
                    <th className="py-3 px-1 text-center">Trạng thái</th>
                    <th className="py-3 px-4 text-left">Các order</th>
                    <th className="py-3 px-4 text-left">Lựa chọn</th>
                  </tr>
                </thead>

                <tbody className="text-gray-600">
                  {listOfSaleKit.map((kit) => (
                    <tr
                      key={kit.kitId}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="py-2 pl-4">{kit.kitId}</td>
                      <td className="py-2 px-7">{kit.kitName}</td>
                      <td className="py-2 px-1 text-right">
                        {kit.totalQuantity}
                      </td>
                      <td className="py-2 pr-5 text-right">
                        {kit.totalPrice.toLocaleString()}đ
                      </td>
                      <td className="py-2 px-1">
                        <div className="flex items-center justify-center">
                          <span
                            className={`${getStatusColor(
                              handleGetKitStatus(kit.kitId)
                            )} w-28 inline-block py-2 px-4 rounded-lg text-sm text-center text-white`}
                          >
                            {handleStatusTranslate(
                              handleGetKitStatus(kit.kitId)
                            )}
                          </span>
                        </div>
                      </td>
                      <td className="py-2 px-4">Xem đơn</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default AdminDashboard;
