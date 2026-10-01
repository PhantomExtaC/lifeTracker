'use client';
import { CheckSquare, IndianRupee, Target, PenTool } from 'lucide-react';

interface NavProps {
  onOpenModal: (type: 'task' | 'budget' | 'progress' | 'note') => void;
}

export default function MobileNav({ onOpenModal }: NavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 pb-safe">
      <div className="flex justify-around items-center p-4 max-w-md mx-auto">
        <button onClick={() => onOpenModal('task')} className="flex flex-col items-center gap-1 text-zinc-600 hover:text-blue-600">
          <div className="p-3 bg-blue-100 rounded-2xl text-blue-600"><CheckSquare size={24} /></div>
          <span className="text-xs font-medium">Task</span>
        </button>
        <button onClick={() => onOpenModal('budget')} className="flex flex-col items-center gap-1 text-zinc-600 hover:text-emerald-600">
          <div className="p-3 bg-emerald-100 rounded-2xl text-emerald-600"><IndianRupee size={24} /></div>
          <span className="text-xs font-medium">Expense</span>
        </button>
        <button onClick={() => onOpenModal('progress')} className="flex flex-col items-center gap-1 text-zinc-600 hover:text-orange-600">
          <div className="p-3 bg-orange-100 rounded-2xl text-orange-600"><Target size={24} /></div>
          <span className="text-xs font-medium">Goal</span>
        </button>
        <button onClick={() => onOpenModal('note')} className="flex flex-col items-center gap-1 text-zinc-600 hover:text-purple-600">
          <div className="p-3 bg-purple-100 rounded-2xl text-purple-600"><PenTool size={24} /></div>
          <span className="text-xs font-medium">Note</span>
        </button>
      </div>
    </div>
  );
}