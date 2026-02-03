
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/views/Dashboard';
import { StudyTimerView } from './components/views/StudyTimerView';
import { TasksView } from './components/views/TasksView';
import { LeaderboardView } from './components/views/LeaderboardView';
import { AnalyticsView } from './components/views/AnalyticsView';
import { ProfileView } from './components/views/ProfileView';
import { Auth } from './components/views/Auth';
import type { User, Task, StudySession, Achievement, ViewType } from './types';
import { MOCK_USER, MOCK_TASKS, MOCK_SESSIONS, MOCK_ACHIEVEMENTS } from './data/mock';

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('theme') === 'dark';
  });
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [currentView, setCurrentView] = useState<ViewType>('Dashboard');

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
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

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setCurrentView('Dashboard');
  };

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);
  
  const addStudySession = useCallback((session: Omit<StudySession, 'id' | 'userId'>) => {
    if(user) {
        const newSession: StudySession = {
            ...session,
            id: `session-${Date.now()}`,
            userId: user.id
        };
        setSessions(prev => [newSession, ...prev]);

        // Update user stats
        const xpEarned = Math.floor(session.duration / 10) * 10;
        setUser(prevUser => {
            if (!prevUser) return null;
            const updatedUser = {
                ...prevUser,
                xp: prevUser.xp + xpEarned,
                totalStudyHours: prevUser.totalStudyHours + session.duration / 60,
            };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            return updatedUser;
        });
    }
  }, [user]);

  const updateTask = useCallback((updatedTask: Task) => {
    setTasks(prevTasks => prevTasks.map(task => task.id === updatedTask.id ? updatedTask : task));
    
    // Grant XP on completion
    if (updatedTask.status === 'Completed') {
      setUser(prevUser => {
        if (!prevUser) return null;
        const updatedUser = {
          ...prevUser,
          xp: prevUser.xp + updatedTask.xpEarned,
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        return updatedUser;
      });
    }
  }, []);

  const viewComponent = useMemo(() => {
    if (!user) return <Auth onLogin={handleLogin} />;
    
    switch (currentView) {
      case 'Study Timer':
        return <StudyTimerView addStudySession={addStudySession} />;
      case 'Tasks':
        return <TasksView tasks={tasks} updateTask={updateTask} />;
      case 'Leaderboard':
        return <LeaderboardView currentUser={user} />;
      case 'Analytics':
        return <AnalyticsView sessions={sessions} tasks={tasks} />;
      case 'Profile':
        return <ProfileView user={user} achievements={achievements} />;
      case 'Dashboard':
      default:
        return <Dashboard user={user} tasks={tasks} sessions={sessions} />;
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

export default App;
