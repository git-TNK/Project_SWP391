import React, { useMemo, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import PropTypes from "prop-types";

const SalesStatisticsCharts = ({
  chartDataAmount,
  chartDataTotalPrice,
  chartOrder,
}) => {
  const [selectedChart, setSelectedChart] = useState("amount"); // 'amount' or 'price'
  const [sortOrder, setSortOrder] = useState("none");

  // if (chartOrder.length !== 0) {
  //   console.log(chartOrder);
  // }

  // Calculate totals
  const totalQuantity = chartOrder.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const totalAmount = chartDataAmount.reduce(
    (sum, item) => sum + item.amount,
    0
  );
  const totalPrice = chartDataTotalPrice.reduce(
    (sum, item) => sum + item.price,
    0
  );

  const handleTranslateName = (name) => {
    switch (name) {
      case "Shipping":
        return "Đang giao";
      case "Done":
        return "Đã xong";
      default:
        return "Đang xử lí";
    }
  };

  const formatYAxis = (value) => {
    if (selectedChart === "price") {
      let formattedValue = `${value.toLocaleString()}đ`;
      return formattedValue;
    }
    return value;
  };

  // Memoize the sorted data instead of using setState
  const sortedData = useMemo(() => {
    const currentData =
      selectedChart === "amount" ? chartDataAmount : chartDataTotalPrice;
    const key = selectedChart === "amount" ? "amount" : "price";

    if (sortOrder === "none") {
      return currentData;
    }

    return [...currentData].sort((a, b) => {
      if (sortOrder === "asc") {
        return a[key] - b[key];
      }
      return b[key] - a[key];
    });
  }, [selectedChart, sortOrder, chartDataAmount, chartDataTotalPrice]);

  const handleClickSort = () => {
    setSortOrder((current) => {
      if (current === "none") return "asc";
      if (current === "asc") return "desc";
      return "none";
    });
  };

  const handleChartSelect = (type) => {
    setSelectedChart(type);
    setSortOrder("none");
  };

  const handleColorPie = (status) => {
    switch (status) {
      case "Done":
        return "#00f901";
      case "Shipping":
        return "#eaff00";
      default:
        return "#EF4444";
    }
  };

  //Pie chart
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    const percentageValue = `${(percent * 100).toFixed(0)}%`;

    return (
      <text
        x={x}
        y={y}
        fill="black"
        className="text-sm font-bold"
        textAnchor="middle"
        dominantBaseline="central"
      >
        {percentageValue}
      </text>
    );
  };

  return (
    <div className="w-full space-y-6">
      <div className="grid grid-cols-3 gap-4">
        {/* Số lượng bán */}
        <div
          className={`p-6 bg-white rounded-lg shadow cursor-pointer transition-all
            ${
              selectedChart === "amount"
                ? "ring-2 ring-black"
                : "hover:shadow-lg"
            }`}
          onClick={() => handleChartSelect("amount")}
        >
          <div className="text-sm font-medium text-gray-500">
            Số lượng sản phẩm đã bán
          </div>
          <div className="mt-2 text-3xl font-bold">{totalAmount} sản phẩm</div>
        </div>

        {/* Doanh thu */}
        <div
          className={`p-6 bg-white rounded-lg shadow cursor-pointer transition-all
            ${
              selectedChart === "price"
                ? "ring-2 ring-black"
                : "hover:shadow-lg"
            }`}
          onClick={() => handleChartSelect("price")}
        >
          <div className="text-sm font-medium text-gray-500">
            Tổng doanh thu
          </div>
          <div className="mt-2 text-3xl font-bold">
            {totalPrice.toLocaleString()}đ
          </div>
        </div>

        {/* Đơn hàng */}
        <div
          className={`p-6 bg-white rounded-lg shadow cursor-pointer transition-all
            ${
              selectedChart === "order"
                ? "ring-2 ring-black"
                : "hover:shadow-lg"
            }`}
          onClick={() => handleChartSelect("order")}
        >
          <div className="text-sm font-medium text-gray-500">
            Số lượng đơn hàng
          </div>
          <div className="mt-2 text-3xl font-bold">{totalQuantity} đơn</div>
        </div>
      </div>

      {/* Chart */}
      <div className="p-6 bg-white rounded-lg shadow">
        {selectedChart !== "order" ? (
          <div>
            <span className="font-semibold">Sắp xếp: </span>
            <button
              onClick={handleClickSort}
              className="ml-1 w-44 bg-gray-300 text-black hover:bg-black hover:text-white font-bold py-2 px-4 rounded"
            >
              {sortOrder === "none"
                ? "Chưa sắp xếp"
                : sortOrder === "desc"
                ? "Cao đến thấp"
                : "Thấp đến cao"}
            </button>
          </div>
        ) : (
          ""
        )}

        {/* render chart */}
        <div className="h-[400px] ">
          {selectedChart === "order" ? (
            <div className="grid grid-cols-12 h-full">
              <div className="col-span-8 h-full pl-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartOrder}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      outerRadius={160}
                      fill="#8884d8"
                      dataKey="quantity"
                      nameKey="status"
                      animationDuration={600}
                    >
                      {chartOrder.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={handleColorPie(entry.status)}
                          className="stroke-white stroke-2"
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, name) => [
                        `${value} đơn`,
                        handleTranslateName(name),
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="col-span-3 pt-[60px] pl-[100px]">
                <div className="flex flex-col space-y-4 p-4  bg-gray-100 rounded-lg">
                  <h3 className="font-semibold text-lg border-b pb-2">
                    Chi tiết
                  </h3>
                  {chartOrder.map((entry, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div
                        className="w-4 h-4 rounded"
                        style={{
                          backgroundColor: handleColorPie(entry.status),
                        }}
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">
                            {handleTranslateName(entry.status)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={sortedData}
                margin={{ top: 20, right: 30, left: 30, bottom: 5 }}
              >
                <XAxis dataKey="name" tick={false} />
                <YAxis tickFormatter={formatYAxis} width={80} />
                <Tooltip
                  formatter={(value) => [
                    selectedChart === "price"
                      ? ["Doanh thu: ", `${value.toLocaleString()}đ`]
                      : ["Số lượng bán: ", value],
                  ]}
                />
                <Bar
                  dataKey={selectedChart === "amount" ? "amount" : "price"}
                  fill="#1aa3ff"
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};

SalesStatisticsCharts.propTypes = {
  chartDataAmount: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
    })
  ).isRequired,
  chartDataTotalPrice: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
    })
  ).isRequired,
  chartOrder: PropTypes.arrayOf(
    PropTypes.shape({
      status: PropTypes.string.isRequired,
      quantity: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default SalesStatisticsCharts;
