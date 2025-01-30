import React, { useState, useEffect } from "react";
import axios from "axios";

function Dashboard() {
  const [mostSoldToday, setMostSoldToday] = useState("");
  const [bestSoldAllTime, setBestSoldAllTime] = useState("");
  const [totalCollectionToday, setTotalCollectionToday] = useState(0);
  const [totalOrdersToday, setTotalOrdersToday] = useState(0);
  const [totalOrdersAllTime, setTotalOrdersAllTime] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const todayDate = new Date().toLocaleDateString("en-CA");
  const validateAdminAccess = () => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token) {
      throw new Error("Token not found. Please log in again.");
    }
    if (role !== "admin") {
      throw new Error("Access restricted. Only admins can view this data.");
    }
    return token; 
  };
  const fetchDashboardData = async () => {
    try {
      const token = validateAdminAccess();
      const apiUrl = `https://ritual-cakes-new-ogk5.vercel.app/api/orders`;
      const allOrdersResponse = await axios.get(apiUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const todayOrders = allOrdersResponse.data.filter(
        (order) => new Date(order.createdAt).toLocaleDateString("en-CA") === todayDate
      );
      const todayCollection = todayOrders.reduce((total, order) => total + order.totalAmount, 0);
      const mostSoldToday = getMostSoldCake(todayOrders);
      setMostSoldToday(mostSoldToday);
      setTotalCollectionToday(todayCollection);
      setTotalOrdersToday(todayOrders.length);
      const allOrders = allOrdersResponse.data;
      const bestSoldAllTime = getMostSoldCake(allOrders);
      setBestSoldAllTime(bestSoldAllTime);
      setTotalOrdersAllTime(allOrders.length);
    } catch (error) {
      console.error("Error fetching dashboard data", error);
      setError(error.message || "Failed to fetch dashboard data.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchDashboardData();
  }, []);
  const getMostSoldCake = (orders) => {
    const cakeCount = {};
    orders.forEach((order) => {
      order.orderItems.forEach((item) => {
        cakeCount[item.name] = (cakeCount[item.name] || 0) + item.quantity;
      });
    });
    let mostSold = "";
    let maxCount = 0;
    for (const cake in cakeCount) {
      if (cakeCount[cake] > maxCount) {
        maxCount = cakeCount[cake];
        mostSold = cake;
      }
    }
    return mostSold || "N/A";
  };

  return (
    <div className="p-8 h-full">
      <h1 className="text-3xl font-bold text-neutral-900">Dashboard</h1>
      <p className="text-neutral-500 mt-2">Welcome to the admin dashboard!</p>

      {loading ? (
        <div className="text-center mt-8">
          <p>Loading...</p>
        </div>
      ) : error ? (
        <div className="text-center mt-8 text-red-500">
          <p>{error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mt-8">
          <div className="bg-neutral-100 rounded-lg p-6 shadow">
            <h2 className="text-xl font-semibold text-neutral-700">Most Sold Cake Today</h2>
            <p className="text-2xl font-bold text-neutral-900 mt-4">{mostSoldToday}</p>
          </div>
          <div className="bg-neutral-100 rounded-lg p-6 shadow">
            <h2 className="text-xl font-semibold text-neutral-700">Best Sold Cake All Time</h2>
            <p className="text-2xl font-bold text-neutral-900 mt-4">{bestSoldAllTime}</p>
          </div>
          <div className="bg-neutral-100 rounded-lg p-6 shadow">
            <h2 className="text-xl font-semibold text-neutral-700">Total Collection Today</h2>
            <p className="text-2xl font-bold text-neutral-900 mt-4">${totalCollectionToday.toFixed(2)}</p>
          </div>
          <div className="bg-neutral-100 rounded-lg p-6 shadow">
            <h2 className="text-xl font-semibold text-neutral-700">Orders</h2>
            <p className="text-2xl font-bold text-neutral-900 mt-4">
              Today: {totalOrdersToday} <br />
              All Time: {totalOrdersAllTime}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;