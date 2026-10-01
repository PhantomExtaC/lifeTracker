'use client';
import { useState } from 'react';
import { format } from 'date-fns';

export default function ProgressForm({ onSuccess }: { onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const date = format(new Date(), 'dd-MMM-yyyy');
    
    // Schema: Date | Category | Activity | Value/Achieved | Daily Reflection
    const values = [
      date,
      formData.get('category'),
      formData.get('activity'),
      formData.get('value'),
      formData.get('reflection') || '-'
    ];

    try {
      await fetch('/api/sheets?tab=Progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ values }),
      });
      onSuccess();
    } catch (error) {
      alert('Failed to log progress.');
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold mb-1 block">Category</label>
          <select name="category" className="w-full p-3 rounded-lg border border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800">
            <option>Workout</option>
            <option>Media</option>
            <option>Project</option>
            <option>Personal</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-semibold mb-1 block">Metric Achieved</label>
          <input name="value" required type="text" className="w-full p-3 rounded-lg border border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800" placeholder="e.g., 50, Done, 2 hrs" />
        </div>
      </div>

      <div>
        <label className="text-sm font-semibold mb-1 block">Specific Activity</label>
        <input name="activity" required type="text" className="w-full p-3 rounded-lg border border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800" placeholder="e.g., Pushups, Fanalytics Post, Reading" />
      </div>

      <div>
        <label className="text-sm font-semibold mb-1 block">Daily Reflection (Optional)</label>
        <textarea name="reflection" rows={3} className="w-full p-3 rounded-lg border border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800" placeholder="How did it go?"></textarea>
      </div>

      <button disabled={loading} type="submit" className="w-full p-4 mt-4 bg-orange-600 text-white rounded-xl font-bold text-lg hover:bg-orange-700 disabled:opacity-50 transition-all">
        {loading ? 'Saving...' : 'Track Progress'}
      </button>
    </form>
  );
}