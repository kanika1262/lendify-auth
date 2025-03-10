
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { Loan } from './LoanCard';

interface LoanFormProps {
  editLoan?: Loan;
}

const LoanForm = ({ editLoan }: LoanFormProps) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    amount: editLoan?.amount.toString() || '',
    purpose: editLoan?.purpose || '',
    description: '',
    dueDate: editLoan?.dueDate.split('T')[0] || '',
    loanType: 'personal',
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.amount || !formData.purpose || !formData.dueDate) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get existing loans or initialize empty array
      const existingLoans = JSON.parse(localStorage.getItem('loans') || '[]');
      
      if (editLoan) {
        // Update existing loan
        const updatedLoans = existingLoans.map((loan: Loan) => 
          loan.id === editLoan.id
            ? {
                ...loan,
                amount,
                purpose: formData.purpose,
                dueDate: new Date(formData.dueDate).toISOString(),
                updatedAt: new Date().toISOString(),
              }
            : loan
        );
        
        localStorage.setItem('loans', JSON.stringify(updatedLoans));
        toast.success('Loan updated successfully');
      } else {
        // Create new loan
        const newLoan = {
          id: uuidv4(),
          amount,
          purpose: formData.purpose,
          description: formData.description,
          status: 'pending',
          loanType: formData.loanType,
          createdAt: new Date().toISOString(),
          dueDate: new Date(formData.dueDate).toISOString(),
        };
        
        localStorage.setItem('loans', JSON.stringify([...existingLoans, newLoan]));
        toast.success('Loan application submitted');
      }
      
      navigate('/loans');
    } catch (error) {
      toast.error('Failed to submit loan application');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className="w-full shadow-elevation animate-scale-in">
      <CardHeader>
        <CardTitle className="text-xl">
          {editLoan ? 'Edit Loan Application' : 'New Loan Application'}
        </CardTitle>
        <CardDescription>
          {editLoan 
            ? 'Update your loan details below' 
            : 'Fill out the form below to apply for a loan'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount" className="required">Loan Amount</Label>
            <div className="relative">
              <span className="absolute left-3 top-0 flex h-12 items-center text-muted-foreground">$</span>
              <Input
                id="amount"
                name="amount"
                type="number"
                placeholder="1000"
                value={formData.amount}
                onChange={handleChange}
                className="h-12 pl-8"
                required
                min="100"
                step="100"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="purpose" className="required">Loan Purpose</Label>
            <Input
              id="purpose"
              name="purpose"
              placeholder="e.g. Home renovation, Education, etc."
              value={formData.purpose}
              onChange={handleChange}
              className="h-12"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Provide additional details about your loan request"
              value={formData.description}
              onChange={handleChange}
              rows={4}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="loanType" className="required">Loan Type</Label>
              <Select
                value={formData.loanType}
                onValueChange={(value) => handleSelectChange('loanType', value)}
              >
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select loan type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="personal">Personal Loan</SelectItem>
                  <SelectItem value="business">Business Loan</SelectItem>
                  <SelectItem value="education">Education Loan</SelectItem>
                  <SelectItem value="mortgage">Mortgage</SelectItem>
                  <SelectItem value="vehicle">Vehicle Loan</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dueDate" className="required">Expected Repayment Date</Label>
              <Input
                id="dueDate"
                name="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={handleChange}
                className="h-12"
                required
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>
          
          <div className="pt-4">
            <Button 
              type="submit" 
              className="w-full h-12" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {editLoan ? 'Updating...' : 'Submitting...'}
                </>
              ) : (
                editLoan ? 'Update Loan' : 'Submit Application'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button 
          variant="outline" 
          onClick={() => navigate('/loans')}
        >
          Cancel
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LoanForm;
