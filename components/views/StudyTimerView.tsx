import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import type { StudySession } from '../../types';

type TimerMode = 'Pomodoro' | 'Deep Focus' | 'Custom';
type SessionType = 'Study' | 'Break';

const MODE_SETTINGS = {
  'Pomodoro': { study: 25, break: 5 },
  'Deep Focus': { study: 50, break: 10 },
  'Custom': { study: 45, break: 15 },
};

const CircularProgress: React.FC<{ progress: number }> = ({ progress }) => {
    const radius = 90;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progress / 100) * circumference;

    return (
        <svg className="w-64 h-64" viewBox="0 0 200 200">
            <circle
                className="text-gray-200 dark:text-gray-700"
                strokeWidth="10"
                stroke="currentColor"
                fill="transparent"
                r={radius}
                cx="100"
                cy="100"
            />
            <circle
                className="text-primary"
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r={radius}
                cx="100"
                cy="100"
                style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
                />
        </svg>
    );
};


export const StudyTimerView: React.FC<{ addStudySession: (session: Omit<StudySession, 'id' | 'userId'>) => void }> = ({ addStudySession }) => {
  const [mode, setMode] = useState<TimerMode>('Pomodoro');
  const [sessionType, setSessionType] = useState<SessionType>('Study');
  const [isActive, setIsActive] = useState(false);
  const [time, setTime] = useState(MODE_SETTINGS[mode].study * 60);
  const [initialTime, setInitialTime] = useState(MODE_SETTINGS[mode].study * 60);

  const [subject, setSubject] = useState<'Physics' | 'Chemistry' | 'Mathematics'>('Physics');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const duration = sessionType === 'Study' ? MODE_SETTINGS[mode].study : MODE_SETTINGS[mode].break;
    setTime(duration * 60);
    setInitialTime(duration * 60);
    setIsActive(false);
  }, [mode, sessionType]);

  useEffect(() => {
    // FIX: Prefixed setInterval and clearInterval with `window` to ensure the browser-native
    // function is used, which returns a `number` and resolves the type conflict with NodeJS.Timeout.
    let interval: number | null = null;
    if (isActive && time > 0) {
      interval = window.setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (isActive && time === 0) {
      setIsActive(false);
      alert('Session ended!');
      if (sessionType === 'Study') {
          addStudySession({
              subject,
              duration: initialTime / 60,
              timerType: mode,
              notes,
              xpEarned: Math.floor((initialTime / 60) / 10) * 10,
              startTime: new Date().toISOString()
          });
          setSessionType('Break');
      } else {
          setSessionType('Study');
      }
    }
    return () => {
      if (interval) window.clearInterval(interval);
    };
  }, [isActive, time, addStudySession, subject, initialTime, mode, notes, sessionType]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    const duration = sessionType === 'Study' ? MODE_SETTINGS[mode].study : MODE_SETTINGS[mode].break;
    setTime(duration * 60);
  };

  const progress = useMemo(() => (time / initialTime) * 100, [time, initialTime]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center justify-center h-full animate-fade-in">
        <Card className="w-full max-w-2xl text-center">
            <div className="flex justify-center gap-2 mb-6">
                {(['Pomodoro', 'Deep Focus', 'Custom'] as TimerMode[]).map(m => (
                    <Button key={m} variant={mode === m ? 'primary' : 'ghost'} onClick={() => setMode(m)}>
                        {m}
                    </Button>
                ))}
            </div>

            <div className="relative inline-flex items-center justify-center my-8">
                <CircularProgress progress={progress} />
                <div className="absolute flex flex-col items-center">
                    <p className="text-6xl font-bold">{formatTime(time)}</p>
                    <p className="text-lg text-gray-500 dark:text-gray-400">{sessionType}</p>
                </div>
            </div>

            <div className="flex justify-center gap-4 mb-6">
                <Button onClick={toggleTimer} variant="primary" className="w-32">
                    {isActive ? 'Pause' : 'Start'}
                </Button>
                <Button onClick={resetTimer} variant="secondary" className="w-32">
                    Reset
                </Button>
            </div>

            {sessionType === 'Study' && (
              <div className="space-y-4 text-left">
                  <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Subject</label>
                      <select id="subject" value={subject} onChange={e => setSubject(e.target.value as any)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 bg-light-card dark:bg-dark-card focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md">
                          <option>Physics</option>
                          <option>Chemistry</option>
                          <option>Mathematics</option>
                      </select>
                  </div>
                  <div>
                      <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Session Notes</label>
                      <textarea id="notes" rows={3} value={notes} onChange={e => setNotes(e.target.value)} className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-600 bg-light-card dark:bg-dark-card rounded-md focus:ring-primary focus:border-primary" placeholder="What are you focusing on?"></textarea>
                  </div>
              </div>
            )}
        </Card>
    </div>
  );
};