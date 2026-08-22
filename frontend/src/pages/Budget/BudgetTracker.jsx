import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wallet, DollarSign, PieChart, Plus, AlertTriangle, 
  TrendingUp, ArrowUpRight, CheckCircle2, X, Calendar, 
  CreditCard, Tag, Sparkles, MapPin, Trash2, Edit2, ChevronRight
} from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import ConfirmDeleteModal from '../../components/ConfirmDeleteModal';

export default function BudgetTracker() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTripId, setSelectedTripId] = useState('all');
  const [expenses, setExpenses] = useState([
    { id: 'exp-1', tripId: 'trip-kerala', tripName: 'Kerala Backwaters & Hills Tour 🌴', category: 'STAY', amount: 32000, description: 'Spice Plantation Boutique Resort (3 nights)', date: '2026-08-23' },
    { id: 'exp-2', tripId: 'trip-kerala', tripName: 'Kerala Backwaters & Hills Tour 🌴', category: 'TRANSPORT', amount: 18000, description: 'Private AC Innova Cab for Kerala Circuit', date: '2026-08-22' },
    { id: 'exp-3', tripId: 'trip-kerala', tripName: 'Kerala Backwaters & Hills Tour 🌴', category: 'MEALS', amount: 8500, description: 'Traditional Malabar Dining & Sea Food', date: '2026-08-24' },
    { id: 'exp-4', tripId: 'trip-rajasthan', tripName: 'Royal Rajasthan Heritage 🇮🇳', category: 'STAY', amount: 22000, description: 'Heritage Haveli Stay in Jaipur', date: '2026-09-10' },
    { id: 'exp-5', tripId: 'trip-rajasthan', tripName: 'Royal Rajasthan Heritage 🇮🇳', category: 'TRANSPORT', amount: 9500, description: 'Jaipur to Udaipur Luxury Sleeper', date: '2026-09-12' },
    { id: 'exp-6', tripId: 'trip-goa', tripName: 'Goa Coastal Watersports & Sunsets 🏖️', category: 'STAY', amount: 18000, description: 'Beachfront Cottage in Calangute', date: '2026-10-02' },
    { id: 'exp-7', tripId: 'trip-goa', tripName: 'Goa Coastal Watersports & Sunsets 🏖️', category: 'MEALS', amount: 6500, description: 'Shack Dinners & Sunset Cocktails', date: '2026-10-03' }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditBudgetOpen, setIsEditBudgetOpen] = useState(false);
  const [editBudgetValue, setEditBudgetValue] = useState(50000);

  // Delete Confirmation Modal State
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    itemId: null,
    itemType: 'expense',
    title: 'Delete Expense',
    description: 'Are you sure you want to remove this expense record from the budget?'
  });

  const [form, setForm] = useState({
    tripId: '',
    category: 'MEALS',
    amount: '',
    description: ''
  });

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      const { data } = await api.get('/core/trips');
      if (data && data.length > 0) {
        setTrips(data);
        setForm(prev => ({ ...prev, tripId: data[0].id }));
      } else {
        // Sample fallback trips
        const mockTrips = [
          {
            id: 'trip-kerala',
            name: 'Kerala Backwaters & Hills Tour 🌴',
            budget: 160000,
            startDate: '2026-08-22',
            endDate: '2026-08-27',
            coverPhotoUrl: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&q=80&w=800',
            stops: [
              {
                city: { name: 'Kerala' },
                activities: [
                  { id: 'act-1', activity: { name: 'Alleppey Backwaters Houseboat Day Cruise', category: 'RELAXATION', cost: 4500 }, customCost: 4500 },
                  { id: 'act-2', activity: { name: 'Munnar Tea Plantations Trek', category: 'ADVENTURE', cost: 1000 }, customCost: 1000 }
                ]
              }
            ]
          },
          {
            id: 'trip-rajasthan',
            name: 'Royal Rajasthan Heritage 🇮🇳',
            budget: 45000,
            startDate: '2026-09-10',
            endDate: '2026-09-16',
            coverPhotoUrl: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&q=80&w=800',
            stops: [
              {
                city: { name: 'Jaipur' },
                activities: [
                  { id: 'act-3', activity: { name: 'Amber Fort & Sheesh Mahal Tour', category: 'SIGHTSEEING', cost: 1200 }, customCost: 1200 }
                ]
              }
            ]
          },
          {
            id: 'trip-goa',
            name: 'Goa Coastal Watersports & Sunsets 🏖️',
            budget: 35000,
            startDate: '2026-10-01',
            endDate: '2026-10-05',
            coverPhotoUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=80&w=800',
            stops: [
              {
                city: { name: 'Goa' },
                activities: [
                  { id: 'act-4', activity: { name: 'Grand Island Scuba Diving', category: 'ADVENTURE', cost: 3500 }, customCost: 3500 }
                ]
              }
            ]
          }
        ];
        setTrips(mockTrips);
        setForm(prev => ({ ...prev, tripId: mockTrips[0].id }));
      }
    } catch (err) {
      console.log('Using sample fallback trips');
    } finally {
      setLoading(false);
    }
  };

  // Active Selected Trip
  const currentTrip = useMemo(() => {
    if (selectedTripId === 'all') return null;
    return trips.find(t => t.id === selectedTripId) || trips[0];
  }, [trips, selectedTripId]);

  // Aggregate trip-specific calculations
  const tripBudgetCalculations = useMemo(() => {
    return trips.map(t => {
      // Activities cost from stops
      const activityCost = t.stops?.reduce((sum, stop) => {
        const stopSum = stop.activities?.reduce((aSum, a) => aSum + (Number(a.customCost || a.activity?.cost || 0)), 0) || 0;
        return sum + stopSum;
      }, 0) || 0;

      // Expenses recorded for this trip
      const recordedExpenses = expenses.filter(e => e.tripId === t.id || e.tripName === t.name);
      const recordedCost = recordedExpenses.reduce((sum, e) => sum + Number(e.amount), 0);

      const totalSpent = activityCost + recordedCost;
      const budget = Number(t.budget || 50000);
      const remaining = budget - totalSpent;
      const percentUsed = Math.min(100, Math.round((totalSpent / (budget || 1)) * 100));

      return {
        ...t,
        activityCost,
        recordedCost,
        totalSpent,
        remaining,
        percentUsed,
        isOverBudget: remaining < 0,
        recordedExpenses
      };
    });
  }, [trips, expenses]);

  // Calculations for current view (Selected Trip vs All Trips)
  const activeStats = useMemo(() => {
    if (selectedTripId === 'all') {
      const totalAllocated = tripBudgetCalculations.reduce((sum, t) => sum + Number(t.budget || 50000), 0);
      const totalSpent = tripBudgetCalculations.reduce((sum, t) => sum + t.totalSpent, 0);
      const remaining = totalAllocated - totalSpent;
      const percentUsed = Math.min(100, Math.round((totalSpent / (totalAllocated || 1)) * 100));
      return {
        title: 'All Trips Combined Budget',
        totalBudget: totalAllocated,
        totalSpent,
        remaining,
        percentUsed,
        isOverBudget: remaining < 0
      };
    } else {
      const active = tripBudgetCalculations.find(t => t.id === selectedTripId) || tripBudgetCalculations[0];
      return {
        title: active?.name || 'Selected Trip',
        totalBudget: Number(active?.budget || 50000),
        totalSpent: active?.totalSpent || 0,
        remaining: active?.remaining || 0,
        percentUsed: active?.percentUsed || 0,
        isOverBudget: active?.isOverBudget || false,
        activityCost: active?.activityCost || 0,
        recordedCost: active?.recordedCost || 0,
        tripObj: active
      };
    }
  }, [selectedTripId, tripBudgetCalculations]);

  // Expenses to display in ledger
  const displayedExpenses = useMemo(() => {
    if (selectedTripId === 'all') return expenses;
    const active = trips.find(t => t.id === selectedTripId);
    return expenses.filter(e => e.tripId === selectedTripId || (active && e.tripName === active.name));
  }, [expenses, selectedTripId, trips]);

  // Categories breakdown
  const categoryTotals = useMemo(() => {
    const totals = { TRANSPORT: 0, STAY: 0, MEALS: 0, ACTIVITIES: 0, MISC: 0 };
    
    // Add activities from trip stops if specific trip or all
    if (selectedTripId === 'all') {
      tripBudgetCalculations.forEach(t => {
        totals.ACTIVITIES += t.activityCost;
      });
    } else {
      const active = tripBudgetCalculations.find(t => t.id === selectedTripId);
      if (active) totals.ACTIVITIES += active.activityCost;
    }

    displayedExpenses.forEach(exp => {
      const cat = exp.category || 'MISC';
      totals[cat] = (totals[cat] || 0) + Number(exp.amount);
    });

    return totals;
  }, [displayedExpenses, selectedTripId, tripBudgetCalculations]);

  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!form.amount || !form.description) {
      toast.error('Please enter amount and description');
      return;
    }

    const assignedTrip = trips.find(t => t.id === form.tripId) || currentTrip || trips[0];

    const newExpense = {
      id: `exp-${Date.now()}`,
      tripId: assignedTrip?.id || 'general',
      tripName: assignedTrip?.name || 'Trip Expense',
      category: form.category,
      amount: Number(form.amount),
      description: form.description,
      date: new Date().toISOString().split('T')[0]
    };

    setExpenses([newExpense, ...expenses]);
    setIsModalOpen(false);
    setForm({ tripId: assignedTrip?.id || '', category: 'MEALS', amount: '', description: '' });
    toast.success(`Expense added to ${assignedTrip?.name || 'trip'}! 💸`);
  };

  // Open Delete Pop-up Modal
  const requestDeleteExpense = (expId) => {
    setDeleteModal({
      isOpen: true,
      itemId: expId,
      itemType: 'expense',
      title: 'Delete Expense Log',
      description: 'Are you sure you want to remove this expense record from the budget tracker?'
    });
  };

  const handleConfirmDelete = () => {
    if (deleteModal.itemId) {
      setExpenses(prev => prev.filter(e => e.id !== deleteModal.itemId));
      toast.success('Expense removed from budget');
    }
  };

  const handleSaveTripBudget = async (e) => {
    e.preventDefault();
    if (!currentTrip) return;
    const newBudgetNum = Number(editBudgetValue);

    try {
      await api.put(`/core/trips/${currentTrip.id}`, { budget: newBudgetNum });
    } catch (e) {
      console.log('Saved locally');
    }

    setTrips(prev => prev.map(t => t.id === currentTrip.id ? { ...t, budget: newBudgetNum } : t));
    setIsEditBudgetOpen(false);
    toast.success(`Budget for "${currentTrip.name}" updated to ₹${newBudgetNum.toLocaleString('en-IN')}! 💸`);
  };

  const getCategoryBadge = (cat) => {
    switch (cat) {
      case 'TRANSPORT': return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'STAY': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'MEALS': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'ACTIVITIES': return 'bg-purple-50 text-purple-700 border-purple-200';
      default: return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Trip Budget Tracker</h1>
          <p className="text-sm text-slate-500 mt-1">Manage and track spending per trip with live activity deduction in Indian Rupees (₹)</p>
        </div>

        <button
          onClick={() => {
            if (currentTrip) {
              setForm(prev => ({ ...prev, tripId: currentTrip.id }));
            }
            setIsModalOpen(true);
          }}
          className="bg-sky-600 hover:bg-sky-700 active:scale-95 text-white font-bold px-6 py-3.5 rounded-2xl text-xs shadow-lg shadow-sky-600/25 transition flex items-center space-x-2 shrink-0 cursor-pointer"
        >
          <Plus size={16} />
          <span>Log Trip Expense</span>
        </button>
      </div>

      {/* 🧭 Trip-Wise Selector Pills */}
      <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Select Trip to View Budget:
          </span>
          <span className="text-xs text-slate-500 font-medium">
            {trips.length} active {trips.length === 1 ? 'itinerary' : 'itineraries'}
          </span>
        </div>

        <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
          <button
            onClick={() => setSelectedTripId('all')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center space-x-2 shrink-0 cursor-pointer ${
              selectedTripId === 'all'
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-100'
            }`}
          >
            <span>🌐 All Trips Combined</span>
          </button>

          {tripBudgetCalculations.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedTripId(t.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center space-x-2 shrink-0 cursor-pointer border ${
                selectedTripId === t.id
                  ? 'bg-sky-600 text-white border-sky-600 shadow-md shadow-sky-600/20'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200/80'
              }`}
            >
              <MapPin size={13} className={selectedTripId === t.id ? 'text-white' : 'text-sky-500'} />
              <span className="truncate max-w-[150px]">{t.name}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-md font-extrabold ${
                selectedTripId === t.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
              }`}>
                ₹{Number(t.budget || 50000).toLocaleString('en-IN')}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 📊 Main Metrics Row for Active Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Allocated Budget Card */}
        <div className="bg-white p-7 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Allocated Budget</span>
            {selectedTripId !== 'all' && currentTrip && (
              <button
                onClick={() => {
                  setEditBudgetValue(currentTrip.budget || 50000);
                  setIsEditBudgetOpen(true);
                }}
                className="text-xs text-sky-600 hover:text-sky-700 font-bold flex items-center space-x-1 cursor-pointer bg-sky-50 px-2 py-1 rounded-lg"
              >
                <Edit2 size={11} />
                <span>Edit</span>
              </button>
            )}
          </div>
          <div>
            <p className="text-3xl font-extrabold text-slate-900">
              ₹{activeStats.totalBudget.toLocaleString('en-IN')}
            </p>
            <p className="text-xs text-slate-500 mt-1 truncate">
              {selectedTripId === 'all' ? 'Combined total across all itineraries' : activeStats.title}
            </p>
          </div>
        </div>

        {/* Total Spent Card */}
        <div className="bg-white p-7 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Utilized</span>
            <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full ${
              activeStats.isOverBudget ? 'bg-rose-50 text-rose-700' : 'bg-sky-50 text-sky-700'
            }`}>
              {activeStats.percentUsed}%
            </span>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-sky-600">
              ₹{activeStats.totalSpent.toLocaleString('en-IN')}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {selectedTripId !== 'all' 
                ? `Includes ₹${(activeStats.activityCost || 0).toLocaleString('en-IN')} on activities`
                : 'Aggregated activities & stays'}
            </p>
          </div>
        </div>

        {/* Remaining Balance Card */}
        <div className={`p-7 rounded-3xl border shadow-sm flex flex-col justify-between space-y-4 ${
          activeStats.isOverBudget ? 'bg-rose-50/50 border-rose-200' : 'bg-emerald-50/50 border-emerald-200'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider opacity-70">
              {activeStats.isOverBudget ? 'Budget Exceeded' : 'Remaining Balance'}
            </span>
            <span className="text-lg">
              {activeStats.isOverBudget ? '⚠️' : '✨'}
            </span>
          </div>
          <div>
            <p className={`text-3xl font-extrabold ${activeStats.isOverBudget ? 'text-rose-700' : 'text-emerald-700'}`}>
              {activeStats.isOverBudget 
                ? `-₹${Math.abs(activeStats.remaining).toLocaleString('en-IN')}` 
                : `₹${activeStats.remaining.toLocaleString('en-IN')}`}
            </p>
            <p className="text-xs opacity-80 mt-1">
              {activeStats.isOverBudget ? 'Please adjust expenses or increase budget' : 'Comfortable balance remaining'}
            </p>
          </div>
        </div>
      </div>

      {/* Progress & Category Distribution Card */}
      <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-bold text-lg text-slate-900">
              {selectedTripId === 'all' ? 'All Trips Spending Breakdown' : `${activeStats.title} - Cost Breakdown`}
            </h3>
            <p className="text-xs text-slate-500">Distribution across Activities, Accommodations, Transport, and Food</p>
          </div>
          <span className="text-xs font-bold bg-slate-100 text-slate-800 px-3 py-1 rounded-xl">
            {activeStats.percentUsed}% of allocated budget
          </span>
        </div>

        {/* Multi-segment Visual Progress Bar */}
        <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex">
          <div style={{ width: `${Math.round(((categoryTotals['ACTIVITIES'] || 0) / (activeStats.totalBudget || 1)) * 100)}%` }} className="bg-purple-500 transition-all duration-500" title="Activities" />
          <div style={{ width: `${Math.round(((categoryTotals['STAY'] || 0) / (activeStats.totalBudget || 1)) * 100)}%` }} className="bg-blue-600 transition-all duration-500" title="Stays" />
          <div style={{ width: `${Math.round(((categoryTotals['TRANSPORT'] || 0) / (activeStats.totalBudget || 1)) * 100)}%` }} className="bg-sky-500 transition-all duration-500" title="Transport" />
          <div style={{ width: `${Math.round(((categoryTotals['MEALS'] || 0) / (activeStats.totalBudget || 1)) * 100)}%` }} className="bg-amber-500 transition-all duration-500" title="Meals" />
          <div style={{ width: `${Math.round(((categoryTotals['MISC'] || 0) / (activeStats.totalBudget || 1)) * 100)}%` }} className="bg-emerald-500 transition-all duration-500" title="Misc" />
        </div>

        {/* Category Summary Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
          {[
            { label: 'Activities', key: 'ACTIVITIES', color: 'bg-purple-500' },
            { label: 'Accommodations', key: 'STAY', color: 'bg-blue-600' },
            { label: 'Transport', key: 'TRANSPORT', color: 'bg-sky-500' },
            { label: 'Food & Dining', key: 'MEALS', color: 'bg-amber-500' },
            { label: 'Miscellaneous', key: 'MISC', color: 'bg-emerald-500' }
          ].map((cat) => (
            <div key={cat.key} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
              <div className="flex items-center space-x-1.5">
                <span className={`w-2.5 h-2.5 rounded-full ${cat.color}`} />
                <span className="text-[11px] font-bold text-slate-600">{cat.label}</span>
              </div>
              <p className="text-lg font-extrabold text-slate-900">
                ₹{(categoryTotals[cat.key] || 0).toLocaleString('en-IN')}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 📝 Itemized Expenses Table with Pop-up Deletion */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 px-8 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-lg text-slate-900">
              {selectedTripId === 'all' ? 'Recorded Expenses Ledger' : `Expenses for ${activeStats.title}`}
            </h3>
            <p className="text-xs text-slate-500">Itemized transactions and expense records</p>
          </div>

          <button
            onClick={() => {
              if (currentTrip) {
                setForm(prev => ({ ...prev, tripId: currentTrip.id }));
              }
              setIsModalOpen(true);
            }}
            className="text-xs font-bold text-sky-600 hover:text-sky-700 bg-sky-50 hover:bg-sky-100 px-4 py-2 rounded-xl transition flex items-center space-x-1 cursor-pointer self-start sm:self-auto"
          >
            <Plus size={14} />
            <span>+ Add Entry</span>
          </button>
        </div>

        <div className="divide-y divide-slate-100 overflow-x-auto">
          {displayedExpenses.length === 0 ? (
            <div className="p-12 text-center text-slate-400 space-y-2">
              <Wallet size={32} className="mx-auto text-slate-300" />
              <p className="text-sm font-semibold">No expense logs found for this trip.</p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="text-xs text-sky-600 font-bold hover:underline cursor-pointer"
              >
                + Log your first expense
              </button>
            </div>
          ) : (
            displayedExpenses.map((exp) => (
              <div key={exp.id} className="p-5 px-8 flex items-center justify-between gap-4 hover:bg-slate-50/50 transition">
                <div className="flex items-center space-x-4 min-w-0">
                  <span className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border shrink-0 ${getCategoryBadge(exp.category)}`}>
                    {exp.category}
                  </span>
                  <div className="min-w-0">
                    <h4 className="font-bold text-sm text-slate-900 truncate">{exp.description}</h4>
                    <p className="text-xs text-slate-400 flex items-center space-x-2 mt-0.5">
                      <span>{exp.tripName}</span>
                      <span>•</span>
                      <span>{exp.date}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 shrink-0">
                  <span className="font-extrabold text-sm text-slate-900">
                    ₹{Number(exp.amount).toLocaleString('en-IN')}
                  </span>
                  <button
                    onClick={() => requestDeleteExpense(exp.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                    title="Delete expense entry"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 🗺️ All Planned Trips Comparison Grid */}
      <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-lg text-slate-900">All Itineraries Budget Comparison</h3>
            <p className="text-xs text-slate-500">Overview of planned finances across your entire travel account</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tripBudgetCalculations.map((t) => (
            <div
              key={t.id}
              onClick={() => setSelectedTripId(t.id)}
              className={`p-5 rounded-3xl border transition cursor-pointer space-y-4 hover:shadow-md ${
                selectedTripId === t.id ? 'bg-sky-50/40 border-sky-300 ring-2 ring-sky-500/20' : 'bg-slate-50 border-slate-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-slate-900 truncate">{t.name}</h4>
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                  t.isOverBudget ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                }`}>
                  {t.percentUsed}%
                </span>
              </div>

              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Budget:</span>
                  <span className="font-bold text-slate-800">₹{Number(t.budget || 50000).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Spent:</span>
                  <span className="font-bold text-sky-600">₹{t.totalSpent.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-200/60 font-semibold">
                  <span className={t.isOverBudget ? 'text-rose-600' : 'text-emerald-700'}>
                    {t.isOverBudget ? 'Over Budget:' : 'Remaining:'}
                  </span>
                  <span className={t.isOverBudget ? 'text-rose-600' : 'text-emerald-700'}>
                    ₹{Math.abs(t.remaining).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Mini progress bar */}
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  style={{ width: `${t.percentUsed}%` }}
                  className={`h-full rounded-full ${
                    t.isOverBudget ? 'bg-rose-500' : t.percentUsed > 80 ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                />
              </div>
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
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 p-8 z-10"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X size={20} />
              </button>

              <div className="flex items-center space-x-3 mb-5">
                <div className="p-3 bg-sky-50 text-sky-600 rounded-2xl">
                  <CreditCard size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Record Trip Expense</h3>
                  <p className="text-xs text-slate-500">Track stays, transport, meals, and tickets</p>
                </div>
              </div>

              <form onSubmit={handleAddExpense} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Assign to Trip *
                  </label>
                  <select
                    value={form.tripId}
                    onChange={(e) => setForm({ ...form, tripId: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900 text-sm font-medium"
                    required
                  >
                    {trips.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} (Budget: ₹{Number(t.budget || 50000).toLocaleString('en-IN')})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Category
                    </label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                    >
                      <option value="STAY">Accommodations</option>
                      <option value="TRANSPORT">Flights & Transport</option>
                      <option value="MEALS">Food & Dining</option>
                      <option value="ACTIVITIES">Sightseeing & Tours</option>
                      <option value="MISC">Miscellaneous</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Amount (₹) *
                    </label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 4500"
                      value={form.amount}
                      onChange={(e) => setForm({ ...form, amount: e.target.value })}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Description *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Houseboat stay deposit or flight tickets"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  />
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl shadow-lg shadow-sky-600/20 transition cursor-pointer"
                  >
                    Save Expense Record
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Budget Modal */}
      <AnimatePresence>
        {isEditBudgetOpen && currentTrip && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditBudgetOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 p-8 z-10"
            >
              <button 
                onClick={() => setIsEditBudgetOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X size={20} />
              </button>

              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-4">
                <Wallet size={24} />
              </div>

              <h3 className="text-xl font-bold text-slate-900">Edit Budget for {currentTrip.name}</h3>
              <p className="text-xs text-slate-500 mb-5">Update allocated spending limit in INR (₹)</p>

              <form onSubmit={handleSaveTripBudget} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Allocated Budget (₹)
                  </label>
                  <input
                    type="number"
                    required
                    value={editBudgetValue}
                    onChange={(e) => setEditBudgetValue(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900 text-lg font-extrabold"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  {[35000, 50000, 75000, 120000, 160000].map((amt) => (
                    <button
                      type="button"
                      key={amt}
                      onClick={() => setEditBudgetValue(amt)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-xl transition cursor-pointer ${
                        Number(editBudgetValue) === amt ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      ₹{(amt / 1000).toFixed(0)}k
                    </button>
                  ))}
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl shadow-lg shadow-sky-600/20 transition cursor-pointer"
                  >
                    Save Trip Budget
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 🔴 Custom Animated Delete Confirmation Modal (Replaces browser alert/confirm) */}
      <ConfirmDeleteModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal(prev => ({ ...prev, isOpen: false }))}
        onConfirm={handleConfirmDelete}
        title={deleteModal.title}
        description={deleteModal.description}
      />

    </div>
  );
}
