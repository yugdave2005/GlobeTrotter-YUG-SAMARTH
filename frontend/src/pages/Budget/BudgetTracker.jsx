import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wallet, DollarSign, PieChart, Plus, AlertTriangle, 
  TrendingUp, ArrowUpRight, CheckCircle2, X, Calendar, 
  CreditCard, Tag, Sparkles
} from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const INITIAL_EXPENSES = [
  { id: 'exp-1', tripName: 'Classic Euro Tour 2026', category: 'TRANSPORT', amount: 55000, description: 'Flights from Mumbai/Delhi to Paris', date: '2026-06-15' },
  { id: 'exp-2', tripName: 'Classic Euro Tour 2026', category: 'STAY', amount: 68000, description: 'Boutique Hotel Le Marais (4 nights)', date: '2026-06-15' },
  { id: 'exp-3', tripName: 'Classic Euro Tour 2026', category: 'MEALS', amount: 15500, description: 'Dinner at Le Comptoir & Wine', date: '2026-06-16' },
  { id: 'exp-4', tripName: 'Classic Euro Tour 2026', category: 'MISC', amount: 6200, description: 'Metro Pass & Museum Entry', date: '2026-06-17' },
  { id: 'exp-5', tripName: 'Tokyo Neon & Cherry Blossoms', category: 'TRANSPORT', amount: 72000, description: 'Roundtrip Tokyo Flights', date: '2026-04-10' },
  { id: 'exp-6', tripName: 'Tokyo Neon & Cherry Blossoms', category: 'STAY', amount: 48000, description: 'Shinjuku Prince Hotel (5 nights)', date: '2026-04-11' },
];

export default function BudgetTracker() {
  const [expenses, setExpenses] = useState(INITIAL_EXPENSES);
  const [trips, setMyTrips] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form, setForm] = useState({
    tripId: '',
    category: 'MEALS',
    amount: '',
    description: ''
  });

  const totalBudget = 350000;
  const totalSpent = expenses.reduce((sum, item) => sum + Number(item.amount), 0);
  const remaining = totalBudget - totalSpent;
  const percentage = Math.min(100, Math.round((totalSpent / totalBudget) * 100));

  const categoryTotals = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + Number(exp.amount);
    return acc;
  }, {});

  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!form.amount || !form.description) {
      toast.error('Please fill in amount and description');
      return;
    }

    const newExpense = {
      id: `exp-${Date.now()}`,
      tripName: 'Classic Euro Tour 2026',
      category: form.category,
      amount: Number(form.amount),
      description: form.description,
      date: new Date().toISOString().split('T')[0]
    };

    setExpenses([newExpense, ...expenses]);
    setIsModalOpen(false);
    setForm({ tripId: '', category: 'MEALS', amount: '', description: '' });
    toast.success('Expense recorded successfully! 💸');
  };

  const getCategoryColor = (cat) => {
    switch (cat) {
      case 'TRANSPORT': return { bg: 'bg-sky-50 text-sky-700', bar: 'bg-sky-500' };
      case 'STAY': return { bg: 'bg-blue-50 text-blue-700', bar: 'bg-blue-600' };
      case 'MEALS': return { bg: 'bg-amber-50 text-amber-700', bar: 'bg-amber-500' };
      default: return { bg: 'bg-emerald-50 text-emerald-700', bar: 'bg-emerald-500' };
    }
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Travel Budget & Expenses</h1>
          <p className="text-sm text-slate-500 mt-1">Track categorized spending, daily averages, and avoid overbudget days</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-sky-600 hover:bg-sky-700 active:scale-95 text-white font-bold px-6 py-3.5 rounded-2xl text-sm shadow-md shadow-sky-600/20 transition flex items-center justify-center space-x-2 shrink-0 cursor-pointer"
        >
          <Plus size={18} />
          <span>Log New Expense</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Allocated Budget</p>
          <p className="text-3xl font-extrabold text-slate-900">₹{totalBudget.toLocaleString('en-IN')}</p>
          <p className="text-xs text-slate-500">Across 2 upcoming active trips</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Recorded Spend</p>
          <p className="text-3xl font-extrabold text-sky-600">₹{totalSpent.toLocaleString('en-IN')}</p>
          <p className="text-xs text-emerald-600 font-semibold">{percentage}% of budget utilized</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Remaining Balance</p>
          <p className="text-3xl font-extrabold text-emerald-600">₹{remaining.toLocaleString('en-IN')}</p>
          <p className="text-xs text-slate-500 font-medium">✨ Spending is on track</p>
        </div>
      </div>

      {/* Financial Health Progress Card */}
      <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-bold text-lg text-slate-900">Category Cost Distribution</h3>
            <p className="text-xs text-slate-500">Breakdown by Flights & Transport, Stays, Meals, and Activities</p>
          </div>
          <span className="text-sm font-bold text-slate-700">{percentage}% Spent</span>
        </div>

        {/* Multi-segment progress bar */}
        <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex">
          <div style={{ width: `${Math.round(((categoryTotals['TRANSPORT'] || 0) / totalBudget) * 100)}%` }} className="bg-sky-500" title="Transport" />
          <div style={{ width: `${Math.round(((categoryTotals['STAY'] || 0) / totalBudget) * 100)}%` }} className="bg-blue-600" title="Stays" />
          <div style={{ width: `${Math.round(((categoryTotals['MEALS'] || 0) / totalBudget) * 100)}%` }} className="bg-amber-500" title="Meals" />
          <div style={{ width: `${Math.round(((categoryTotals['MISC'] || 0) / totalBudget) * 100)}%` }} className="bg-emerald-500" title="Misc" />
        </div>

        {/* Category Pills Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
          {[
            { label: 'Transport', key: 'TRANSPORT', color: 'bg-sky-500' },
            { label: 'Accommodations', key: 'STAY', color: 'bg-blue-600' },
            { label: 'Food & Meals', key: 'MEALS', color: 'bg-amber-500' },
            { label: 'Misc & Activities', key: 'MISC', color: 'bg-emerald-500' },
          ].map((cat) => (
            <div key={cat.key} className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="flex items-center space-x-2">
                <span className={`w-3 h-3 rounded-full ${cat.color}`} />
                <span className="text-xs font-semibold text-slate-600">{cat.label}</span>
              </div>
              <p className="text-xl font-bold text-slate-900 mt-2">
                ₹{(categoryTotals[cat.key] || 0).toLocaleString('en-IN')}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Expense History Ledger */}
      <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
        <div className="p-6 px-8 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-lg text-slate-900">Recent Expense Ledger</h3>
          <span className="text-xs text-slate-400 font-semibold">{expenses.length} entries recorded</span>
        </div>

        <div className="divide-y divide-slate-50">
          {expenses.map((item) => (
            <div key={item.id} className="p-5 px-8 flex items-center justify-between hover:bg-slate-50/60 transition">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold ${getCategoryColor(item.category).bg}`}>
                    {item.category}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900">{item.description}</h4>
                </div>
                <p className="text-xs text-slate-400">
                  {item.tripName} • {new Date(item.date).toLocaleDateString()}
                </p>
              </div>

              <span className="text-base font-extrabold text-slate-900">
                ₹{item.amount.toLocaleString('en-IN')}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Log Expense Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 p-8 z-10"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X size={20} />
              </button>

              <h3 className="text-2xl font-bold text-slate-900 mb-1">Log Expense</h3>
              <p className="text-xs text-slate-500 mb-6">Record a purchase or travel cost</p>

              <form onSubmit={handleAddExpense} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Description *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="e.g. Flight to Rome / Train tickets"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900 text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Amount (₹) *
                    </label>
                    <input
                      type="number"
                      required
                      value={form.amount}
                      onChange={(e) => setForm({ ...form, amount: e.target.value })}
                      placeholder="12000"
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Category
                    </label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                    >
                      <option value="TRANSPORT">Transport</option>
                      <option value="STAY">Accommodation</option>
                      <option value="MEALS">Food & Meals</option>
                      <option value="MISC">Misc & Activities</option>
                    </select>
                  </div>
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl shadow-lg shadow-sky-600/20 transition cursor-pointer"
                  >
                    Save Expense
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
