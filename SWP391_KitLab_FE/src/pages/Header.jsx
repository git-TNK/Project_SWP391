import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

function Header() {
  const [searchTerm, setSearchTerm] = useState(""); // State to capture search term
  const navigate = useNavigate();
  const [listOrder, setListOrder] = useState([]);

  async function fetchListOrder(account) {
    try {
      const response = await fetch(
        `http://localhost:5056/Order/${account.accountId}`
      );
      const data = await response.json();
      setListOrder(data);
      return data.orderId;
    } catch (err) {
      console.log(err);
    }
  }

  const [account, setAccount] = useState(null);

  useEffect(() => {
    const savedAccount = JSON.parse(localStorage.getItem("account"));
    if (savedAccount) {
      setAccount(savedAccount);
    }
  }, []);

  useEffect(() => {
    if (account) {
      fetchListOrder(account);
    }
  }, [account]);

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.clear();
    sessionStorage.clear();
    setAccount(null); // Update state to remove account
    setTimeout(() => {
      navigate("/"); // Navigate after state change
    }, 0);
  };

  const handleSearch = () => {
    // Navigate to the homepage with the search term as a query parameter
    navigate(`/`, { state: { search: searchTerm } });
  };

  const navLinkStyle = {
    color: "white",
    margin: "0 15px",
    fontSize: "18px",
    textDecoration: "none",
    padding: "10px 15px",
    borderRadius: "8px",
    transition: "background-color 0.3s, color 0.3s",
  };

  const activeNavLinkStyle = {
    ...navLinkStyle,
    backgroundColor: "#444",
    color: "yellow",
  };

  console.log(account);
  return (
    <div>
      <header
        style={{
          backgroundColor: "white",
          padding: "0px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)", // Add a subtle shadow for better appearance
        }}
      >
        {/* Top Bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "20px 40px", // Add more padding for a spacious feel
            backgroundColor: "white",
          }}
        >
          {/* Logo */}
          <NavLink to="/" style={{ display: "flex", alignItems: "center" }}>
            <img
              src="https://firebasestorage.googleapis.com/v0/b/swp391-2004.appspot.com/o/Logo%2Flogo.jpg?alt=media&token=7ec2c0f7-bebb-4c69-ab1d-0e70fc821d99"
              alt="KitCentral Logo"
              style={{
                height: "80px", // Make the logo bigger
                cursor: "pointer",
                borderRadius: "8px", // Slight border radius for softer edges
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // Add a subtle shadow for depth
              }}
            />
            <div className="pl-3 cursor-default">
              <h1
                style={{ fontSize: "24px", fontWeight: "bold", color: "black" }}
              >
                KitCentral{" "}
                <span
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: "bold",
                    marginTop: "-5px",
                    color: "black",
                  }}
                >
                  Linh Kiện Điện Tử
                </span>
              </h1>
            </div>
          </NavLink>

          <div style={{ display: "flex", alignItems: "center" }}>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm sản phẩm"
              style={{
                padding: "10px",
                borderRadius: "20px", // More rounded corners
                marginRight: "10px",
                width: "600px",
                height: "40px",
                borderColor: "black",
                borderStyle: "solid",
                borderWidth: "2px",
                color: "black",
                outline: "none",
              }}
            />
            <button
              style={{
                padding: "10px 20px",
                backgroundColor: "#333", // Slightly darker background color
                color: "white",
                border: "none",
                borderRadius: "20px", // Match the rounded search bar
                cursor: "pointer",
                transition: "background-color 0.3s", // Smooth hover effect
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#555")} // Change on hover
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#333")}
              onClick={handleSearch}
            >
              Tìm Kiếm
            </button>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {account ? (
              <>
                <NavLink
                  to="/view-profile"
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#333",
                    color: "white",
                    border: "none",
                    borderRadius: "20px",
                    cursor: "pointer",
                    textDecoration: "none",
                    transition: "background-color 0.3s",
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.backgroundColor = "#555")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.backgroundColor = "#333")
                  }
                >
                  {account.fullName}
                </NavLink>
                <NavLink
                  to="/"
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#333",
                    color: "white",
                    border: "none",
                    borderRadius: "20px",
                    cursor: "pointer",
                    textDecoration: "none",
                    transition: "background-color 0.3s",
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.backgroundColor = "#555")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.backgroundColor = "#333")
                  }
                  onClick={handleLogout}
                >
                  Đăng xuất
                </NavLink>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#333",
                    color: "white",
                    border: "none",
                    borderRadius: "20px",
                    cursor: "pointer",
                    textDecoration: "none",
                    transition: "background-color 0.3s",
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.backgroundColor = "#555")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.backgroundColor = "#333")
                  }
                >
                  Đăng nhập
                </NavLink>
                <span style={{ color: "black" }}>hoặc</span>
                <NavLink
                  to="/register"
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#333",
                    color: "white",
                    border: "none",
                    borderRadius: "20px",
                    cursor: "pointer",
                    textDecoration: "none",
                    transition: "background-color 0.3s",
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.backgroundColor = "#555")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.backgroundColor = "#333")
                  }
                >
                  Đăng Ký
                </NavLink>
              </>
            )}
          </div>
        </div>

        {/* Navigation Bar */}
        <nav
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#222",
            padding: "10px 40px",
            color: "white",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <NavLink
            to="/"
            style={({ isActive }) =>
              isActive ? activeNavLinkStyle : navLinkStyle
            }
          >
            Trang chủ
          </NavLink>
          <NavLink
            to="/products-view"
            style={({ isActive }) =>
              isActive ? activeNavLinkStyle : navLinkStyle
            }
          >
            Sản Phẩm
          </NavLink>
          <NavLink
            to="/orderHistory"
            style={({ isActive }) =>
              account
                ? isActive
                  ? activeNavLinkStyle
                  : navLinkStyle
                : { ...navLinkStyle, color: "gray", pointerEvents: "none" }
            }
          >
            Lịch Sử Đơn Hàng
          </NavLink>
          <NavLink
            to="/service"
            style={({ isActive }) =>
              account && listOrder.length > 0
                ? isActive
                  ? activeNavLinkStyle
                  : navLinkStyle
                : { ...navLinkStyle, color: "gray", pointerEvents: "none" }
            }
          >
            Yêu Cầu Hỗ Trợ
          </NavLink>

          <NavLink
            to="/viewQuestion"
            style={({ isActive }) =>
              account && listOrder.length > 0
                ? isActive
                  ? activeNavLinkStyle
                  : navLinkStyle
                : { ...navLinkStyle, color: "gray", pointerEvents: "none" }
            }
          >
            Xem câu hỏi và trả lời
          </NavLink>
          <NavLink
            to="/checkout"
            style={({ isActive }) =>
              account
                ? isActive
                  ? activeNavLinkStyle
                  : navLinkStyle
                : { ...navLinkStyle, color: "gray", pointerEvents: "none" }
            }
          >
            Thanh Toán
          </NavLink>

          <div style={{ marginLeft: "auto" }}>
            <NavLink
              to="/cart"
              style={({ isActive }) => ({
                ...navLinkStyle,
                color: isActive ? "yellow" : "white",
                backgroundColor: isActive ? "#444" : "#333",
                display: "flex",
                alignItems: "center",
                padding: "10px 20px",
                borderRadius: "8px",
              })}
            >
              Giỏ Hàng
            </NavLink>
          </div>
        </nav>
      </header>
    </div>
  );
}

export default Header;
