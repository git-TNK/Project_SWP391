import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StaffHeader from "./StaffHeader";
import StaffSlideBar from "./StaffSlideBar";
import Footer from "../../Footer";

function AnswerQuestion() {
  const [listQuestion, setListQuestion] = useState([]);
  const [answer, setAnswer] = useState('');
  const [attachment, setAttachment] = useState(null);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const navigate = useNavigate();

  // Hàm fetch câu hỏi từ API
  const fetchQuestion = async () => {
    try {
      const response = await fetch(`http://localhost:5056/api/Question`);
      const data = await response.json();
      setListQuestion(data);
    } catch (err) {
      console.error("Failed to fetch support data:", err);
    }
  };

  // Hàm gửi câu trả lời
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedQuestion) return; // Kiểm tra nếu chưa chọn câu hỏi thì không thực hiện gì

    try {
      const formData = new FormData();
      formData.append('acctachFile', attachment); // Đính kèm file nếu có

      // Gửi câu trả lời qua API
      const response = await fetch(
        `http://localhost:5056/api/Answer/answerQuestion/${selectedQuestion.questionId}/${selectedQuestion.accountId}/${answer}/${selectedQuestion.labName}`,
        {
          method: 'POST',
          body: formData, // Đưa FormData chứa câu trả lời và file đính kèm vào API
        }
      );

      const data = await response.json();
      console.log("Submitted answer:", data);

      // Cập nhật lại danh sách câu hỏi và reset form
      fetchQuestion();
      setAnswer(''); // Reset câu trả lời
      setAttachment(null); // Reset tệp đính kèm
      setSelectedQuestion(null); // Reset câu hỏi được chọn

      // Điều hướng người dùng đến trang lịch sử hỗ trợ
      navigate('/historySupport');
    } catch (error) {
      console.error("Failed to submit answer:", error);
    }
  };

  // Hàm chọn câu hỏi
  const handleSelectQuestion = (question) => {
    setSelectedQuestion(question);
    setAnswer(''); // Reset câu trả lời
    setAttachment(null); // Reset tệp đính kèm
  };

  useEffect(() => {
    fetchQuestion();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* StaffHeader */}
      <header>
        <StaffHeader />
      </header>

      <div className="flex flex-grow">
        {/* Sidebar */}
        <aside>
          <StaffSlideBar />
        </aside>
        
        <main className="flex-grow p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Yêu cầu Hỗ Trợ</h1>
          <h3 className="text-lg font-semibold mb-4">Danh Sách Câu Hỏi:</h3>
          <table className="w-full border-collapse border border-gray-300 mt-4">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2">ID Tài Khoản</th>
                <th className="border border-gray-300 p-2">Câu Hỏi</th>
                <th className="border border-gray-300 p-2">Tên Bài Lab</th>
                <th className="border border-gray-300 p-2">File Đính Kèm</th>
                <th className="border border-gray-300 p-2">Ngày</th>
                <th className="border border-gray-300 p-2">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {listQuestion.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  <td className="border border-gray-300 p-2">{row.accountId}</td>
                  <td className="border border-gray-300 p-2">{row.question}</td>
                  <td className="border border-gray-300 p-2">{row.labName}</td>
                  <td className="border border-gray-300 p-2">{row.attachedFile}</td>
                  <td className="border border-gray-300 p-2">{row.dateOfQuestion}</td>
                  <td className="border border-gray-300 p-2">
                    <button 
                      onClick={() => handleSelectQuestion(row)} // Gọi hàm chọn câu hỏi
                      className={`px-2 py-1 rounded ${row.status === 'Active' ? 'bg-red-500' : 'bg-green-500'} text-white`}
                    >
                      {row.status === 'Active' ? 'Chưa Trả Lời' : 'Đã Trả Lời'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Hiển thị form trả lời nếu có câu hỏi được chọn */}
          {selectedQuestion && (
            <div className="mt-6">
              <h2 className="text-xl font-bold mb-2">Trả Lời Câu Hỏi</h2>
              
              {/* Thông tin câu hỏi */}
              <div className="mb-4">
                <h3 className="text-lg font-semibold">ID Tài Khoản: {selectedQuestion.accountId}</h3>
                <h3 className="text-lg font-semibold">Tên Bài Lab: {selectedQuestion.labName}</h3>
                <h3 className="text-lg font-semibold">Câu Hỏi: {selectedQuestion.question}</h3>
              </div>

              <form onSubmit={handleSubmit} className="mb-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2">Câu Trả Lời:</h3>
                  <textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    rows="4"
                    required
                  />
                </div>
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2">Chọn Tệp:</h3>
                  <input
                    type="file"
                    accept=".xlsx, .pdf, .docx, .doc, .xls, .jpg, .png, .zip"
                    onChange={(e) => setAttachment(e.target.files[0])}
                    className="w-full"
                  />
                </div>
                <button type="submit" className="px-4 py-2 bg-black text-white rounded hover:bg-blue-600">
                  Gửi
                </button>
              </form>
            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default AnswerQuestion;
