import React from 'react';
import type { ReactNode } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar fixo */}
      <Sidebar />
      
      {/* Container principal com header, conteúdo e footer */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Header fixo */}
        <Header />
        
        {/* Conteúdo scrollável */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>
        
        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;