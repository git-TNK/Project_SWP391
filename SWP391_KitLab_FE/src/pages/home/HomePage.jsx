import React, { useEffect, useState } from "react";
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

  useEffect(() => {
    fetchProduct();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <section>
          <h2 className="text-2xl font-bold mb-6">Sản Phẩm Mới</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {listProduct.map((item, index) => (
              <li
                key={index}
                className="border border-gray-200 rounded-lg overflow-hidden shadow-md"
              >
                <div className="flex flex-col h-full">
                  <img
                    className="w-full h-48 object-cover"
                    src={item.picture}
                    alt={item.name}
                  />
                  <div className="p-4 flex flex-col flex-grow">
                    <p className="text-lg font-semibold mb-2">{item.name}</p>
                    <p className="text-red-600 font-bold mb-4">{item.price}</p>
                    <button className="mt-auto w-full bg-white text-black py-2 px-4 rounded hover:bg-black hover:text-white transition duration-300 font-medium">
                      MUA HÀNG
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default HomePage;
