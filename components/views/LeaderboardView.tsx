
import React, { useState } from 'react';
import type { User } from '../../types';
import { Card } from '../ui/Card';
import { MOCK_LEADERBOARD_USERS } from '../../data/mock';

interface LeaderboardViewProps {
  currentUser: User;
}

type LeaderboardType = 'XP' | 'Study Hours' | 'Streak';

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({ currentUser }) => {
  const [leaderboardType, setLeaderboardType] = useState<LeaderboardType>('XP');

  const sortedUsers = [...MOCK_LEADERBOARD_USERS].sort((a, b) => {
    switch (leaderboardType) {
      case 'Study Hours':
        return b.totalStudyHours - a.totalStudyHours;
      case 'Streak':
        return b.currentStreak - a.currentStreak;
      case 'XP':
      default:
        return b.xp - a.xp;
    }
  });

  const getStat = (user: User) => {
    switch (leaderboardType) {
      case 'Study Hours':
        return `${user.totalStudyHours.toFixed(1)} hrs`;
      case 'Streak':
        return `${user.currentStreak} days`;
      case 'XP':
      default:
        return `${user.xp.toLocaleString()} XP`;
    }
  };

  return (
    <div className="animate-fade-in">
      <h2 className="text-3xl font-bold mb-6">Leaderboard</h2>
      <Card>
        <div className="flex justify-center border-b border-gray-200 dark:border-gray-700 mb-6">
          {(['XP', 'Study Hours', 'Streak'] as LeaderboardType[]).map(type => (
            <button
              key={type}
              onClick={() => setLeaderboardType(type)}
              className={`px-4 py-2 text-lg font-semibold transition-colors duration-300 ${
                leaderboardType === type
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
        <ul className="space-y-3">
          {sortedUsers.map((user, index) => (
            <li
              key={user.id}
              className={`flex items-center p-4 rounded-lg transition-all duration-300 ${
                user.id === currentUser.id ? 'bg-primary/20 scale-105 shadow-lg' : 'bg-gray-100 dark:bg-gray-800'
              }`}
            >
              <div className="w-10 text-xl font-bold text-center">
                {index < 3 ? ['🥇', '🥈', '🥉'][index] : index + 1}
              </div>
              <img src={user.avatar} alt={user.displayName} className="w-12 h-12 rounded-full mx-4" />
              <div className="flex-1">
                <p className="font-bold text-lg">{user.displayName}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Level {user.level}</p>
              </div>
              <div className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                {getStat(user)}
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
};
