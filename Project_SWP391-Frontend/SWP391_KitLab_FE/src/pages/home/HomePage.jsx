import React, { useEffect, useState } from "react";
import "./HomePage.css";
import Header from "../Header";
import Footer from "../../Footer";
import axios from "axios";
function HomePage() {
  const [listProduct, setListProduct] = useState([]);

  async function fetchProduct() {
    try {
      const response = await axios.get(`http://localhost:5056/product`);
      setListProduct(response.data);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(function () {
    fetchProduct();
  }, []);

  return (
    <div>
      <Header />
      <section className="product-section">
        <h2>Sản Phẩm Mới</h2>
        <ul className="product-list">
          {listProduct.map((item, index) => {
            return (
              <li key={index} className="product-item">
                <div className="product-card">
                  <img
                    className="img-style"
                    src={item.picture}
                    alt={item.name}
                  />
                  <p className="product-name">{item.name}</p>
                  <p className="price">{item.price}</p>
                  <button className="buy-button">MUA HÀNG</button>
                </div>
              </li>
            );
          })}
        </ul>
      </section>
      <Footer />
    </div>
  );
}

export default HomePage;
