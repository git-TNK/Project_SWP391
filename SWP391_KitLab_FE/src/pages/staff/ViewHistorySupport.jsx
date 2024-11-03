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

  const getLabNameFromLink = (url) => {
    const parts = url.split("/");
    const fileNameWithParams = parts[parts.length - 1];
    const fileName = fileNameWithParams.split("?")[0];

    // Decode the filename to handle any URL encoding
    const decodedFileName = decodeURIComponent(fileName);

    // Remove the timestamp if it exists (assuming it's separated by an underscore)
    const nameWithoutTimestamp = decodedFileName.split("_")[0];

    const finalName = nameWithoutTimestamp.split("/").pop();

    const nameWithoutFileType = finalName.split(".")[0];

    return nameWithoutFileType;
  };

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
                  <th className="border pl-4 py-3 text-left">ID Tài Khoản</th>
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
                    <td className="border pl-4 py-3">{row.accountId}</td>
                    <td className="border px-4 py-3">
                      <span className="w-48 truncate" title={row.answer}>
                        {row.answer}
                      </span>
                    </td>
                    <td className="border px-4 py-3">
                      <span className="w-32 truncate" title={row.labName}>
                        {row.labName}
                      </span>
                    </td>
                    <td className="border px-4 py-3">
                      {row.attachedFile !== null ? (
                        <a
                          href={row.attachedFile}
                          className="text-blue-500 hover:text-blue-800"
                          target="_blank"
                          rel="noopener noreferrer"
                          title={getLabNameFromLink(row.attachedFile)}
                        >
                          File trả lời
                        </a>
                      ) : (
                        <span>-</span>
                      )}
                    </td>
                    <td className="border px-4 py-3">{row.dateOfAnswer}</td>
                    <td className="border px-4 py-3 text-center">
                      <span
                        className={`${
                          row.status === "Pending"
                            ? "bg-red-500"
                            : "bg-green-500"
                        } text-white font-bold py-2 px-4 rounded-full shadow-lg transition-all duration-300`}
                      >
                        {row.status === "Pending"
                          ? "Chưa Trả Lời"
                          : "Đã Trả Lời"}
                      </span>
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
