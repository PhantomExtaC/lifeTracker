'use client';
import { useState } from 'react';
import { format } from 'date-fns';

export default function TaskForm({ onSuccess }: { onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const dateAdded = format(new Date(), 'dd-MMM-yyyy');
    const id = Date.now().toString();
    
    // Order strictly matches our Phase 1 Google Sheet Columns:
    // ID | Date Added | Task Name | Category | Priority | Status | Deadline | Notes | Recurring_Ref_ID
    const values = [
      id,
      dateAdded,
      formData.get('taskName'),
      formData.get('category'),
      formData.get('priority'),
      'To Do', // Default status
      formData.get('deadline'),
      formData.get('notes') || '',
      '' // Blank for one-off tasks
    ];

    try {
      await fetch('/api/sheets?tab=Tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ values }),
      });
      onSuccess();
    } catch (error) {
      console.error(error);
      alert('Failed to save task.');
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="text-sm font-semibold mb-1 block">Task Name</label>
        <input name="taskName" required type="text" className="w-full p-3 rounded-lg border border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800" placeholder="e.g., Deploy Fanalytics Pipeline" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold mb-1 block">Category</label>
          <select name="category" className="w-full p-3 rounded-lg border border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800">
            <option>Personal</option>
            <option>F1 Analytics</option>
            <option>University</option>
            <option>GraphNet</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-semibold mb-1 block">Priority</label>
          <select name="priority" className="w-full p-3 rounded-lg border border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800">
            <option>Medium</option>
            <option>High</option>
            <option>Low</option>
          </select>
        </div>
      </div>

      <div>
        <label className="text-sm font-semibold mb-1 block">Deadline (Optional)</label>
        <input name="deadline" type="date" className="w-full p-3 rounded-lg border border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800" />
      </div>

      <div>
        <label className="text-sm font-semibold mb-1 block">Notes / Specifics</label>
        <textarea name="notes" rows={3} className="w-full p-3 rounded-lg border border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800" placeholder="Add context here..."></textarea>
      </div>

      <button disabled={loading} type="submit" className="w-full p-4 mt-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 disabled:opacity-50 transition-all">
        {loading ? 'Saving...' : 'Save Task'}
      </button>
    </form>
  );
}