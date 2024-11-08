import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

function AdminHeader() {
  const [account, setAccount] = useState(null);
  const navigate = useNavigate();
  const [displayAccount, setDisplayAccount] = useState(null);

  useEffect(() => {
    const savedAccount = JSON.parse(localStorage.getItem("account"));

    if (savedAccount) {
      setDisplayAccount(savedAccount);
      console.log(savedAccount);
    }
    if (savedAccount === null || savedAccount.role !== "Admin") {
      navigate("/*");
    }
  }, [navigate]);

  const handleLogOut = (e) => {
    e.preventDefault();
    localStorage.removeItem("account");
    setAccount(null);
    setTimeout(() => {
      navigate("/");
    }, 0);
  };

  return (
    <div>
      <header
        style={{
          backgroundColor: "white",
          padding: "0px",
        }}
      >
        {/* Top Bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px 20px",
            backgroundColor: "white",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <img
              src="https://firebasestorage.googleapis.com/v0/b/swp391-2004.appspot.com/o/Logo%2Flogo.jpg?alt=media&token=7ec2c0f7-bebb-4c69-ab1d-0e70fc821d99"
              alt="KitCentral Logo"
              style={{
                height: "80px", // Make the logo bigger
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
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <NavLink to="/view-profile">
              <button className="rounded-lg cursor-pointer bg-gray-300 text-black font-semibold hover:bg-black hover:text-white h-10 w-28">
                {displayAccount === null ? "" : `${displayAccount.fullName}`}
              </button>
            </NavLink>

            <button
              onClick={handleLogOut}
              className="rounded-lg cursor-pointer bg-gray-300 text-black font-semibold hover:bg-black hover:text-white h-10 w-28"
            >
              <NavLink to="/">Đăng xuất</NavLink>
            </button>
          </div>
        </div>
      </header>
    </div>
  );
}

export default AdminHeader;
