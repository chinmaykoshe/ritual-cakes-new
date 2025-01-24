import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import assets from "../assets/assets";
import { FaBars, FaTimes } from "react-icons/fa";
import "font-awesome/css/font-awesome.min.css";
import SearchBar from "./SearchBar";
import { useCart } from "../context/CartContext";

function Navbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('token') ? true : false);
  const [isOpen, setIsOpen] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false); // State to track dark mode

  const { cart } = useCart(); // Accessing the cart from context

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleSignOut = () => {
    const isConfirmed = window.confirm('Are you sure you want to sign out?');
    if (isConfirmed) {
      localStorage.clear();
      setIsLoggedIn(false);
      navigate('/'); // Navigate to home page after sign-out
    }
  };

    // Check if the token exists and sign out if missing
    useEffect(() => {
      const token = localStorage.getItem('token');
      if (!token) {
        localStorage.clear();
      } else {
        setIsLoggedIn(true); // Token exists, user is logged in
      }
    }, []);

  return (
    <div className="mb-14">
      <nav className="fixed top-0 left-0 w-full border-grey-200 font-montserrat bg-orange-50 bg-opacity-80 backdrop-blur-md z-[9999]">
        <div className="w-full px-3 py-2 flex items-center justify-between mx-auto">
          <div className="flex items-center rtl:space-x-reverse">
            <div className="lg:hidden flex items-center mr-2">
              <button onClick={toggleMenu} className="text-gray-900">
                {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
              </button>
            </div>
            <NavLink to="/" className="flex items-center md:ml-6 mr-2">
              <img src={assets.logo} className="h-8" alt="Logo" />
              <span className="self-center text-xl font-bold text-customGray hidden md:block ml-4">RITUAL CAKES</span>
            </NavLink>
          </div>

          <div className="hidden lg:flex space-x-4 justify-center flex-grow">
            <NavLink to="/" className={({ isActive }) => `text-sm font-semibold px-2 py-1 rounded-lg ${isActive ? "text-black bg-darkcustombg" : "text-gray-900"} hover:text-white hover:bg-darkcustombg`}>Home</NavLink>
            <NavLink to="/designs" className={({ isActive }) => `text-sm font-semibold px-2 py-1 rounded-lg ${isActive ? "text-black bg-darkcustombg" : "text-gray-900"} hover:text-white hover:bg-darkcustombg`}>Designs</NavLink>
            <NavLink to="/cakes" className={({ isActive }) => `text-sm font-semibold px-2 py-1 rounded-lg ${isActive ? "text-black bg-darkcustombg" : "text-gray-900"} hover:text-white hover:bg-darkcustombg`}>Cakes</NavLink>
            <NavLink to="/catalogue" className={({ isActive }) => `text-sm font-semibold px-2 py-1 rounded-lg ${isActive ? "text-black bg-darkcustombg" : "text-gray-900"} hover:text-white hover:bg-darkcustombg`}>Catalogue</NavLink>
            <NavLink to="/customization" className={({ isActive }) => `text-sm font-semibold px-2 py-1 rounded-lg ${isActive ? "text-black bg-darkcustombg" : "text-gray-900"} hover:text-white hover:bg-darkcustombg`}>Customization</NavLink>
            <NavLink to="/about" className={({ isActive }) => `text-sm font-semibold px-2 py-1 rounded-lg ${isActive ? "text-black bg-darkcustombg" : "text-gray-900"} hover:text-white hover:bg-darkcustombg`}>About</NavLink>
            <NavLink to="/order" className={({ isActive }) => `text-sm font-semibold px-2 py-1 rounded-lg ${isActive ? "text-black bg-darkcustombg" : "text-gray-900"} hover:text-white hover:bg-darkcustombg`}>Orders</NavLink>
          </div>

          <div className="ml-auto flex items-center space-x-4">
            <button className="relative text-gray-600 hover:text-gray-800 transition duration-300 ease-in-out" onClick={() => setShowSearchBar(!showSearchBar)}>
              <i className="fa-solid fa-magnifying-glass md:text-2xl text-lg"></i>
            </button>

            <button
              className="relative text-gray-600 hover:text-gray-800 mx-2 transition duration-300 ease-in-out"
              onClick={() => {
                navigate('/cart');
                window.location.reload(); // Avoid this reload if unnecessary
              }}
            >
              <i className="fa-solid fa-cart-shopping md:text-2xl text-lg"></i>
              {cart?.length > 0 && (
                <span className="absolute md:-top-2 md:-right-1 -top-1 -right-2 bg-red-500 text-white font-bold rounded-full md:w-5 md:h-5 w-4 h-4 text-xs flex items-center justify-center">
                  {cart?.reduce((total, item) => total + item.quantity, 0)}
                </span>
              )}
            </button>

            <button className="relative text-gray-600 hover:text-gray-800 mx-2 transition duration-300 ease-in-out" onClick={() => navigate('/UserDetails')}>
              <i className="fa-solid fa-user md:text-2xl text-xl"></i>
            </button>

            <button
              type="button"
              className="text-black bg-darkcustombg hover:bg-orange-300 hover:text-white font-bold rounded-lg text-xs md:text-sm px-2 py-2"
              onClick={isLoggedIn ? handleSignOut : () => navigate('/login')}
            >
              {isLoggedIn ? 'Sign Out' : 'Sign In'}
            </button>
          </div>
        </div>
      </nav>


      {showSearchBar && <SearchBar showSearchBar={showSearchBar} setShowSearchBar={setShowSearchBar} />}

      {!isLoggedIn && (
        <div className="fixed top-12 left-0 w-full bg-red-50 bg-opacity-50 text-center p-2">
          <p className="text-red-600 md:font-semibold">
            Please <span className="cursor-pointer text-red-500" onClick={() => navigate('/login')}>sign in</span> to order online.
          </p>
        </div>
      )}

      {/* Mobile menu */}
      <div className={`fixed inset-0 z-40 ${isOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={toggleMenu}></div>
        <div className={`fixed top-0 left-0 w-64 bg-white h-full shadow-lg z-50 ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-500 ease-in-out`}>
          <div className="flex justify-end p-4">
            <button onClick={toggleMenu} className="text-gray-900"><FaTimes size={24} /></button>
          </div>
          <div className="space-y-4 p-4">
            <NavLink to="/" onClick={toggleMenu} className={({ isActive }) => `block font-semibold px-2 py-1 rounded-lg ${isActive ? "text-black bg-darkcustombg" : "text-gray-900"} hover:text-white hover:bg-darkcustombg text-m`}>Home</NavLink>
            <NavLink to="/designs" onClick={toggleMenu} className={({ isActive }) => `block font-semibold px-2 py-1 rounded-lg ${isActive ? "text-black bg-darkcustombg" : "text-gray-900"} hover:text-white hover:bg-darkcustombg text-m`}>Designs</NavLink>
            <NavLink to="/cakes" onClick={toggleMenu} className={({ isActive }) => `block font-semibold px-2 py-1 rounded-lg ${isActive ? "text-black bg-darkcustombg" : "text-gray-900"} hover:text-white hover:bg-darkcustombg text-m`}>Cakes</NavLink>
            <NavLink to="/catalogue" onClick={toggleMenu} className={({ isActive }) => `block font-semibold px-2 py-1 rounded-lg ${isActive ? "text-black bg-darkcustombg" : "text-gray-900"} hover:text-white hover:bg-darkcustombg text-m`}>Catalogue</NavLink>
            <NavLink to="/customization" onClick={toggleMenu} className={({ isActive }) => `block font-semibold px-2 py-1 rounded-lg ${isActive ? "text-black bg-darkcustombg" : "text-gray-900"} hover:text-white hover:bg-darkcustombg text-m`}>Customization</NavLink>
            <NavLink to="/about" onClick={toggleMenu} className={({ isActive }) => `block font-semibold px-2 py-1 rounded-lg ${isActive ? "text-black bg-darkcustombg" : "text-gray-900"} hover:text-white hover:bg-darkcustombg text-m`}>About</NavLink>
            <NavLink to="/order" onClick={toggleMenu} className={({ isActive }) => `block font-semibold px-2 py-1 rounded-lg ${isActive ? "text-black bg-darkcustombg" : "text-gray-900"} hover:text-white hover:bg-darkcustombg text-m`}>Orders</NavLink>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
