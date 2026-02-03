
import React, { useState } from 'react';
import type { Task, TaskStatus } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { PlusIcon } from '../icons/PlusIcon';
import { CheckIcon } from '../icons/CheckIcon';

interface TasksViewProps {
  tasks: Task[];
  updateTask: (task: Task) => void;
}

const TaskItem: React.FC<{ task: Task; onUpdate: (task: Task) => void }> = ({ task, onUpdate }) => {
  const handleStatusChange = () => {
    const newStatus: TaskStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
    onUpdate({ ...task, status: newStatus });
  };
  
  const priorityColor = {
    High: 'border-l-danger',
    Medium: 'border-l-warning',
    Low: 'border-l-success',
  };

  return (
    <div className={`flex items-center justify-between p-4 bg-light-card dark:bg-dark-card rounded-lg shadow-sm border-l-4 ${priorityColor[task.priority]} transition-all duration-300`}>
        <div className="flex items-center gap-4">
            <button 
                onClick={handleStatusChange} 
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${task.status === 'Completed' ? 'bg-primary border-primary' : 'border-gray-400'}`}
            >
                {task.status === 'Completed' && <CheckIcon className="w-4 h-4 text-white" />}
            </button>
            <div>
                <p className={`font-semibold ${task.status === 'Completed' ? 'line-through text-gray-500' : ''}`}>{task.title}</p>
                <p className="text-sm text-gray-400">{task.subject} • {task.taskType}</p>
            </div>
        </div>
        <div className="text-right">
            <p className="text-sm font-medium">{new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                task.priority === 'High' ? 'bg-danger/20 text-danger' : 
                task.priority === 'Medium' ? 'bg-warning/20 text-warning' : 'bg-success/20 text-success'
            }`}>
                {task.priority}
            </span>
        </div>
    </div>
  );
};

export const TasksView: React.FC<TasksViewProps> = ({ tasks, updateTask }) => {
  const [filter, setFilter] = useState<'All' | TaskStatus>('All');

  const filteredTasks = tasks.filter(task => filter === 'All' || task.status === filter);
  
  const pendingTasks = tasks.filter(t => t.status === 'Pending' || t.status === 'In Progress');
  const completedTasks = tasks.filter(t => t.status === 'Completed');


  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">My Tasks</h2>
        <Button>
          <PlusIcon className="w-5 h-5" />
          Add Task
        </Button>
      </div>

      <Card>
        <div className="mb-6">
            <h3 className="text-xl font-bold mb-4">Pending</h3>
            {pendingTasks.length > 0 ? (
                <div className="space-y-3">
                    {pendingTasks.map(task => (
                        <TaskItem key={task.id} task={task} onUpdate={updateTask} />
                    ))}
                </div>
            ) : (
                <p className="text-gray-500">No pending tasks. You're all caught up!</p>
            )}
        </div>
        
        <div>
            <h3 className="text-xl font-bold mb-4">Completed</h3>
            {completedTasks.length > 0 ? (
                <div className="space-y-3">
                    {completedTasks.map(task => (
                        <TaskItem key={task.id} task={task} onUpdate={updateTask} />
                    ))}
                </div>
            ) : (
                <p className="text-gray-500">No tasks completed yet.</p>
            )}
        </div>
      </Card>
    </div>
  );
};
