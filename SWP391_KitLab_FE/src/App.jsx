import { Link, Route, Router, Routes } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/login/LoginPage";
import RegisterPage from "./pages/register/RegisterPage";
import ContactPage from "./pages/contact/ContactPage";
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

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/login" element={<LoginPage />}></Route>
        <Route path="/register" element={<RegisterPage />}></Route>
        <Route path="/contact" element={<ContactPage />}></Route>
        <Route path="/service" element={<ServicePage />}></Route>
        <Route path="/checkout" element={<CheckoutPage />}></Route>
        <Route path="/cart" element={<CartPage />}></Route>
        {/* <Route path="login/homepage" element={<HomePage />}></Route> */}

        <Route path="admin/product" element={<AdminProduct />}></Route>
        <Route path="admin" element={<AdminProduct />}></Route>
        <Route path="admin/lab" element={<AdminLab />}></Route>
        <Route path="admin/account" element={<AdminAccount />}></Route>
        <Route path="admin/dashboard" element={<AdminDashboard />}></Route>
        <Route path="admin/order" element={<AdminOrder />}></Route>
        <Route path="admin/addProduct" element={<AddProduct />}></Route>
        <Route path="/admin/product/:id" element={<AdminViewProduct />} />
      </Routes>
    </>
  );
}

export default App;
