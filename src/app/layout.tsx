// src/app/layout.tsx
'use client';

import React from 'react';
import { AppProvider } from './context/AppContext';
import BottomNavigation from '../components/BottomNavigation';
import './_assets/globals.css';


interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <html lang="en">
      <head>
        <title>My App</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        <AppProvider>
          <div className="flex flex-col min-h-screen">
            <main className="flex-grow">{children}</main>
            <BottomNavigation />
          </div>
        </AppProvider>
      </body>
    </html>
  );
};

export default Layout;
