import React from 'react';
import { Outlet } from 'react-router-dom';
import NavigationPane from './Navigationpane';

function AdminLayout() {
  return (
    <div className="bg-gray-70 min-h-screen font-montserrat lg:flex md:flex">
      {/* Sidebar for desktop and navbar for mobile are handled by one component */}
      <NavigationPane />
      <main className="md:flex-1 lg:flex-1 overflow-y-auto p-4 md:p-6 pt-20 md:pt-8">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
