
import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Loan } from '../loans/LoanCard';

interface ChartProps {
  loans: Loan[];
}

interface ChartData {
  name: string;
  amount: number;
}

const Chart = ({ loans }: ChartProps) => {
  const chartData = useMemo(() => {
    // Group loans by month
    const groupedByMonth: Record<string, number> = {};
    
    loans.forEach(loan => {
      const date = new Date(loan.createdAt);
      const month = date.toLocaleString('default', { month: 'short' });
      const year = date.getFullYear();
      const key = `${month} ${year}`;
      
      groupedByMonth[key] = (groupedByMonth[key] || 0) + loan.amount;
    });
    
    // Sort by date
    const sortedData = Object.entries(groupedByMonth)
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => {
        const dateA = new Date(a.name);
        const dateB = new Date(b.name);
        return dateA.getTime() - dateB.getTime();
      });
    
    // If we have less than 6 data points, add empty months
    if (sortedData.length < 6) {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();
      
      for (let i = 5; i >= 0; i--) {
        let monthIndex = currentMonth - i;
        let year = currentYear;
        
        if (monthIndex < 0) {
          monthIndex += 12;
          year -= 1;
        }
        
        const key = `${months[monthIndex]} ${year}`;
        
        if (!groupedByMonth[key]) {
          sortedData.push({ name: key, amount: 0 });
        }
      }
      
      // Sort again after adding empty months
      sortedData.sort((a, b) => {
        const [monthA, yearA] = a.name.split(' ');
        const [monthB, yearB] = b.name.split(' ');
        
        if (yearA !== yearB) {
          return parseInt(yearA) - parseInt(yearB);
        }
        
        return months.indexOf(monthA) - months.indexOf(monthB);
      });
    }
    
    // Limit to last 6 months
    return sortedData.slice(-6);
  }, [loans]);
  
  // Format the tooltip values
  const formatTooltipValue = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };
  
  return (
    <Card className="shadow-subtle animate-slide-up">
      <CardHeader>
        <CardTitle>Loan Volume</CardTitle>
        <CardDescription>Monthly loan application amount</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{
              top: 10,
              right: 10,
              left: 0,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
              tickLine={false}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={value => `$${value}`}
              width={60}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--background))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
              }}
              formatter={(value: number) => [formatTooltipValue(value), 'Amount']}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
            />
            <Area
              type="monotone"
              dataKey="amount"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              fill="url(#colorAmount)"
              activeDot={{ r: 6, strokeWidth: 0, fill: 'hsl(var(--primary))' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default Chart;
