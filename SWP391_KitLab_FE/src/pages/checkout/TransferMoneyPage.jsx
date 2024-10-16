import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Notification from "../admin/notification";
import Header from "../Header";
import Footer from "../../Footer";
import LoadingSpinner from "../admin/loading";
import { NavLink } from "react-router-dom";

const urlQr = `https://img.vietqr.io/image/MB-0961671129-compact2.jpg?amount=3000&addInfo=Testing&accountName=BinhLS`;

function TransferMoneyPage() {
  const [paymentCheck, setPaymentCheck] = useState(null);
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

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
    if (isSuccess) {
      navigate("/");
    } else {
      fetchResult();
      setLoading(true);
    }
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
