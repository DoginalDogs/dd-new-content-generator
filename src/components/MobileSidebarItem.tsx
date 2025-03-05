// MobileSidebarItem.tsx
import React, { useState } from 'react';

interface MobileSidebarItemProps {
  label: string;
  isActive: boolean;
  onClick: (selectedLabel: string) => void; // Pass selected label
  dropdownItems: string[]; // List of dropdown options
}

const MobileSidebarItem: React.FC<MobileSidebarItemProps> = ({
  label,
  isActive,
  onClick,
  dropdownItems,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const baseClasses = 'w-full py-2 mt-0 text-center cursor-pointer mb-3';
  const activeClasses = 'font-bold text-black bg-white';
  const inactiveClasses = 'bg-white text-black';
  const dropdownItemClasses = 'px-6 py-2 my-2 text-center bg-black border border-white cursor-pointer hover:bg-gray-100';

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

  return (
    <div className="w-full">
      {/* Main button */}
      <button
        className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
        aria-pressed={isActive}
        onClick={toggleDropdown}
      >
        {label} {/* Display the current selected label */}
      </button>

      {/* Dropdown items */}
      {isDropdownOpen && (
        <div className="bg-black text-white p-8 mb-5">
          {dropdownItems.map((item, index) => (
            <div
              key={index}
              className={dropdownItemClasses}
              onClick={() => {
                setIsDropdownOpen(false);
                onClick(item); // Pass the clicked item to the parent
              }}
            >
              {item}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MobileSidebarItem;
