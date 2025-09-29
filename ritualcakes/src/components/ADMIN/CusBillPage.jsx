import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import { designnames } from "../../designs/designassets";

const CusBillPage = () => {
  const { customizationId } = useParams();
  const [customization, setCustomization] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const billRef = useRef();

  const apiUrl = "https://ritual-cakes-new-ogk5.vercel.app/api";

  const fetchCustomization = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token not found. Please login again.");

      const res = await axios.get(
        `${apiUrl}/customizations/single/${customizationId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCustomization(res.data.customization);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || "Failed to fetch customization");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomization();
  }, [customizationId]);

  const handlePrint = () => {
    const printContents = billRef.current.innerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">Error: {error}</div>;
  if (!customization) return <div className="p-8">No customization found.</div>;

  return (
    <div className="p-8">
      <div ref={billRef} className="max-w-3xl mx-auto border p-6 shadow-lg bg-white">
        <h1 className="text-2xl font-bold mb-4 text-center">Ritual Cakes - Custom Order Bill</h1>
        <p className="mb-2">
          <strong>Order ID:</strong> {customization._id}
        </p>
        <p className="mb-2">
          <strong>Placed on:</strong> {moment(customization.createdAt).format("YYYY-MM-DD")}
        </p>

        <h2 className="text-xl font-semibold mt-4 mb-2">Customer Information</h2>
        <p><strong>Name:</strong> {customization.name}</p>
        <p><strong>Email:</strong> {customization.email}</p>
        <p><strong>Phone:</strong> {customization.phone || "N/A"}</p>
        <p><strong>Address:</strong> {customization.address}</p>

        <h2 className="text-xl font-semibold mt-4 mb-2">Cake Details</h2>
        <table className="w-full border-collapse border border-gray-300 mb-4">
          <tbody>
            <tr>
              <td className="border border-gray-300 px-4 py-2 font-semibold">Cake Type</td>
              <td className="border border-gray-300 px-4 py-2">{customization.cakeType}</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2 font-semibold">Size</td>
              <td className="border border-gray-300 px-4 py-2">{customization.size}</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2 font-semibold">Flavor</td>
              <td className="border border-gray-300 px-4 py-2">{customization.flavor}</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2 font-semibold">Special Instructions</td>
              <td className="border border-gray-300 px-4 py-2">{customization.specialInstructions || "None"}</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2 font-semibold">Delivery Date</td>
              <td className="border border-gray-300 px-4 py-2">{moment(customization.deliveryDate).format("YYYY-MM-DD")}</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2 font-semibold">Approval Status</td>
              <td className="border border-gray-300 px-4 py-2">{customization.approvalStatus}</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2 font-semibold">Price</td>
              <td className="border border-gray-300 px-4 py-2">₹{customization.price}</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2 font-semibold">Design / Image</td>
              <td className="border border-gray-300 px-4 py-2">
                {customization.imageOrDesign ? (
                  designnames[customization.imageOrDesign] ? (
                    <img
                      src={designnames[customization.imageOrDesign]}
                      alt={customization.imageOrDesign}
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                  ) : customization.imageOrDesign.startsWith("http") && /\.(jpg|jpeg|png|gif|webp)$/i.test(customization.imageOrDesign) ? (
                    <img
                      src={customization.imageOrDesign}
                      alt="Cake Design"
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                  ) : (
                    <a href={customization.imageOrDesign} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline break-all">
                      Open Link
                    </a>
                  )
                ) : (
                  "No image/design provided"
                )}
              </td>
            </tr>
          </tbody>
        </table>

        <p className="mt-4 text-center">Thank you for ordering from Ritual Cakes!</p>
      </div>

      <div className="text-center mt-6">
        <button
          onClick={handlePrint}
          className="bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600"
        >
          Print Bill
        </button>
      </div>
    </div>
  );
};

export default CusBillPage;
