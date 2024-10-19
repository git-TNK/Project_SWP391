import React, { useEffect, useState } from "react";
import StaffHeader from "./StaffHeader";
import StaffSlideBar from "./StaffSlideBar";
import axios from "axios";
import Footer from "../../Footer";

function ViewHistorySupport() {
  const [listAnswers, setListAnswers] = useState([]);

  // Fetch the list of orders from the API
  async function fetchListAnswers() {
    try {
      const response = await axios.get(`http://localhost:5056/api/Answer`);
      setListAnswers(response.data);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    }
  }

  const headers = [
    'ID Tài Khoản',
    'Câu Trả Lời',
    'Tên Bài Lab',
    'File Đính Kèm',
    'Ngày',
    'Trạng thái'
  ];

  const data = [
    {
      id: '12345',
      answer: 'Answer text 1',
      labName: 'Lab 1',
      attachment: 'File 1',
      date: '2024-10-01',
      status: 'Pending'
    },
    {
      id: '12346',
      answer: 'Answer text 2',
      labName: 'Lab 2',
      attachment: 'File 2',
      date: '2024-10-02',
      status: 'Confirmed'
    },
    {
      id: '12347',
      answer: 'Answer text 3',
      labName: 'Lab 3',
      attachment: 'File 3',
      date: '2024-10-03',
      status: 'Pending'
    },
    // Add more data rows as needed
  ];

  useEffect(() => {
    fetchListAnswers();
  }, []);

  console.log(listAnswers);
  

  return (
    <div className="flex flex-col min-h-screen">
      {/* StaffHeader at the top */}
      <header>
        <StaffHeader />
      </header>

      <div className="flex flex-grow">
        {/* Sidebar on the left */}
        <aside>
          <StaffSlideBar />
        </aside>

        {/* Main content area with the table */}
        <main className="flex-grow p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Lịch Sử Hỗ Trợ</h1>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                {headers.map((header, index) => (
                  <th
                    key={index}
                    className="border border-gray-300 p-2 bg-gray-100 text-left"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {listAnswers.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  <td className="border border-gray-300 p-2">{row.accountId}</td>
                  <td className="border border-gray-300 p-2">{row.answer}</td>
                  <td className="border border-gray-300 p-2">
                    <button className="text-blue-600 underline">
                      {row.labName}
                    </button>
                  </td>
                  <td className="border border-gray-300 p-2">{row.attachedFile}</td>
                  <td className="border border-gray-300 p-2">{row.dateOfAnswer}</td>
                  <td className="border border-gray-300 p-2">
                    <button className="bg-blue-500 text-white px-2 py-1 rounded">
                      {row.status === 'Pending' ? 'Chưa Trả Lời' : 'Đã Trả Lời'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default ViewHistorySupport;
