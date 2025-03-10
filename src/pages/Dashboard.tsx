
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/layout/Navbar';
import Stats from '@/components/dashboard/Stats';
import RecentLoans from '@/components/dashboard/RecentLoans';
import Chart from '@/components/dashboard/Chart';
import { Loan } from '@/components/loans/LoanCard';
import { PlusCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  
  // Check if user is logged in
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      
      if (!data.session) {
        navigate('/login');
        return;
      }
      
      setUser({
        id: data.session.user.id,
        name: data.session.user.user_metadata.first_name || 'User',
      });
    };
    
    checkUser();
  }, [navigate]);
  
  // Fetch loans from Supabase
  const { data: loans = [], isLoading } = useQuery({
    queryKey: ['loans'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('loans')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Transform the data to match our Loan interface
      return data.map(loan => ({
        id: loan.id,
        amount: loan.amount,
        purpose: loan.purpose,
        status: loan.status as 'pending' | 'approved' | 'rejected' | 'paid',
        description: loan.description || '', // Using null coalescing operator to handle undefined
        createdAt: loan.created_at,
        dueDate: loan.start_date, // Using start_date as dueDate
        loanType: loan.purpose, // Using purpose as loanType temporarily
        interest_rate: loan.interest_rate,
        term: loan.term,
        borrower_name: loan.borrower_name
      }));
    },
    enabled: !!user,
  });
  
  if (!user) return null;
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-12 px-6">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Dashboard</p>
              <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user.name}</h1>
            </div>
            <Button 
              className="mt-4 md:mt-0 flex items-center"
              onClick={() => navigate('/loans/new')}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              New Loan Application
            </Button>
          </div>
          
          <div className="space-y-6">
            {isLoading ? (
              <div className="text-center py-20">
                <p className="text-muted-foreground">Loading your loan data...</p>
              </div>
            ) : (
              <>
                <Stats loans={loans} />
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Chart loans={loans} />
                  <RecentLoans loans={loans} />
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
