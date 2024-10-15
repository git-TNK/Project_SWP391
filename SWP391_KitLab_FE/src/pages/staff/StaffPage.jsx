import React from "react";
import StaffHeader from "./StaffHeader";
import StaffSlideBar from "./StaffSlideBar";

function StaffPage() {
  const rules = [
    "Nhân viên đi làm đúng giờ, mặc đồng phục, quần dài màu tối, mang vớ, tóc gọn gàng – Tóc không nhuộm màu sáng, nhân viên nữ tóc dài thì phải cột gọn gàng , không đeo đồ trang sức như nhẫn, vòng đeo tay, đồng hồ bằng kim loại và có bề mặt nhô cao để gây tổn thương khi tiếp xúc với các bé.",
    "Trong giờ làm, nhân viên chăm chỉ làm việc. Không tụ tập nói chuyện để tránh xảy ra tai nạn cho bé, hỗ trợ những bé nhút nhát, dọn vệ sinh sạch sẽ khu vực mình phụ trách và khu vui chơi.",
    "Không chạy nhảy, hò hét, đùa giỡn trong khu vui chơi.",
    "Không tự ý bỏ vị trí làm việc khi chưa có sự đồng ý của Quản lý.",
    "Không tiếp khách trong giờ làm việc (nếu có khách cần xin ý kiến của Quản lý).",
    "Không tụ tập nói chuyện công ty - cá nhân, chơi game, đọc sách báo, xem phim, trốn việc trong góc khuất camera. Không nhai kẹo cao su, ăn quà vặt trong khi làm việc.",
    "Không sử dụng điện thoại di động trong giờ làm việc (trừ trường hợp khẩn cấp).",
    "Nếu có góp ý thì gặp trực tiếp Quản lý hoặc liên hệ văn phòng chính. Không tỏ thái độ hay chống đối đối với cấp trên và khách hàng.",
    "Đồng thời nhân viên tuân thủ theo những quy định tại trung tâm thương mại như giờ ra vào, xuất nhập hàng, không gây xin, chửi thề, hút thuốc, sử dụng chất kích thích, văn hóa phẩm đồi trụy. Sau khi tan giờ làm, khi còn mặc đồng phục của công ty thì phải lưu ý giữ lịch sự trong hành xử.",
    "Nếu thay đổi lịch làm việc phải báo trước với Quản lý trong vòng 2 ngày kể từ khi quản lý chốt lịch làm việc cho nhân viên. Nghỉ việc báo trước 30 - 45 ngày (tùy theo đối tượng HĐLĐ). Không được nghỉ việc mà không báo cáo với cấp trên.",
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <StaffHeader />
      <div className="flex flex-1">
        <StaffSlideBar />
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-3xl mx-auto mt-4">
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
            NỘI QUY NHÂN VIÊN
          </h1>
          <ol className="list-decimal pl-6 space-y-4 text-gray-700">
            {rules.map((rule, index) => (
              <li key={index} className="text-md">
                {rule.split(", ").map((segment, segIndex) => (
                  <React.Fragment key={segIndex}>
                    {segment}
                    {segIndex < rule.split(", ").length - 1 && (
                      <span className="text-red-500">, </span>
                    )}
                  </React.Fragment>
                ))}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

export default StaffPage;
