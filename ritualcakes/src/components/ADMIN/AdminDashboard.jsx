import React from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import NavigationPane from './Navigationpane';
import Customers from './Customers';
import Analytics from './Analytics';
import Store from './Store';
import Dashboard from './Dashboard';
import Orders from './OrdersPanal';
import Products from './Products';
import CustomizePanal from './CustomizePanal';
import CakesAvailable from './CakesAvailable';
import TotalOrders from './TotalOrders';

function AdminDashboard() {
  return (
    <div className="w-full h-full bg-neutral-50 flex bg-white">
      {/* Fixed Navigation Pane */}
      <NavigationPane />
      
      <main className="flex-1 p-6">
        {/* Navigation links for routing */}

        {/* Routing the selected component */}
        <Routes>
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/customers" element={<Customers />} />
          <Route path="/admin/analytics" element={<Analytics />} />
          <Route path="/admin/store" element={<Store />} />
          <Route path="/admin/orders" element={<Orders />} />
          <Route path="/admin/products" element={<Products />} />
          <Route path="/admin/customizedpanal" element={<CustomizePanal />} />
          <Route path="/admin/orderscollection" element={<TotalOrders />} />
          <Route path="/admin/CakesAvailable" element={<CakesAvailable />} />
          <Route path="/admin/reviewsection" element={<CakesAvailable />} />
        </Routes>
      </main>
    </div>
  );
}

export default AdminDashboard;
