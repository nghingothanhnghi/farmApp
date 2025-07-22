// src/components/common/ListLink.tsx
import React from 'react';
import { Link, useLocation } from 'react-router'
import type { ListLinkProps } from '../../models/types/ListLinkProps';

const ListLink: React.FC<ListLinkProps> = ({ to, icon, label, active, onClick }) => {
  const location = useLocation();
  const isActive = active ?? location.pathname === to;
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors duration-200
        hover:bg-gray-300 dark:hover:bg-zinc-800 hover:text-gray-800
        ${isActive ? 'bg-gray-300 text-gray-800 dark:bg-zinc-800' : 'text-gray-800 dark:text-zinc-300'}
      `}
    >
      <div className="text-xl">{icon}</div>
      <span className="text-sm font-medium">{label}</span>
    </Link>
  );
};

export default ListLink;
