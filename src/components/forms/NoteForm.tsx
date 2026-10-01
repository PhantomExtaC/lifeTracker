'use client';
import { useState } from 'react';
import { format } from 'date-fns';

export default function NoteForm({ onSuccess }: { onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const date = format(new Date(), 'dd-MMM-yyyy hh:mm a');
    
    // Schema: Date | Title | Content
    const values = [
      date,
      formData.get('title'),
      formData.get('content')
    ];

    try {
      await fetch('/api/sheets?tab=Notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ values }),
      });
      onSuccess();
    } catch (error) {
      alert('Failed to save note.');
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="text-sm font-semibold mb-1 block">Title</label>
        <input name="title" required type="text" className="w-full p-3 rounded-lg border border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800" placeholder="e.g., Ideas for InnoSpark '26" />
      </div>

      <div>
        <label className="text-sm font-semibold mb-1 block">Content</label>
        <textarea name="content" required rows={6} className="w-full p-3 rounded-lg border border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800" placeholder="Brain dump here..."></textarea>
      </div>

      <button disabled={loading} type="submit" className="w-full p-4 mt-4 bg-purple-600 text-white rounded-xl font-bold text-lg hover:bg-purple-700 disabled:opacity-50 transition-all">
        {loading ? 'Saving...' : 'Save Note'}
      </button>
    </form>
  );
}