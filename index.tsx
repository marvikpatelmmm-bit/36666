
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';


// ====================================================================================
// --- TYPES (from types.ts) ---
// ====================================================================================

interface User {
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

type TaskStatus = 'Pending' | 'In Progress' | 'Completed';
type TaskPriority = 'High' | 'Medium' | 'Low';
type TaskType = 'Study' | 'Practice' | 'Revision' | 'Mock Test' | 'Doubt Solving';

interface Task {
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

interface StudySession {
  id: string;
  userId: string;
  subject: 'Physics' | 'Chemistry' | 'Mathematics';
  duration: number; // in minutes
  timerType: 'Pomodoro' | 'Custom' | 'Deep Focus';
  notes: string;
  xpEarned: number;
  startTime: string;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  xpReward: number;
}

type ViewType = 'Dashboard' | 'Study Timer' | 'Tasks' | 'Leaderboard' | 'Analytics' | 'Profile';


// ====================================================================================
// --- ICONS (from components/icons/*.tsx) ---
// ====================================================================================

const TimerIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);
const TaskIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);
const ChartIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
  </svg>
);
const TrophyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-6.75c-.621 0-1.125.504-1.125 1.125V18.75m9 0h-9" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 21.75h4.5M12 18.75v-6.75m0 0a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 0a3.375 3.375 0 0 1 3.375-3.375h.375m-4.5 0v.375c0 .621.504 1.125 1.125 1.125h2.25c.621 0 1.125-.504 1.125-1.125V8.625" />
  </svg>
);
const UserIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
  </svg>
);
const DashboardIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" />
  </svg>
);
const SunIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.95-4.243-1.591 1.591M5.25 12H3m4.243-4.95-1.591-1.591M12 12a4.5 4.5 0 0 0 0 9 4.5 4.5 0 0 0 0-9Z" />
  </svg>
);
const MoonIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
  </svg>
);
const ChevronDownIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
  </svg>
);
const PlusIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);
const FireIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.362-3.797 8.222 8.222 0 0 0 3 .398Z" />
  </svg>
);
const XIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
  </svg>
);
const CheckIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
  </svg>
);
const SparklesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
    </svg>
);

// ====================================================================================
// --- UI COMPONENTS (from components/ui/*.tsx) ---
// ====================================================================================

const Card: React.FC<{ children: React.ReactNode; className?: string; }> = ({ children, className = '' }) => {
  return (
    <div
      className={`
        bg-light-card/60 dark:bg-dark-card/60 
        backdrop-blur-xl 
        border border-white/10 dark:border-white/5
        rounded-2xl shadow-lg
        p-6
        transition-all duration-300
        ${className}
      `}
    >
      {children}
    </div>
  );
};

const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { children: React.ReactNode; variant?: 'primary' | 'secondary' | 'ghost'; }> = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyles = 'px-4 py-2 rounded-lg font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-light-bg dark:focus:ring-offset-dark-bg flex items-center justify-center gap-2';
  
  const variantStyles = {
    primary: 'bg-primary text-white hover:bg-indigo-500 focus:ring-primary',
    secondary: 'bg-secondary text-white hover:bg-purple-500 focus:ring-secondary',
    ghost: 'bg-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700',
  };

  return (
    <button className={`${baseStyles} ${variantStyles[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

// ====================================================================================
// --- MOCK DATA (from data/mock.ts) ---
// ====================================================================================

const MOCK_USER: User = {
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

const MOCK_LEADERBOARD_USERS: User[] = [
    { ...MOCK_USER, xp: 1250, displayName: "You" },
    { id: 'user-2', username: 'priya_k', displayName: 'Priya K.', avatar: 'https://i.pravatar.cc/150?u=priya', xp: 1800, level: 3, totalStudyHours: 60, currentStreak: 25, achievements: [] },
    { id: 'user-3', username: 'arjun_m', displayName: 'Arjun M.', avatar: 'https://i.pravatar.cc/150?u=arjun', xp: 1100, level: 2, totalStudyHours: 40, currentStreak: 8, achievements: [] },
    { id: 'user-4', username: 'sneha_p', displayName: 'Sneha P.', avatar: 'https://i.pravatar.cc/150?u=sneha', xp: 950, level: 2, totalStudyHours: 35, currentStreak: 15, achievements: [] },
    { id: 'user-5', username: 'vikram_r', displayName: 'Vikram R.', avatar: 'https://i.pravatar.cc/150?u=vikram', xp: 2200, level: 3, totalStudyHours: 75, currentStreak: 30, achievements: [] },
];

const MOCK_TASKS: Task[] = [
  { id: 'task-1', userId: 'user-1', title: 'Solve HCV Optics Ex.', subject: 'Physics', priority: 'High', status: 'Completed', taskType: 'Practice', dueDate: '2024-07-20T00:00:00.000Z', xpEarned: 75 },
  { id: 'task-2', userId: 'user-1', title: 'Revise Chemical Bonding', subject: 'Chemistry', priority: 'Medium', status: 'In Progress', taskType: 'Revision', dueDate: '2024-07-21T00:00:00.000Z', xpEarned: 50 },
  { id: 'task-3', userId: 'user-1', title: 'Practice Integration Problems', subject: 'Mathematics', priority: 'High', status: 'Pending', taskType: 'Practice', dueDate: '2024-07-22T00:00:00.000Z', xpEarned: 75 },
  { id: 'task-4', userId: 'user-1', title: 'Mock Test - Full Syllabus', subject: 'Physics', priority: 'High', status: 'Pending', taskType: 'Mock Test', dueDate: '2024-07-25T00:00:00.000Z', xpEarned: 150 },
  { id: 'task-5', userId: 'user-2', title: 'Read Thermodynamics', subject: 'Physics', priority: 'Medium', status: 'Completed', taskType: 'Study', dueDate: '2024-07-20T00:00:00.000Z', xpEarned: 50 },
];

const MOCK_SESSIONS: StudySession[] = [
  { id: 'session-1', userId: 'user-1', subject: 'Physics', duration: 50, timerType: 'Deep Focus', notes: 'Solved optics numericals.', xpEarned: 50, startTime: '2024-07-20T10:00:00.000Z' },
  { id: 'session-2', userId: 'user-1', subject: 'Chemistry', duration: 25, timerType: 'Pomodoro', notes: 'Revised VSEPR theory.', xpEarned: 20, startTime: '2024-07-20T11:00:00.000Z' },
  { id: 'session-3', userId: 'user-1', subject: 'Mathematics', duration: 120, timerType: 'Custom', notes: 'Practiced definite integrals.', xpEarned: 120, startTime: '2024-07-19T14:00:00.000Z' },
  { id: 'session-4', userId: 'user-1', subject: 'Physics', duration: 50, timerType: 'Deep Focus', notes: 'Modern Physics concepts.', xpEarned: 50, startTime: '2024-07-19T09:00:00.000Z' },
];

const MOCK_ACHIEVEMENTS: Achievement[] = [
  { id: 'ach-1', name: 'First Study Session', description: 'Complete your first study session.', icon: '🎓', xpReward: 50 },
  { id: 'ach-2', name: '1 Hour Warrior', description: 'Study for 1 hour in a single session.', icon: '⚔️', xpReward: 100 },
  { id: 'ach-3', name: 'Night Owl', description: 'Study after 10 PM.', icon: '🦉', xpReward: 75 },
  { id: 'ach-4', name: 'Early Bird', description: 'Study before 6 AM.', icon: '🐦', xpReward: 75 },
  { id: 'ach-5', name: '7 Day Streak', description: 'Maintain a study streak for 7 days.', icon: '🔥', xpReward: 200 },
  { id: 'ach-6', name: 'Task Master', description: 'Complete 10 tasks.', icon: '✅', xpReward: 150 },
  { id: 'ach-7', name: 'Physics Lover', description: 'Study Physics for 10 hours.', icon: '⚛️', xpReward: 100 },
  { id: 'ach-8', name: 'Math Maestro', description: 'Study Mathematics for 10 hours.', icon: '➗', xpReward: 100 },
];

// ====================================================================================
// --- GEMINI SERVICE ---
// ====================================================================================

const MOCK_TIPS = [
    "Take regular short breaks to stay focused. The Pomodoro Technique is great for this!",
    "Explain a concept to someone else (or even to yourself) to solidify your understanding.",
    "Practice solving previous years' question papers to get a feel for the exam pattern.",
    "Don't neglect your health. Ensure you get enough sleep, eat well, and exercise.",
    "Create a formula sheet for each subject and review it daily."
];

const getStudyTip = async (subject: string): Promise<string> => {
  try {
    const serverResponse = await fetch('/api/gemini', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ subject }),
    });

    if (!serverResponse.ok) {
      console.error(`Server error: ${serverResponse.status} ${serverResponse.statusText}`);
      const errorBody = await serverResponse.json();
      console.error('Error details:', errorBody);
      throw new Error(`Server error: ${serverResponse.statusText}`);
    }

    const data = await serverResponse.json();
    
    if (data.tip) {
      return data.tip.trim();
    }
    
    return "Remember to stay consistent. Every small effort adds up to big results!";
  } catch (error) {
    console.error("Error fetching study tip:", error);
    return MOCK_TIPS[Math.floor(Math.random() * MOCK_TIPS.length)];
  }
};


// ====================================================================================
// --- VIEW COMPONENTS (from components/views/*.tsx) ---
// ====================================================================================

const Auth: React.FC<{ onLogin: (user: User) => void; }> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() && password.trim()) {
      onLogin(MOCK_USER);
    } else {
      setError('Please enter a username and password.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-sm animate-fade-in">
        <div className="text-center mb-8">
            <span className="text-5xl">🎓</span>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary mt-2">
                JEE Squad Tracker
            </h1>
            <p className="text-gray-500 dark:text-gray-400">Login to start your journey.</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-dark-bg border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              placeholder="rohit_sharma"
            />
          </div>
          <div>
            <label htmlFor="password"  className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-dark-bg border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              placeholder="••••••••"
            />
          </div>
          {error && <p className="text-sm text-danger">{error}</p>}
          <div>
            <Button type="submit" className="w-full">
              Login / Register
            </Button>
            <p className="text-xs text-center text-gray-400 mt-2">Registration is mocked. Any username/password will work.</p>
          </div>
        </form>
      </Card>
    </div>
  );
};

const Dashboard: React.FC<{ user: User; tasks: Task[]; sessions: StudySession[]; }> = ({ user, tasks, sessions }) => {
  const todayStats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const todaySessions = sessions.filter(s => s.startTime.startsWith(today));
    const hoursStudied = todaySessions.reduce((acc, s) => acc + s.duration, 0) / 60;
    const tasksCompleted = tasks.filter(t => t.status === 'Completed' && new Date(t.dueDate).toISOString().startsWith(today)).length;
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
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

const StudyTimerView: React.FC<{ addStudySession: (session: Omit<StudySession, 'id' | 'userId'>) => void }> = ({ addStudySession }) => {
  type TimerMode = 'Pomodoro' | 'Deep Focus' | 'Custom';
  type SessionType = 'Study' | 'Break';
  const MODE_SETTINGS = { 'Pomodoro': { study: 25, break: 5 }, 'Deep Focus': { study: 50, break: 10 }, 'Custom': { study: 45, break: 15 } };
  const [mode, setMode] = useState<TimerMode>('Pomodoro');
  const [sessionType, setSessionType] = useState<SessionType>('Study');
  const [isActive, setIsActive] = useState(false);
  const [time, setTime] = useState(MODE_SETTINGS[mode].study * 60);
  const [initialTime, setInitialTime] = useState(MODE_SETTINGS[mode].study * 60);
  const [subject, setSubject] = useState<'Physics' | 'Chemistry' | 'Mathematics'>('Physics');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const duration = sessionType === 'Study' ? MODE_SETTINGS[mode].study : MODE_SETTINGS[mode].break;
    setTime(duration * 60); setInitialTime(duration * 60); setIsActive(false);
  }, [mode, sessionType]);

  useEffect(() => {
    let interval: number | null = null;
    if (isActive && time > 0) {
      interval = window.setInterval(() => { setTime((prevTime) => prevTime - 1); }, 1000);
    } else if (isActive && time === 0) {
      setIsActive(false); alert('Session ended!');
      if (sessionType === 'Study') {
          addStudySession({ subject, duration: initialTime / 60, timerType: mode, notes, xpEarned: Math.floor((initialTime / 60) / 10) * 10, startTime: new Date().toISOString() });
          setSessionType('Break');
      } else { setSessionType('Study'); }
    }
    return () => { if (interval) window.clearInterval(interval); };
  }, [isActive, time, addStudySession, subject, initialTime, mode, notes, sessionType]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => { setIsActive(false); const duration = sessionType === 'Study' ? MODE_SETTINGS[mode].study : MODE_SETTINGS[mode].break; setTime(duration * 60); };
  const progress = useMemo(() => (time / initialTime) * 100, [time, initialTime]);
  const formatTime = (seconds: number) => { const minutes = Math.floor(seconds / 60); const secs = seconds % 60; return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`; };

  const CircularProgress: React.FC<{ progress: number }> = ({ progress }) => {
    const radius = 90; const circumference = 2 * Math.PI * radius; const offset = circumference - (progress / 100) * circumference;
    return (<svg className="w-64 h-64" viewBox="0 0 200 200"><circle className="text-gray-200 dark:text-gray-700" strokeWidth="10" stroke="currentColor" fill="transparent" r={radius} cx="100" cy="100" /><circle className="text-primary" strokeWidth="10" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" stroke="currentColor" fill="transparent" r={radius} cx="100" cy="100" style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }} /></svg>);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full animate-fade-in">
        <Card className="w-full max-w-2xl text-center">
            <div className="flex justify-center gap-2 mb-6">{(['Pomodoro', 'Deep Focus', 'Custom'] as TimerMode[]).map(m => (<Button key={m} variant={mode === m ? 'primary' : 'ghost'} onClick={() => setMode(m)}>{m}</Button>))}</div>
            <div className="relative inline-flex items-center justify-center my-8"><CircularProgress progress={progress} /><div className="absolute flex flex-col items-center"><p className="text-6xl font-bold">{formatTime(time)}</p><p className="text-lg text-gray-500 dark:text-gray-400">{sessionType}</p></div></div>
            <div className="flex justify-center gap-4 mb-6"><Button onClick={toggleTimer} variant="primary" className="w-32">{isActive ? 'Pause' : 'Start'}</Button><Button onClick={resetTimer} variant="secondary" className="w-32">Reset</Button></div>
            {sessionType === 'Study' && (<div className="space-y-4 text-left"><div><label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Subject</label><select id="subject" value={subject} onChange={e => setSubject(e.target.value as any)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 bg-light-card dark:bg-dark-card focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"><option>Physics</option><option>Chemistry</option><option>Mathematics</option></select></div><div><label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Session Notes</label><textarea id="notes" rows={3} value={notes} onChange={e => setNotes(e.target.value)} className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-600 bg-light-card dark:bg-dark-card rounded-md focus:ring-primary focus:border-primary" placeholder="What are you focusing on?"></textarea></div></div>)}
        </Card>
    </div>
  );
};

const TasksView: React.FC<{ tasks: Task[]; updateTask: (task: Task) => void; }> = ({ tasks, updateTask }) => {
  const pendingTasks = tasks.filter(t => t.status === 'Pending' || t.status === 'In Progress');
  const completedTasks = tasks.filter(t => t.status === 'Completed');

  const TaskItem: React.FC<{ task: Task; onUpdate: (task: Task) => void }> = ({ task, onUpdate }) => {
    const handleStatusChange = () => { const newStatus: TaskStatus = task.status === 'Completed' ? 'Pending' : 'Completed'; onUpdate({ ...task, status: newStatus }); };
    const priorityColor = { High: 'border-l-danger', Medium: 'border-l-warning', Low: 'border-l-success' };
    return (<div className={`flex items-center justify-between p-4 bg-light-card dark:bg-dark-card rounded-lg shadow-sm border-l-4 ${priorityColor[task.priority]} transition-all duration-300`}><div className="flex items-center gap-4"><button onClick={handleStatusChange} className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${task.status === 'Completed' ? 'bg-primary border-primary' : 'border-gray-400'}`}>{task.status === 'Completed' && <CheckIcon className="w-4 h-4 text-white" />}</button><div><p className={`font-semibold ${task.status === 'Completed' ? 'line-through text-gray-500' : ''}`}>{task.title}</p><p className="text-sm text-gray-400">{task.subject} • {task.taskType}</p></div></div><div className="text-right"><p className="text-sm font-medium">{new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p><span className={`px-2 py-1 text-xs font-semibold rounded-full ${ task.priority === 'High' ? 'bg-danger/20 text-danger' : task.priority === 'Medium' ? 'bg-warning/20 text-warning' : 'bg-success/20 text-success'}`}>{task.priority}</span></div></div>);
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex justify-between items-center"><h2 className="text-3xl font-bold">My Tasks</h2><Button><PlusIcon className="w-5 h-5" />Add Task</Button></div>
      <Card>
        <div className="mb-6"><h3 className="text-xl font-bold mb-4">Pending</h3>{pendingTasks.length > 0 ? (<div className="space-y-3">{pendingTasks.map(task => (<TaskItem key={task.id} task={task} onUpdate={updateTask} />))}</div>) : (<p className="text-gray-500">No pending tasks. You're all caught up!</p>)}</div>
        <div><h3 className="text-xl font-bold mb-4">Completed</h3>{completedTasks.length > 0 ? (<div className="space-y-3">{completedTasks.map(task => (<TaskItem key={task.id} task={task} onUpdate={updateTask} />))}</div>) : (<p className="text-gray-500">No tasks completed yet.</p>)}</div>
      </Card>
    </div>
  );
};

const LeaderboardView: React.FC<{ currentUser: User; }> = ({ currentUser }) => {
  type LeaderboardType = 'XP' | 'Study Hours' | 'Streak';
  const [leaderboardType, setLeaderboardType] = useState<LeaderboardType>('XP');
  const sortedUsers = [...MOCK_LEADERBOARD_USERS].sort((a, b) => { switch (leaderboardType) { case 'Study Hours': return b.totalStudyHours - a.totalStudyHours; case 'Streak': return b.currentStreak - a.currentStreak; default: return b.xp - a.xp; } });
  const getStat = (user: User) => { switch (leaderboardType) { case 'Study Hours': return `${user.totalStudyHours.toFixed(1)} hrs`; case 'Streak': return `${user.currentStreak} days`; default: return `${user.xp.toLocaleString()} XP`; } };

  return (
    <div className="animate-fade-in"><h2 className="text-3xl font-bold mb-6">Leaderboard</h2>
      <Card>
        <div className="flex justify-center border-b border-gray-200 dark:border-gray-700 mb-6">{(['XP', 'Study Hours', 'Streak'] as LeaderboardType[]).map(type => (<button key={type} onClick={() => setLeaderboardType(type)} className={`px-4 py-2 text-lg font-semibold transition-colors duration-300 ${ leaderboardType === type ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}>{type}</button>))}</div>
        <ul className="space-y-3">{sortedUsers.map((user, index) => (<li key={user.id} className={`flex items-center p-4 rounded-lg transition-all duration-300 ${ user.id === currentUser.id ? 'bg-primary/20 scale-105 shadow-lg' : 'bg-gray-100 dark:bg-gray-800'}`}><div className="w-10 text-xl font-bold text-center">{index < 3 ? ['🥇', '🥈', '🥉'][index] : index + 1}</div><img src={user.avatar} alt={user.displayName} className="w-12 h-12 rounded-full mx-4" /><div className="flex-1"><p className="font-bold text-lg">{user.displayName}</p><p className="text-sm text-gray-500 dark:text-gray-400">Level {user.level}</p></div><div className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">{getStat(user)}</div></li>))}</ul>
      </Card>
    </div>
  );
};

const AnalyticsView: React.FC<{ sessions: StudySession[]; tasks: Task[]; }> = ({ sessions, tasks }) => {
  const COLORS = ['#6366F1', '#8B5CF6', '#10B981'];
  const subjectDistributionData = useMemo(() => { const dist = sessions.reduce((acc, s) => { acc[s.subject] = (acc[s.subject] || 0) + s.duration; return acc; }, {} as Record<string, number>); return Object.entries(dist).map(([name, value]) => ({ name, value: value / 60 })); }, [sessions]);
  // FIX: Explicitly type `daily` as `Record<string, number>` to ensure TypeScript correctly infers `hours` as a number, allowing the use of `.toFixed()`.
  const dailyStudyData = useMemo(() => { const daily: Record<string, number> = {}; sessions.forEach(s => { const date = new Date(s.startTime).toLocaleDateString('en-CA'); daily[date] = (daily[date] || 0) + s.duration / 60; }); return Object.entries(daily).map(([date, hours]) => ({ name: new Date(date).toLocaleDateString('en-us',{weekday:'short'}), hours: parseFloat(hours.toFixed(1)) })).slice(-7); }, [sessions]);
  const tasksCompleted = tasks.filter(t => t.status === 'Completed').length; const tasksPending = tasks.length - tasksCompleted; const completionRate = tasks.length > 0 ? (tasksCompleted / tasks.length * 100).toFixed(0) : 0;

  return (
    <div className="animate-fade-in space-y-6"><h2 className="text-3xl font-bold">Analytics & Insights</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6"><Card><h3 className="font-bold text-lg">Tasks Completed</h3><p className="text-4xl font-extrabold text-success">{tasksCompleted}</p></Card><Card><h3 className="font-bold text-lg">Tasks Pending</h3><p className="text-4xl font-extrabold text-warning">{tasksPending}</p></Card><Card><h3 className="font-bold text-lg">Completion Rate</h3><p className="text-4xl font-extrabold text-primary">{completionRate}%</p></Card></div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card><h3 className="text-xl font-bold mb-4">Daily Study Hours (Last 7 Days)</h3><ResponsiveContainer width="100%" height={300}><BarChart data={dailyStudyData}><CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.2)" /><XAxis dataKey="name" /><YAxis /><Tooltip contentStyle={{ backgroundColor: 'rgba(30, 41, 59, 0.8)', borderColor: 'rgba(128,128,128,0.5)', borderRadius: '0.75rem' }} /><Legend /><Bar dataKey="hours" fill="#8B5CF6" /></BarChart></ResponsiveContainer></Card>
        <Card><h3 className="text-xl font-bold mb-4">Subject Distribution (Hours)</h3><ResponsiveContainer width="100%" height={300}><PieChart><Pie data={subjectDistributionData} cx="50%" cy="50%" labelLine={false} outerRadius={100} fill="#8884d8" dataKey="value" nameKey="name" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>{subjectDistributionData.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}</Pie><Tooltip contentStyle={{ backgroundColor: 'rgba(30, 41, 59, 0.8)', borderColor: 'rgba(128,128,128,0.5)', borderRadius: '0.75rem' }} /></PieChart></ResponsiveContainer></Card>
      </div>
    </div>
  );
};

const ProfileView: React.FC<{ user: User; achievements: Achievement[]; }> = ({ user, achievements }) => {
  const LEVEL_MAP: { [key: number]: string } = { 1: 'JEE Aspirant', 2: 'Problem Solver', 3: 'Concept Builder', 4: 'Formula Master', 5: 'Chapter Champion' };
  const userLevelTitle = LEVEL_MAP[user.level] || 'IIT Bound';
  const AchievementCard: React.FC<{ achievement: Achievement; earned: boolean }> = ({ achievement, earned }) => (<div className={`p-4 rounded-lg flex items-center gap-4 transition-all duration-300 ${earned ? 'bg-yellow-400/20' : 'bg-gray-200/50 dark:bg-gray-700/50 opacity-60'}`}><span className="text-4xl">{achievement.icon}</span><div><h4 className="font-bold">{achievement.name}</h4><p className="text-sm text-gray-500 dark:text-gray-400">{achievement.description}</p></div>{earned && <div className="ml-auto text-xs font-bold text-yellow-500">EARNED</div>}</div>);
  return (
    <div className="animate-fade-in space-y-6">
      <Card className="flex flex-col md:flex-row items-center gap-8"><img src={user.avatar} alt={user.displayName} className="w-32 h-32 rounded-full border-4 border-primary shadow-lg" /><div className="text-center md:text-left"><h2 className="text-4xl font-bold">{user.displayName}</h2><p className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">{userLevelTitle}</p><div className="flex justify-center md:justify-start gap-6 mt-4 text-center"><div><p className="text-2xl font-bold">{user.xp.toLocaleString()}</p><p className="text-sm text-gray-500">Total XP</p></div><div><p className="text-2xl font-bold">{user.totalStudyHours.toFixed(1)}</p><p className="text-sm text-gray-500">Hours Studied</p></div><div><p className="text-2xl font-bold">{user.currentStreak}</p><p className="text-sm text-gray-500">Day Streak</p></div></div></div></Card>
      <Card><h3 className="text-2xl font-bold mb-4">Achievements</h3><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{achievements.map(ach => (<AchievementCard key={ach.id} achievement={ach} earned={user.achievements.includes(ach.id)} />))}</div></Card>
    </div>
  );
};

// ====================================================================================
// --- LAYOUT COMPONENTS (from components/*.tsx) ---
// ====================================================================================

const Sidebar: React.FC<{ currentView: ViewType; setCurrentView: (view: ViewType) => void; }> = ({ currentView, setCurrentView }) => {
  const navItems = [ { view: 'Dashboard', icon: DashboardIcon }, { view: 'Study Timer', icon: TimerIcon }, { view: 'Tasks', icon: TaskIcon }, { view: 'Leaderboard', icon: TrophyIcon }, { view: 'Analytics', icon: ChartIcon }, { view: 'Profile', icon: UserIcon } ] as const;
  return (
    <aside className="fixed top-0 left-0 h-full w-64 bg-light-card/80 dark:bg-dark-card/80 backdrop-blur-xl border-r border-white/10 dark:border-white/5 p-6 flex-col justify-between hidden lg:flex">
      <div>
        <div className="flex items-center gap-3 mb-12"><span className="text-2xl">🎓</span><h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">JEE Squad Tracker</h1></div>
        <nav><ul>{navItems.map(({ view, icon: Icon }) => (<li key={view} className="mb-2"><button onClick={() => setCurrentView(view)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-300 ${ currentView === view ? 'bg-primary text-white shadow-lg' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}><Icon className="w-6 h-6" /><span className="font-semibold">{view}</span></button></li>))}</ul></nav>
      </div>
      <div className="text-center text-xs text-gray-400"><p>&copy; 2024 JEE Squad. All rights reserved.</p></div>
    </aside>
  );
};

const Header: React.FC<{ user: User; toggleDarkMode: () => void; isDarkMode: boolean; onLogout: () => void; }> = ({ user, toggleDarkMode, isDarkMode, onLogout }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  return (
    <header className="sticky top-0 bg-light-bg/80 dark:bg-dark-bg/80 backdrop-blur-xl z-10 p-4 sm:p-6 border-b border-white/10 dark:border-white/5 flex justify-between items-center">
      <div><h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Welcome back, {user.displayName}!</h2><p className="text-sm text-gray-500 dark:text-gray-400">Let's make today productive.</p></div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1 text-orange-500 font-bold bg-orange-500/10 px-3 py-1.5 rounded-full"><FireIcon className="w-5 h-5" /><span>{user.currentStreak} Day Streak</span></div>
        <button onClick={toggleDarkMode} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" aria-label="Toggle dark mode">{isDarkMode ? <SunIcon className="w-6 h-6" /> : <MoonIcon className="w-6 h-6" />}</button>
        <div className="relative"><button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center gap-2"><img src={user.avatar} alt={user.displayName} className="w-10 h-10 rounded-full border-2 border-primary" /><ChevronDownIcon className={`w-5 h-5 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} /></button>{dropdownOpen && (<div className="absolute right-0 mt-2 w-48 bg-light-card dark:bg-dark-card rounded-lg shadow-xl animate-fade-in p-2 z-20 border border-white/10"><button onClick={onLogout} className="w-full text-left px-4 py-2 rounded-md text-sm text-danger hover:bg-red-500/10 transition-colors">Logout</button></div>)}</div>
      </div>
    </header>
  );
};

// ====================================================================================
// --- MAIN APP COMPONENT (from App.tsx) ---
// ====================================================================================

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => localStorage.getItem('theme') === 'dark');
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [currentView, setCurrentView] = useState<ViewType>('Dashboard');

  useEffect(() => {
    if (isDarkMode) { document.documentElement.classList.add('dark'); localStorage.setItem('theme', 'dark'); } 
    else { document.documentElement.classList.remove('dark'); localStorage.setItem('theme', 'light'); }
  }, [isDarkMode]);

  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      const parsedUser = JSON.parse(loggedInUser);
      setUser(parsedUser);
      setTasks(MOCK_TASKS.filter(t => t.userId === parsedUser.id));
      setSessions(MOCK_SESSIONS.filter(s => s.userId === parsedUser.id));
      setAchievements(MOCK_ACHIEVEMENTS);
    }
  }, []);
  
  const handleLogin = (loggedInUser: User) => {
    localStorage.setItem('user', JSON.stringify(loggedInUser));
    setUser(loggedInUser);
    setTasks(MOCK_TASKS.filter(t => t.userId === loggedInUser.id));
    setSessions(MOCK_SESSIONS.filter(s => s.userId === loggedInUser.id));
    setAchievements(MOCK_ACHIEVEMENTS);
  };

  const handleLogout = () => { localStorage.removeItem('user'); setUser(null); setCurrentView('Dashboard'); };
  const toggleDarkMode = () => setIsDarkMode(prev => !prev);
  
  const addStudySession = useCallback((session: Omit<StudySession, 'id' | 'userId'>) => {
    if(user) {
        const newSession: StudySession = { ...session, id: `session-${Date.now()}`, userId: user.id };
        setSessions(prev => [newSession, ...prev]);
        const xpEarned = Math.floor(session.duration / 10) * 10;
        setUser(prevUser => {
            if (!prevUser) return null;
            const updatedUser = { ...prevUser, xp: prevUser.xp + xpEarned, totalStudyHours: prevUser.totalStudyHours + session.duration / 60, };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            return updatedUser;
        });
    }
  }, [user]);

  const updateTask = useCallback((updatedTask: Task) => {
    setTasks(prevTasks => prevTasks.map(task => task.id === updatedTask.id ? updatedTask : task));
    if (updatedTask.status === 'Completed') {
      setUser(prevUser => {
        if (!prevUser) return null;
        const updatedUser = { ...prevUser, xp: prevUser.xp + updatedTask.xpEarned, };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        return updatedUser;
      });
    }
  }, []);

  const viewComponent = useMemo(() => {
    if (!user) return <Auth onLogin={handleLogin} />;
    switch (currentView) {
      case 'Study Timer': return <StudyTimerView addStudySession={addStudySession} />;
      case 'Tasks': return <TasksView tasks={tasks} updateTask={updateTask} />;
      case 'Leaderboard': return <LeaderboardView currentUser={user} />;
      case 'Analytics': return <AnalyticsView sessions={sessions} tasks={tasks} />;
      case 'Profile': return <ProfileView user={user} achievements={achievements} />;
      default: return <Dashboard user={user} tasks={tasks} sessions={sessions} />;
    }
  }, [currentView, user, tasks, sessions, achievements, addStudySession, updateTask]);

  if (!user) {
    return (
      <main className="min-h-screen bg-light-bg dark:bg-dark-bg text-gray-800 dark:text-gray-200 font-sans transition-colors duration-300">
        <Auth onLogin={handleLogin} />
      </main>
    );
  }

  return (
    <div className="flex min-h-screen bg-light-bg dark:bg-dark-bg text-gray-800 dark:text-gray-200 font-sans transition-colors duration-300">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      <div className="flex-1 flex flex-col lg:ml-64">
        <Header user={user} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} onLogout={handleLogout} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {viewComponent}
        </main>
      </div>
    </div>
  );
};


// ====================================================================================
// --- RENDER APP ---
// ====================================================================================

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
