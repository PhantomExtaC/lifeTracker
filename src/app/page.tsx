'use client';
import { useState } from 'react';
import MobileNav from '@/components/layout/MobileNav';
import Modal from '@/components/ui/Modal';
import TaskForm from '@/components/forms/TaskForm';
import TaskList from '@/components/widgets/TaskList';
import BudgetForm from '@/components/forms/BudgetForm';     // NEW
import ProgressForm from '@/components/forms/ProgressForm'; // NEW
import NoteForm from '@/components/forms/NoteForm';
import BudgetSummary from '@/components/widgets/BudgetSummary';


type ModalType = 'task' | 'budget' | 'progress' | 'note' | null;

export default function Dashboard() {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const closeModal = () => setActiveModal(null);
  
  const handleSuccess = () => {
    closeModal();
    setRefreshTrigger(prev => prev + 1); 
  };

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-black p-4 pb-24 font-sans">
      <header className="mb-8 mt-4 max-w-4xl mx-auto">
        <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white">October Arc</h1>
        <p className="text-zinc-500 font-medium">Your central command system.</p>
      </header>

      

      <section className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Task Widget */}
        <div className="p-5 bg-white dark:bg-zinc-900/80 rounded-2xl shadow-sm border border-zinc-200/60 dark:border-zinc-800 backdrop-blur-xl">
          <h3 className="font-bold mb-4 flex items-center gap-2 text-zinc-800 dark:text-zinc-200">
            Pending Tasks
          </h3>
          <TaskList refreshTrigger={refreshTrigger} />
        </div>

        {/* New Budget Widget */}
        <div className="p-5 bg-white dark:bg-zinc-900/80 rounded-2xl shadow-sm border border-zinc-200/60 dark:border-zinc-800 backdrop-blur-xl flex flex-col">
          <h3 className="font-bold mb-4 flex items-center gap-2 text-zinc-800 dark:text-zinc-200">
            October Budget
          </h3>
          <BudgetSummary refreshTrigger={refreshTrigger} />
        </div>
      </section>

      <MobileNav onOpenModal={setActiveModal} />

      {/* The Modals */}
      <Modal isOpen={activeModal === 'task'} onClose={closeModal} title="New Task">
        <TaskForm onSuccess={handleSuccess} /> 
      </Modal>

      <Modal isOpen={activeModal === 'budget'} onClose={closeModal} title="Log Expense">
        <BudgetForm onSuccess={handleSuccess} />
      </Modal>
      
      <Modal isOpen={activeModal === 'progress'} onClose={closeModal} title="Update Goal">
        <ProgressForm onSuccess={handleSuccess} />
      </Modal>

      <Modal isOpen={activeModal === 'note'} onClose={closeModal} title="Quick Note">
        <NoteForm onSuccess={handleSuccess} />
      </Modal>
    </main>
  );
}