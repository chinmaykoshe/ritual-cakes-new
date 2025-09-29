// CusBillPage.jsx
import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment";

const CusBillPage = () => {
  const { customizationId } = useParams();
  const navigate = useNavigate();
  const [customization, setCustomization] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const invoiceRef = useRef();
  const apiUrl = "https://ritual-cakes-new-ogk5.vercel.app/api";

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchCustomization = async () => {
      try {
        if (!token) throw new Error("Token missing. Please login again.");
        const res = await fetch(`${apiUrl}/customizations/${customizationId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(`Failed to fetch customization: ${res.status}`);
        const data = await res.json();
        setCustomization(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomization();
  }, [customizationId, token]);

  const handlePrint = () => {
    const printContents = invoiceRef.current.innerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };

  const handleChange = (field, value) => {
    setCustomization(prev => ({ ...prev, [field]: value }));
  };

  if (loading) return <div className="p-6 text-center">Loading bill...</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;
  if (!customization) return <div className="p-6">Customization not found.</div>;

  return (
    <div className="p-8 max-w-3xl mx-auto font-sans">
      <div ref={invoiceRef} className="p-6 border shadow-lg bg-white rounded-lg">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <img src="/favicon.ico.png" alt="Ritual Logo" className="h-16 w-16 rounded-full" />
            <div>
              <h1 className="text-3xl font-bold text-pink-600">Ritual Cakes</h1>
            </div>
          </div>
          <div className="text-right">
            <p className="font-bold">Invoice</p>
            <p className="text-gray-600 text-sm">
              Date: {editMode ? (
                <input
                  type="date"
                  value={customization.deliveryDate ? customization.deliveryDate.slice(0, 10) : ""}
                  onChange={e => handleChange("deliveryDate", e.target.value)}
                  className="border px-1 py-1 w-full"
                />
              ) : (
                moment(customization.deliveryDate).format("YYYY-MM-DD")
              )}
            </p>
            <p className="text-gray-600 text-sm">
              Customization ID: {customization._id}
            </p>
          </div>
        </div>

        {/* Customer Info */}
        <div className="mb-4 border-t pt-2">
          <p className="font-semibold">Billed To:</p>
          {editMode ? (
            <>
              <input
                type="text"
                value={customization.name}
                onChange={e => handleChange("name", e.target.value)}
                className="border px-1 py-1 w-full mb-1"
              />
              <input
                type="text"
                value={customization.email}
                onChange={e => handleChange("email", e.target.value)}
                className="border px-1 py-1 w-full mb-1"
              />
              <input
                type="text"
                value={customization.address}
                onChange={e => handleChange("address", e.target.value)}
                className="border px-1 py-1 w-full"
              />
            </>
          ) : (
            <>
              <p>{customization.name}</p>
              <p>{customization.email}</p>
              <p>{customization.address}</p>
            </>
          )}
        </div>

        {/* Cake Details */}
        <div className="mb-4">
          <p className="font-semibold">Cake Type / Size / Flavor:</p>
          <p>
            {customization.cakeType} / {customization.size} / {customization.flavor}
          </p>
        </div>

        {/* Cake Message */}
        <div className="mb-6">
          <p className="font-semibold">Cake Message:</p>
          {editMode ? (
            <textarea
              value={customization.message || ""}
              onChange={e => handleChange("message", e.target.value)}
              className="border px-2 py-1 w-full"
            />
          ) : (
            <p>{customization.message || "N/A"}</p>
          )}
        </div>

        {/* Price */}
        <div className="text-right font-bold text-xl mb-4">
          Price: ₹{customization.price}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center space-y-2 text-gray-700 text-sm">
          <p>
            If you have any questions, feel free to{" "}
            <a href="mailto:ritualcakes2019@gmail.com" className="underline text-pink-600">
              contact us
            </a>.
          </p>
          <p>Sincerely, <br />Ritual Cakes</p>
          <p>&copy; {new Date().getFullYear()} Ritual Cakes. All rights reserved.</p>
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-6 flex justify-center gap-4">
        <button
          onClick={() => setEditMode(!editMode)}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded"
        >
          {editMode ? "Cancel Edit" : "Edit Bill"}
        </button>
        <button
          onClick={handlePrint}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
        >
          Print Bill
        </button>
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default CusBillPage;
