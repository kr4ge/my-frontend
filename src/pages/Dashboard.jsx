import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import { 
  FaAnglesRight,
  FaRegCircleUser,
  FaTruckFast,
  FaTags,
  FaBoxOpen,
  FaArrowTrendUp,
  FaCartArrowDown,
 } from "react-icons/fa6";
import apiConn from "../api";

function Dashboard() {
  const [overviewData, setOverviewData] = useState({
    customers: [],
    categories: [],
    products: [],
    suppliers: [],
    purchases: [],
    sales: [],
  });
  const [lowStockAlert, setLowStockAlert] = useState([]);

  useEffect(() => {
    const getAllData = async () => {
      try {
        const [
          customersRes,
          suppliersRes,
          categoriesRes,
          productsRes,
          purchasesRes,
          salesRes,
        ] = await Promise.all([
          apiConn.get("api/customers/"),
          apiConn.get("api/categories/"),
          apiConn.get("api/products/"),
          apiConn.get("api/suppliers/"),
          apiConn.get("api/purchases/"),
          apiConn.get("api/sales/"),
        ]);

        setOverviewData({
          customers: customersRes.data.slice(0, 3),
          categories: categoriesRes.data.slice(0, 3),
          products: productsRes.data.slice(0, 3),
          suppliers: suppliersRes.data.slice(0, 3),
          purchases: purchasesRes.data.slice(0, 3),
          sales: salesRes.data.slice(0, 3),
        });

        const hasLowStock = productsRes.data.some(
          (item) => item.stockQuantity <= 3
        );

        if (hasLowStock) {
          const lowStockRes = await apiConn.get("api/products/low-stock/");
          setLowStockAlert(lowStockRes.data);
        } else {
          setLowStockAlert([]);
        }
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      }
    };

    getAllData();
  }, []);

  const sectionAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeInOut" },
    },
  };

  const hoverEffect = {
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 },
    },
  };

  const sections = [
    {
      title: "Customers",
      key: "customers",
      link: "/Customer",
      display: "name",
      icon: FaRegCircleUser,
    },
    {
      title: "Categories",
      key: "categories",
      link: "/Category",
      display: "name",
      icon: FaTags,
    },
    {
      title: "Products",
      key: "products",
      link: "/Product",
      display: "name",
      icon: FaBoxOpen,
    },
    {
      title: "Suppliers",
      key: "suppliers",
      link: "/Supplier",
      display: "name",
      icon: FaTruckFast,
    },
    {
      title: "Purchases",
      key: "purchases",
      link: "/Purchase",
      display: "total",
      icon: FaCartArrowDown,
    },
    {
      title: "Sales",
      key: "sales",
      link: "/Sales",
      display: "total",
      icon: FaArrowTrendUp,
    },
  ];

  return (
    <div className="p-6">
      {/* Low Stock Banner */}
      {lowStockAlert.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md shadow"
        >
          <div className="flex items-start">
            <svg
              className="h-5 w-5 text-red-500 mt-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <div className="ml-3">
              <h3 className="text-sm font-semibold text-red-800">Low Stock Alert</h3>
              <ul className="mt-2 text-sm text-red-700 list-disc pl-4 space-y-1">
                {lowStockAlert.map((item) => (
                  <li key={item.id}>
                    <strong>{item.name}</strong> — only {item.stockQuantity} left
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      )}

      {/* 📊 Dashboard Grid */}
      <motion.div
        className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-100 shadow-xl rounded-2xl md:w-[900px]"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              delayChildren: 0.2,
              staggerChildren: 0.1,
            },
          },
        }}
      >
        {sections.map((section) => {
          const Icon = section.icon;
          const entries = overviewData[section.key];

          return (
            <motion.div
              key={section.title}
              className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
              variants={sectionAnimation}
            >
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                    {section.title}
                    <Icon className="ml-2 text-gray-500" />
                  </h3>
                </div>
                <ul>
                  {entries.map((item, idx) => (
                    <motion.li
                      key={item.id}
                      variants={hoverEffect}
                      whileHover="hover"
                      className="text-gray-700 py-2 px-3 hover:bg-gray-50 rounded-md"
                    >
                      {section.display === "total"
                        ? `Total: ${item[section.display]}`
                        : item[section.display] || `ID: ${item.id}`}
                    </motion.li>
                  ))}
                  {entries.length === 0 && (
                    <li className="text-gray-500 py-2 px-3">
                      No data available.
                    </li>
                  )}
                </ul>
                {entries.length > 0 && (
                  <div className="mt-4">
                    <Link
                      to={section.link}
                      className="inline-block text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      View All <FaAnglesRight className="inline" />
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}

export default Dashboard;
