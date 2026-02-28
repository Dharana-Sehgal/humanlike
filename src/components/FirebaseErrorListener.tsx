
'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { useToast } from '@/hooks/use-toast';

export function FirebaseErrorListener() {
  const { toast } = useToast();

  useEffect(() => {
    const handlePermissionError = (error: any) => {
      // In development, this will be caught by the Next.js error overlay
      // if it's thrown. For production/UX, we show a toast.
      toast({
        variant: 'destructive',
        title: 'Database Permission Denied',
        description: `Operation ${error.context.operation} failed at ${error.context.path}. Please check your security rules.`,
      });
      
      // Re-throw in development to trigger the overlay
      if (process.env.NODE_ENV === 'development') {
        // We delay the throw slightly to ensure the toast registers
        setTimeout(() => {
          throw error;
        }, 100);
      }
    };

    errorEmitter.on('permission-error', handlePermissionError);
    return () => {
      errorEmitter.off('permission-error', handlePermissionError);
    };
  }, [toast]);

  return null;
}
