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
  const [minAmount, setMinAmount] = useState("");
  const [hideAdminOrders, setHideAdminOrders] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({
    orderId: true,
    email: true,
    itemName: true,
    shape: true,
    quantity: true,
    price: true,
    weight: true,
    message: true,
    orderDate: true,
    orderTime: true,
    totalAmount: true,
    status: true,
    actions: true,
  });
  const [dropdownOpen, setDropdownOpen] = useState(false);

  
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.patch(
        `${apiUrl}/${orderId}`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      fetchOrders(); // Refresh orders after updating status
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update order status");
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    setLoading(true);
    await updateOrderStatus(orderId, newStatus);
    setLoading(false);
  };
  

  const apiUrl = "https://ritual-cakes-new-ogk5.vercel.app/api/orders";

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token not found. Please log in again.");

      const response = await axios.get(apiUrl, {
        headers: { Authorization: `${token}` },
      });

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

  useEffect(() => {
    fetchOrders();
  }, []);


  const filteredOrders = orders.filter((order) => {
    const matchesSearchQuery =
      !searchQuery ||
      [order.userEmail, order._id, order.deliveryAddress]
        .some((field) => field?.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = filterStatus ? order.status === filterStatus : true;
    const matchesDate = filterDate
      ? moment(order.orderDate).isSame(moment(filterDate), "day")
      : true;
    const matchesMaxAmount = (filterAmount === "" || parseFloat(filterAmount) === 0) || 
      (filterAmount && !isNaN(filterAmount) && order.totalAmount <= parseFloat(filterAmount));
    const matchesMinAmount = (minAmount === "" || parseFloat(minAmount) === 0) ||
      (minAmount && !isNaN(minAmount) && order.totalAmount >= parseFloat(minAmount));

      const notFromAdmin = hideAdminOrders ? order.userEmail !== "ritualcake.admin@gmail.com" : true;

    return matchesSearchQuery && matchesStatus && matchesDate && matchesMaxAmount && matchesMinAmount && notFromAdmin ;
  });



  const sortedOrders = filteredOrders.sort((a, b) =>
    new Date(b.orderDate) - new Date(a.orderDate)
  );

  const renderColumnHeader = (column, label) => {
    return (
      <th className="border border-gray-300 px-4 py-2">
        {label}
      </th>
    );
  };

  const handleDropdownToggle = () => {
    setDropdownOpen(!dropdownOpen);
  };

  

  const handleCheckboxChange = (column) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [column]: !prev[column],
    }));
  };

  // Function to generate CSV data
  const generateCSV = () => {
    const headers = Object.keys(visibleColumns).filter(
      (column) => visibleColumns[column]
    );

    const csvData = [
      // Adding header row
      headers.join(","),
      ...sortedOrders.map((order) =>
        headers
          .map((column) => {
            if (column === "orderId") return order._id;
            if (column === "email") return order.userEmail;
            if (column === "itemName") return order.orderItems.map(item => item.name).join(", ");
            if (column === "shape") return order.orderItems.map(item => item.shape).join(", ");
            if (column === "quantity") return order.orderItems.map(item => item.quantity).join(", ");
            if (column === "price") return order.orderItems.map(item => item.price).join(", ");
            if (column === "weight") return order.orderItems.map(item => item.weight).join(", ");
            if (column === "message") return order.cakeMessage;
            if (column === "orderDate") return new Date(order.orderDate).toLocaleDateString();
            if (column === "orderTime") return order.orderTime;
            if (column === "totalAmount") return order.totalAmount;
            if (column === "status") return order.status;
            return "";
          })
          .join(",")
      ),
    ];

    return csvData.join("\n");
  };

  // Function to download the CSV file
  const downloadCSV = () => {
    const csvContent = generateCSV();
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "orders.csv";
    link.click();
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="pt-4 h-full">
      <h2 className="text-xl font-bold mb-4">Orders Panel</h2>
      
      {/* Filters Section */}
      <div className="flex items-center space-x-4 mb-4">
        {/* Search Input */}
        <input
          type="text"
          className="border border-gray-400 rounded px-2 py-1 h-10 border-2 border-gray-400"
          placeholder="Search by Order ID, Email, or Address"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {/* Filter by Status */}
        <select
          className="border border-gray-400 rounded px-2 border-2 border-gray-400 py-1 h-10"
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
          className="border border-gray-400 rounded border-2 border-gray-400 px-2 py-1 h-10"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
        />
        {/* Filter by Minimum Amount */}
        <input
          type="number"
          className="border border-gray-400 rounded border-2 border-gray-400 px-2 py-1 h-10"
          placeholder="Min Amount"
          value={minAmount}
          onChange={(e) => setMinAmount(e.target.value)}
          min="0"
        />
        {/* Filter by Max Amount */}
        <input
          type="number"
          className="border border-gray-400 rounded border-2 border-gray-400 px-2 py-1 h-10"
          placeholder="Max Amount"
          value={filterAmount}
          onChange={(e) => setFilterAmount(e.target.value)}
        />
  
  <div
  className="flex items-center space-x-2 border-2 border-gray-400 px-2 py-1 h-10 rounded-md bg-white"
  title="Hide orders from store" // Tooltip text
>
  <input
    type="checkbox"
    id="toggleAdminOrders"
    checked={hideAdminOrders}
    onChange={(e) => setHideAdminOrders(e.target.checked)}
    className="h-4 w-4"
  />
  <label htmlFor="toggleAdminOrders" className="text-sm cursor-pointer">
    <i className="fa-solid fa-store"></i>
  </label>
</div>



        {/* Dropdown for Show/Hide Columns */}
        <div className="relative">
          <button
            onClick={handleDropdownToggle}
            className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 h-10"
          >
            Show/Hide
          </button>
          {dropdownOpen && (
            <div className="absolute bg-white shadow-lg border mt-2 rounded w-48 z-10">
              <div className="p-2">
                {Object.keys(visibleColumns).map((column) => (
                  <label key={column} className="block">
                    <input
                      type="checkbox"
                      checked={visibleColumns[column]}
                      onChange={() => handleCheckboxChange(column)}
                      className="mr-2"
                    />
                    {column}
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
        {/* Export Button */}
        <button
  className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 h-10 flex items-center space-x-2"
  onClick={downloadCSV}
>
  <i className="fa-solid fa-download"></i>
  <span>.CSV</span>
</button>

      </div>

      {/* Orders Table */}
      {sortedOrders.length === 0 ? (
        <div className="text-center text-lg font-semibold mb-4">No orders yet</div>
      ) : (
        <table className="table-auto w-full border-collapse border border-gray-300 text-sm">
          <thead>
            <tr>
              {visibleColumns.orderId && renderColumnHeader("orderId", "Order ID")}
              {visibleColumns.email && renderColumnHeader("email", "Customer Email")}
              {visibleColumns.itemName && renderColumnHeader("itemName", "Item Name")}
              {visibleColumns.shape && renderColumnHeader("shape", "Shape")}
              {visibleColumns.quantity && renderColumnHeader("quantity", "Quantity")}
              {visibleColumns.price && renderColumnHeader("price", "Price")}
              {visibleColumns.weight && renderColumnHeader("weight", "Weight")}
              {visibleColumns.message && renderColumnHeader("message", "Message")}
              {visibleColumns.orderDate && renderColumnHeader("orderDate", "Order Date")}
              {visibleColumns.orderTime && renderColumnHeader("orderTime", "Order Time")}
              {visibleColumns.totalAmount && renderColumnHeader("totalAmount", "Total")}
              {visibleColumns.status && renderColumnHeader("status", "Status")}
              {visibleColumns.actions && renderColumnHeader("actions", "Actions")}
            </tr>
          </thead>
          <tbody>
            {sortedOrders.map((order) =>
              order.orderItems.map((item, index) => (
                <tr key={`${order._id}-${index}`}>
                  {visibleColumns.orderId && <td className="border border-gray-300 px-4 py-2">{order._id}</td>}
                  {visibleColumns.email && <td className="border border-gray-300 px-4 py-2">{order.userEmail}</td>}
                  {visibleColumns.itemName && <td className="border border-gray-300 px-4 py-2">{item.name}</td>}
                  {visibleColumns.shape && <td className="border border-gray-300 px-4 py-2">{item.shape}</td>}
                  {visibleColumns.quantity && <td className="border border-gray-300 px-4 py-2">{item.quantity}</td>}
                  {visibleColumns.price && <td className="border border-gray-300 px-4 py-2">₹{item.price}</td>}
                  {visibleColumns.weight && <td className="border border-gray-300 px-4 py-2">{item.weight}</td>}
                  {visibleColumns.message && <td className="border border-gray-300 px-4 py-2">{order.cakeMessage}</td>}
                  {visibleColumns.orderDate && <td className="border border-gray-300 px-4 py-2">{new Date(order.orderDate).toLocaleDateString()}</td>}
                  {visibleColumns.orderTime && <td className="border border-gray-300 px-4 py-2">{order.orderTime}</td>}
                  {visibleColumns.totalAmount && <td className="border border-gray-300 px-4 py-2">₹{order.totalAmount}</td>}
                  {visibleColumns.status && <td className="border border-gray-300 px-4 py-2">{order.status}</td>}
                  {visibleColumns.actions && <td className="border border-gray-300 px-4 py-2">
                    <select
                      className="border border-gray-400 rounded px-2 py-1"
                      value={order.status}
                      onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>}
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OrdersPanel;
