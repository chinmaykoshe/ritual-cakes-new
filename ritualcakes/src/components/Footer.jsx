import React from 'react';
import { Link } from 'react-router-dom';
import 'font-awesome/css/font-awesome.min.css';

function Footer() {
  return (
    <div className="mt-28 flex flex-col min-h">
      <footer className="bg-orange-50 bg-opacity-85 text-darkcustombg1 pt-4 pb-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap md:flex-nowrap justify-between">
            <div className="w-full md:w-1/3 mb-6 md:mb-0 pl-4 pr-20 ">
              <Link to="/about">
                <h2 className="text-2xl font-bold mb-4 text-darkcustombg1">About Us</h2>
              </Link>
              <p className="text-gray-700">
                At Ritual Cakes, we are passionate about baking the finest cakes and goodies, always fresh from the oven.
              </p>
              <p className="mt-4 font-italic text-gray-500">- Jyoti Joshi COO</p>
            </div>
            <div className="w-full md:w-1/3 mb-6 md:mb-0 px-4">
              <h2 className="text-2xl font-bold mb-4 text-darkcustombg1">Keep Connected</h2>
              <ul className="list-none">
                <li className="mb-2">
                  <a href="https://www.facebook.com/ritualcakes/" className="text-gray-700 hover:text-darkcustombg1 flex items-center">
                    <i className="fa fa-facebook mr-2"></i> Like us on Facebook
                  </a>
                </li>
                <li className="mb-2">
                  <a href="https://www.instagram.com/ritualcakes/" className="text-gray-700 hover:text-darkcustombg1 flex items-center">
                    <i className="fa fa-instagram mr-2"></i> Follow us on Instagram
                  </a>
                </li>
              </ul>
            </div>
            <div className="w-full md:w-1/3 px-4">
              <h2 className="text-2xl font-bold mb-4 text-darkcustombg1">Contact Information</h2>
              <address className="text-gray-700">
                Ritual Cakes <br />
                Shop no.:1, Uma Imperial, Dronagiri Sec.:48 <br />
                Dronagiri, Uran-400702, Raigad, Maharashtra, India
              </address>
              <p className="mt-4">
                <i className="fa fa-phone mr-2"></i>
                <a href="tel:+918169296802" className="text-gray-700 hover:text-darkcustombg1">
                  +91 8169296802
                </a>
                <br />
                <i className="fa fa-phone mr-2"></i>
                <a href="tel:+917021482775" className="text-gray-700 hover:text-darkcustombg1">
                  +91 7021482775
                </a>
              </p>
              <p className="mt-2">
                <i className="fa fa-envelope mr-2"></i>
                <a href="mailto:ritualcakes2019@gmail.com" className="text-gray-700 hover:text-darkcustombg1">
                  ritualcakes2019@gmail.com
                </a>
              </p>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-700 pt-4 text-center">
            <p className="text-gray-700 text-sm">
              © 2024 Ritual Cakes. All Rights Reserved. Designed and developed by Chinmay Koshe.
            </p>
            <div className="mt-4">
              <a href="/" className="text-gray-700 hover:text-darkcustombg1 mx-2 text-sm">Company Information</a>
              <a href="/" className="text-gray-700 hover:text-darkcustombg1 mx-2 text-sm">Privacy Policy</a>
              <a href="/" className="text-gray-700 hover:text-darkcustombg1 mx-2 text-sm">Terms & Conditions</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Footer;
