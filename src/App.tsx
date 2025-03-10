
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Loans from "./pages/Loans";
import LoanDetails from "./pages/LoanDetails";
import LoanForm from "./components/loans/LoanForm";
import NotFound from "./pages/NotFound";

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
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/loans" element={<Loans />} />
          <Route path="/loans/new" element={
            <div className="min-h-screen flex flex-col">
              <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-3 bg-white/80 backdrop-blur-lg shadow-subtle">
                <div className="container mx-auto px-6">
                  <div onClick={() => window.history.back()} className="cursor-pointer text-xl font-medium flex items-center space-x-2">
                    <span className="text-primary">Lendify</span>
                  </div>
                </div>
              </nav>
              <main className="flex-1 pt-24 pb-12 px-6">
                <div className="container mx-auto max-w-2xl">
                  <LoanForm />
                </div>
              </main>
            </div>
          } />
          <Route path="/loans/edit/:id" element={
            <div className="min-h-screen flex flex-col">
              <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-3 bg-white/80 backdrop-blur-lg shadow-subtle">
                <div className="container mx-auto px-6">
                  <div onClick={() => window.history.back()} className="cursor-pointer text-xl font-medium flex items-center space-x-2">
                    <span className="text-primary">Lendify</span>
                  </div>
                </div>
              </nav>
              <main className="flex-1 pt-24 pb-12 px-6">
                <div className="container mx-auto max-w-2xl">
                  <LoanForm />
                </div>
              </main>
            </div>
          } />
          <Route path="/loans/:id" element={<LoanDetails />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
