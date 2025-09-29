import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const BillPage = () => {
  const { orderId } = useParams(); // from URL /admin/bill/:orderId
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        if (!token) throw new Error("Token missing. Please login again.");

        const res = await fetch(
          `https://ritual-cakes-new-ogk5.vercel.app/api/orders/id/${orderId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!res.ok) {
          throw new Error(`Failed to fetch order: ${res.status}`);
        }

        const data = await res.json();
        setOrder(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, token]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <div className="p-6 text-center">Loading bill...</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;
  if (!order) return <div className="p-6">Order not found.</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-center mb-6">Order Invoice</h1>

      <div className="mb-6 border-b pb-4">
        <p><strong>Order ID:</strong> {order._id}</p>
        <p><strong>Email:</strong> {order.userEmail}</p>
        <p><strong>Delivery Address:</strong> {order.deliveryAddress || "N/A"}</p>
        <p><strong>Order Date:</strong> {new Date(order.orderDate).toLocaleDateString()}</p>
        <p><strong>Order Time:</strong> {order.orderTime}</p>
        <p><strong>Status:</strong> {order.status}</p>
        <p><strong>Message:</strong> {order.cakeMessage || "N/A"}</p>
      </div>

      <table className="w-full border-collapse border text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2 text-left">Item</th>
            <th className="border px-4 py-2 text-left">Shape</th>
            <th className="border px-4 py-2 text-left">Quantity</th>
            <th className="border px-4 py-2 text-left">Price</th>
            <th className="border px-4 py-2 text-left">Weight</th>
          </tr>
        </thead>
        <tbody>
          {order.orderItems.map((item, index) => (
            <tr key={index}>
              <td className="border px-4 py-2">{item.name}</td>
              <td className="border px-4 py-2">{item.shape || "N/A"}</td>
              <td className="border px-4 py-2">{item.quantity}</td>
              <td className="border px-4 py-2">₹{item.price}</td>
              <td className="border px-4 py-2">{item.weight}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="text-right text-xl font-semibold mt-4">
        Total Amount: ₹{order.totalAmount}
      </div>

      <div className="mt-6 flex justify-center gap-4">
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

export default BillPage;
    