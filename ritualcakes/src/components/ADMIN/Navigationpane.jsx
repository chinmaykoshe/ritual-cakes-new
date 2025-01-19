import React from 'react';
import { useNavigate, NavLink } from 'react-router-dom';

function NavigationPane() {
  const navigate = useNavigate();

  return (
    <aside className="sticky bg-neutral-900 text-neutral-50 w-[250px] h-full pt-8 px-6 flex flex-col">
      <div className="flex items-center mb-8">
        <img src="/titlelogo.png" className="h-8" alt="Logo" />
        <span className="self-center text-xl font-bold text-customGray hidden md:block ml-4">
          RITUAL CAKES
        </span>
      </div>

      <nav className="flex flex-col gap-4">
        <NavLink
          to="/admin/dashboards"
          className={({ isActive }) =>
            isActive ? 'text-neutral-50' : 'text-neutral-400 hover:text-neutral-50'
          }
        >
          DASHBOARD
        </NavLink>
        <NavLink
          to="/admin/customers"
          className={({ isActive }) =>
            isActive ? 'text-neutral-50' : 'text-neutral-400 hover:text-neutral-50'
          }
        >
          CUSTOMERS
        </NavLink>
        <NavLink
          to="/admin/orderspanel"
          className={({ isActive }) =>
            isActive ? 'text-neutral-50' : 'text-neutral-400 hover:text-neutral-50'
          }
        >
          ORDERS
        </NavLink>
        <NavLink
          to="/admin/adminproducts"
          className={({ isActive }) =>
            isActive ? 'text-neutral-50' : 'text-neutral-400 hover:text-neutral-50'
          }
        >
          PRODUCT
        </NavLink>
        <NavLink
          to="/admin/store"
          className={({ isActive }) =>
            isActive ? 'text-neutral-50' : 'text-neutral-400 hover:text-neutral-50'
          }
        >
          STORE
        </NavLink>
        <NavLink
          to="/admin/customizedpanal"
          className={({ isActive }) =>
            isActive ? 'text-neutral-50' : 'text-neutral-400 hover:text-neutral-50'
          }
        >
          CUSTOMIZED ORDERS
        </NavLink>
        <NavLink
          to="/admin/CakesAvailable"
          className={({ isActive }) =>
            isActive ? 'text-neutral-50' : 'text-neutral-400 hover:text-neutral-50'
          }
        >
          AVAILABLE CAKES
        </NavLink>
        <NavLink
          to="/admin/orderscollection"
          className={({ isActive }) =>
            isActive ? 'text-neutral-50' : 'text-neutral-400 hover:text-neutral-50'
          }
        >
          ORDERS COLLECTION
        </NavLink>
        <NavLink
          to="/admin/reviewsection"
          className={({ isActive }) =>
            isActive ? 'text-neutral-50' : 'text-neutral-400 hover:text-neutral-50'
          }
        >
          REVIEW SECTION
        </NavLink>
      </nav>

      <div className="mt-auto">
        <p
          className="text-neutral-400 mt-8 cursor-pointer"
          onClick={() => navigate('/')}
        >
          VIEW STORE
        </p>

        <p
          className="text-neutral-400 my-4 cursor-pointer"
          onClick={() => alert('Call Chinmay to get help related to development')}
        >
          HELP CENTRE
        </p>
      </div>
    </aside>
  );
}

export default NavigationPane;
