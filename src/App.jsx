import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import PrivateRoute from "./components/PrivateRoute";
import Navbar from "./components/Navbar";
import UserRegister from "./pages/Register";
import NotFound from "./pages/NotFound";
import CustomerManager from "./pages/Customer";
import SupplierManager from "./pages/Supplier";
import CategoryManager from "./pages/Category";
import PurchaseManager from "./pages/Purchase";
import ProductManager from "./pages/Product";
import UserLogout from "./pages/Logout";
import SalesManager from "./pages/Sales";
import UserLogin from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import apiConn from "./api";

// Routes Configuration
const routes = [
  { path: "/", element: <Dashboard /> },
  { path: "/Customer", element: <CustomerManager /> },
  { path: "/Category", element: <CategoryManager /> },
  { path: "/Supplier", element: <SupplierManager /> },
  { path: "/Product", element: <ProductManager /> },
  { path: "/Sales", element: <SalesManager /> },
  { path: "/Purchase", element: <PurchaseManager /> },
  { path: "/logout", element: <UserLogout /> },
];

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    apiConn
      .get("api/user/")
      .then(() => setIsAuthenticated(true))
      .catch(() => setIsAuthenticated(false))
      .finally(() => console.log("Checked authentication status"));
  }, []);

  const renderPrivateRoutes = () => {
    return routes.map(({ path, element }) => (
      <Route
        key={path}
        path={path}
        element={<PrivateRoute>{element}</PrivateRoute>}
      />
    ));
  };

  return (
    <BrowserRouter>
      {isAuthenticated && <Navbar />}
      <Routes>
        {renderPrivateRoutes()}
        <Route path="/login" element={<UserLogin />} />
        <Route path="/register" element={<UserRegister />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
