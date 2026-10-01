// Define the specific categories to ensure consistency and zero-friction typing
export type TaskCategory = 'Lap Logic' | 'University' | 'Major Project' | 'Personal';
export type BudgetCategory = 'Food' | 'Travel' | 'Entertainment' | 'Outings';
export type ProgressCategory = 'Workout' | 'Media' | 'Project' | 'Personal';
export type TaskPriority = 'High' | 'Medium' | 'Low';
export type TaskStatus = 'To Do' | 'In Progress' | 'Blocked' | 'Done';
export type TransactionType = 'Credit' | 'Debit';
export type PaymentMethod = 'UPI' | 'Cash' | 'Card';

export interface Task {
  id: string; // Timestamp
  dateAdded: string;
  taskName: string;
  category: TaskCategory;
  priority: TaskPriority;
  status: TaskStatus;
  deadline: string;
  notes: string;
  recurringRefId?: string;
}

export interface Budget {
  date: string;
  day: string;
  amount: number;
  type: BudgetCategory;
  transaction: TransactionType;
  splitWith: string;
  settled: boolean;
  paymentMethod: PaymentMethod;
}

export interface Progress {
  date: string;
  category: ProgressCategory;
  activity: string;
  value: string | number; // e.g., "10000" (steps) or "Done"
  dailyReflection: string;
}

export interface Note {
  date: string;
  title: string;
  content: string;
}