
import React from 'react';
import type { ViewType } from '../types';
import { DashboardIcon } from './icons/DashboardIcon';
import { TimerIcon } from './icons/TimerIcon';
import { TaskIcon } from './icons/TaskIcon';
import { TrophyIcon } from './icons/TrophyIcon';
import { ChartIcon } from './icons/ChartIcon';
import { UserIcon } from './icons/UserIcon';

interface SidebarProps {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
}

const navItems = [
  { view: 'Dashboard', icon: DashboardIcon },
  { view: 'Study Timer', icon: TimerIcon },
  { view: 'Tasks', icon: TaskIcon },
  { view: 'Leaderboard', icon: TrophyIcon },
  { view: 'Analytics', icon: ChartIcon },
  { view: 'Profile', icon: UserIcon },
] as const;

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView }) => {
  return (
    <aside className="fixed top-0 left-0 h-full w-64 bg-light-card/80 dark:bg-dark-card/80 backdrop-blur-xl border-r border-white/10 dark:border-white/5 p-6 flex-col justify-between hidden lg:flex">
      <div>
        <div className="flex items-center gap-3 mb-12">
          <span className="text-2xl">🎓</span>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            JEE Squad Tracker
          </h1>
        </div>
        <nav>
          <ul>
            {navItems.map(({ view, icon: Icon }) => (
              <li key={view} className="mb-2">
                <button
                  onClick={() => setCurrentView(view)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-300 ${
                    currentView === view
                      ? 'bg-primary text-white shadow-lg'
                      : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-6 h-6" />
                  <span className="font-semibold">{view}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="text-center text-xs text-gray-400">
        <p>&copy; 2024 JEE Squad. All rights reserved.</p>
      </div>
    </aside>
  );
};
