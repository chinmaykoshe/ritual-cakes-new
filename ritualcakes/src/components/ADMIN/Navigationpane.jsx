import React, { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";

function NavigationPane() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const links = [
    { to: "/admin/dashboards", label: "Dashboard" },
    { to: "/admin/customers", label: "Customers" },
    { to: "/admin/orderspanel", label: "Orders Total" },
    { to: "/admin/customizedpanal", label: "Customized Orders" },
    { to: "/admin/orderscollection", label: "In Store Collection" },
    { to: "/admin/CakesAvailable", label: "Available Cakes" },
    { to: "/admin/adminproducts", label: "Available Customizations" },
    { to: "/admin/store", label: "Store" },
    { to: "/admin/reviewsection", label: "Review Section" },
  ];

  const handleOverlayClick = (e) => {
    if (e.target.id === "adminNavOverlay") setMenuOpen(false);
  };

  // Sidebar for desktop, top navbar + drawer for mobile
  return (
    <>
      <div className="md:flex hidden flex-col sticky top-0 h-screen bg-neutral-900 text-neutral-50 w-[250px] min-w-[220px] pt-8 px-6 z-50">
        <div className="flex items-center mb-8">
          <img src="/titlelogo.ico" className="h-8" alt="Logo" />
          <span className="self-center text-xl font-bold text-white hidden md:block ml-3">
            RITUAL CAKES
          </span>
        </div>
        <hr className='mb-4' />
        <nav className="flex flex-col gap-4 flex-1">
          {links.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                isActive
                  ? 'text-neutral-50 bg-gray-400 p-2 rounded-lg'
                  : 'text-neutral-400 hover:text-neutral-50 p-2 rounded-lg'
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto pb-6">
          <button
            className="text-neutral-400 cursor-pointer mb-2 hover:text-orange-300"
            onClick={() => navigate('/')}
          >
            View Store
          </button>
          <button
            className="text-neutral-400 cursor-pointer hover:text-orange-300"
            onClick={() => alert("Call Chinmay for dev help")}
          >
            Help Centre
          </button>
        </div>
      </div>
      {/* Mobile topbar + hamburger */}
      <header className="md:hidden sticky top-0 left-0 right-0 z-50 bg-neutral-900 text-neutral-50 shadow-md">
        <div className="flex items-center justify-between px-5 py-4">
          <div className="flex items-center">
            <img src="/titlelogo.ico" className="h-8" alt="Logo" />
            <span className="self-center text-xl font-bold text-white ml-3">
              RITUAL CAKES
            </span>
          </div>
          <button
            className="md:hidden text-neutral-50"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <FaTimes size={28} /> : <FaBars size={28} />}
          </button>
        </div>
        {menuOpen && (
          <div
            id="adminNavOverlay"
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={handleOverlayClick}
          >
            <nav className="bg-neutral-900 w-[80%] max-w-sm absolute top-0 right-0 h-full shadow-2xl flex flex-col pt-14 px-6 gap-4 animate-slide-in">
              {links.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    "block font-semibold rounded-lg p-2 " +
                    (isActive
                      ? "bg-gray-700 text-orange-300"
                      : "text-neutral-300 hover:text-white hover:bg-neutral-800")
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              <div className="mt-8 border-t border-gray-700 pt-4 flex flex-col gap-2">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    navigate("/");
                  }}
                  className="text-left text-neutral-300 hover:text-orange-300"
                >
                  View Store
                </button>
                <button
                  onClick={() => alert("Call Chinmay for dev help")}
                  className="text-left text-neutral-300 hover:text-orange-300"
                >
                  Help Centre
                </button>
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}

export default NavigationPane;
