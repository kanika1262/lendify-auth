
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/layout/Navbar';
import Stats from '@/components/dashboard/Stats';
import RecentLoans from '@/components/dashboard/RecentLoans';
import Chart from '@/components/dashboard/Chart';
import { Loan } from '@/components/loans/LoanCard';
import { PlusCircle } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [user, setUser] = useState<any>(null);
  
  // Check if user is logged in
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
      return;
    }
    
    setUser(JSON.parse(userData));
    
    // Fetch loans from localStorage
    const loansData = localStorage.getItem('loans');
    if (loansData) {
      setLoans(JSON.parse(loansData));
    } else {
      // Add sample loans for demo purposes
      const sampleLoans = [
        {
          id: '1',
          amount: 5000,
          purpose: 'Home Renovation',
          status: 'approved',
          createdAt: new Date('2023-01-15').toISOString(),
          dueDate: new Date('2023-07-15').toISOString(),
        },
        {
          id: '2',
          amount: 2000,
          purpose: 'Education',
          status: 'pending',
          createdAt: new Date('2023-02-20').toISOString(),
          dueDate: new Date('2023-08-20').toISOString(),
        },
        {
          id: '3',
          amount: 10000,
          purpose: 'Business Expansion',
          status: 'rejected',
          createdAt: new Date('2023-03-10').toISOString(),
          dueDate: new Date('2023-09-10').toISOString(),
        },
        {
          id: '4',
          amount: 3000,
          purpose: 'Medical Expenses',
          status: 'approved',
          createdAt: new Date('2023-04-05').toISOString(),
          dueDate: new Date('2023-10-05').toISOString(),
        },
        {
          id: '5',
          amount: 7500,
          purpose: 'Vehicle Purchase',
          status: 'paid',
          createdAt: new Date('2023-05-18').toISOString(),
          dueDate: new Date('2023-11-18').toISOString(),
        },
      ];
      
      localStorage.setItem('loans', JSON.stringify(sampleLoans));
      setLoans(sampleLoans);
    }
  }, [navigate]);
  
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
            <Stats loans={loans} />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Chart loans={loans} />
              <RecentLoans loans={loans} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
