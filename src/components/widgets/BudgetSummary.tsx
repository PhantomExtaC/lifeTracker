'use client';
import { useEffect, useState } from 'react';
import { TrendingDown, IndianRupee } from 'lucide-react';

interface Transaction {
  date: string;
  amount: number;
  type: string;
  transaction: string;
}

export default function BudgetSummary({ refreshTrigger }: { refreshTrigger: number }) {
  const [totalSpent, setTotalSpent] = useState(0);
  const [recent, setRecent] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBudget() {
      try {
        const res = await fetch('/api/sheets?tab=Budget');
        const rawData = await res.json();
        
        if (!Array.isArray(rawData)) return;

        let spent = 0;
        const formatted = rawData
          .filter((row: any) => Object.keys(row).length > 0)
          .map((row: any) => {
            const safeRow: any = {};
            Object.keys(row).forEach(key => safeRow[key.trim().toLowerCase()] = row[key]);
            
            const amount = parseFloat(safeRow['amount'] || '0');
            const isDebit = (safeRow['transaction'] || safeRow['in / out'] || '').toLowerCase().includes('debit');
            
            if (isDebit) spent += amount;

            return {
              date: safeRow['date'],
              amount,
              type: safeRow['type'] || safeRow['category'],
              transaction: isDebit ? 'Debit' : 'Credit',
            };
          });

        setTotalSpent(spent);
        setRecent(formatted.reverse().slice(0, 3)); // Get last 3 transactions
      } catch (error) {
        console.error('Failed to load budget', error);
      } finally {
        setLoading(false);
      }
    }

    fetchBudget();
  }, [refreshTrigger]);

  if (loading) return <div className="p-4 text-zinc-500 animate-pulse">Calculating...</div>;

  return (
    <div className="flex flex-col h-full justify-between gap-4">
      <div>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium mb-1">Total Spent</p>
        <h2 className="text-3xl font-black tracking-tight text-emerald-600 flex items-center">
          <IndianRupee size={24} className="mr-1" />
          {totalSpent.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </h2>
      </div>

      <div className="space-y-2 border-t border-zinc-100 dark:border-zinc-800 pt-3">
        <p className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Recent</p>
        {recent.map((tx, i) => (
          <div key={i} className="flex justify-between items-center text-sm">
            <span className="flex items-center gap-2">
              {tx.transaction === 'Debit' ? <TrendingDown size={14} className="text-red-500"/> : <IndianRupee size={14} className="text-emerald-500"/>}
              <span className="font-medium">{tx.type}</span>
            </span>
            <span className={tx.transaction === 'Debit' ? 'text-zinc-600 dark:text-zinc-300' : 'text-emerald-600 font-medium'}>
              {tx.transaction === 'Debit' ? '-' : '+'}₹{tx.amount}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}