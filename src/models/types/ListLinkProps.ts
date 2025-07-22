import React from 'react';

export type ListLinkProps = {
  to: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
};
