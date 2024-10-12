import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Header from "../Header";
import Footer from "../../Footer";

function ProductDetails() {
  const { id } = useParams(); // Get the product ID from the URL params
  const [product, setProduct] = useState(null);

  // Fetch product details from the API
  useEffect(() => {
    async function fetchProductDetails() {
      try {
        const response = await axios.get(`http://localhost:5056/product/${id}`);
        setProduct(response.data);
      } catch (err) {
        console.log(err);
      }
    }

    fetchProductDetails();
  }, [id]);

  // Placeholder action for "Mua hàng" button
  const handleBuyNow = () => {
    alert(`Đã thêm sản phẩm ${product.name} vào giỏ hàng!`);
    // You can replace the alert with actual cart logic or redirect to the cart/checkout page
  };

  if (!product) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
        <img
          className="w-full h-64 object-cover mb-4"
          src={product.picture}
          alt={product.name}
        />
        <p className="text-red-600 font-bold text-xl mb-4">{product.price}</p>
        <p>{product.description}</p>

        {/* Mua hàng Button */}
        <button
          onClick={handleBuyNow}
          className="mt-6 w-full bg-black text-white py-3 px-6 rounded hover:bg-gray-900 transition duration-300 font-bold"
        >
          MUA HÀNG
        </button>
      </div>
      <Footer />
    </>
  );
}

export default ProductDetails;
