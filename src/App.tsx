
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/auth/ProtectedRoute";

import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Loans from "./pages/Loans";
import LoanDetails from "./pages/LoanDetails";
import LoanForm from "./components/loans/LoanForm";
import NotFound from "./pages/NotFound";
import Navbar from "./components/layout/Navbar";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/loans" element={
            <ProtectedRoute>
              <Loans />
            </ProtectedRoute>
          } />
          
          <Route path="/loans/new" element={
            <ProtectedRoute>
              <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-1 pt-24 pb-12 px-6">
                  <div className="container mx-auto max-w-2xl">
                    <LoanForm />
                  </div>
                </main>
              </div>
            </ProtectedRoute>
          } />
          
          <Route path="/loans/edit/:id" element={
            <ProtectedRoute>
              <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-1 pt-24 pb-12 px-6">
                  <div className="container mx-auto max-w-2xl">
                    <LoanForm />
                  </div>
                </main>
              </div>
            </ProtectedRoute>
          } />
          
          <Route path="/loans/:id" element={
            <ProtectedRoute>
              <LoanDetails />
            </ProtectedRoute>
          } />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
