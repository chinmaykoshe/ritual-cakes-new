import React from 'react';
import { Outlet } from 'react-router-dom';
import NavigationPane from './Navigationpane';

function AdminLayout() {
  return (
    <div className="flex h-screen">
      {/* Fixed Navigation Pane */}
      <NavigationPane />

      {/* Content Area */}
      <main className="flex-1 bg-neutral-50 overflow-y-auto p-6">
        {/* The nested route components will render here */}
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
