import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import Navbar from '@/components/layout/Navbar';
import BlurContainer from '@/components/ui/BlurContainer';
import { Loan } from '@/components/loans/LoanCard';
import { AlertTriangle, ArrowLeft, Clock, Calendar, Edit, Trash2, DollarSign, CheckCircle, XCircle } from 'lucide-react';

const LoanDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loan, setLoan] = useState<Loan | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<'approved' | 'rejected' | null>(null);
  
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/login');
      return;
    }
    
    const loansData = localStorage.getItem('loans');
    if (loansData) {
      const loans = JSON.parse(loansData);
      const foundLoan = loans.find((l: Loan) => l.id === id);
      
      if (foundLoan) {
        setLoan(foundLoan);
      } else {
        navigate('/loans');
        toast.error('Loan not found');
      }
    }
  }, [id, navigate]);
  
  const handleDelete = () => {
    if (!id) return;
    
    const loansData = localStorage.getItem('loans');
    if (loansData) {
      const loans = JSON.parse(loansData);
      const updatedLoans = loans.filter((l: Loan) => l.id !== id);
      
      localStorage.setItem('loans', JSON.stringify(updatedLoans));
      toast.success('Loan deleted successfully');
      navigate('/loans');
    }
  };
  
  const handleStatusChange = () => {
    if (!id || !newStatus) return;
    
    const loansData = localStorage.getItem('loans');
    if (loansData) {
      const loans = JSON.parse(loansData);
      const updatedLoans = loans.map((l: Loan) => 
        l.id === id ? { ...l, status: newStatus } : l
      );
      
      localStorage.setItem('loans', JSON.stringify(updatedLoans));
      setLoan(prev => prev ? { ...prev, status: newStatus } : null);
      toast.success(`Loan ${newStatus} successfully`);
      setStatusDialogOpen(false);
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  
  if (!loan) return null;
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-12 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center mb-6">
            <Button
              variant="ghost"
              className="flex items-center mr-4 p-0 h-auto"
              onClick={() => navigate('/loans')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Loans
            </Button>
            
            <Badge 
              className={`
                capitalize ml-auto
                ${loan.status === 'approved' ? 'bg-green-100 text-green-800 hover:bg-green-200' : ''}
                ${loan.status === 'pending' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' : ''}
                ${loan.status === 'rejected' ? 'bg-red-100 text-red-800 hover:bg-red-200' : ''}
                ${loan.status === 'paid' ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' : ''}
              `}
            >
              {loan.status}
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <BlurContainer>
                <div className="flex justify-between items-start">
                  <h1 className="text-2xl font-bold">{loan.purpose}</h1>
                  
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => navigate(`/loans/edit/${loan.id}`)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="icon"
                      className="text-destructive"
                      onClick={() => setDeleteDialogOpen(true)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="mt-6 flex items-center">
                  <DollarSign className="h-6 w-6 text-muted-foreground mr-2" />
                  <span className="text-3xl font-bold">{formatCurrency(loan.amount)}</span>
                </div>
                
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-muted-foreground mr-3" />
                    <div>
                      <p className="text-sm text-muted-foreground">Application Date</p>
                      <p className="font-medium">{formatDate(loan.createdAt)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-muted-foreground mr-3" />
                    <div>
                      <p className="text-sm text-muted-foreground">Due Date</p>
                      <p className="font-medium">{formatDate(loan.dueDate)}</p>
                    </div>
                  </div>
                </div>
                
                {loan.description && (
                  <div className="mt-8">
                    <h3 className="text-lg font-medium mb-2">Description</h3>
                    <p className="text-muted-foreground">{loan.description}</p>
                  </div>
                )}
              </BlurContainer>
            </div>
            
            <div className="md:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {loan.status === 'pending' && (
                    <>
                      <Button
                        className="w-full flex items-center justify-center"
                        onClick={() => {
                          setNewStatus('approved');
                          setStatusDialogOpen(true);
                        }}
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Approve Loan
                      </Button>
                      
                      <Button
                        variant="outline"
                        className="w-full flex items-center justify-center text-destructive border-destructive/30 hover:bg-destructive/10"
                        onClick={() => {
                          setNewStatus('rejected');
                          setStatusDialogOpen(true);
                        }}
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Reject Loan
                      </Button>
                    </>
                  )}
                  
                  {(loan.status === 'approved' || loan.status === 'rejected') && (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => navigate(`/loans/edit/${loan.id}`)}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Application
                    </Button>
                  )}
                  
                  <Button
                    variant="outline"
                    className="w-full text-destructive border-destructive/30 hover:bg-destructive/10"
                    onClick={() => setDeleteDialogOpen(true)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Application
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-destructive mr-2" />
              Confirm Deletion
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this loan application? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {newStatus === 'approved' ? 'Approve Loan' : 'Reject Loan'}
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to {newStatus} this loan application?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setStatusDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant={newStatus === 'approved' ? 'default' : 'destructive'}
              onClick={handleStatusChange}
            >
              {newStatus === 'approved' ? 'Approve' : 'Reject'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LoanDetails;
