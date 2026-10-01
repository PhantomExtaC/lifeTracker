'use client';
import { useEffect, useState } from 'react';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';

interface Task {
  id: string;
  taskName: string;
  category: string;
  priority: string;
  status: string;
  deadline: string;
}

export default function TaskList({ refreshTrigger }: { refreshTrigger: number }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTasks() {
      try {
        const res = await fetch('/api/sheets?tab=Tasks');
        const rawData = await res.json();
        
        if (!Array.isArray(rawData)) {
          console.error("API Error:", rawData);
          throw new Error("Invalid response from API.");
        }

        // BULLETPROOF MAPPING: Ignore exact casing/spaces and skip empty rows
        const formattedData = rawData
          .filter((row: any) => Object.keys(row).length > 0) 
          .map((row: any) => {
            const safeRow: any = {};
            // Convert all keys to lowercase and trim spaces
            Object.keys(row).forEach(key => {
              safeRow[key.trim().toLowerCase()] = row[key];
            });

            return {
              id: safeRow['id'] || Math.random().toString(),
              taskName: safeRow['task name'] || safeRow['task'] || safeRow['name'] || 'Unnamed Task',
              category: safeRow['category'] || 'General',
              priority: safeRow['priority'] || 'Low',
              status: safeRow['status'] || 'To Do',
              deadline: safeRow['deadline'] || '',
            };
          });

        const pendingTasks = formattedData.filter((task: Task) => task.status.toLowerCase() !== 'done');
        setTasks(pendingTasks);
      } catch (err: any) {
        console.error('Failed to load tasks', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchTasks();
  }, [refreshTrigger]);

  if (loading) return <div className="p-4 text-zinc-500 animate-pulse">Loading tasks...</div>;
  if (error) return <div className="p-4 text-red-500 flex items-center gap-2"><AlertCircle size={16}/> Error loading tasks. Check console.</div>;

  if (tasks.length === 0) {
    return (
      <div className="p-8 text-center text-zinc-500 flex flex-col items-center">
        <CheckCircle2 size={32} className="mb-2 opacity-50" />
        <p>All clear! No pending tasks.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto pr-2">
      {tasks.map((task) => (
        <div key={task.id} className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg flex justify-between items-start border border-zinc-100 dark:border-zinc-700">
          <div>
            <h4 className="font-semibold text-sm">{task.taskName}</h4>
            <div className="flex gap-2 mt-2">
              <span className="text-[10px] px-2 py-0.5 bg-zinc-200 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300 rounded-md font-medium">
                {task.category}
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded-md font-medium ${
                task.priority === 'High' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                task.priority === 'Medium' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
              }`}>
                {task.priority}
              </span>
            </div>
          </div>
          {task.deadline && (
            <div className="flex items-center gap-1 text-xs text-zinc-400 bg-white dark:bg-zinc-900 px-2 py-1 rounded-md border border-zinc-100 dark:border-zinc-800">
              <Clock size={12} />
              <span>{task.deadline}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}