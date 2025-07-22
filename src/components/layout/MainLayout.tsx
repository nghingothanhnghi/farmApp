/* components/layout/MainLayout.tsx*/
import React, { useState } from 'react';
import type { ReactNode } from 'react';
import SideMenu from './SideMenu';
import MobileTopBar from './MobileTopBar';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="min-h-screen bg-gray-200">
      <div className="flex flex-col lg:flex lg:flex-1 min-h-screen">
        {/* Mobile toggle button */}
        <MobileTopBar onMenuClick={() => setMenuOpen(true)} />
        <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
        <div className="flex flex-1 flex-col pb-2 lg:min-w-0 lg:pt-2 lg:pr-2 lg:pl-64">
          <div className='grow p-6 lg:rounded-3xl lg:bg-white lg:p-10 lg:shadow-xs lg:ring-1 lg:ring-zinc-950/5 dark:lg:bg-zinc-900 dark:lg:ring-white/10'>
            {children}
          </div>
          <footer>
            <div className="max-w-7xl mx-auto pt-3 pb-1 px-4 sm:px-6 lg:px-8">
              <p className="text-center text-xs text-gray-500">
                &copy; {new Date().getFullYear()}. All rights reserved.
              </p>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;