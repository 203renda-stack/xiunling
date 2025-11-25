import React from 'react';
import { View } from '../types';
import { Icons } from '../constants';

interface NavBarProps {
  currentView: View;
  setView: (view: View) => void;
}

const NavBar: React.FC<NavBarProps> = ({ currentView, setView }) => {
  const navItems: { view: View; label: string; icon: React.FC<React.SVGProps<SVGSVGElement>> }[] = [
    { view: 'chat', label: '对话', icon: Icons.Message },
    { view: 'mood', label: '日记', icon: Icons.Chart },
    { view: 'resources', label: '资源', icon: Icons.Book },
  ];

  return (
    <div className="fixed bottom-0 w-full bg-white border-t border-slate-100 pb-safe pt-2 px-6 z-50">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = currentView === item.view;
          return (
            <button
              key={item.view}
              onClick={() => setView(item.view)}
              className={`flex flex-col items-center gap-1 w-16 transition-all duration-300 ${
                isActive ? 'text-sage-600 -translate-y-1' : 'text-slate-400'
              }`}
            >
              <item.icon
                className={`w-6 h-6 ${isActive ? 'fill-current opacity-20 stroke-[2.5px]' : 'stroke-2'}`}
              />
              <span className={`text-[10px] font-medium ${isActive ? 'opacity-100' : 'opacity-80'}`}>
                {item.label}
              </span>
              {isActive && (
                <span className="absolute -bottom-2 w-1 h-1 bg-sage-600 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default NavBar;