
import type { User, Task, StudySession, Achievement } from '../types';

export const MOCK_USER: User = {
  id: 'user-1',
  username: 'rohit_sharma',
  displayName: 'Rohit S.',
  avatar: 'https://i.pravatar.cc/150?u=rohit',
  xp: 1250,
  level: 2,
  totalStudyHours: 45.5,
  currentStreak: 12,
  achievements: ['ach-1', 'ach-2', 'ach-5'],
};

export const MOCK_LEADERBOARD_USERS: User[] = [
    { ...MOCK_USER, xp: 1250, displayName: "You" },
    { id: 'user-2', username: 'priya_k', displayName: 'Priya K.', avatar: 'https://i.pravatar.cc/150?u=priya', xp: 1800, level: 3, totalStudyHours: 60, currentStreak: 25, achievements: [] },
    { id: 'user-3', username: 'arjun_m', displayName: 'Arjun M.', avatar: 'https://i.pravatar.cc/150?u=arjun', xp: 1100, level: 2, totalStudyHours: 40, currentStreak: 8, achievements: [] },
    { id: 'user-4', username: 'sneha_p', displayName: 'Sneha P.', avatar: 'https://i.pravatar.cc/150?u=sneha', xp: 950, level: 2, totalStudyHours: 35, currentStreak: 15, achievements: [] },
    { id: 'user-5', username: 'vikram_r', displayName: 'Vikram R.', avatar: 'https://i.pravatar.cc/150?u=vikram', xp: 2200, level: 3, totalStudyHours: 75, currentStreak: 30, achievements: [] },
];


export const MOCK_TASKS: Task[] = [
  { id: 'task-1', userId: 'user-1', title: 'Solve HCV Optics Ex.', subject: 'Physics', priority: 'High', status: 'Completed', taskType: 'Practice', dueDate: '2024-07-20T00:00:00.000Z', xpEarned: 75 },
  { id: 'task-2', userId: 'user-1', title: 'Revise Chemical Bonding', subject: 'Chemistry', priority: 'Medium', status: 'In Progress', taskType: 'Revision', dueDate: '2024-07-21T00:00:00.000Z', xpEarned: 50 },
  { id: 'task-3', userId: 'user-1', title: 'Practice Integration Problems', subject: 'Mathematics', priority: 'High', status: 'Pending', taskType: 'Practice', dueDate: '2024-07-22T00:00:00.000Z', xpEarned: 75 },
  { id: 'task-4', userId: 'user-1', title: 'Mock Test - Full Syllabus', subject: 'Physics', priority: 'High', status: 'Pending', taskType: 'Mock Test', dueDate: '2024-07-25T00:00:00.000Z', xpEarned: 150 },
  { id: 'task-5', userId: 'user-2', title: 'Read Thermodynamics', subject: 'Physics', priority: 'Medium', status: 'Completed', taskType: 'Study', dueDate: '2024-07-20T00:00:00.000Z', xpEarned: 50 },
];

export const MOCK_SESSIONS: StudySession[] = [
  { id: 'session-1', userId: 'user-1', subject: 'Physics', duration: 50, timerType: 'Deep Focus', notes: 'Solved optics numericals.', xpEarned: 50, startTime: '2024-07-20T10:00:00.000Z' },
  { id: 'session-2', userId: 'user-1', subject: 'Chemistry', duration: 25, timerType: 'Pomodoro', notes: 'Revised VSEPR theory.', xpEarned: 20, startTime: '2024-07-20T11:00:00.000Z' },
  { id: 'session-3', userId: 'user-1', subject: 'Mathematics', duration: 120, timerType: 'Custom', notes: 'Practiced definite integrals.', xpEarned: 120, startTime: '2024-07-19T14:00:00.000Z' },
  { id: 'session-4', userId: 'user-1', subject: 'Physics', duration: 50, timerType: 'Deep Focus', notes: 'Modern Physics concepts.', xpEarned: 50, startTime: '2024-07-19T09:00:00.000Z' },
];

export const MOCK_ACHIEVEMENTS: Achievement[] = [
  { id: 'ach-1', name: 'First Study Session', description: 'Complete your first study session.', icon: '🎓', xpReward: 50 },
  { id: 'ach-2', name: '1 Hour Warrior', description: 'Study for 1 hour in a single session.', icon: '⚔️', xpReward: 100 },
  { id: 'ach-3', name: 'Night Owl', description: 'Study after 10 PM.', icon: '🦉', xpReward: 75 },
  { id: 'ach-4', name: 'Early Bird', description: 'Study before 6 AM.', icon: '🐦', xpReward: 75 },
  { id: 'ach-5', name: '7 Day Streak', description: 'Maintain a study streak for 7 days.', icon: '🔥', xpReward: 200 },
  { id: 'ach-6', name: 'Task Master', description: 'Complete 10 tasks.', icon: '✅', xpReward: 150 },
  { id: 'ach-7', name: 'Physics Lover', description: 'Study Physics for 10 hours.', icon: '⚛️', xpReward: 100 },
  { id: 'ach-8', name: 'Math Maestro', description: 'Study Mathematics for 10 hours.', icon: '➗', xpReward: 100 },
];
