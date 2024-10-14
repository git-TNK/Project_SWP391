import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

function Header() {
  const [searchTerm, setSearchTerm] = useState(""); // State to capture search term
  const navigate = useNavigate();

  const [account, setAccount] = useState(null);

  useEffect(() => {
    const savedAccount = JSON.parse(localStorage.getItem("account"));
    if (savedAccount) {
      setAccount(savedAccount);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("account"); // Remove account from localStorage
    navigate("/");
  };

  const handleSearch = () => {
    // Navigate to the homepage with the search term as a query parameter
    navigate(`/`, { state: { search: searchTerm } });
  };

  const linkStyle = (enabled) => ({
    color: enabled ? "white" : "gray", // Gray if disabled
    pointerEvents: enabled ? "auto" : "none", // Disable click if no account
    cursor: enabled ? "pointer" : "default",
    margin: "0 15px",
    fontSize: "18px",
    textDecoration: "none",
  });

  const activeLinkStyle = {
    color: "yellow", // Change to the desired active color
    textDecoration: "underline", // Optional: add underline to active link
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
                  to="/edit-profile"
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
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Shadow for better distinction
          }}
        >
          <NavLink
            to="/"
            style={({ isActive }) =>
              isActive ? activeLinkStyle : linkStyle(true)
            }
          >
            Trang chủ
          </NavLink>
          <NavLink
            to="/products-view"
            style={({ isActive }) =>
              isActive ? activeLinkStyle : linkStyle(true)
            }
          >
            Sản Phẩm
          </NavLink>
          <NavLink
            to="/orderHistory"
            style={({ isActive }) =>
              isActive ? activeLinkStyle : linkStyle(!!account)
            }
          >
            Lịch Sử Đơn Hàng
          </NavLink>
          <NavLink
            to="/service"
            style={({ isActive }) =>
              isActive ? activeLinkStyle : linkStyle(!!account)
            }
          >
            Yêu Cầu Hỗ Trợ
          </NavLink>
          <NavLink
            to="/checkout"
            style={({ isActive }) =>
              isActive ? activeLinkStyle : linkStyle(!!account)
            }
          >
            Thanh Toán
          </NavLink>

          <div style={{ marginLeft: "auto" }}>
            <NavLink
              to="/cart"
              style={({ isActive }) => ({
                color: isActive ? "yellow" : "white", // Change color when active
                display: "flex",
                alignItems: "center",
                backgroundColor: "#333",
                padding: "10px 20px",
                borderRadius: "8px",
                textDecoration: "none",
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
