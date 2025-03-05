// SidebarItem.tsx
import React from 'react';

interface SidebarItemProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ label, isActive, onClick }) => {
  const baseClasses = 'w-1/3 text-sm px-3 border-2 py-2 my-0 mr-2  text-center cursor-pointer';
  const activeClasses = 'font-bold my-0 text-black bg-white';
  const inactiveClasses = 'bg-black my-0 border-white text-white';

  return (
    <button
      className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
      aria-pressed={isActive}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export default SidebarItem;
