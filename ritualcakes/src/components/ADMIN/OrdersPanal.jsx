import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";

const OrdersPanel = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query

  const updateOrderStatus = async (orderId, newStatus) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token not found. Please log in again.");
      }

      const response = await axios.put(
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

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token not found. Please log in again.");
      }

      const response = await axios.get("https://ritual-cakes--alpha.vercel.app/api/orders/all", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Assuming the orders are in response.data.orders
      if (Array.isArray(response.data.orders)) {
        // Filter out orders from 'RITUALCAKE.ADMIN@gmail.com'
        const filteredOrders = response.data.orders.filter(order => order.userEmail !== 'RITUALCAKE.ADMIN@gmail.com');
        setOrders(filteredOrders);
      } else {
        throw new Error("Received data is not an array");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  // Filter orders based on search query
  const filteredOrders = orders.filter((order) => {
    return (
      order.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.deliveryAddress?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const exportToCSV = () => {
    const headers = [
      "Order ID",
      "Customer Email",
      "Order Date",
      "Order Time",
      "Delivery Address",
      "Items",
      "Message on Cake",
      "Total Amount",
      "Status",
    ];

    const rows = orders.map((order) => {
      const items = order.orderItems
        .map(
          (item) =>
            `Name: ${item.name}, Weight: ${item.weight}kg, Shape: ${item.shape}, Quantity: ${item.quantity}`
        )
        .join(" | ");

      return [
        order._id,
        order.userEmail,
        new Date(order.orderDate).toLocaleDateString(),
        order.orderTime ? moment(order.orderTime).format("hh:mm A") : "N/A",
        order.deliveryAddress || "N/A",
        items,
        order.messageOnCake || "N/A",
        `₹${order.totalAmount}`,
        order.status,
      ];
    });

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

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

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

      {/* Display "No orders yet" message if no orders */}
      {filteredOrders.length === 0 ? (
        <div className="text-center text-lg font-semibold mb-4">No orders yet</div>
      ) : (
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">Order ID</th>
              <th className="border border-gray-300 px-4 py-2">Customer Email</th>
              <th className="border border-gray-300 px-4 py-2">Order Date</th>
              <th className="border border-gray-300 px-4 py-2">Order Time</th>
              <th className="border border-gray-300 px-4 py-2">Delivery Address</th>
              <th className="border border-gray-300 px-4 py-2">Items</th>
              <th className="border border-gray-300 px-4 py-2">Message on Cake</th>
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
                <td className="border border-gray-300 px-4 py-2">{order.orderTime}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {order.deliveryAddress || "N/A"}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <ul>
                    {order.orderItems.map((item, index) => (
                      <li key={index} className="py-1">
                        <strong>Name:</strong>-{item.name}<br />
                        <strong>Weight:</strong>-{item.weight}kg<br />
                        <strong>Shape:</strong>-{item.shape}<br />
                        <strong>Quantity:</strong>-{item.quantity}
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {order.messageOnCake || "N/A"}
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
