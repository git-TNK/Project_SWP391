import React, { useEffect } from "react";

function TransferMoneyPage() {
  const urlQr = `https://qr.sepay.vn/img?acc=0961671129&bank=MBBank&amount=2000&des=ThanhToanTest`;

  const callApiWithToken = async () => {
    const accessToken =
      "CBZG8EAGHX6NG5LWP36ISAONKRQIAONUMDFDZOETCT1VQCAZJT0KLXRNY3WWJ894"; // Access Token nhận từ hệ thống xác thực.

    try {
      const response = await fetch(
        "https://my.sepay.vn/userapi/transactions/list?amount_in=10000",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`, // Gửi Access Token trong Header
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      console.log("Dữ liệu nhận được:", data);
    } catch (error) {
      console.error("Có lỗi xảy ra:", error);
    }
  };

  // Gọi hàm trong component hoặc khi cần
  useEffect(() => {
    callApiWithToken();
  });

  return (
    <div>
      <img src={urlQr}></img>
    </div>
  );
}

export default TransferMoneyPage;
