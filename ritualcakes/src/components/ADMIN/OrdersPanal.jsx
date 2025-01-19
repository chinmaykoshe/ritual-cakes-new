import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";

const OrdersPanel = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterAmount, setFilterAmount] = useState("");

  // Set the base API URL based on the environment (production or development)
  const apiUrl = "https://ritual-cakes-new-ogk5.vercel.app/api/orders";

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token not found. Please log in again.");

      // Call the API to fetch all orders (for admin)
      const response = await axios.get(apiUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Filter out admin orders if needed
      const filteredOrders = response.data.filter(
        (order) => order.userEmail !== ""
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
        `${apiUrl}/${orderId}/status`,
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
    const isConfirmed = window.confirm("Are you sure you want to delete this order?");
    if (!isConfirmed) return; // If the user cancels, don't proceed with deletion
  
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token not found. Please log in again.");
  
      await axios.delete(`${apiUrl}/${orderId}`, {
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

  // Apply filters
  const filteredOrders = orders.filter((order) => {
    // Filter by Order ID, Email, or Address
    const matchesSearchQuery =
      [order.userEmail, order._id, order.deliveryAddress]
        .some((field) => field?.toLowerCase().includes(searchQuery.toLowerCase()));

    // Filter by Status
    const matchesStatus = filterStatus ? order.status === filterStatus : true;

    // Filter by Date (if filterDate is not empty)
    const matchesDate = filterDate
      ? moment(order.orderDate).isSame(moment(filterDate), "day")
      : true;

    // Filter by Amount (if filterAmount is not empty)
    const matchesAmount =
      filterAmount && order.totalAmount <= parseFloat(filterAmount) ? true : true;

    return matchesSearchQuery && matchesStatus && matchesDate && matchesAmount;
  });

  // Sort orders by latest order date
  const sortedOrders = filteredOrders.sort((a, b) =>
    new Date(b.orderDate) - new Date(a.orderDate)
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-8 h-full">

      <h2 className="text-xl font-bold mb-4">Orders Panel</h2>
      
      {/* Filters Section */}
      <div className="flex mb-4 space-x-4">
        {/* Search Input */}
        <input
          type="text"
          className="border border-gray-400 rounded px-2 py-1"
          placeholder="Search by Order ID, Email, or Address"
          value={searchQuery}
          onChange={handleSearch}
        />

        {/* Filter by Status */}
        <select
          className="border border-gray-400 rounded px-2 py-1"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">Filter by Status</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>

        {/* Filter by Date */}
        <input
          type="date"
          className="border border-gray-400 rounded px-2 py-1"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
        />

        {/* Filter by Amount */}
        <input
          type="number"
          className="border border-gray-400 rounded px-2 py-1"
          placeholder="Max Amount"
          value={filterAmount}
          onChange={(e) => setFilterAmount(e.target.value)}
        />

        {/* Export Button */}
        <button
          onClick={exportToCSV}
          className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
        >
          Export to CSV
        </button>
      </div>

      {/* Display Orders Table */}
      {sortedOrders.length === 0 ? (
        <div className="text-center text-lg font-semibold mb-4">No orders yet</div>
      ) : (
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">Order ID</th>
              <th className="border border-gray-300 px-4 py-2">Customer Email</th>
              <th className="border border-gray-300 px-4 py-2">Order Date</th>
              <th className="border border-gray-300 px-4 py-2">Order Time</th>
              <th className="border border-gray-300 px-4 py-2">Total</th>
              <th className="border border-gray-300 px-4 py-2">Status</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th> 
            </tr>
          </thead>
          <tbody>
            {sortedOrders.map((order) => (
              <tr key={order._id}>
                <td className="border border-gray-300 px-4 py-2">{order._id}</td>
                <td className="border border-gray-300 px-4 py-2">{order.userEmail}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {new Date(order.orderDate).toLocaleDateString()}
                </td>
                <td className="border border-gray-300 px-4 py-2">{order.orderTime}</td>
                <td className="border border-gray-300 px-4 py-2">₹{order.totalAmount}</td>
                <td className="border border-gray-300 px-4 py-2">{order.status}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <select
                    className="border border-gray-400 rounded px-2 py-1"
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select> 
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
