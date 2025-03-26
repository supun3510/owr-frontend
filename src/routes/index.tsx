import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./../views/login";
import Signup from "./../views/signup";
import Dashboard from "./../views/dashboard";
import Marketplace from "./../views/marketplace/PropertyList";
import AddMarketplace from "./../views/marketplace/index";
import Amentics from "../views/amentics/index";
import Profile from "../views/profile";
import UpdateProfileView from "../views/profile/updateProfile";
import ProductDetails from "../views/marketplace/productDeatails";
import ProtectedRoute from "../component/MainLayout/ProtectedRoute";

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["INVESTOR", "LANDOWNER", "Scout"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Marketplace - Accessible to all roles */}
        <Route
          path="/marketplace"
          element={
            <ProtectedRoute allowedRoles={["INVESTOR", "LANDOWNER", "Scout"]}>
              <Marketplace />
            </ProtectedRoute>
          }
        />

        {/* Add Marketplace - Only Landowners can add */}
        <Route
          path="/addmarketplace"
          element={
            <ProtectedRoute allowedRoles={["INVESTOR", "LANDOWNER", "Scout"]}>
              <AddMarketplace />
            </ProtectedRoute>
          }
        />

        {/* View Product Details - Accessible to all */}
        <Route
          path="/product/:id"
          element={
            <ProtectedRoute allowedRoles={["INVESTOR", "LANDOWNER", "Scout"]}>
              <ProductDetails />
            </ProtectedRoute>
          }
        />

        {/* Amenities - Only Landowners can manage amenities */}
        <Route
          path="/amentics"
          element={
            <ProtectedRoute allowedRoles={["INVESTOR", "LANDOWNER", "Scout"]}>
              <Amentics />
            </ProtectedRoute>
          }
        />

        {/* Profile - Accessible to all */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={["INVESTOR", "LANDOWNER", "Scout"]}>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Update Profile - Only Investors can update their profiles */}
        <Route
          path="/updateprofile"
          element={
            <ProtectedRoute allowedRoles={["INVESTOR", "LANDOWNER", "Scout"]}>
              <UpdateProfileView />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
