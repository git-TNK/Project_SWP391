import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import StaffHeader from "./StaffHeader";
import StaffSlideBar from "./StaffSlideBar";
import Footer from "../../Footer";

function AnswerQuestion() {
  const [listQuestion, setListQuestion] = useState([]);
  const [answer, setAnswer] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const navigate = useNavigate();

  // Fetch câu hỏi từ API
  const fetchQuestion = async () => {
    try {
      const response = await fetch(`http://localhost:5056/api/Question`);
      const data = await response.json();
      setListQuestion(data);
    } catch (err) {
      console.error("Failed to fetch support data:", err);
    }
  };

  // Gửi câu trả lời
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedQuestion) return;

    try {
      const formData = new FormData();
      formData.append("acctachFile", attachment);

      const response = await fetch(
        `http://localhost:5056/api/Answer/answerQuestion/${
          selectedQuestion.questionId
        }/${selectedQuestion.accountId}/${encodeURIComponent(answer)}/${
          selectedQuestion.labName
        }`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      console.log("Submitted answer:", data);

      fetchQuestion();
      setAnswer("");
      setAttachment(null);
      setSelectedQuestion(null);
      navigate("/historySupport");
    } catch (error) {
      console.error("Failed to submit answer:", error);
    }
  };

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

  const filteredQuestion = useMemo(() => {
    return listQuestion.sort((a, b) => {
      const dateA = new Date(a.dateOfQuestion);
      const dateB = new Date(b.dateOfQuestion);
      return dateA - dateB;
    });
  }, [listQuestion]);

  // Chọn câu hỏi
  const handleSelectQuestion = (question) => {
    setSelectedQuestion(question);
    setAnswer("");
    setAttachment(null);
  };

  useEffect(() => {
    fetchQuestion();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <StaffHeader />
      <div className="flex flex-grow">
        <StaffSlideBar />

        <main className="flex-grow p-10">
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
            Yêu cầu Hỗ Trợ
          </h1>
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Danh Sách Câu Hỏi:
          </h3>
          <div className="overflow-x-auto rounded-lg shadow-lg">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr className="bg-indigo-500 text-white">
                  <th className="border pl-4 py-3 text-left">ID Tài Khoản</th>
                  <th className="border px-4 py-3 text-left">Câu Hỏi</th>
                  <th className="border px-4 py-3 text-left">Tên Bài Lab</th>
                  <th className="border px-4 py-3 text-left">File Đính Kèm</th>
                  <th className="border px-4 py-3 text-left">Ngày</th>
                </tr>
              </thead>
              <tbody>
                {filteredQuestion
                  .filter((row) => row.status === "Active")
                  .map((row, rowIndex) => (
                    <tr
                      key={row.questionId}
                      className="hover:bg-gray-100 transition-colors duration-300"
                    >
                      <td className="border pl-4 py-3">{row.accountId}</td>
                      <td className="border px-4 py-3">
                        <p className="w-80 truncate" title={row.question}>
                          {row.question}
                        </p>
                      </td>
                      <td className="border px-4 py-3">
                        <p className="w-44 truncate" title={row.labName}>
                          {row.labName}
                        </p>
                      </td>
                      <td className="border px-4 py-3">
                        {" "}
                        <a
                          href={row.attachedFile}
                          className="text-blue-500 hover:text-blue-800"
                          target="_blank"
                          rel="noopener noreferrer"
                          title={getLabNameFromLink(row.attachedFile)}
                        >
                          File của câu hỏi
                        </a>{" "}
                      </td>
                      <td className="border px-4 py-3 text-center">
                        <button
                          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full shadow-lg transition-all duration-300"
                          onClick={() => handleSelectQuestion(row)}
                        >
                          Chưa Trả Lời
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {selectedQuestion && (
            <div className="mt-6 p-6 bg-white rounded-lg shadow-lg">
              <h2 className="text-xl font-bold mb-4 text-gray-800">
                Trả Lời Câu Hỏi
              </h2>

              <div className="mb-4">
                <h3 className="text-lg font-semibold">
                  ID Tài Khoản: {selectedQuestion.accountId}
                </h3>
                <h3 className="text-lg font-semibold">
                  Tên Bài Lab: {selectedQuestion.labName}
                </h3>
                <h3 className="text-lg font-semibold">
                  Câu Hỏi: {selectedQuestion.question}
                </h3>
              </div>

              <form onSubmit={handleSubmit} className="mb-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2">Câu Trả Lời:</h3>
                  <textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    rows="4"
                    required
                  />
                </div>
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2">Chọn Tệp:</h3>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setAttachment(e.target.files[0])}
                    className="w-full"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-blue-700 transition duration-200"
                >
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
