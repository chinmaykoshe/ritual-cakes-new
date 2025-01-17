import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Dashboard() {
  const [mostSoldToday, setMostSoldToday] = useState('');
  const [bestSoldAllTime, setBestSoldAllTime] = useState('');
  const [totalCollectionToday, setTotalCollectionToday] = useState(0);
  const [totalOrdersToday, setTotalOrdersToday] = useState(0);
  const [totalOrdersAllTime, setTotalOrdersAllTime] = useState(0);

  // Get today's date in YYYY-MM-DD format for comparison
  const todayDate = new Date().toLocaleDateString('en-CA'); // Format: YYYY-MM-DD

  // Fetch data from API
  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token not found. Please log in again.');

      // Fetch all orders (no date filter needed here)
      const allOrdersResponse = await axios.get('https://ritual-cakes--alpha.vercel.app/api/orders/all', {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Filter today's orders by createdAt
      const todayOrders = allOrdersResponse.data.filter((order) =>
        new Date(order.createdAt).toLocaleDateString('en-CA') === todayDate
      );

      // Process Today's Data
      const todayCollection = todayOrders.reduce((total, order) => total + order.totalAmount, 0);
      const mostSoldToday = getMostSoldCake(todayOrders);

      setMostSoldToday(mostSoldToday);
      setTotalCollectionToday(todayCollection);
      setTotalOrdersToday(todayOrders.length);

      // Process All-time Data
      const allOrders = allOrdersResponse.data;
      const bestSoldAllTime = getMostSoldCake(allOrders);
      setBestSoldAllTime(bestSoldAllTime);
      setTotalOrdersAllTime(allOrders.length);

    } catch (error) {
      console.error('Error fetching dashboard data', error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Function to calculate the most sold cake from the orders
  const getMostSoldCake = (orders) => {
    const cakeCount = {};
    orders.forEach((order) => {
      order.orderItems.forEach((item) => {
        cakeCount[item.name] = (cakeCount[item.name] || 0) + item.quantity;
      });
    });

    let mostSold = '';
    let maxCount = 0;
    for (const cake in cakeCount) {
      if (cakeCount[cake] > maxCount) {
        maxCount = cakeCount[cake];
        mostSold = cake;
      }
    }
    return mostSold;
  };

  return (
    <div className="p-8 bg-white h-full">
      <h1 className="text-3xl font-bold text-neutral-900">Dashboard</h1>
      <p className="text-neutral-500 mt-2">Welcome to the admin dashboard!</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mt-8">
        {/* Most Sold Cake Today */}
        <div className="bg-neutral-100 rounded-lg p-6 shadow">
          <h2 className="text-xl font-semibold text-neutral-700">Most Sold Cake Today</h2>
          <p className="text-2xl font-bold text-neutral-900 mt-4">{mostSoldToday || 'N/A'}</p>
        </div>

        {/* Best Sold Cake All Time */}
        <div className="bg-neutral-100 rounded-lg p-6 shadow">
          <h2 className="text-xl font-semibold text-neutral-700">Best Sold Cake All Time</h2>
          <p className="text-2xl font-bold text-neutral-900 mt-4">{bestSoldAllTime || 'N/A'}</p>
        </div>

        {/* Total Collection Today */}
        <div className="bg-neutral-100 rounded-lg p-6 shadow">
          <h2 className="text-xl font-semibold text-neutral-700">Total Collection Today</h2>
          <p className="text-2xl font-bold text-neutral-900 mt-4">${totalCollectionToday.toFixed(2)}</p>
        </div>

        {/* Total Orders Today and All Time */}
        <div className="bg-neutral-100 rounded-lg p-6 shadow">
          <h2 className="text-xl font-semibold text-neutral-700">Orders</h2>
          <p className="text-2xl font-bold text-neutral-900 mt-4">
            Today: {totalOrdersToday} <br />
            All Time: {totalOrdersAllTime}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
