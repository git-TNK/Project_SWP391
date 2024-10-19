import { Link, Route, Router, Routes } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/login/LoginPage";
import RegisterPage from "./pages/register/RegisterPage";
import ServicePage from "./pages/services/ServicePage";
import CheckoutPage from "./pages/checkout/CheckoutPage";
import CartPage from "./pages/cart/CartPage";
//admin
import AdminProduct from "./pages/admin/admin-product";
import AdminLab from "./pages/admin/admin-lab";
import AdminAccount from "./pages/admin/admin-account";
import AdminDashboard from "./pages/admin/admin-dashboard";
import AdminOrder from "./pages/admin/admin-order";
import AddProduct from "./pages/admin/admin-add-product";
import AdminViewProduct from "./pages/admin/admin-product-view";
import ForgotPasswordPage from "./pages/forgotpassword/ForgotPassWordPage";
import ResetPasswordPage from "./pages/resetpassword/ResetPasswordPage";
import OrderHistoryPage from "./pages/orderHistory/OrderHistoryPage";

import ProductViewPage from "./pages/products/ProductViewPage";
import ProductDetails from "./pages/products/ProductDetails";
import NotFound404 from "./NotFound404";

import UpdateProduct from "./pages/admin/admin-update-product";
import EditProfile from "./pages/profile/EditProfile";
import AdminAddLab from "./pages/admin/admin-add-lab";
import AdminNotFound from "./pages/admin/admin-not-found-page";
import UpdateLab from "./pages/admin/admin-update-lab";
import StaffPage from "./pages/staff/StaffPage";
import TransferMoneyPage from "./pages/checkout/TransferMoneyPage";
import ProcessingOrder from "./pages/staff/ProcessingOrder";
import AnswerQuesion from "./pages/staff/AnswerQuesion";
import ViewHistorySupport from "./pages/staff/ViewHistorySupport";
import ViewHistoryQuestion from "./pages/services/ViewHistoryQuestion";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/login" element={<LoginPage />}></Route>
        <Route path="/forgotpassword" element={<ForgotPasswordPage />}></Route>
        <Route path="/resetpassword" element={<ResetPasswordPage />}></Route>
        <Route path="/register" element={<RegisterPage />}></Route>
        <Route path="/edit-profile" element={<EditProfile />}></Route>

        <Route path="/orderHistory" element={<OrderHistoryPage />}></Route>
        <Route path="/service" element={<ServicePage />}></Route>
        <Route path="/viewQuestion" element={<ViewHistoryQuestion />}></Route>
        <Route path="/checkout" element={<CheckoutPage />}></Route>
        <Route path="/banking" element={<TransferMoneyPage />}></Route>
        <Route path="/cart" element={<CartPage />}></Route>
        <Route path="/products-view" element={<ProductViewPage />}></Route>
        <Route path="/product/:id" element={<ProductDetails />} />
        {/*Staff*/}
        <Route path="/processingOrder" element={<ProcessingOrder />}></Route>
        <Route path="/staff" element={<StaffPage />}></Route>
        <Route path="/answerQuestion" element={<AnswerQuesion />}></Route>
        <Route path="/historySupport" element={<ViewHistorySupport />}></Route>
        {/* <Route path="login/homepage" element={<HomePage />}></Route> */}

        <Route path="admin/product" element={<AdminProduct />}></Route>
        <Route path="admin" element={<AdminProduct />}></Route>
        <Route path="admin/lab" element={<AdminLab />}></Route>
        <Route path="admin/account" element={<AdminAccount />}></Route>
        <Route path="admin/dashboard" element={<AdminDashboard />}></Route>
        <Route path="admin/order" element={<AdminOrder />}></Route>
        <Route path="admin/addProduct" element={<AddProduct />}></Route>
        <Route path="/admin/product/:id" element={<AdminViewProduct />} />

        <Route path="*" element={<NotFound404 />}></Route>
        <Route
          path="/admin/product/:kitId/update"
          element={<UpdateProduct />}
        />
        <Route path="admin/addLab" element={<AdminAddLab />}></Route>
        <Route path="/admin/product/*" element={<AdminNotFound />}></Route>
        <Route path="/admin/lab/*" element={<AdminNotFound />}></Route>
        <Route
          path="/admin/lab/:labId/updateLab"
          element={<UpdateLab />}
        ></Route>
      </Routes>
    </>
  );
}

export default App;
