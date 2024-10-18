import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Notification from "../admin/notification";
import Header from "../Header";
import Footer from "../../Footer";
import LoadingSpinner from "../admin/loading";
import { NavLink } from "react-router-dom";

function TransferMoneyPage() {
  const [paymentCheck, setPaymentCheck] = useState(null);
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();
  const account = JSON.parse(localStorage.getItem("account"));

  const fetchResult = async () => {
    try {
      const response = await fetch("http://localhost:5056/Order/QrResponse");
      const responseText = await response.text();
      console.log(responseText);
      setPaymentCheck(responseText);
    } catch (e) {
      console.log(e);
    }
  };

  const handleOnClick = () => {
    setIsSuccess(true);
    // if (isSuccess) {
    //   navigate("/");
    // } else {
    //   fetchResult();
    //   setLoading(true);
    // }
    //clear gio hang
    sessionStorage.clear();
  };

  useEffect(() => {
    if (paymentCheck !== null) {
      if (paymentCheck === "Success") {
        setNotification({ message: "Thanh toán thành công", type: "success" });
        setPaymentCheck(null);
        setLoading(false);
        setIsSuccess(true);
      } else {
        setNotification({ message: "Thanh toán thất bại", type: "error" });
        setPaymentCheck(null);
        setLoading(false);
      }
    }
  }, [paymentCheck]);

  const closeNotification = () => {
    setNotification(null);
  };

  const [cart, setCart] = useState([]);
  useEffect(() => {
    const cart = sessionStorage.getItem("cart")
      ? JSON.parse(sessionStorage.getItem("cart"))
      : [];
    setCart(cart);
  }, []);

  const [buyerData, setBuyerData] = useState([]);

  useEffect(() => {
    const dataBuyer = sessionStorage.getItem("dataBuyer")
      ? JSON.parse(sessionStorage.getItem("dataBuyer"))
      : [];
    setBuyerData(dataBuyer);
  }, []);

  console.log(buyerData);

  const createOrder = async () => {
    try {
      const { notes, totalCart, address } = buyerData;
      const response = await fetch(
        `http://localhost:5056/Order/addOrder/${account.accountId}/${notes}/${totalCart}/${address}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) throw new Error("Failed to create order");
      console.log(await response.json());
    } catch (e) {
      console.log(e);
    }
  };

  const createOrderDetails = async (item) => {
    try {
      const response = await fetch(
        `http://localhost:5056/api/OrderDetail/${account.accountId}/${item.kitId}/${item.name}/${item.quantity}/${item.price}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) throw new Error("Failed to create order detail");
      console.log(await response.json());
    } catch (e) {
      console.log(e);
    }
  };

  if (isSuccess) {
    createOrder();
  }

  if (isSuccess) {
    Promise.all(cart.map((item) => createOrderDetails(item)))
      .then(() => console.log("All order details created"))
      .catch((e) => console.log(e));
  }
  // const urlQr = `https://img.vietqr.io/image/MB-0373713955-compact2.jpg?amount=${buyerData.totalCart}&addInfo=Testing&accountName=Tran Nam Khanh`;
  //o tren la dung so tien hien thi o duoi la so tien nho de test
  const urlQr = `https://img.vietqr.io/image/MB-0373713955-compact2.jpg?amount=2000&addInfo=Testing&accountName=Tran Nam Khanh`;

  console.log(buyerData.totalCart);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-gray-100 py-6">
        <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg">
          <h1 className="text-2xl font-bold text-center p-3">QR Thanh toán</h1>
          <h1 className="text-sm font-bold text-center text-red-500">
            LƯU Ý: PHẢI BẤM XÁC NHẬN SAU KHI THANH TOÁN THÀNH CÔNG MỚI NHẬN ĐƯỢC
            LAB
          </h1>
          <div className="flex flex-col items-center p-4">
            <img className="w-3/5 h-3/5" src={urlQr} alt="QR Code" />
            <button
              onClick={handleOnClick}
              className="font-bold mt-4 px-4 py-2 bg-gray-300 text-black rounded hover:bg-black hover:text-white transition duration-500"
            >
              {isSuccess ? "Quay về trang chủ" : "Xác nhận"}
            </button>
          </div>
        </div>
      </main>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={closeNotification}
        />
      )}
      <Footer />
      {loading && <LoadingSpinner />}
    </div>
  );
}

export default TransferMoneyPage;
