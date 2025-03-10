
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Navbar from '@/components/layout/Navbar';
import LoanCard, { Loan } from '@/components/loans/LoanCard';
import { PlusCircle, Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

const Loans = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
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
        description: loan.description || '', // Add fallback for null/undefined description
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
  
  // Filter loans based on search term and status
  const filteredLoans = loans?.filter(loan => {
    // Apply search filter
    const matchesSearch = !searchTerm || 
      loan.purpose.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Apply status filter
    const matchesStatus = statusFilter === 'all' || loan.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  }) || [];
  
  if (!user) return null;
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-12 px-6">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight">My Loans</h1>
            <Button 
              className="mt-4 md:mt-0 flex items-center"
              onClick={() => navigate('/loans/new')}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              New Loan Application
            </Button>
          </div>
          
          <div className="bg-background sticky top-[72px] z-10 py-4 border-b mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search loans..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 h-10"
                />
              </div>
              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
              >
                <SelectTrigger className="w-full md:w-[180px] h-10">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {isLoading ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground">Loading your loan data...</p>
            </div>
          ) : filteredLoans.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
              {filteredLoans.map((loan) => (
                <LoanCard key={loan.id} loan={loan} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <h3 className="text-xl font-medium">No loans found</h3>
              <p className="text-muted-foreground mt-2">
                {loans.length > 0 
                  ? 'Try adjusting your filters or search term'
                  : 'Get started by applying for your first loan'}
              </p>
              {loans.length === 0 && (
                <Button 
                  className="mt-6"
                  onClick={() => navigate('/loans/new')}
                >
                  Apply Now
                </Button>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Loans;
