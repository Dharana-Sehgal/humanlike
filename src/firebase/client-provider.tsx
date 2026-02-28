
'use client';

import React, { ReactNode, useMemo } from 'react';
import { FirebaseProvider } from './provider';
import { initializeFirebase } from './init';

/**
 * A Client Component provider that initializes Firebase services 
 * and provides them to the rest of the application.
 */
export const FirebaseClientProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  // Initialize Firebase services on the client. 
  // useMemo ensures this only happens once.
  const services = useMemo(() => initializeFirebase(), []);

  return (
    <FirebaseProvider 
      firebaseApp={services.firebaseApp} 
      firestore={services.firestore} 
      auth={services.auth}
    >
      {children}
    </FirebaseProvider>
  );
};
