import { Link, Route, Router, Routes } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/login/LoginPage";
import RegisterPage from "./pages/register/RegisterPage";
import ContactPage from "./pages/contact/ContactPage";
import ServicePage from "./pages/services/ServicePage";
import CheckoutPage from "./pages/checkout/CheckoutPage";
import CartPage from "./pages/cart/CartPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="login" element={<LoginPage />}></Route>
        <Route path="register" element={<RegisterPage />}></Route>
        <Route path="contact" element={<ContactPage />}></Route>
        <Route path="service" element={<ServicePage />}></Route>
        <Route path="checkout" element={<CheckoutPage />}></Route>
        <Route path="cart" element={<CartPage />}></Route>
      </Routes>
    </>
  );
}

export default App;
