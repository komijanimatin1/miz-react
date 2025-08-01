'use client';

import { useState, useEffect } from 'react';

interface MenuItem {
  title: string;
  icon: string;
  url: string;
  logoUrl?: string;
}

interface SideBarProps {
  menuItems: MenuItem[];
  mainMenuItems: MenuItem[];
  fullSideBarClicked: boolean;
  menuItemClicked: (item: MenuItem, fullClicked: boolean, index: number) => void;
  menuSliderShown: () => void;
  updateHiddenItems: (items: MenuItem[]) => void;
}

export default function SideBar({
  menuItems,
  mainMenuItems,
  fullSideBarClicked,
  menuItemClicked,
  menuSliderShown,
  updateHiddenItems,
}: SideBarProps) {
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [visibleItems, setVisibleItems] = useState<MenuItem[]>([]);
  const [hiddenItems, setHiddenItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    const calculateVisibleItems = () => {
      const sidebarHeight = window.innerHeight - 100; // Adjust as needed
      const itemHeight = 80; // Approximate height of a menu item
      const maxVisible = Math.floor(sidebarHeight / itemHeight);

      setVisibleItems(menuItems.slice(0, maxVisible));
      const newHiddenItems = menuItems.slice(maxVisible);
      setHiddenItems(newHiddenItems);
      updateHiddenItems(newHiddenItems);
    };

    calculateVisibleItems();
    window.addEventListener('resize', calculateVisibleItems);
    return () => window.removeEventListener('resize', calculateVisibleItems);
  }, [menuItems, updateHiddenItems]);

  const handleItemClick = (item: MenuItem, index: number) => {
    setActiveItem(item.url);
    menuItemClicked(item, false, index);
  };

  return (
    <aside className="flex flex-col items-center w-24 py-4 space-y-4 bg-white rounded-lg shadow-md">
      <div className="flex flex-col items-center space-y-2">
        {mainMenuItems.map((item) => (
          <button key={item.title} className="p-2 rounded-full hover:bg-gray-200">
            <span className="material-icons-outlined">{item.icon}</span>
          </button>
        ))}
      </div>
      <div className="flex-1 space-y-4">
        {visibleItems.map((item, index) => (
          <button
            key={item.url}
            onClick={() => handleItemClick(item, index)}
            className={`flex flex-col items-center p-2 rounded-lg w-20 ${
              activeItem === item.url ? 'bg-primary text-white' : 'hover:bg-gray-200'
            }`}
          >
            {item.logoUrl ? (
              <img src={item.logoUrl} alt={item.title} className="w-8 h-8" />
            ) : (
              <span className="material-icons-outlined">{item.icon}</span>
            )}
            <span className="text-xs truncate">{item.title}</span>
          </button>
        ))}
      </div>
      {hiddenItems.length > 0 && (
        <button onClick={menuSliderShown} className="p-2 rounded-full hover:bg-gray-200">
          <span className="material-icons-outlined">more_horiz</span>
        </button>
      )}
    </aside>
  );
}
