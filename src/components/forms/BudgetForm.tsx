'use client';
import { useState } from 'react';
import { format } from 'date-fns';

export default function BudgetForm({ onSuccess }: { onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const date = format(new Date(), 'dd-MMM-yyyy');
    const day = format(new Date(), 'EEEE');
    
    // Schema: Date | Day | Amount | Type | Transaction | Split With | Settled? | Payment Method
    const values = [
      date,
      day,
      formData.get('amount'),
      formData.get('type'),
      formData.get('transaction'),
      formData.get('splitWith') || '-',
      formData.get('settled') ? 'TRUE' : 'FALSE',
      formData.get('paymentMethod')
    ];

    try {
      await fetch('/api/sheets?tab=Budget', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ values }),
      });
      onSuccess();
    } catch (error) {
      alert('Failed to log expense.');
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold mb-1 block">Amount (₹)</label>
          <input name="amount" required type="number" step="0.01" className="w-full p-3 rounded-lg border border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 text-lg font-bold text-emerald-600" placeholder="0.00" />
        </div>
        <div>
          <label className="text-sm font-semibold mb-1 block">In / Out</label>
          <select name="transaction" className="w-full p-3 rounded-lg border border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800">
            <option value="Debit">Debit (Spent)</option>
            <option value="Credit">Credit (Received)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold mb-1 block">Category</label>
          <select name="type" className="w-full p-3 rounded-lg border border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800">
            <option>Food</option>
            <option>Travel</option>
            <option>Entertainment</option>
            <option>Outings</option>
            <option>Miscellaneous</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-semibold mb-1 block">Method</label>
          <select name="paymentMethod" className="w-full p-3 rounded-lg border border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800">
            <option>UPI</option>
            <option>Card</option>
            <option>Cash</option>
          </select>
        </div>
      </div>

      <div>
        <label className="text-sm font-semibold mb-1 block">Split With (Optional)</label>
        <input name="splitWith" type="text" className="w-full p-3 rounded-lg border border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800" placeholder="e.g., Rahul, Aditi" />
      </div>

      <div className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg border border-zinc-200 dark:border-zinc-700">
        <input type="checkbox" name="settled" id="settled" className="w-5 h-5 accent-emerald-600" />
        <label htmlFor="settled" className="font-medium text-sm">Debt Settled? (Check if paid back)</label>
      </div>

      <button disabled={loading} type="submit" className="w-full p-4 mt-4 bg-emerald-600 text-white rounded-xl font-bold text-lg hover:bg-emerald-700 disabled:opacity-50 transition-all">
        {loading ? 'Logging...' : 'Log Transaction'}
      </button>
    </form>
  );
}