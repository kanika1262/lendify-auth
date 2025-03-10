
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, DollarSign, Clock, ArrowRight } from 'lucide-react';

export interface Loan {
  id: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  purpose: string;
  createdAt: string;
  dueDate: string;
}

interface LoanCardProps {
  loan: Loan;
}

const LoanCard = ({ loan }: LoanCardProps) => {
  const navigate = useNavigate();
  
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
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-elevation card-hover">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-medium text-lg">{loan.purpose}</h3>
            <p className="text-2xl font-semibold mt-1 flex items-center">
              <DollarSign className="h-5 w-5 text-muted-foreground mr-1" />
              {formatCurrency(loan.amount)}
            </p>
          </div>
          <Badge className={`${statusColors[loan.status]} capitalize`}>
            {loan.status}
          </Badge>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-2" />
            <span>Created: {formatDate(loan.createdAt)}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="h-4 w-4 mr-2" />
            <span>Due: {formatDate(loan.dueDate)}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="bg-secondary/50 px-6 py-3">
        <Button 
          variant="ghost" 
          className="ml-auto flex items-center text-sm"
          onClick={() => navigate(`/loans/${loan.id}`)}
        >
          View details
          <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LoanCard;
