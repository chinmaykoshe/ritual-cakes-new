import { useState, useEffect } from 'react'; 
import React from 'react';
import { BrowserRouter, Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import About from './components/About';
import Customization from './components/Customization';
import Cart from './components/Cart';
import Orders from './components/Orders.jsx';
import Cakes from './components/Cakes';
import Navbar from './components/Navbar';
import Designs from './components/Designs';
import PageDesigns from './components/PageDesigns.jsx';
import Catalogue from './components/Catalogue';
import ProductPage from './components/ProductPage';
import Footer from './components/Footer';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import 'react-toastify/ReactToastify.css';
import './index.css';
import { CartProvider } from './context/CartContext.jsx';
import axios from 'axios';
axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`
import UserDetails from './components/UserButton.jsx'; 
import PrivateRoute from './PrivateRoute.jsx';
import Customers from './components/ADMIN/Customers.jsx';
import Store from './components/ADMIN/Store.jsx';
import OrdersPanal from './components/ADMIN/OrdersPanal.jsx';
import Login from './components/Login.jsx';
import Signup from './components/Signup.jsx';
import Dashboard from './components/ADMIN/Dashboard.jsx';
import AdminProducts from './components/ADMIN/Products.jsx';
import DesignCustomizationPage from './components/DesignCustomizationPage';
import AdminLayout from './components/ADMIN/AdminLayout'; 
import Checkout from './components/Checkout.jsx';
import { CustomizationProvider } from './context/customizeContext';
import { OrderProvider } from './context/OrderContext';
import CustomizePanal from './components/ADMIN/CustomizePanal.jsx';
import CakesAvailable from './components/ADMIN/CakesAvailable.jsx';
import StoreOrders from './components/ADMIN/StoreOrders.jsx';
import ReviewSection from './components/ADMIN/ReviewSection.jsx';

// InvalidRouteRedirect component
function InvalidRouteRedirect() {
  const navigate = useNavigate();
  
  useEffect(() => {
    navigate('/', { replace: true });
  }, [navigate]);

  return null;
}

function App() {
  const location = useLocation();

  // Check if the current path is for the admin dashboard
  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <div className='container mx-auto max-w-none relative'>
      <React.StrictMode>
      <CustomizationProvider> 
      <OrderProvider>
        <CartProvider>
          {!isAdminPath && (
            <div className='z-[1] relative'>
              <Navbar />
            </div>
          )}
          
          <div className='z-[0] relative'>
            <Routes>
              {/* Admin routes */}
              <Route path="/admin" element={<PrivateRoute element={<AdminLayout />} />} >
                <Route path="/admin/dashboards" element={<PrivateRoute element={<Dashboard />} />} />
                <Route path="/admin/customers" element={<PrivateRoute element={<Customers />} />} />
                <Route path="/admin/orderspanel" element={<PrivateRoute element={<OrdersPanal />} />} />
                <Route path="/admin/adminproducts" element={<PrivateRoute element={<AdminProducts />} />} />
                <Route path="/admin/store" element={<PrivateRoute element={<Store />} />} />
                <Route path="/admin/customizedpanal" element={<PrivateRoute element={<CustomizePanal />} />} />
                <Route path="/admin/CakesAvailable" element={<PrivateRoute element={<CakesAvailable />} />} />
                <Route path="/admin/orderscollection" element={<PrivateRoute element={<StoreOrders />} />} />
                <Route path="/admin/reviewsection" element={<PrivateRoute element={<ReviewSection />} />} />
              </Route>

              {/* Other routes go here */}
              <Route path='/' element={<Home />} />
              <Route path='/about' element={<About />} />
              <Route path='/designs' element={<Designs />} />
              <Route path='/customization' element={<Customization />} />
              <Route path='/order' element={<Orders />} />
              <Route path="/cart" element={<Cart />} />
              <Route path='/cakes' element={<Cakes />} />
              <Route path='/catalogue' element={<Catalogue />} />
              <Route path='/checkout' element={<Checkout />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/product/:orderId" element={<ProductPage />} />
              <Route path="/design/:designName" element={<DesignCustomizationPage />} />
              <Route path="/pagedesigns" element={<PageDesigns />} />
              <Route path="*" element={<InvalidRouteRedirect />} />
              <Route path="/UserDetails" element={<UserDetails />} />
            </Routes>
          </div>

          {!isAdminPath && (
            <div className='z-[-1] relative'>
              <Footer />
            </div>
          )}
        </CartProvider>
      </OrderProvider>
      </CustomizationProvider>  

      </React.StrictMode>
    </div>
    
  );
}

export default App;
