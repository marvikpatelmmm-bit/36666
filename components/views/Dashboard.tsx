
import React, { useMemo, useState, useEffect } from 'react';
import type { User, Task, StudySession } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { FireIcon } from '../icons/FireIcon';
import { CheckIcon } from '../icons/CheckIcon';
import { TimerIcon } from '../icons/TimerIcon';
import { SparklesIcon } from '../icons/SparklesIcon';
import { MOCK_LEADERBOARD_USERS } from '../../data/mock';
import { getStudyTip } from '../../services/geminiService';

interface DashboardProps {
  user: User;
  tasks: Task[];
  sessions: StudySession[];
}

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; color: string }> = ({ title, value, icon, color }) => (
  <Card className="flex items-center gap-4">
    <div className={`p-3 rounded-full ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
      <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{value}</p>
    </div>
  </Card>
);

export const Dashboard: React.FC<DashboardProps> = ({ user, tasks, sessions }) => {
  const todayStats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const todaySessions = sessions.filter(s => s.startTime.startsWith(today));
    const hoursStudied = todaySessions.reduce((acc, s) => acc + s.duration, 0) / 60;
    const tasksCompleted = tasks.filter(t => t.status === 'Completed' && t.dueDate.startsWith(today)).length;
    return { hoursStudied, tasksCompleted };
  }, [sessions, tasks]);
  
  const upcomingTasks = useMemo(() => {
      return tasks.filter(t => t.status !== 'Completed').slice(0, 3);
  }, [tasks]);

  const [studyTip, setStudyTip] = useState<string>('Loading study tip...');
  const [isLoadingTip, setIsLoadingTip] = useState(false);

  const fetchStudyTip = async () => {
    setIsLoadingTip(true);
    const tip = await getStudyTip('general');
    setStudyTip(tip);
    setIsLoadingTip(false);
  };

  useEffect(() => {
    fetchStudyTip();
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard title="Hours Studied Today" value={todayStats.hoursStudied.toFixed(1)} icon={<TimerIcon className="w-6 h-6 text-white"/>} color="bg-primary" />
          <StatCard title="Tasks Completed Today" value={todayStats.tasksCompleted} icon={<CheckIcon className="w-6 h-6 text-white"/>} color="bg-success" />
          <StatCard title="Current Streak" value={`${user.currentStreak} days`} icon={<FireIcon className="w-6 h-6 text-white"/>} color="bg-orange-500" />
        </div>
        
        <Card>
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <SparklesIcon className="w-6 h-6 text-primary"/>
            AI Study Tip of the Day
          </h3>
          <p className="text-gray-600 dark:text-gray-300 italic">{studyTip}</p>
          <Button onClick={fetchStudyTip} variant="ghost" className="mt-2 text-sm text-primary" disabled={isLoadingTip}>
            {isLoadingTip ? 'Generating...' : 'Get New Tip'}
          </Button>
        </Card>

        <Card>
          <h3 className="text-xl font-bold mb-4">Upcoming Tasks</h3>
          {upcomingTasks.length > 0 ? (
            <ul className="space-y-3">
              {upcomingTasks.map(task => (
                <li key={task.id} className="flex justify-between items-center p-3 rounded-lg bg-gray-100 dark:bg-gray-700/50">
                  <div>
                    <p className="font-semibold">{task.title}</p>
                    <p className="text-sm text-gray-500">{task.subject}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      task.priority === 'High' ? 'bg-danger/20 text-danger' : 
                      task.priority === 'Medium' ? 'bg-warning/20 text-warning' : 'bg-success/20 text-success'
                  }`}>
                    {task.priority}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No upcoming tasks. Great job!</p>
          )}
        </Card>
      </div>

      {/* Side Content */}
      <div className="lg:col-span-1 space-y-6">
        <Card>
          <h3 className="text-xl font-bold mb-4">Mini Leaderboard</h3>
          <ul className="space-y-3">
            {MOCK_LEADERBOARD_USERS.sort((a, b) => b.xp - a.xp).slice(0, 5).map((u, index) => (
              <li key={u.id} className={`flex items-center gap-4 p-2 rounded-lg ${u.id === user.id ? 'bg-primary/20' : ''}`}>
                <span className="font-bold text-lg w-6">{['🥇', '🥈', '🥉'][index] || index + 1}</span>
                <img src={u.avatar} alt={u.displayName} className="w-10 h-10 rounded-full" />
                <div>
                  <p className="font-semibold">{u.displayName}</p>
                  <p className="text-sm text-gray-500">{u.xp.toLocaleString()} XP</p>
                </div>
              </li>
            ))}
          </ul>
        </Card>
        
        <Card>
            <h3 className="text-xl font-bold mb-4">Live Activity</h3>
            <p className="text-gray-500 text-sm">Real-time activity feed coming soon!</p>
            {/* Mocked activity for now */}
            <ul className="space-y-3 mt-4 text-sm">
                <li className="flex items-center gap-2">
                    <span className="text-lg">🎉</span>
                    <div>
                        <strong>Priya K.</strong> unlocked achievement: <strong>Night Owl</strong>.
                        <p className="text-xs text-gray-400">5 minutes ago</p>
                    </div>
                </li>
                <li className="flex items-center gap-2">
                    <span className="text-lg">📚</span>
                     <div>
                        <strong>Arjun M.</strong> started studying <strong>Physics</strong>.
                        <p className="text-xs text-gray-400">12 minutes ago</p>
                    </div>
                </li>
            </ul>
        </Card>
      </div>
    </div>
  );
};
