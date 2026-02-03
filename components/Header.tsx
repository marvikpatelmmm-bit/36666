
import React, { useState } from 'react';
import type { User } from '../types';
import { SunIcon } from './icons/SunIcon';
import { MoonIcon } from './icons/MoonIcon';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { FireIcon } from './icons/FireIcon';

interface HeaderProps {
  user: User;
  toggleDarkMode: () => void;
  isDarkMode: boolean;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, toggleDarkMode, isDarkMode, onLogout }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 bg-light-bg/80 dark:bg-dark-bg/80 backdrop-blur-xl z-10 p-4 sm:p-6 border-b border-white/10 dark:border-white/5 flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Welcome back, {user.displayName}!</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Let's make today productive.</p>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1 text-orange-500 font-bold bg-orange-500/10 px-3 py-1.5 rounded-full">
            <FireIcon className="w-5 h-5" />
            <span>{user.currentStreak} Day Streak</span>
        </div>
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          aria-label="Toggle dark mode"
        >
          {isDarkMode ? <SunIcon className="w-6 h-6" /> : <MoonIcon className="w-6 h-6" />}
        </button>
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2"
          >
            <img src={user.avatar} alt={user.displayName} className="w-10 h-10 rounded-full border-2 border-primary" />
            <ChevronDownIcon className={`w-5 h-5 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-light-card dark:bg-dark-card rounded-lg shadow-xl animate-fade-in p-2 z-20 border border-white/10">
              <button
                onClick={onLogout}
                className="w-full text-left px-4 py-2 rounded-md text-sm text-danger hover:bg-red-500/10 transition-colors"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
