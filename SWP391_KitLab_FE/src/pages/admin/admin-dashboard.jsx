import React, { useCallback, useEffect, useMemo, useState } from "react";
import AdminHeader from "./admin-header";
import Sidebar from "./sidebar";
import Footer from "../../Footer";
import axios from "axios";
import SearchBar from "./search-bar";

function AdminDashboard() {
  const [listOfKit, setListOfKit] = useState([]);
  const [listOfOrderDetail, setListOfOrderDetail] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("none");
  const labPerpage = 12;

  const [searchTerm, setSearchTerm] = useState("");

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
      console.log(`Error: ${err}`);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event);
    setCurrentPage(1); // Reset to first page when searching
  };

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
        // kitSales[kitId].orders.push({
        //   orderId: orderDetail.orderId,
        //   quantity: kitQuantity,
        //   price,
        // });
      } else {
        kitSales[kitId] = {
          kitId,
          kitName,
          totalQuantity: kitQuantity,
          totalPrice: price * kitQuantity,
          // orders: [
          //   { orderId: orderDetail.orderId, quantity: kitQuantity, price },
          // ],
        };
      }
    });

    return Object.values(kitSales);
  }, [listOfOrderDetail]);

  const sortedAndFilteredKits = useMemo(() => {
    let sortedKits = [...listOfSaleKit];
    if (sortOrder === "asc") {
      sortedKits.sort((a, b) => a.totalQuantity - b.totalQuantity);
    } else if (sortOrder === "desc") {
      sortedKits.sort((a, b) => b.totalQuantity - a.totalQuantity);
    } else if (sortOrder === "descMoney") {
      sortedKits.sort((a, b) => b.totalPrice - a.totalPrice);
    } else if (sortOrder === "ascMoney") {
      sortedKits.sort((a, b) => a.totalPrice - b.totalPrice);
    }
    // return sortedKits;
    return sortedKits.filter((kit) => {
      const nameMatch = kit.kitName
        .toLowerCase()
        .includes(searchTerm.toLocaleLowerCase());
      return nameMatch;
    });
  }, [listOfSaleKit, sortOrder, searchTerm]);

  const indexOfLastKit = currentPage * labPerpage;
  const indexOfFirstKit = indexOfLastKit - labPerpage;
  const currentKits = sortedAndFilteredKits.slice(
    indexOfFirstKit,
    indexOfLastKit
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const fetchKitData = async () => {
    try {
      const response = await axios.get("http://localhost:5056/Product");
      if (response.status === 200) {
        console.log(response.data);
        setListOfKit(response.data);
      }
    } catch (err) {
      console.log(`Error: ${err}`);
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

  const handleSortByAmount = () => {
    setSortOrder((current) => {
      if (current === "none") return "asc";
      if (current === "asc") return "desc";
      if (current === "descMoney" || current === "ascMoney") return "asc";
      return "none";
    });
  };

  const handleSortByMoney = () => {
    setSortOrder((current) => {
      if (current === "none") return "ascMoney";
      if (current === "ascMoney") return "descMoney";
      if (current === "desc" || current === "asc") return "ascMoney";
      return "none";
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader />
      <hr className="w-full h-px border-0 bg-[#0a0a0a]" />
      <div className="flex-grow flex overflow-hidden">
        <div className="flex flex-grow bg-gray-100 overflow-hidden">
          <Sidebar />

          <div className="flex-1 p-8 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Thống kê</h1>
              <SearchBar
                searchTerm={searchTerm}
                onSearchChange={handleSearch}
                placeholderString="Tìm kiếm bằng tên kit..."
              />
              <div className="grid justify-items-center gap-2">
                <div>
                  <span className="font-semibold">
                    Sắp xếp theo tổng tiền:{" "}
                  </span>
                  <button
                    onClick={handleSortByMoney}
                    className="ml-7 w-44 bg-gray-300 text-black hover:bg-black hover:text-white font-bold py-2 px-4 rounded"
                  >
                    {sortOrder === "none"
                      ? "Chưa sắp xếp"
                      : sortOrder === "ascMoney"
                      ? "Thấp đến cao"
                      : sortOrder === "descMoney"
                      ? "Cao đến thấp"
                      : "Chưa sắp xếp"}
                  </button>
                </div>
                <div>
                  <span className="font-semibold">
                    Sắp xếp theo số lượng bán:{" "}
                  </span>
                  <button
                    onClick={handleSortByAmount}
                    className="w-44 bg-gray-300 text-black hover:bg-black hover:text-white font-bold py-2 px-4 rounded"
                  >
                    {sortOrder === "none"
                      ? "Chưa sắp xếp"
                      : sortOrder === "asc"
                      ? "Thấp đến cao"
                      : sortOrder === "desc"
                      ? "Cao đến thấp"
                      : "Chưa sắp xếp"}
                  </button>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead className="bg-gray-200 text-gray-700">
                  <tr>
                    <th className="py-3 pl-4 text-left">KitId</th>
                    <th className="py-3 px-7 text-left">Tên kit</th>
                    <th className="py-3 px-1 text-right">Số lượng bán</th>
                    <th className="py-3 pr-5 text-right">Tổng tiền</th>
                    <th className="py-3 px-1 text-center">Trạng thái</th>
                  </tr>
                </thead>

                <tbody className="text-gray-600">
                  {currentKits.map((kit) => (
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-center mt-8">
              {[
                ...Array(Math.ceil(sortedAndFilteredKits.length / labPerpage)),
              ].map((_, index) => (
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
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default AdminDashboard;
