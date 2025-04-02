import { FaBarsStaggered } from "react-icons/fa6";
import { FaChevronUp } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import appLogo from "../assets/graph.svg";
import { useState } from "react";

function Navbar() {
  const [navbarOut, setNavbarOut] = useState(false);
  const toggleNavbar = () => setNavbarOut(prev => !prev);

  const links = [
    { label: "Customers", path: "/Customer" },
    { label: "Categories", path: "/Category" },
    { label: "Products", path: "/Product" },
    { label: "Suppliers", path: "/Supplier" },
    { label: "Purchase", path: "/Purchase" },
    { label: "Sales", path: "/Sales" },
  ];

  return (
    <div className="fixed top-0 left-0 z-50 bg-white shadow-md w-full py-4">
      <div className="md:container md:mx-auto mx-4 flex justify-between items-center">
        <div className="flex items-center">
          <img className="h-9 mr-2" src={appLogo} alt="Logo" />
          <NavLink
            to="/"
            className="font-bold text-xl tracking-wide text-[#3172c4]"
          >
            Web-Based Inventory System
          </NavLink>
        </div>

        <button
          onClick={toggleNavbar}
          className="md:hidden text-gray-700 text-2xl outline-none"
        >
          {navbarOut ? <FaChevronUp /> : <FaBarsStaggered />}
        </button>

        <div
          className={`${
            navbarOut ? "block" : "hidden"
          } md:flex md:space-x-4 absolute md:static bg-white w-full md:w-auto left-0 top-16 py-4 md:py-0 shadow-md md:shadow-none text-[17px] font-medium text-gray-600`}
        >
          {links.map(({ label, path }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `block md:inline-block py-2 mx-4 md:mx-0 ${
                  isActive ? "text-black" : "hover:text-gray-700"
                }`
              }
              onClick={() => setNavbarOut(false)}
            >
              {label}
            </NavLink>
          ))}
          <NavLink
            to="/logout"
            className={({ isActive }) =>
              `block md:inline-block py-2 mx-4 md:mx-0 ${
                isActive ? "text-black" : "hover:text-gray-700"
              }`
            }
            onClick={() => setNavbarOut(false)}
          >
            Logout
            <FiLogOut className="inline-block ml-2" />
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
