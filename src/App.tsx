
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Pages
import Home from "@/pages/Home";
import Products from "@/pages/Products";
import ProductDetail from "@/pages/ProductDetail";
import Login from "@/pages/Login";
import ForgotPassword from "@/pages/ForgotPassword";
import AdminProducts from "@/pages/admin/AdminProducts";
import AddProduct from "@/pages/admin/AddProduct";
import EditProduct from "@/pages/admin/EditProduct";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                
                {/* Protected Admin Routes */}
                <Route 
                  path="/admin/products" 
                  element={
                    <ProtectedRoute requiresAdmin={true}>
                      <AdminProducts />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/products/add" 
                  element={
                    <ProtectedRoute requiresAdmin={true}>
                      <AddProduct />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/products/edit/:id" 
                  element={
                    <ProtectedRoute requiresAdmin={true}>
                      <EditProduct />
                    </ProtectedRoute>
                  } 
                />
                
                {/* 404 Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
