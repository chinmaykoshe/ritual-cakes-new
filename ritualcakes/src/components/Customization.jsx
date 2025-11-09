import React from 'react';
import { useCustomization } from '../context/customizeContext';
import { useNavigate } from 'react-router-dom';

function CustomizationForm() {
  const {
    formData,
    handleChange,
    submitCustomization,
    loading,
    error,
    success,
  } = useCustomization();
  const navigate = useNavigate();
  const availableCakeTypes = {
    "0.5 kg": ["Round", "Heart", "Square"],
    "1 kg": ["Round", "Heart", "Square"],
    "1.5 kg": ["Round", "Square"],
    "2 kg": ["Square"],
    "2.5 kg": ["Square"],
    "3 kg": ["Square"],
    "3.5 kg": ["Square"],
    "4 kg": ["Square"],
  };
  const flavors = [
    "Plain Chocolate", "Chocochips Zebra", "Vanilla Chocochips", "Hazelnut Mousse Cream Cake",
    "White Forest", "Black Forest", "Chocolate Forest", "Belgium Chocolate", "Coffee", "Roasted Almond",
    "Dairy Milk", "Dry Fruits", "Hazelnut Nutella", "Dairy Milk Dry Fruits", "KitKat", "Alpento (White Chocolate + Dark Chocolate)",
    "Casotto (Strawberry Crush + Roasted Almonds)", "Celebration (Butterscotch + Chocolate)", "Truffle",
    "Chocochips Truffle", "White Truffle", "White Chocochips Truffle", "Roasted Almond Truffle", "darkcustombg1ie",
    "Walnut darkcustombg1ie", "Cashew Nut darkcustombg1ie", "Vanilla", "Mango", "Strawberry", "Blueberry", "Litchi",
    "Bubble Gum", "Opera (Mixed Flavors)", "Berry Berry (Strawberry + Pineapple)", "Butterscotch",
    "Berry Custard (Strawberry + Custard Apple)", "Tender Coconut", "Anjeer", "Rose Falooda", "Kulfi Falooda",
    "Rasmalai", "Rose Rasmalai", "Rajbhog", "Gulab Jamun", "Rabdi", "Kaju Katli", "Lotus Biscoff", "Kesar Milk",
    "Rose Milk", "American Ice Cream", "Red Velvet Cheesecake", "Blueberry Cheesecake", "Mango Cheesecake",
    "Pineapple (Real Fruit)", "Strawberry Sitaphal (Real Fruit)", "Cranberry(Real Fruit)", "Blueberry (Real Fruit)",
    "Mixed Fruit (Real Fruit)", "Strawberry (Real Fruit)", "Mango (Real Fruit)"
  ];
  const handleSizeChange = (event) => {
    handleChange(event);
  };
  const filteredCakeTypes = formData.size ? availableCakeTypes[formData.size] : [];
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 2);
  const minDateString = minDate.toISOString().split("T")[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    submitCustomization(e);
  };
  const isLoggedIn = localStorage.getItem("token");

  return (
    <div className="mx-auto max-w-4xl px-6 py-8 lg:py-16 bg-white bg-opacity-30 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-center">Customize Your Cake</h1>
      {!isLoggedIn && (
        <div className='flex justify-center'>
        <p className="text-red-600 md:font-semibold ">
          Please <span className="cursor-pointer text-red-500" onClick={() => navigate('/login')}>sign in</span> to place customized orders online.
        </p>
        </div> 
      )}
      <form className="bg-white p-6 rounded-lg shadow-md" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Full Name of orderer"
            className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-darkcustombg focus:outline-none"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={!isLoggedIn}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-darkcustombg focus:outline-none"
            value={formData.email}
            onChange={handleChange}
            required
            disabled
          />
        </div>
        <div className="mb-4">
          <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">Phone Number</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            placeholder="Whatsapp Number Suggested"
            className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-darkcustombg focus:outline-none"
            value={formData.phone}
            onChange={handleChange}
            required
            disabled={!isLoggedIn}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="address" className="block text-gray-700 font-medium mb-2">Address</label>
          <textarea
            id="address"
            name="address"
            placeholder="Your address"
            className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-darkcustombg focus:outline-none"
            value={formData.address}
            onChange={handleChange}
            required
            disabled={!isLoggedIn}
          ></textarea>
        </div>
        <div className="mb-4">
          <label htmlFor="size" className="block text-gray-700 font-medium mb-2">Size</label>
          <select
            id="size"
            name="size"
            className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-darkcustombg focus:outline-none"
            onChange={handleSizeChange}
            value={formData.size}
            required
            disabled={!isLoggedIn}
          >
            <option value="">Select Size</option>
            {Object.keys(availableCakeTypes).map((size) => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="cakeType" className="block text-gray-700 font-medium mb-2">Cake Type</label>
          <select
            id="cakeType"
            name="cakeType"
            className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-darkcustombg focus:outline-none"
            required
            disabled={filteredCakeTypes.length === 0 || !isLoggedIn}
            value={formData.cakeType}
            onChange={handleChange}
          >
            <option value="">Select Cake Type</option>
            {filteredCakeTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="flavor" className="block text-gray-700 font-medium mb-2">Flavor</label>
          <select
            id="flavor"
            name="flavor"
            className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-darkcustombg focus:outline-none"
            value={formData.flavor}
            onChange={handleChange}
            required
            disabled={!isLoggedIn}
          >
            <option value="">Select Flavor</option>
            {flavors.map((flavor) => (
              <option key={flavor} value={flavor}>{flavor}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="deliveryDate" className="block text-gray-700 font-medium mb-2"><p>Order Date</p><p className="text-xs text-gray-300">Order Date must be after 2 days</p></label>
          <input
            type="date"
            id="deliveryDate"
            name="deliveryDate"
            className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-darkcustombg focus:outline-none"
            required
            min={minDateString}
            value={formData.deliveryDate}
            onChange={handleChange}
            disabled={!isLoggedIn}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="message" className="block text-gray-700 font-medium mb-2">Message on Cake</label>
          <input
            type="text"
            id="message"
            name="message"
            placeholder="Happy Birthday "
            className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-darkcustombg focus:outline-none"
            value={formData.message}
            onChange={handleChange}
            disabled={!isLoggedIn}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="imageOrDesign" className="block text-gray-700 font-medium mb-2">Image URL</label>
          <input
            type="text"
            id="imageOrDesign"
            name="imageOrDesign"
            className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-darkcustombg focus:outline-none"
            placeholder="Enter Image URL"
            value={formData.imageOrDesign}
            onChange={handleChange}
            disabled={!isLoggedIn}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="specialInstructions" className="block text-gray-700 font-medium mb-2">Special Instructions</label>
          <textarea
            id="specialInstructions"
            placeholder="please mention time between 10 AM TO 11 PM"
            name="specialInstructions"
            className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-darkcustombg focus:outline-none"
            value={formData.specialInstructions}
            onChange={handleChange}
            disabled={!isLoggedIn}
          ></textarea>
        </div>
        <p className="text-center text-sm font-medium text-customGray mt-4 mb-8 bg-yellow-200 p-4 rounded-lg border border-yellow-400">
          <span className="font-bold text-red-600">Note:</span> If the design is multi-tiered/multi-layered, please choose a weight above 1.5kg for a 2-tier cake and 2.5kg for a 3-tier cake.
        </p>
        <button
          type="submit"
          className="bg-darkcustombg2 text-white px-6 py-3 rounded-lg font-semibold w-full disabled:opacity-50"
          disabled={loading || !isLoggedIn}
        >
          {loading ? "Submitting..." : "Submit Customization"}
        </button>
      </form>
      {error && (
        <div className="text-red-500 mt-4 text-center">{error}</div>
      )}
      {success && (
        <div className="text-green-500 mt-4 text-center">
          Customization submitted successfully!
          <button
            onClick={() => navigate("/orders")}
            className="m-4 bg-darkcustombg2 text-white py-2 px-6 rounded-lg hover:text-darkcustombg2 hover:bg-white hover:border-2 hover:border-darkcustombg2"
          >
            Check Your Orders Here
          </button>
        </div>
      )}
    </div>
  );
}

export default CustomizationForm;
