
export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  xp: number;
  level: number;
  totalStudyHours: number;
  currentStreak: number;
  achievements: string[];
}

export type TaskStatus = 'Pending' | 'In Progress' | 'Completed';
export type TaskPriority = 'High' | 'Medium' | 'Low';
export type TaskType = 'Study' | 'Practice' | 'Revision' | 'Mock Test' | 'Doubt Solving';

export interface Task {
  id: string;
  userId: string;
  title: string;
  subject: 'Physics' | 'Chemistry' | 'Mathematics';
  priority: TaskPriority;
  status: TaskStatus;
  taskType: TaskType;
  dueDate: string;
  xpEarned: number;
}

export interface StudySession {
  id: string;
  userId: string;
  subject: 'Physics' | 'Chemistry' | 'Mathematics';
  duration: number; // in minutes
  timerType: 'Pomodoro' | 'Custom' | 'Deep Focus';
  notes: string;
  xpEarned: number;
  startTime: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  xpReward: number;
}

export type ViewType = 'Dashboard' | 'Study Timer' | 'Tasks' | 'Leaderboard' | 'Analytics' | 'Profile';
