
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import type { StudySession, Task } from '../../types';
import { Card } from '../ui/Card';

interface AnalyticsViewProps {
  sessions: StudySession[];
  tasks: Task[];
}

const COLORS = ['#6366F1', '#8B5CF6', '#10B981'];

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ sessions, tasks }) => {

  const subjectDistributionData = React.useMemo(() => {
    const distribution = sessions.reduce((acc, session) => {
      acc[session.subject] = (acc[session.subject] || 0) + session.duration;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(distribution).map(([name, value]) => ({ name, value: value / 60 }));
  }, [sessions]);

  const dailyStudyData = React.useMemo(() => {
    const dailyData: Record<string, number> = {};
    sessions.forEach(session => {
        const date = new Date(session.startTime).toLocaleDateString('en-CA');
        dailyData[date] = (dailyData[date] || 0) + session.duration / 60;
    });

    return Object.entries(dailyData)
      .map(([date, hours]) => ({ name: new Date(date).toLocaleDateString('en-us',{weekday:'short'}), hours: parseFloat(hours.toFixed(1)) }))
      .slice(-7); // Last 7 days
  }, [sessions]);
  
  const tasksCompleted = tasks.filter(t => t.status === 'Completed').length;
  const tasksPending = tasks.length - tasksCompleted;
  const completionRate = tasks.length > 0 ? (tasksCompleted / tasks.length * 100).toFixed(0) : 0;


  return (
    <div className="animate-fade-in space-y-6">
      <h2 className="text-3xl font-bold">Analytics & Insights</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
            <h3 className="font-bold text-lg">Tasks Completed</h3>
            <p className="text-4xl font-extrabold text-success">{tasksCompleted}</p>
        </Card>
        <Card>
            <h3 className="font-bold text-lg">Tasks Pending</h3>
            <p className="text-4xl font-extrabold text-warning">{tasksPending}</p>
        </Card>
        <Card>
            <h3 className="font-bold text-lg">Completion Rate</h3>
            <p className="text-4xl font-extrabold text-primary">{completionRate}%</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-xl font-bold mb-4">Daily Study Hours (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dailyStudyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.2)" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(30, 41, 59, 0.8)',
                  borderColor: 'rgba(128,128,128,0.5)',
                  borderRadius: '0.75rem',
                }}
              />
              <Legend />
              <Bar dataKey="hours" fill="#8B5CF6" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="text-xl font-bold mb-4">Subject Distribution (Hours)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={subjectDistributionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {subjectDistributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(30, 41, 59, 0.8)',
                  borderColor: 'rgba(128,128,128,0.5)',
                  borderRadius: '0.75rem',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
};
