import React from "react";

function Footer() {
  return (
    <footer
      style={{ backgroundColor: "#333" }}
      className="text-white py-4 mt-auto"
    >
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo Section on the Left */}
        <div className="flex items-center">
          <img
            src="https://fpt.edu.vn/Content/images/assets/2021-FPTU-Eng.png"
            alt="FPT University"
            style={{ maxWidth: "200px" }}
            className="mr-4"
          />
        </div>

        {/* Information Section Centered */}
        <div className="text-center flex-grow">
          <p className="mb-2 font-semibold">
            Thành viên: Trần Nam Khánh, Trịnh Hải Đức, Lê Sỹ Bình
          </p>
          <p className="mb-2">Thông tin: GV: SWP391, SE1866</p>
          <p>Liên hệ: FPT University - kitcentral@gmail.com</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
