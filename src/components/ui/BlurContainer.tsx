
import React from 'react';
import { cn } from '@/lib/utils';

interface BlurContainerProps {
  children: React.ReactNode;
  className?: string;
}

const BlurContainer = ({ children, className }: BlurContainerProps) => {
  return (
    <div 
      className={cn(
        'glass rounded-2xl p-6 animate-scale-in',
        className
      )}
    >
      {children}
    </div>
  );
};

export default BlurContainer;
