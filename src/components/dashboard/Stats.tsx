
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { DollarSign, CreditCard, Calendar, CheckCircle } from 'lucide-react';
import { Loan } from '../loans/LoanCard';

interface StatsProps {
  loans: Loan[];
}

const Stats = ({ loans }: StatsProps) => {
  // Calculate total amount borrowed
  const totalAmount = loans.reduce((acc, loan) => acc + loan.amount, 0);
  
  // Calculate number of approved loans
  const approvedLoans = loans.filter(loan => loan.status === 'approved').length;
  
  // Calculate approval rate
  const approvalRate = loans.length ? (approvedLoans / loans.length) * 100 : 0;
  
  // Calculate pending loans
  const pendingLoans = loans.filter(loan => loan.status === 'pending').length;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-slide-up">
      <StatCard
        title="Total Amount"
        value={formatCurrency(totalAmount)}
        icon={<DollarSign className="h-5 w-5" />}
        description="Total amount borrowed"
        className="bg-blue-50"
        iconClassName="bg-blue-100 text-blue-600"
      />
      
      <StatCard
        title="Active Loans"
        value={loans.length.toString()}
        icon={<CreditCard className="h-5 w-5" />}
        description="Total number of loans"
        className="bg-purple-50"
        iconClassName="bg-purple-100 text-purple-600"
      />
      
      <StatCard
        title="Approval Rate"
        value={`${approvalRate.toFixed(0)}%`}
        icon={<CheckCircle className="h-5 w-5" />}
        description={`${approvedLoans} out of ${loans.length} approved`}
        progress={approvalRate}
        className="bg-green-50"
        iconClassName="bg-green-100 text-green-600"
      />
      
      <StatCard
        title="Pending Approval"
        value={pendingLoans.toString()}
        icon={<Calendar className="h-5 w-5" />}
        description="Awaiting review"
        className="bg-amber-50"
        iconClassName="bg-amber-100 text-amber-600"
      />
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  description: string;
  progress?: number;
  className?: string;
  iconClassName?: string;
}

const StatCard = ({ 
  title, 
  value, 
  icon, 
  description, 
  progress, 
  className = '', 
  iconClassName = '' 
}: StatCardProps) => {
  return (
    <Card className={`border shadow-subtle overflow-hidden ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={`p-2 rounded-full ${iconClassName}`}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">
          {description}
        </p>
        {progress !== undefined && (
          <Progress value={progress} className="h-1 mt-3" />
        )}
      </CardContent>
    </Card>
  );
};

// Helper function to format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
};

export default Stats;
