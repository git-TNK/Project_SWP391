import React, { useEffect, useMemo, useState } from "react";
import AdminHeader from "./admin-header";
import Sidebar from "./sidebar";
import Footer from "../../Footer";
import axios from "axios";
import Notification from "./notification";
import SearchBar from "./search-bar";
import { ChevronDown, Filter } from "lucide-react";

function AdminAccount() {
  const [accountList, setAccountList] = useState([]);
  const [notification, setNotification] = useState(null);
  const [selectedAccount, setselectedAccount] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  //search
  const [searchTerm, setSearchTerm] = useState("");

  //pagination
  const [currentPage, setCurrentPage] = useState(1);
  const accountsPerPage = 10;

  //Filter
  const [filterRole, setFilterRole] = useState("All");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

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

  const filteredAccounts = useMemo(() => {
    return accountList
      .filter((account) => account.role !== "Admin")
      .filter((account) => {
        const nameMatch = account.fullName
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const roleMatch = filterRole === "All" || account.role === filterRole;
        return nameMatch && roleMatch;
      });
  }, [accountList, searchTerm, filterRole]);

  const indexOfLastAccount = currentPage * accountsPerPage;
  const indexOfFirstAccount = indexOfLastAccount - accountsPerPage;
  const currentAccounts = filteredAccounts.slice(
    indexOfFirstAccount,
    indexOfLastAccount
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

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
            type: "error",
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

  const handleFilterClick = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const handleFilterSelect = (role) => {
    setFilterRole(role);
    setIsFilterOpen(false);
    setCurrentPage(1);
  };

  const handleTranslate = (role) => {
    switch (role) {
      case "All":
        return "Tất cả";
      case "Customer":
        return "Khách hàng";
      default:
        return "Nhân viên";
    }
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
              <SearchBar
                searchTerm={searchTerm}
                onSearchChange={handleSearch}
                placeholder="Tìm kiếm theo tên"
              />

              <div className="relative z-50">
                <button
                  onClick={handleFilterClick}
                  className="bg-black text-white px-4 py-2 rounded-md flex items-center"
                >
                  <Filter size={20} className="mr-2" />
                  Lọc
                  <ChevronDown size={20} className="ml-2" />
                </button>
                {isFilterOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 overflow-hidden">
                    <div
                      className="py-1"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="options-menu"
                    >
                      {["All", "Customer", "Staff"].map((role) => (
                        <button
                          key={role}
                          onClick={() => handleFilterSelect(role)}
                          className={`block items-center my-2 mx-4 w-5/6 px-4 py-3 text-sm hover:bg-black hover:text-white rounded-lg transition-colors duration-500 font-medium text-left
                            ${
                              role === filterRole
                                ? "text-white bg-black"
                                : "text-black bg-white"
                            }
                            `}
                          role="menuitem"
                        >
                          {handleTranslate(role)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/*Table content*/}
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead className="bg-gray-200 text-gray-700">
                  <tr>
                    <th className="py-3 px-4 text-left">ID</th>
                    <th className="py-3 px-4 text-left">Tài khoản</th>
                    <th className="py-3 px-4 text-left">Mật khẩu</th>
                    <th className="py-3 px-4 text-left">Họ tên</th>
                    <th className="py-3 px-4 text-center">Số điện thoại</th>
                    <th className="py-3 px-4 text-left">Email</th>
                    <th className="py-3 px-4 text-left">Địa chỉ</th>
                    <th className="py-3 px-4 text-left ">Chức vụ</th>
                    <th className="py-3 px-4 text-center">Thăng/Giáng cấp</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600">
                  {currentAccounts.map((account) => (
                    <tr
                      key={account.accountId}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="py-2 px-4">{account.accountId}</td>
                      <td className="py-2 px-4">{account.username}</td>
                      <td className="py-2 px-4 ">{account.password}</td>
                      <td className="py-2 px-4 ">{account.fullName}</td>
                      <td className="py-2 px-4 text-right">
                        {account.phoneNumber}
                      </td>
                      <td className="py-2 px-4 ">{account.email}</td>
                      <td className="py-2 px-4 ">
                        {account.address ? (
                          <button
                            onClick={() => handleModalOpen(account)}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            Xem địa chỉ
                          </button>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="py-2 pl-4 pr-1">
                        <span className="inline-block w-24">
                          {account.role === "Staff"
                            ? "Nhân viên"
                            : "Khách hàng"}
                        </span>
                      </td>

                      <td className="py-2 px-4 text-center">
                        {account.role === "Staff" ? (
                          <button
                            className="w-24 py-1 px-2 bg-black text-white rounded"
                            onClick={() => handlePromote(account)}
                          >
                            Giáng cấp
                          </button>
                        ) : (
                          <button
                            className="w-24 py-1 px-2 bg-black text-white rounded"
                            onClick={() => handlePromote(account)}
                          >
                            Thăng cấp
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            <div className="flex justify-center mt-8">
              {[
                ...Array(Math.ceil(filteredAccounts.length / accountsPerPage)),
              ].map((_, index) => (
                <button
                  key={index}
                  onClick={() => paginate(index + 1)}
                  className={`mx-1 px-3 py-1 rounded ${
                    currentPage === index + 1
                      ? "bg-black text-white"
                      : "bg-white text-black"
                  } `}
                >
                  {index + 1}
                </button>
              ))}
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
