import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import { designnames } from "../../designs/designassets";

const CustomizationPanel = () => {
  const [customizations, setCustomizations] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch customizations from API
  const fetchCustomizations = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token not found. Please log in again.");
      }

      const response = await axios.get("http://localhost:8084/api/customizations", {
        headers: { Authorization: `${token}` },
      });

      // Check if the response data is an array
      if (Array.isArray(response.data)) {
        setCustomizations(response.data);
      } else {
        setCustomizations([]);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to fetch customizations");
    } finally {
      setLoading(false);
    }
  };

  // Filter customizations based on the search query
  const filteredCustomizations = customizations.filter((customization) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      customization.name.toLowerCase().includes(searchLower) ||
      customization.email.toLowerCase().includes(searchLower) ||
      customization.cakeType.toLowerCase().includes(searchLower)
    );
  });

  // Update customization approval status
  const updateCustomizationStatus = async (customizationId, newStatus) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token not found. Please log in again.");
      }

      const response = await axios.put(
        `http://localhost:8084/api/customizations/${customizationId}`,
        { approvalStatus: newStatus },
        { headers: { Authorization: `${token}` } }
      );

      setCustomizations((prevCustomizations) =>
        prevCustomizations.map((customization) =>
          customization._id === customizationId ? { ...customization, approvalStatus: newStatus } : customization
        )
      );
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to update customization status");
    } finally {
      setLoading(false);
    }
  };

  // Delete customization
  const deleteCustomization = async (customizationId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token not found. Please log in again.");
      }

      const response = await axios.delete(
        `http://localhost:8084/api/customizations/${customizationId}`,
        { headers: { Authorization: `${token}` } }
      );

      setCustomizations((prevCustomizations) =>
        prevCustomizations.filter((customization) => customization._id !== customizationId)
      );
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to delete customization");
    } finally {
      setLoading(false);
    }
  };

  // Update price for customization
  const updateCustomizationPrice = async (customizationId, newPrice) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token not found. Please log in again.");
      }

      const response = await axios.put(
        `http://localhost:8084/api/customizations/${customizationId}`,
        { price: newPrice },
        { headers: { Authorization: `${token}` } }
      );

      setCustomizations((prevCustomizations) =>
        prevCustomizations.map((customization) =>
          customization._id === customizationId ? { ...customization, price: newPrice } : customization
        )
      );
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to update price");
    } finally {
      setLoading(false);
    }
  };

  // Export customizations to CSV
  const exportToCSV = () => {
    const headers = [
      "Customization ID",
      "Customer Name",
      "Email",
      "Phone",
      "Address",
      "Cake Size",
      "Cake Type",
      "Flavor",
      "Message",
      "Special Instructions",
      "Delivery Date",
      "Approval Status",
      "Price",
      "imageOrDesign"
    ];

    const rows = customizations.map((customization) => [
      customization._id,
      customization.name,
      customization.email,
      customization.phone || "N/A",
      customization.address,
      customization.size,
      customization.cakeType,
      customization.imageOrDesign,
      customization.flavor,
      customization.message || "N/A",
      customization.specialInstructions || "N/A",
      moment(customization.deliveryDate).format("YYYY-MM-DD"),
      customization.approvalStatus,
      `₹${customization.price}`,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((item) => `"${item}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.setAttribute("href", url);
    link.setAttribute("download", `customizations_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    fetchCustomizations();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Customization Panel</h2>
      <div className="flex items-center mb-4">
      <input
          type="text"
          placeholder="Search by name, email, or cake type"
          className="border border-gray-400 rounded px-4 py-2 w-64 mr-4"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          onClick={exportToCSV}
          className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 "
        >
          Export to CSV
        </button>
      </div>
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">Customization ID</th>
            <th className="border border-gray-300 px-12 py-2">Image Or Design</th>
            <th className="border border-gray-300 px-4 py-2">Customer Name</th>
            <th className="border border-gray-300 px-4 py-2">Email</th>
            <th className="border border-gray-300 px-4 py-2">Phone</th>
            <th className="border border-gray-300 px-4 py-2">Address</th>
            <th className="border border-gray-300 px-4 py-2">Cake Size</th>
            <th className="border border-gray-300 px-4 py-2">Cake Type</th>
            <th className="border border-gray-300 px-4 py-2">Flavor</th>
            <th className="border border-gray-300 px-4 py-2">Message</th>
            <th className="border border-gray-300 px-4 py-2">Special Instructions</th>
            <th className="border border-gray-300 px-4 py-2">Delivery Date</th>
            <th className="border border-gray-300 px-4 py-2">Approval Status</th>
            <th className="border border-gray-300 px-4 py-2">Price</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
            <th className="border border-gray-300 px-4 py-2">Delete</th>
          </tr>
        </thead>
        <tbody>
          {filteredCustomizations.map((customization) => (
            <tr key={customization._id}>
              <td className="border border-gray-300 px-4 py-2">{customization._id}</td>
              <td className="border border-gray-300 px-4 py-2">
                {customization.imageOrDesign ? (
                  customization.imageOrDesign.startsWith('http') ? (
                    <img
                      src={customization.imageOrDesign}
                      alt={`Design: ${customization.imageOrDesign}`}
                      className="w-32 h-32 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.src = '/fallback-image.jpg';
                      }}
                    />
                  ) : (
                    <img
                      src={designnames[customization.imageOrDesign] || '/path/to/fallback-image.jpg'}
                      alt={`Design: ${customization.imageOrDesign}`}
                      className="w-32 h-32 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.src = '/path/to/fallback-image.jpg';
                      }}
                    />
                  )
                ) : (
                  "No image/design provided"
                )}
              </td>
              <td className="border border-gray-300 px-4 py-2">{customization.name}</td>
              <td className="border border-gray-300 px-4 py-2">{customization.email}</td>
              <td className="border border-gray-300 px-4 py-2">{customization.phone || "N/A"}</td>
              <td className="border border-gray-300 px-4 py-2">{customization.address}</td>
              <td className="border border-gray-300 px-4 py-2">{customization.size}</td>
              <td className="border border-gray-300 px-4 py-2">{customization.cakeType}</td>
              <td className="border border-gray-300 px-4 py-2">{customization.flavor}</td>
              <td className="border border-gray-300 px-4 py-2">{customization.message || "N/A"}</td>
              <td className="border border-gray-300 px-4 py-2">{customization.specialInstructions || "N/A"}</td>
              <td className="border border-gray-300 px-4 py-2">{moment(customization.deliveryDate).format("YYYY-MM-DD")}</td>
              <td className="border border-gray-300 px-4 py-2">{customization.approvalStatus}</td>
              <td className="border border-gray-300 px-4 py-2">
                <input
                  type="number"
                  className="border border-gray-400 rounded px-2 py-1"
                  value={customization.price}
                  onBlur={(e) => updateCustomizationPrice(customization._id, parseFloat(e.target.value))}
                  onChange={(e) => {
                    setCustomizations((prevCustomizations) =>
                      prevCustomizations.map((item) =>
                        item._id === customization._id ? { ...item, price: e.target.value } : item
                      )
                    );
                  }}
                />
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <select
                  className="border border-gray-400 rounded px-2 py-1"
                  value={customization.approvalStatus}
                  onChange={(e) => updateCustomizationStatus(customization._id, e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <button
                  onClick={() => deleteCustomization(customization._id)}
                  className="bg-red-500 text-white py-1 px-4 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomizationPanel;
