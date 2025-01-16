import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useCustomization } from "../context/customizeContext";  // Using your context
import { designnames } from "../designs/designassets"; // Assuming you have some predefined designs

// Define available cake types based on size
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

// Define available flavors
const flavors = [
  "Plain Chocolate", "Chocochips Zebra", "Vanilla Chocochips", "Hazelnut Mousse Cream Cake",
  "White Forest", "Black Forest", "Chocolate Forest", "Belgium Chocolate", "Coffee", "Roasted Almond",
  "Dairy Milk", "Dry Fruits", "Hazelnut Nutella", "Dairy Milk Dry Fruits", "KitKat", "Alpento (White Chocolate + Dark Chocolate)",
  "Casotto (Strawberry Crush + Roasted Almonds)", "Celebration (Butterscotch + Chocolate)", "Truffle",
  "Chocochips Truffle", "White Truffle", "White Chocochips Truffle", "Roasted Almond Truffle", "Brownie",
  "Walnut Brownie", "Cashew Nut Brownie", "Vanilla", "Mango", "Strawberry", "Blueberry", "Litchi",
  "Bubble Gum", "Opera (Mixed Flavors)", "Berry Berry (Strawberry + Pineapple)", "Butterscotch",
  "Berry Custard (Strawberry + Custard Apple)", "Tender Coconut", "Anjeer", "Rose Falooda", "Kulfi Falooda",
  "Rasmalai", "Rose Rasmalai", "Rajbhog", "Gulab Jamun", "Rabdi", "Kaju Katli", "Lotus Biscoff", "Kesar Milk",
  "Rose Milk", "American Ice Cream", "Red Velvet Cheesecake", "Blueberry Cheesecake", "Mango Cheesecake",
  "Pineapple (Real Fruit)", "Strawberry Sitaphal (Real Fruit)", "Cranberry(Real Fruit)", "Blueberry (Real Fruit)",
  "Mixed Fruit (Real Fruit)", "Strawberry (Real Fruit)", "Mango (Real Fruit)"
];

const DesignCustomizationPage = () => {
  const { designName } = useParams();  // Get design name from URL
  const { formData, handleChange, submitCustomization, loading, error, success } = useCustomization();
  const [design, setDesign] = useState(null);
  const [availableTypes, setAvailableTypes] = useState([]);
  const [selectedSize, setSelectedSize] = useState(formData.size || "");  // Initialize with formData if available

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (designnames.hasOwnProperty(designName)) {
      const currentDesign = {
        name: designName,  // Use the designName as the name
        imageUrl: designnames[designName],  // Get the corresponding image URL
      };
      setDesign(currentDesign);
      
      // Directly set imageOrDesign without calling handleChange
      formData.imageOrDesign = currentDesign.name; // Directly update the value here
      
    } else {
      console.error("Design not found in designnames!");  // Log error if design is not found
    }
  }, [designName, formData]);

  useEffect(() => {
    if (selectedSize) {
      setAvailableTypes(availableCakeTypes[selectedSize] || []);
    }
  }, [selectedSize]);

  if (!design) {
    return (
      <div className="text-center mt-16">
        <h2 className="text-xl font-semibold text-darkcustomGray">Design not found</h2>
        <p className="text-customGray">The design you are looking for does not exist.</p>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    submitCustomization(e);  // Call submit function from context
  };

  return (
    <div className="mx-2 max-w-7xl md:mx-auto px-4 py-12 bg-white bg-opacity-30 rounded-lg shadow-lg">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Side: Design Image */}
        <div className="flex-1">
          <img
            src={design.imageUrl}
            alt={design.name}
            className="w-full h-[500px] object-contain rounded-lg shadow-md"
          />
        </div>

        {/* Right Side: Customization Form */}
        <div className="flex-1">


            {/* Image URL (Design Name) */}
            <div className="mb-4">
              <label htmlFor="imageOrDesign" className="block text-gray-700 font-medium mb-2">Image URL</label>
              <input
                type="text"
                id="imageOrDesign"
                name="imageOrDesign"
                className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-darkcustombg focus:outline-none"
                placeholder="Enter Image URL"
                value={formData.imageOrDesign}  // This will now be the design name
                disabled
              />
            </div>



          {/* Customization Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block font-bold text-sm mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block font-bold text-sm mb-2">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            {/* Address */}
            <div>
              <label className="block font-bold text-sm mb-2">Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            {/* Cake Size */}
            <div>
              <label className="block font-bold text-sm mb-2">Size</label>
              <select
                name="size"
                value={selectedSize}
                onChange={(e) => {
                  setSelectedSize(e.target.value);
                  handleChange(e);  // Also update formData with handleChange
                }}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Select Size</option>
                {Object.keys(availableCakeTypes).map((size) => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>

            {/* Cake Type */}
            <div>
              <label className="block font-bold text-sm mb-2">Cake Type</label>
              <select
                name="cakeType"
                value={formData.cakeType}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Select Cake Type</option>
                {availableTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Flavor */}
            <div>
              <label className="block font-bold text-sm mb-2">Flavor</label>
              <select
                name="flavor"
                value={formData.flavor}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Select Flavor</option>
                {flavors.map((flavor) => (
                  <option key={flavor} value={flavor}>{flavor}</option>
                ))}
              </select>
            </div>

            {/* Delivery Date */}
            <div>
              <label className="block font-bold text-sm mb-2">Delivery Date</label>
              <input
                type="date"
                name="deliveryDate"
                value={formData.deliveryDate}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            {/* Message on Cake */}
            <div>
              <label className="block font-bold text-sm mb-2">Message on Cake</label>
              <input
                type="text"
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>


            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-darkcustombg text-white py-2 rounded-lg focus:outline-none hover:bg-darkcustombg-light"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit Customization'}
            </button>

            {error && <div className="text-red-500 mt-4 text-center">{error}</div>}
            {success && <div className="text-green-500 mt-4 text-center">Customization submitted successfully!</div>}
          </form>
        </div>
      </div>

      <p className="text-center text-sm font-medium text-customGray mt-4 mb-8 bg-yellow-200 p-4 rounded-lg border border-yellow-400">
  <span className="font-bold text-red-600">Note:</span> If the design is multi-tiered/multi-layered, please choose a weight above 1.5kg for a 2-tier cake and 2.5kg for a 3-tier cake.
</p>


   </div>
  );
};

export default DesignCustomizationPage;
