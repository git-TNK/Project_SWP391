import React, { useEffect, useState } from "react";
import StaffHeader from "./StaffHeader";
import StaffSlideBar from "./StaffSlideBar";
import axios from "axios";
import Footer from "../../Footer";

function ViewHistorySupport() {
  const [listAnswers, setListAnswers] = useState([]);

  // Fetch the list of answers from the API
  async function fetchListAnswers() {
    try {
      const response = await axios.get(`http://localhost:5056/api/Answer`);
      setListAnswers(response.data);
    } catch (err) {
      console.error("Failed to fetch answers:", err);
    }
  }

  useEffect(() => {
    fetchListAnswers();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* StaffHeader at the top */}
      <StaffHeader />

      <div className="flex flex-1">
        {/* Sidebar on the left */}
        <StaffSlideBar />

        {/* Main content area with the table */}
        <div className="flex-1 p-10 overflow-x-auto">
          <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
            Lịch Sử Hỗ Trợ
          </h1>
          <div className="overflow-x-auto rounded-lg shadow-lg">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr className="bg-indigo-500 text-white">
                  <th className="border px-4 py-3 text-left">ID Tài Khoản</th>
                  <th className="border px-4 py-3 text-left">Câu Trả Lời</th>
                  <th className="border px-4 py-3 text-left">Tên Bài Lab</th>
                  <th className="border px-4 py-3 text-left">File Đính Kèm</th>
                  <th className="border px-4 py-3 text-left">Ngày</th>
                  <th className="border px-4 py-3 text-center">Trạng Thái</th>
                </tr>
              </thead>
              <tbody>
                {listAnswers.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className="hover:bg-gray-100 transition-colors duration-300"
                  >
                    <td className="border px-4 py-3">{row.accountId}</td>
                    <td className="border px-4 py-3">{row.answer}</td>
                    <td className="border px-4 py-3">
                      <button className="text-blue-600 hover:underline">
                        {row.labName}
                      </button>
                    </td>
                    <td className="border px-4 py-3">{row.attachedFile}</td>
                    <td className="border px-4 py-3">{row.dateOfAnswer}</td>
                    <td className="border px-4 py-3 text-center">
                      <button
                        className={`${
                          row.status === "Pending"
                            ? "bg-red-500"
                            : "bg-green-500"
                        } text-white font-bold py-2 px-4 rounded-full shadow-lg transition-all duration-300`}
                      >
                        {row.status === "Pending" ? "Chưa Trả Lời" : "Đã Trả Lời"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ViewHistorySupport;
