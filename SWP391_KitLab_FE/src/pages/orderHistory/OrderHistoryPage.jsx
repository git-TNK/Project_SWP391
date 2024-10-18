import { useEffect, useState } from "react";
import Footer from "../../Footer";
import Header from "../Header";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function OrderHistoryPage() {
  const [account, setAccount] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const savedAccount = JSON.parse(localStorage.getItem("account"));
    if (savedAccount) {
      setAccount(savedAccount);
    }
  }, []);

  useEffect(() => {
    if (account && account.role !== "Customer") {
      navigate("*"); // Redirect if the user is not a Customer
    }
  }, [account, navigate]);

  const [listorder, setListOrder] = useState([]);

  async function fetchListOrder() {
    try {
      const response = await axios.get(
        `http://localhost:5056/Order/${account.accountId}`
      );
      setListOrder(response.data);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    fetchListOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, 1);

  console.log(listorder);

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
              </tr>
            </thead>
            <tbody>
              {listorder.map((order, index) => (
                <tr key={index} className="border-b">
                  <td className="py-2 px-4">{order.orderId}</td>
                  <td className="py-2 px-4">
                    <span className="bg-green-100 text-green-800 py-1 px-2 rounded-full text-sm">
                      {order.status}
                    </span>
                  </td>
                  <td className="py-2 px-4">{order.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default OrderHistoryPage;
