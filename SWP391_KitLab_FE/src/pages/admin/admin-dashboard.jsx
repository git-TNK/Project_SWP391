import React, { useCallback, useEffect, useMemo, useState } from "react";
import AdminHeader from "./admin-header";
import Sidebar from "./sidebar";
import Footer from "../../Footer";
import axios from "axios";
import SearchBar from "./search-bar";
import SalesStatisticsCharts from "./chart-render";
import LoadingSpinner from "./loading";

function AdminDashboard() {
  // const [listOfKit, setListOfKit] = useState([]);
  const [listOfOrderDetail, setListOfOrderDetail] = useState([]);
  // const [currentPage, setCurrentPage] = useState(1);
  // const [sortOrder, setSortOrder] = useState("none");
  // const labPerpage = 12;

  const [loading, setLoading] = useState(false);
  const [chartDataAmount, setChartDataAmount] = useState([]);
  const [chartDataToltalPrice, setChartDataTotalPrice] = useState([]);
  const [orderList, setOrderLsit] = useState([]);

  // const [searchTerm, setSearchTerm] = useState("");
  // const [selectedChart, setSelectedChart] = useState("ChooseAmountChart");

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

  const fetchOrderList = async () => {
    try {
      const response = await axios.get("http://localhost:5056/Order");
      if (response.status === 200) {
        setOrderLsit(response.data);
        console.log(response.data);
      }
    } catch (err) {
      console.log(`Line 40: ${err}`);
    }
  };

  // const handleSearch = (event) => {
  //   setSearchTerm(event);
  //   setCurrentPage(1); // Reset to first page when searching
  // };

  const listOfOrderForChart = useMemo(() => {
    if (orderList.length === 0) {
      return [];
    }

    const listOrderCount = {};
    orderList.forEach((order) => {
      const { status } = order;
      if (listOrderCount[status]) {
        listOrderCount[status].quantity += 1;
      } else {
        listOrderCount[status] = {
          status,
          quantity: 1,
        };
      }
    });
    return Object.values(listOrderCount);
  }, [orderList]);

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

  useEffect(() => {
    // Clear previous chart data
    setChartDataAmount([]);
    setChartDataTotalPrice([]);

    if (listOfSaleKit.length === 0) {
      return;
    }

    // Prepare all data first
    const amountData = listOfSaleKit.map((kit) => ({
      name: kit.kitName,
      amount: kit.totalQuantity,
    }));

    const priceData = listOfSaleKit.map((kit) => ({
      name: kit.kitName,
      price: kit.totalPrice,
    }));

    // Set both states at once
    setChartDataAmount(amountData);
    setChartDataTotalPrice(priceData);
  }, [listOfSaleKit]);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      await fetchOrderDetail();
      // await fetchKitData();
      await fetchOrderList();
      setLoading(false);
    };
    fetchData();
  }, []);

  // const handleStatusTranslate = (status) => {
  //   if (status === null) {
  //     return;
  //   }

  //   switch (status) {
  //     case "New":
  //       return "Mới";
  //     case "Changed":
  //       return "Đã sửa";
  //     default:
  //       return "Đã xóa";
  //   }
  // };

  // const handleSortByAmount = () => {
  //   setSelectedChart("ChooseAmountChart");
  //   setSortOrder((current) => {
  //     if (current === "none") return "asc";
  //     if (current === "asc") return "desc";
  //     if (current === "descMoney" || current === "ascMoney") return "asc";
  //     return "none";
  //   });
  // };

  // const handleSortByMoney = () => {
  //   setSelectedChart("ChooseMoneyChart");
  //   setSortOrder((current) => {
  //     if (current === "none") return "ascMoney";
  //     if (current === "ascMoney") return "descMoney";
  //     if (current === "desc" || current === "asc") return "ascMoney";
  //     return "none";
  //   });
  // };

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
            </div>

            <div className="h-1/2">
              <SalesStatisticsCharts
                chartDataAmount={chartDataAmount}
                chartDataTotalPrice={chartDataToltalPrice}
                chartOrder={listOfOrderForChart}
              />
            </div>
          </div>
        </div>
      </div>
      <Footer />
      {loading && <LoadingSpinner />}
    </div>
  );
}

export default AdminDashboard;
