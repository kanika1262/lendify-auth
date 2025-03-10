
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/layout/Navbar';
import BlurContainer from '@/components/ui/BlurContainer';
import { ArrowRight, ShieldCheck, Clock, Zap } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  
  // Check if user is logged in
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      navigate('/dashboard');
    }
  }, [navigate]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex flex-col">
        {/* Hero Section */}
        <section className="pt-32 px-6 container mx-auto">
          <div className="max-w-4xl mx-auto text-center animate-slide-down">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance">
              Simple, Fast and Secure Lending Solutions
            </h1>
            <p className="mt-6 text-xl text-muted-foreground max-w-2xl mx-auto">
              Lendify provides a straightforward way to apply for loans with transparent terms and competitive rates.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button 
                size="lg" 
                className="h-12 px-8 text-base"
                onClick={() => navigate('/signup')}
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="h-12 px-8 text-base"
                onClick={() => navigate('/login')}
              >
                Sign In
              </Button>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-24 px-6 container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <BlurContainer className="p-8">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600 w-max">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-medium mt-4">Secure Process</h3>
              <p className="mt-2 text-muted-foreground">
                Your data is encrypted and protected with enterprise-grade security measures.
              </p>
            </BlurContainer>
            
            <BlurContainer className="p-8">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600 w-max">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-medium mt-4">Quick Approval</h3>
              <p className="mt-2 text-muted-foreground">
                Get loan approvals in as little as 24 hours with our streamlined application process.
              </p>
            </BlurContainer>
            
            <BlurContainer className="p-8">
              <div className="p-3 rounded-full bg-green-100 text-green-600 w-max">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-medium mt-4">Flexible Terms</h3>
              <p className="mt-2 text-muted-foreground">
                Customize your loan with flexible repayment options that work for your situation.
              </p>
            </BlurContainer>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-accent">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold tracking-tight">
                Ready to take the next step?
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Create an account and start your loan application today.
              </p>
              <Button 
                size="lg" 
                className="mt-8 h-12 px-8 text-base"
                onClick={() => navigate('/signup')}
              >
                Get Started
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="py-8 border-t">
        <div className="container mx-auto px-6 text-center text-sm text-muted-foreground">
          <p>© 2023 Lendify. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
