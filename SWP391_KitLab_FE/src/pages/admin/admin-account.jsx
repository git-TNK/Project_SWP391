import React, { useEffect, useState } from "react";
import AdminHeader from "./admin-header";
import Sidebar from "./sidebar";
import Footer from "../../Footer";
import axios from "axios";
import Notification from "./notification";

function AdminAccount() {
  const [accountList, setAccountList] = useState([]);
  const [notification, setNotification] = useState(null);
  const [selectedAccount, setselectedAccount] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fetchData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5056/api/Account/AccountManage"
      );
      console.log(response.data);
      setAccountList(response.data);
    } catch (err) {
      console.log("Fail to fetch data");
    }
  };

  const fitlerAccount = accountList.filter(
    (account) => account.role !== "Admin"
  );

  useEffect(() => {
    fetchData();
  }, []);

  const handlePromote = async (account) => {
    console.log(account);

    try {
      const response = await axios.put(
        `http://localhost:5056/api/Account/AccountPromote?id=${account.accountId}`
      );

      if (response.status === 200) {
        fetchData();
        console.log("success");

        if (account.role === "Customer") {
          setNotification({
            message: `Thăng cấp tài khoản: ${account.username}`,
            type: "success",
          });
        } else if (account.role === "Staff") {
          setNotification({
            message: `Giáng cấp tài khoản: ${account.username}`,
            type: "err",
          });
        }
      }
    } catch (err) {
      console.log(`Error: ${err}`);
    }
  };

  const closeNotification = () => {
    setNotification(null);
  };

  const handleModalOpen = (account) => {
    setselectedAccount(account);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const renderModalContent = () => {
    if (!selectedAccount) return null;

    let title, content;
    title = "Địa chỉ";
    content = selectedAccount.address ? (
      <p className="mb-4">{selectedAccount.address}</p>
    ) : (
      <p className="mb-4 text-gray-500 italic">Chưa có địa chỉ</p>
    );

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg max-w-md w-full">
          <h2 className="text-xl font-bold mb-4">{title}</h2>
          {content}
          <button
            onClick={handleModalClose}
            className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-black hover:text-white"
          >
            Đóng
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader />
      <hr className="w-full h-px border-0 bg-[#0a0a0a]" />
      <div className="flex-grow flex overflow-hidden">
        <div className="flex flex-grow bg-gray-100 overflow-hidden">
          <Sidebar />

          {/* Main content */}
          <div className="flex-1 p-8 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Quản lý tài khoản</h1>
            </div>

            {/*Table content*/}
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead className="bg-gray-200 text-gray-700">
                  <tr>
                    <th className="py-3 px-4 text-center">ID</th>
                    <th className="py-3 px-4 text-center">Username</th>
                    <th className="py-3 px-4 text-center">Password</th>
                    <th className="py-3 px-4 text-center">Full name</th>
                    <th className="py-3 px-4 text-center">Phone number</th>
                    <th className="py-3 px-4 text-center">Email</th>
                    <th className="py-3 px-4 text-center">Address</th>
                    <th className="py-3 px-4 text-center">Role</th>
                    <th className="py-3 px-4 text-center">Promotion</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600">
                  {fitlerAccount.map((account) => (
                    <tr
                      key={account.accountId}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="py-2 px-4">{account.accountId}</td>
                      <td className="py-2 px-4">{account.username}</td>
                      <td className="py-2 px-4 text-center">
                        {account.password}
                      </td>
                      <td className="py-2 px-4 text-center">
                        {account.fullName}
                      </td>
                      <td className="py-2 px-4 text-center">
                        {account.phoneNumber}
                      </td>
                      <td className="py-2 px-4 text-center">{account.email}</td>
                      <td className="py-2 px-4 text-center">
                        <td className="py-2 px-4 text-center">
                          {account.address ? (
                            <button
                              onClick={() => handleModalOpen(account)}
                              className="text-blue-500 hover:text-blue-700"
                            >
                              Xem đỉa chỉ
                            </button>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                      </td>
                      <td className="py-2 px-4 text-center">
                        <span className="inline-block w-20">
                          {account.role}
                        </span>
                      </td>

                      <td className="py-2 px-4 text-center">
                        {account.role === "Staff" ? (
                          <button
                            className="w-24 py-1 px-2 bg-black text-white rounded"
                            onClick={() => handlePromote(account)}
                          >
                            Demote
                          </button>
                        ) : (
                          <button
                            className="w-24 py-1 px-2 bg-black text-white rounded"
                            onClick={() => handlePromote(account)}
                          >
                            Promote
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {isModalOpen && renderModalContent()}
            {notification && (
              <Notification
                message={notification.message}
                type={notification.type}
                onClose={closeNotification}
              />
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default AdminAccount;
