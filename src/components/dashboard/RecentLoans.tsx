
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Loan } from '../loans/LoanCard';

interface RecentLoansProps {
  loans: Loan[];
}

const RecentLoans = ({ loans }: RecentLoansProps) => {
  const navigate = useNavigate();
  const recentLoans = [...loans]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);
  
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    approved: 'bg-green-100 text-green-800 border-green-200',
    rejected: 'bg-red-100 text-red-800 border-red-200',
    paid: 'bg-blue-100 text-blue-800 border-blue-200',
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  
  return (
    <Card className="shadow-subtle animate-slide-up">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Loans</CardTitle>
          <CardDescription>Your latest loan applications</CardDescription>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate('/loans')}
        >
          View all
        </Button>
      </CardHeader>
      <CardContent>
        {recentLoans.length > 0 ? (
          <div className="space-y-4">
            {recentLoans.map((loan) => (
              <div 
                key={loan.id}
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 transition-colors cursor-pointer"
                onClick={() => navigate(`/loans/${loan.id}`)}
              >
                <div className="flex items-center space-x-4">
                  <div>
                    <div className="font-medium">{loan.purpose}</div>
                    <div className="text-sm text-muted-foreground">
                      {formatDate(loan.createdAt)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <div className="font-medium">{formatCurrency(loan.amount)}</div>
                    <Badge className={`${statusColors[loan.status]} capitalize mt-1`}>
                      {loan.status}
                    </Badge>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>No loan applications yet</p>
            <Button 
              className="mt-4"
              onClick={() => navigate('/loans/new')}
            >
              Apply for a loan
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentLoans;
