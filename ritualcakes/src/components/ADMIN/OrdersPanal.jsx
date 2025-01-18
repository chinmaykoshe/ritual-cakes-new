import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";

const OrdersPanel = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token not found. Please log in again.");

      // Call the API to fetch all orders (for admin)
      const response = await axios.get("https://ritual-cakes-new-ogk5.vercel.app/api/orders", {
        headers: { Authorization: `Bearer ${token}` }, // Send token in the request header
      });

      // You can filter out admin orders if needed here
      const filteredOrders = response.data.filter(
        (order) => order.userEmail !== "ritualcake.admin@gmail.com"
      );

      setOrders(filteredOrders);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token not found. Please log in again.");

      await axios.put(
        `https://ritual-cakes--alpha.vercel.app/api/orders/${orderId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to update order status");
    } finally {
      setLoading(false);
    }
  };

  const deleteOrder = async (orderId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token not found. Please log in again.");

      await axios.delete(`https://ritual-cakes--alpha.vercel.app/api/orders/${orderId}`, 
      {
        headers: { Authorization: `Bearer ${token}` },
      });

      setOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderId));
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to delete order");
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    const headers = ["Order ID", "Customer Email", "Order Date", "Total Amount", "Status"];
    const rows = orders.map((order) => [
      order._id,
      order.userEmail,
      new Date(order.orderDate).toLocaleDateString(),
      `₹${order.totalAmount}`,
      order.status,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((item) => `"${item}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `orders_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSearch = (event) => setSearchQuery(event.target.value);

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((order) =>
    [order.userEmail, order._id, order.deliveryAddress]
      .some((field) => field?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Orders Panel</h2>
      <div className="flex mb-4">
        <input
          type="text"
          className="border border-gray-400 rounded px-2 py-1 mr-4"
          placeholder="Search by Order ID, Email, or Address"
          value={searchQuery}
          onChange={handleSearch}
        />
        <button
          onClick={exportToCSV}
          className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
        >
          Export to CSV
        </button>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center text-lg font-semibold mb-4">No orders yet</div>
      ) : (
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">Order ID</th>
              <th className="border border-gray-300 px-4 py-2">Customer Email</th>
              <th className="border border-gray-300 px-4 py-2">Order Date</th>
              <th className="border border-gray-300 px-4 py-2">Total</th>
              <th className="border border-gray-300 px-4 py-2">Status</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
              <th className="border border-gray-300 px-4 py-2">Delete</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order._id}>
                <td className="border border-gray-300 px-4 py-2">{order._id}</td>
                <td className="border border-gray-300 px-4 py-2">{order.userEmail}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {new Date(order.orderDate).toLocaleDateString()}
                </td>
                <td className="border border-gray-300 px-4 py-2">₹{order.totalAmount}</td>
                <td className="border border-gray-300 px-4 py-2">{order.status}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <select
                    className="border border-gray-400 rounded px-2 py-1"
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    onClick={() => deleteOrder(order._id)}
                    className="bg-red-500 text-white py-1 px-4 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OrdersPanel;
