import React, { useState, useEffect, useMemo, useRef } from "react";
import axios from "axios";

const StoreOrders = () => {
  const [adminOrders, setAdminOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [shapeFilter, setShapeFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const isFetching = useRef(false); // Prevent redundant API calls
  const apiUrl = 'https://ritual-cakes-new-ogk5.vercel.app/api'

  // Function to fetch orders
  const fetchAdminOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const userEmail = localStorage.getItem("user");
      const role = localStorage.getItem("role");

      if (!token) throw new Error("Token not found. Please log in again.");
      if (!userEmail) throw new Error("User email not found.");

      const apiUrl = `${apiUrl}/orders/${userEmail}`;

      const response = await axios.get(apiUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });


      const orders = Array.isArray(response.data) ? response.data : response.data.orders || [];

      const filteredOrders = orders.filter(
        (order) => order.userEmail === userEmail
      );

      const sortedOrders = filteredOrders.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setAdminOrders(sortedOrders);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  // Fetch orders on component mount
  useEffect(() => {
    if (!isFetching.current) {
      isFetching.current = true;
      fetchAdminOrders().then(() => (isFetching.current = false));
    }
  }, []);

  // Helper functions for date formatting
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US");
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", { hour12: true });
  };

  // Filter orders dynamically
  const filteredOrders = useMemo(() => {
    return adminOrders.filter((order) =>
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
  }, [adminOrders, searchQuery, shapeFilter, dateFilter, minAmount, maxAmount]);

  const today = new Date().toLocaleDateString("en-US");
  // Inside your component function
  const todayTotal = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to midnight for today's date comparison

    return adminOrders
      .filter((order) => {
        const orderDate = new Date(order.createdAt);
        orderDate.setHours(0, 0, 0, 0); // Reset time to midnight for each order
        return orderDate.getTime() === today.getTime(); // Compare date parts only
      })
      .reduce((total, order) => total + order.totalAmount, 0); // Sum totalAmount for today's orders
  }, [adminOrders]); // Recalculate when adminOrders changes

  // Export orders to CSV
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
    const rows = filteredOrders.flatMap((order) =>
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
      ...rows.map((row) => row.join(",")),
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-8 h-full">

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
              <th className="border border-gray-300 p-2">Phone no</th>
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
                  <td className={`border border-gray-300 p-2 ${order.cakeMessage === 'Ordered from store' ? 'text-gray-500' : 'text-black'}`}>
                    {order.cakeMessage}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      ) : (
        <div className="text-center text-lg font-semibold mb-4">No orders available</div>
      )}
    </div>
  );
};

export default StoreOrders;
