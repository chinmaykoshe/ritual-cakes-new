import React, { useState, useEffect } from "react";
import axios from "axios";

const TotalOrders = () => {
  const [adminOrders, setAdminOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [shapeFilter, setShapeFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");

  const fetchAdminOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token not found. Please log in again.");

      const response = await axios.get("https://ritual-cakes--alpha.vercel.app/api/orders/all", {
        headers: { Authorization: `${token}` },
      });

      const filteredOrders = response.data.filter(
        (order) => order.userEmail === "RITUALCAKE.ADMIN@gmail.com"
      );

      // Sort orders by latest first
      const sortedOrders = filteredOrders.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setAdminOrders(sortedOrders);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminOrders();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US"); // Format: MM/DD/YYYY
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", { hour12: true }); // Format: hh:mm:ss AM/PM
  };

  const exportToCSV = () => {
    const headers = [
      "Cake Name",
      "Shape",
      "Quantity",
      "Weight",
      "Total Amount",
      "Order Date",
      "Order Time",
    ];
    const rows = filteredOrders.map((order) =>
      order.orderItems.map((item) => [
        item.name,
        item.shape,
        item.quantity || 1,
        item.weight,
        `$${order.totalAmount}`,
        formatDate(order.createdAt),
        formatTime(order.createdAt),
      ])
    );

    const csvContent = [
      headers.join(","),
      ...rows.flat().map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "orders.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredOrders = adminOrders.filter((order) =>
    order.orderItems.some((item) => {
      const matchesSearchQuery =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (order.status && order.status.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesShapeFilter = shapeFilter ? item.shape === shapeFilter : true;
      const matchesDateFilter = dateFilter
        ? new Date(order.createdAt).toLocaleDateString("en-US") ===
          new Date(dateFilter).toLocaleDateString("en-US")
        : true;
      const matchesMinAmount = minAmount ? order.totalAmount >= Number(minAmount) : true;
      const matchesMaxAmount = maxAmount ? order.totalAmount <= Number(maxAmount) : true;
      return (
        matchesSearchQuery &&
        matchesShapeFilter &&
        matchesDateFilter &&
        matchesMinAmount &&
        matchesMaxAmount
      );
    })
  );

  const today = new Date().toLocaleDateString("en-US");
  const todayTotal = adminOrders
    .filter((order) => formatDate(order.createdAt) === today)
    .reduce((total, order) => total + order.totalAmount, 0);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {/* Header Section */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">ORDERS FROM STORE</h2>
        <div className="flex items-center space-x-4">
          <div className="border p-4 rounded bg-gray-100 shadow">
            <h3 className="text-lg font-semibold">Today's Total</h3>
            <p className="text-2xl font-bold">${todayTotal.toFixed(2)}</p>
          </div>
          <button
            onClick={exportToCSV}
            className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600"
          >
            Export to CSV
          </button>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="mb-4 grid grid-cols-6 gap-4">
        <input
          type="text"
          placeholder="Search by Cake Name, Order ID, or Status"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 rounded"
        />

        <select
          value={shapeFilter}
          onChange={(e) => setShapeFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Shapes</option>
          <option value="round">Round</option>
          <option value="square">Square</option>
          <option value="heart">Heart</option>
        </select>

        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="border p-2 rounded"
        />

        <input
          type="number"
          placeholder="Min Amount"
          value={minAmount}
          onChange={(e) => setMinAmount(e.target.value)}
          className="border p-2 rounded"
        />

        <input
          type="number"
          placeholder="Max Amount"
          value={maxAmount}
          onChange={(e) => setMaxAmount(e.target.value)}
          className="border p-2 rounded"
        />
      </div>

      {/* Orders Table */}
      {filteredOrders.length > 0 ? (
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2">Cake Name</th>
              <th className="border border-gray-300 p-2">Shape</th>
              <th className="border border-gray-300 p-2">Quantity</th>
              <th className="border border-gray-300 p-2">Weight</th>
              <th className="border border-gray-300 p-2">Total Amount</th>
              <th className="border border-gray-300 p-2">Order Date</th>
              <th className="border border-gray-300 p-2">Order Time</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) =>
              order.orderItems.map((item, index) => (
                <tr key={`${order._id}-${index}`}>
                  <td className="border border-gray-300 p-2">{item.name}</td>
                  <td className="border border-gray-300 p-2">{item.shape}</td>
                  <td className="border border-gray-300 p-2">{item.quantity || 1}</td>
                  <td className="border border-gray-300 p-2">{item.weight}</td>
                  <td className="border border-gray-300 p-2">${order.totalAmount}</td>
                  <td className="border border-gray-300 p-2">{formatDate(order.createdAt)}</td>
                  <td className="border border-gray-300 p-2">{formatTime(order.createdAt)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      ) : (
        <div>No orders found</div>
      )}
    </div>
  );
};

export default TotalOrders;
