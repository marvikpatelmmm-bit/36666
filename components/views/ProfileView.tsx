
import React from 'react';
import type { User, Achievement } from '../../types';
import { Card } from '../ui/Card';

interface ProfileViewProps {
  user: User;
  achievements: Achievement[];
}

const LEVEL_MAP: { [key: number]: string } = {
  1: 'JEE Aspirant',
  2: 'Problem Solver',
  3: 'Concept Builder',
  4: 'Formula Master',
  5: 'Chapter Champion',
};

const AchievementCard: React.FC<{ achievement: Achievement; earned: boolean }> = ({ achievement, earned }) => (
    <div className={`p-4 rounded-lg flex items-center gap-4 transition-all duration-300 ${earned ? 'bg-yellow-400/20' : 'bg-gray-200/50 dark:bg-gray-700/50 opacity-60'}`}>
        <span className="text-4xl">{achievement.icon}</span>
        <div>
            <h4 className="font-bold">{achievement.name}</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">{achievement.description}</p>
        </div>
        {earned && <div className="ml-auto text-xs font-bold text-yellow-500">EARNED</div>}
    </div>
);

export const ProfileView: React.FC<ProfileViewProps> = ({ user, achievements }) => {
  const userLevelTitle = LEVEL_MAP[user.level] || 'IIT Bound';

  return (
    <div className="animate-fade-in space-y-6">
      <Card className="flex flex-col md:flex-row items-center gap-8">
        <img src={user.avatar} alt={user.displayName} className="w-32 h-32 rounded-full border-4 border-primary shadow-lg" />
        <div className="text-center md:text-left">
          <h2 className="text-4xl font-bold">{user.displayName}</h2>
          <p className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">{userLevelTitle}</p>
          <div className="flex justify-center md:justify-start gap-6 mt-4 text-center">
            <div>
                <p className="text-2xl font-bold">{user.xp.toLocaleString()}</p>
                <p className="text-sm text-gray-500">Total XP</p>
            </div>
            <div>
                <p className="text-2xl font-bold">{user.totalStudyHours.toFixed(1)}</p>
                <p className="text-sm text-gray-500">Hours Studied</p>
            </div>
             <div>
                <p className="text-2xl font-bold">{user.currentStreak}</p>
                <p className="text-sm text-gray-500">Day Streak</p>
            </div>
          </div>
        </div>
      </Card>
      
      <Card>
        <h3 className="text-2xl font-bold mb-4">Achievements</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map(ach => (
                <AchievementCard 
                    key={ach.id} 
                    achievement={ach} 
                    earned={user.achievements.includes(ach.id)} 
                />
            ))}
        </div>
      </Card>
    </div>
  );
};
