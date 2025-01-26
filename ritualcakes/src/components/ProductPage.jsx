import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { elements } from "../assets/assets";
import Card from "./Card"; // Import the Card component
import Reviews from "./Reviews.jsx"; // Import Reviews component
import { useCart } from "../context/CartContext"; // Import useCart hook to manage cart state

const ProductPage = () => {
  const { orderId } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [weight, setWeight] = useState("500g");
  const [shape, setShape] = useState("Square");
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [activeTab, setActiveTab] = useState("description");
  const [price, setPrice] = useState(0);
  const { addToCart } = useCart(); // Use addToCart function from context
  const [errorMessage, setErrorMessage] = useState(""); // State for success message
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false); // Track loading state

  useEffect(() => {
    for (const category of Object.values(elements)) {
      const foundProduct = category.find((item) => item.orderID === orderId);
      if (foundProduct) {
        setProduct(foundProduct);
        break;
      }
    }
  }, [orderId]);

  useEffect(() => {
    if (product) {
      setPrice(product.prices[weight]);
      const availableShapes = getAvailableShapes(weight);
      if (availableShapes.includes("Round")) {
        setShape("Round");
      } else {
        setShape("Square");
      }
    }
  }, [product, weight]);

  useEffect(() => {
    if (product && product.related) {
      const related = product.related
        .map((relatedId) => {
          for (const category of Object.values(elements)) {
            const found = category.find((item) => item.orderID === relatedId);
            if (found) return found;
          }
          return null;
        })
        .filter((item) => item !== null);
      setRelatedProducts(related);
    }
  }, [product]);


  const handleQuantityChange = (action) => {
    setQuantity((prev) => Math.max(1, action === "increment" ? prev + 1 : prev - 1));
  };

  const getAvailableShapes = (weight) => {
    const weightKg = parseFloat(weight);
    if (weightKg === 500) return ["Round", "Heart", "Square"];
    if (weightKg <= 1) return ["Round", "Heart", "Square"];
    if (weightKg <= 1.5) return ["Round", "Square"];
    return ["Square"];
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleAddToCart = async () => {
    const token = localStorage.getItem('token'); // Check for token
  
    if (!token) {
      // If no token, inform the user to sign in
      setErrorMessage("Please sign in to add items to your cart");
      setTimeout(() => setErrorMessage(""), 3000); // Clear the message after 3 seconds
      return;
    }
  
    setLoading(true); // Start loading when the function is triggered
  
    try { 
      const productToAdd = {
        orderID: product.orderID,
        name: product.name,
        shape,
        weight,
        quantity,
        price,
        img: product.img,
      };
  
      const response = await addToCart(productToAdd); // Call the async function
      if (response) {
        setSuccessMessage("Product added successfully");
        setTimeout(() => setSuccessMessage(""), 3000); // Clear the message after 3 seconds
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      setErrorMessage("Failed to add product. Please try again.");
      setTimeout(() => setErrorMessage(""), 3000); // Clear the message after 3 seconds
    } finally {
      setLoading(false); // Stop loading once the process is complete
    }
  };
  

  if (!product) {
    return (
      <div className="text-center mt-16">
        <h2 className="text-xl font-semibold text-darkcustomGray">Product not found</h2>
        <p className="text-customGray">The product you are looking for does not exist.</p>
      </div>
    );
  }

  return (
    <div className="mx-2 max-w-7xl md:mx-auto px-4 py-12 bg-white bg-opacity-30 rounded-lg px-4 lg:p-8 lg:m-top-16 shadow-lg relative">

      <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-8">
        <div className="flex-1">
          <img
            src={product.img}
            alt={product.name}
            className="w-full justify-center object-cover h-[200px] md:h-[500px] rounded-lg shadow-md"
            onError={(e) => (e.target.src = "./assets/fallbackImage.png")}
          />
        </div>

        <div className="flex-1 lg:pr-24">
          <h1 className="text-3xl lg:text-6xl font-bold mt-2 mb-2 md:mb-4 text-darkcustomGray">{product.name}</h1>
          {product.rating && (
            <p className="text-base lg:text-lg text-darkcustomGray mb-2">Rating: {product.rating} ⭐</p>
          )}
          <p className="text-xl lg:text-3xl md:mt-8 mt-2 font-semibold text-gray-600 mb-4 md:mb-6">
            Price: Rs. {price * quantity}
          </p>


          <p className="font-bold text-sm lg:text-lg text-darkcustomGray mb-2">Select Weight:</p>
          <div className="flex flex-wrap gap-4 lg:gap-6 mb-4 lg:mb-6">
            {Object.keys(product.prices).map((weightOption) => (
              <div
                key={weightOption}
                className={`w-12 h-8 lg:w-20 lg:h-12 flex items-center justify-center text-center text-sm lg:text-xl font-semibold rounded-lg border-2 cursor-pointer ${weight === weightOption ? "bg-darkcustombg darkcustombg1 border-darkcustombg" : "bg-white border-darkcustombg"
                  }`}
                onClick={() => setWeight(weightOption)}
              >
                {weightOption}
              </div>
            ))}
          </div>

          <p className="font-bold text-sm md:text-lg text-darkcustomGray mb-2">Select Shape:</p>
          <div className="flex flex-wrap gap-4 md:gap-6 mb-4 md:mb-6">
            {getAvailableShapes(weight).map((shapeOption) => (
              <div
                key={shapeOption}
                className={`w-16 h-8 lg:w-20 lg:h-12 flex items-center justify-center text-center text-sm md:text-xl font-semibold rounded-lg border-2 cursor-pointer ${shape === shapeOption ? "bg-darkcustombg text-darkcustombg1 border-darkcustombg" : "bg-white border-darkcustombg"
                  }`}
                onClick={() => setShape(shapeOption)}
              >
                {shapeOption}
              </div>
            ))}
          </div>

          <p className="font-bold text-sm md:text-lg text-darkcustomGray mb-2">Select Quantity:</p>
          <div className="flex items-center mb-2 md:mb-4">
            <button
              onClick={() => handleQuantityChange("decrement")}
              className="px-2 md:px-4 py-1 md:py-2 border rounded hover:bg-darkcustombg"
            >
              -
            </button>
            <span className="px-2 md:px-4 py-1 md:py-2 border mx-1 md:mx-2 text-sm md:text-base">{quantity}</span>
            <button
              onClick={() => handleQuantityChange("increment")}
              className="px-2 md:px-4 py-1 md:py-2 border rounded hover:bg-darkcustombg"
            >
              +
            </button>
          </div>



          {errorMessage && <p className="text-red-500 text-center p-2">{errorMessage}</p>}
          {successMessage && <p className="text-darkcustombg2 text-center p-2">{successMessage}</p>}


          {/* Updated Add to Cart button */}
          <button
            type="submit"
            className={`w-full font-bold mt-4 py-2 px-6 rounded-lg ${loading
                ? "opacity-50 cursor-not-allowed bg-darkcustombg2 text-white"
                : "bg-darkcustombg2 text-white hover:text-darkcustombg2 hover:bg-white hover:border-2 hover:border-darkcustombg2"
              }`}
            onClick={handleAddToCart}
            disabled={loading} // Disable the button only when loading
          >
            {loading ? "Adding to Cart..." : "Add to Cart"}
          </button>

        </div>
      </div>

      <div className="mt-8 md:mt-12">
        <div className="tabs flex flex-wrap border-b mb-4 md:mb-6">
          <button
            onClick={() => setActiveTab("description")}
            className={`px-2 md:px-4 py-1 md:py-2 font-semibold text-sm md:text-base ${activeTab === "description"
                ? "text-darkcustombg2 border-b-2 border-darkcustombg2"
                : "text-gray-500 hover:text-darkcustombg2"
              }`}
          >
            Description
          </button>

          <button
            onClick={() => setActiveTab("reviews")}
            className={`px-2 md:px-4 py-1 md:py-2 font-semibold text-sm md:text-base ${activeTab === "reviews"
                ? "text-darkcustombg2 border-b-2 border-darkcustombg2"
                : "text-gray-500 hover:text-darkcustombg2"
              }`}
          >
            Reviews
          </button>
        </div>

        {activeTab === "description" ? (
          <p className="mt-4 text-gray-500">{product.description}</p>

        ) : (
          <Reviews orderID={product.orderID} />
        )}
      </div>

      <div className="mt-12">
        <h2 className="text-xl font-semibold text-darkcustomGray">Related Products</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
          {relatedProducts.length > 0 ? (
            relatedProducts.map((relatedProduct) => (
              <Card key={relatedProduct.orderID} orderID={relatedProduct.orderID} />
            ))
          ) : (
            <p>No related products found.</p>
          )}
        </div>
      </div>


    </div>
  );
};

export default ProductPage;
