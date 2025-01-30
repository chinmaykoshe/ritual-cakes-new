import React from 'react';
import { Outlet } from 'react-router-dom';
import NavigationPane from './Navigationpane';

function AdminLayout() {
  return (
    <div className="flex h-screen">
      <NavigationPane />
      <main className="flex-1 bg-gray-70 overflow-y-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
