
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
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const LoanDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<'approved' | 'rejected' | null>(null);
  const queryClient = useQueryClient();
  
  // Check if user is logged in
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        navigate('/login');
      }
    };
    
    checkAuth();
  }, [navigate]);
  
  // Fetch loan details from Supabase
  const { data: loan, isLoading } = useQuery({
    queryKey: ['loan', id],
    queryFn: async () => {
      if (!id) throw new Error('Loan ID is required');
      
      const { data, error } = await supabase
        .from('loans')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      if (!data) throw new Error('Loan not found');
      
      // Transform the data to match our Loan interface
      return {
        id: data.id,
        amount: data.amount,
        purpose: data.purpose,
        status: data.status as 'pending' | 'approved' | 'rejected' | 'paid',
        description: data.description || '', // Fixed: providing empty string as fallback
        createdAt: data.created_at,
        dueDate: data.start_date,
        loanType: data.purpose, // Using purpose as loanType temporarily
        interest_rate: data.interest_rate,
        term: data.term,
        borrower_name: data.borrower_name
      } as Loan;
    }
  });
  
  // Delete loan mutation
  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!id) throw new Error('Loan ID is required');
      
      const { error } = await supabase
        .from('loans')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Loan deleted successfully');
      navigate('/loans');
      queryClient.invalidateQueries({ queryKey: ['loans'] });
    },
    onError: (error) => {
      toast.error(`Error deleting loan: ${error.message}`);
    }
  });
  
  // Update loan status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async (status: string) => {
      if (!id) throw new Error('Loan ID is required');
      
      const { error } = await supabase
        .from('loans')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success(`Loan ${newStatus} successfully`);
      setStatusDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['loan', id] });
      queryClient.invalidateQueries({ queryKey: ['loans'] });
    },
    onError: (error) => {
      toast.error(`Error updating loan status: ${error.message}`);
    }
  });
  
  const handleDelete = () => {
    deleteMutation.mutate();
  };
  
  const handleStatusChange = () => {
    if (!newStatus) return;
    updateStatusMutation.mutate(newStatus);
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
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-24 pb-12 px-6">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center py-20">
              <p className="text-muted-foreground">Loading loan details...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }
  
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
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    {deleteMutation.isPending ? 'Deleting...' : 'Delete Application'}
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
              disabled={deleteMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
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
              disabled={updateStatusMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant={newStatus === 'approved' ? 'default' : 'destructive'}
              onClick={handleStatusChange}
              disabled={updateStatusMutation.isPending}
            >
              {updateStatusMutation.isPending ? 'Processing...' : (newStatus === 'approved' ? 'Approve' : 'Reject')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LoanDetails;
