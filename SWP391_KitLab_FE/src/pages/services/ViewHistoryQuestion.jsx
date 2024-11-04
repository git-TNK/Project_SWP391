import React, { useEffect, useState, useCallback } from "react";
import Header from "../Header";
import Footer from "../../Footer";
import axios from "axios";

function ViewHistoryQuestion() {
  const [listQuestions, setListQuestions] = useState([]);
  const [listAnswers, setListAnswers] = useState([]);
  const [account, setAccount] = useState(null);
  const [newestQuestion, setNewestQuestion] = useState([]); // Trạng thái cho câu hỏi có turn nhỏ nhất

  // Lấy tài khoản từ localStorage khi component mount
  useEffect(() => {
    const savedAccount = JSON.parse(localStorage.getItem("account"));
    if (savedAccount) {
      setAccount(savedAccount);
    }
  }, []);

  // Hàm gọi API lấy danh sách câu trả lời
  const fetchListAnswers = useCallback(async (questions) => {
    try {
      const answers = await Promise.all(
        questions.map((q) =>
          axios
            .get(
              `http://localhost:5056/api/Answer/getAnswerByQuestionId/${q.questionId}`
            )
            .then((res) => res.data)
        )
      );
      setListAnswers(answers.flat());
    } catch (err) {
      console.error("Lỗi khi lấy câu trả lời:", err);
    }
  }, []);

  // Hàm gọi API lấy danh sách câu hỏi
  const fetchListQuestions = useCallback(
    async (accountId) => {
      try {
        const response = await axios.get(
          `http://localhost:5056/api/Question/GetQuestionByAccountId/${accountId}`
        );
        let questions = response.data;

        // Sort questions by date in descending order (newest first)
        questions = questions.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );

        setListQuestions(questions);
        await fetchListAnswers(questions); // Đảm bảo lấy xong câu hỏi mới lấy câu trả lời

        const newestQ = findNewestQuestion(questions);
        setNewestQuestion(newestQ);
      } catch (err) {
        console.error("Lỗi khi lấy câu hỏi:", err);
      }
    },
    [fetchListAnswers]
  );

  function findNewestQuestion(questions) {
    if (questions.length === 0) return null;
    return questions.reduce((newest, current) =>
      new Date(current.dateOfQuestion) > new Date(newest.dateOfQuestion)
        ? current
        : newest
    );
  }

  // Gọi API khi có thông tin tài khoản
  useEffect(() => {
    if (account) {
      fetchListQuestions(account.accountId);
    }
  }, [account, fetchListQuestions]);

  // Tìm câu trả lời dựa trên questionId
  function findAnswerByQuestionId(questionId) {
    return listAnswers.find((answer) => answer.questionId === questionId);
  }

  return (
    //Bình đổi <></> thành div flex flex-col
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">
          Danh Sách Câu Hỏi Và Trả Lời
        </h2>

        {/* Hiển thị lượt hỏi còn lại */}
        {newestQuestion ? (
          <h3>Số lượt hỏi còn lại: {newestQuestion.turn}</h3>
        ) : (
          <h3>Chưa có câu hỏi</h3>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">Câu Hỏi</th>
                <th className="px-4 py-2 text-left">Tên Bài Lab</th>
                <th className="px-4 py-2 text-left">File câu hỏi đính kèm</th>
                <th className="px-4 py-2 text-left">Câu Trả Lời</th>
                <th className="px-4 py-2 text-left">File Trả Lời Câu Hỏi</th>
                <th className="px-4 py-2 text-left">Trạng Thái</th>
              </tr>
            </thead>
            <tbody>
              {listQuestions.map((q, index) => {
                const answer = findAnswerByQuestionId(q.questionId);
                return (
                  <tr key={index} className="border-b">
                    <td className="px-4 py-2">
                      <p className="w-32 truncate" title={q.question}>
                        {q.question}
                      </p>
                    </td>
                    <td className="px-4 py-2">
                      <p className="w-20 truncate" title={q.labName}>
                        {q.labName}
                      </p>
                    </td>
                    <td className="px-4 py-2">
                      <a
                        href={q.attachedFile}
                        className="text-blue-500 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Xem File
                      </a>
                    </td>
                    <td className="px-4 py-2">
                      <p
                        className="w-40 truncate"
                        title={answer?.answer || "Chưa có câu trả lời"}
                      >
                        {answer?.answer || "Chưa có câu trả lời"}
                      </p>
                    </td>
                    <td className="px-4 py-2">
                      {answer?.attachedFile ? (
                        <a
                          href={answer.attachedFile}
                          className="text-blue-500 hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Xem File
                        </a>
                      ) : (
                        "Không có file đính kèm"
                      )}
                    </td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded-full text-sm ${
                          q.status === "Active"
                            ? "bg-red-500 text-white"
                            : "bg-green-500 text-white"
                        }`}
                      >
                        {q.status === "Active" ? "Chưa trả lời" : "Đã trả lời"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ViewHistoryQuestion;
