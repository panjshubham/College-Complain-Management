import React, { useState, useEffect } from 'react';
import { Card, Button, Input } from '../components/UI';
import { Plus, Loader2, LayoutGrid, List as ListIcon, Calendar, MapPin, UserCheck, Phone, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function MaintenanceTracker() {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' | 'list'
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    title: '',
    category: 'AC',
    location: '',
    description: '',
    priority: 'Normal'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 400));
      setRequests([
        {
          id: 'MNT-201',
          title: 'AC Filter Cleaning & Servicing',
          category: 'AC',
          location: 'CS Lab 3, 2nd Floor',
          description: 'AC blowing warm air, needs immediate filter cleaning and coolant check.',
          status: 'in_progress',
          priority: 'High',
          created_at: 'Aug 18, 2026',
          caretaker: { name: 'Robert Vance', phone: '+1 555-0198' }
        },
        {
          id: 'MNT-198',
          title: 'Desk Chair Wheel Replacement',
          category: 'Furniture',
          location: 'Central Library Desk #12',
          description: 'Wheel broken on study desk chair causing instability.',
          status: 'pending',
          priority: 'Normal',
          created_at: 'Aug 16, 2026',
          caretaker: null
        },
        {
          id: 'MNT-185',
          title: 'Restroom Sink Faucet Leak Repair',
          category: 'Plumbing',
          location: 'Block 2, Ground Floor Restroom',
          description: 'Continuous water leakage from tap handle.',
          status: 'completed',
          priority: 'Normal',
          created_at: 'Aug 10, 2026',
          caretaker: { name: 'David Wallace', phone: '+1 555-0412' }
        },
        {
          id: 'MNT-172',
          title: 'Flickering Overhead Tube Light',
          category: 'Electrical',
          location: 'Room 304, Academic Block',
          description: 'Main fluorescent light flickering rapidly.',
          status: 'pending',
          priority: 'Urgent',
          created_at: 'Aug 08, 2026',
          caretaker: null
        }
      ]);
      setLoading(false);
    };

    fetchRequests();
  }, []);

  const getCategoryTheme = (cat) => {
    switch (cat) {
      case 'AC':
      case 'AC/HVAC':
        return { emoji: '❄️', border: 'border-l-4 border-l-[#0891b2]' };
      case 'Furniture':
        return { emoji: '🪑', border: 'border-l-4 border-l-[#92400e]' };
      case 'Plumbing':
        return { emoji: '🔧', border: 'border-l-4 border-l-[#1d4ed8]' };
      case 'Electrical':
        return { emoji: '⚡', border: 'border-l-4 border-l-[#ca8a04]' };
      case 'Equipment':
        return { emoji: '🖥️', border: 'border-l-4 border-l-[#7c3aed]' };
      case 'Other':
      default:
        return { emoji: '📦', border: 'border-l-4 border-l-[#64748b]' };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.location) return;

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    const newReq = {
      id: `MNT-${Math.floor(100 + Math.random() * 900)}`,
      title: form.title,
      category: form.category,
      location: form.location,
      description: form.description,
      priority: form.priority,
      status: 'pending',
      created_at: 'Just now',
      caretaker: null
    };

    setRequests(prev => [newReq, ...prev]);
    setIsSubmitting(false);
    setShowModal(false);
    setForm({ title: '', category: 'AC', location: '', description: '', priority: 'Normal' });
  };

  const columns = [
    {
      id: 'pending',
      title: 'Pending',
      headerBg: 'bg-[#f59e0b] text-white',
      colBg: 'bg-[#fffbeb]',
      countBg: 'bg-amber-100 text-amber-900',
    },
    {
      id: 'in_progress',
      title: 'In Progress',
      headerBg: 'bg-[#2563eb] text-white',
      colBg: 'bg-[#eff6ff]',
      countBg: 'bg-blue-100 text-blue-900',
    },
    {
      id: 'completed',
      title: 'Completed',
      headerBg: 'bg-[#16a34a] text-white',
      colBg: 'bg-[#f0fdf4]',
      countBg: 'bg-green-100 text-green-900',
    }
  ];

  return (
    <div className="space-y-6 relative pb-20">
      {/* Top Header & View Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-primary">Maintenance Work Orders</h1>
          <p className="text-secondary mt-1">Track repair requests across campus in real-time.</p>
        </div>

        {/* View Toggle Buttons */}
        <div className="flex items-center gap-1 bg-surface-variant p-1 rounded-xl border border-outline-variant w-fit">
          <button
            onClick={() => setViewMode('kanban')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'kanban' ? 'bg-white text-primary shadow-sm' : 'text-secondary hover:text-on-surface'
            }`}
          >
            <LayoutGrid size={14} />
            Kanban
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'list' ? 'bg-white text-primary shadow-sm' : 'text-secondary hover:text-on-surface'
            }`}
          >
            <ListIcon size={14} />
            List
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : viewMode === 'kanban' ? (
        /* KANBAN BOARD VIEW */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {columns.map((col) => {
            const colRequests = requests.filter(r => r.status === col.id);

            return (
              <div key={col.id} className={`rounded-2xl overflow-hidden border border-outline-variant ${col.colBg} min-h-[500px] flex flex-col`}>
                {/* Column Header */}
                <div className={`p-4 ${col.headerBg} flex items-center justify-between font-bold shadow-sm`}>
                  <span>{col.title}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs ${col.countBg}`}>
                    {colRequests.length}
                  </span>
                </div>

                {/* Column Content */}
                <div className="p-4 space-y-4 flex-1">
                  {colRequests.length === 0 ? (
                    <div className="text-center py-12 text-secondary/60 text-xs font-medium border-2 border-dashed border-outline-variant/60 rounded-xl">
                      No requests
                    </div>
                  ) : (
                    colRequests.map((req) => {
                      const theme = getCategoryTheme(req.category);

                      return (
                        <div
                          key={req.id}
                          className={`bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all ${theme.border} space-y-3`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl">{theme.emoji}</span>
                              <div>
                                <span className="font-mono text-[10px] text-secondary">{req.id}</span>
                                <h3 className="font-bold text-sm text-on-surface leading-tight">{req.title}</h3>
                              </div>
                            </div>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              req.priority === 'Urgent' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-700'
                            }`}>
                              {req.priority}
                            </span>
                          </div>

                          <p className="text-xs text-secondary line-clamp-2 leading-relaxed">{req.description}</p>

                          <div className="space-y-1 text-[11px] text-secondary pt-2 border-t border-outline-variant">
                            <p className="flex items-center gap-1">
                              <MapPin size={12} className="text-primary shrink-0" />
                              <span className="truncate">{req.location}</span>
                            </p>
                            <p className="flex items-center gap-1">
                              <Calendar size={12} className="text-primary shrink-0" />
                              {req.created_at}
                            </p>
                          </div>

                          {/* Caretaker Info */}
                          <div className="pt-2 flex items-center justify-between text-xs">
                            {req.caretaker ? (
                              <div className="flex items-center gap-1.5 text-tertiary font-medium">
                                <UserCheck size={14} />
                                <span className="truncate font-semibold">{req.caretaker.name}</span>
                              </div>
                            ) : (
                              <span className="text-secondary/60 italic text-[11px]">Unassigned</span>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* STANDARD LIST VIEW */
        <Card className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant text-xs text-secondary uppercase font-semibold">
                  <th className="pb-3 px-2">Type</th>
                  <th className="pb-3 px-2">ID</th>
                  <th className="pb-3 px-2">Title & Location</th>
                  <th className="pb-3 px-2">Caretaker</th>
                  <th className="pb-3 px-2">Requested</th>
                  <th className="pb-3 px-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req) => {
                  const theme = getCategoryTheme(req.category);

                  return (
                    <tr key={req.id} className="border-b border-outline-variant last:border-0 hover:bg-surface-variant/40 transition-colors">
                      <td className="py-4 px-2 text-xl">{theme.emoji}</td>
                      <td className="py-4 px-2 font-mono text-xs text-secondary">{req.id}</td>
                      <td className="py-4 px-2">
                        <p className="font-bold text-sm text-on-surface">{req.title}</p>
                        <p className="text-xs text-secondary">{req.location}</p>
                      </td>
                      <td className="py-4 px-2 text-xs">
                        {req.caretaker ? (
                          <span className="font-semibold text-tertiary">{req.caretaker.name}</span>
                        ) : (
                          <span className="text-secondary/60 italic">Unassigned</span>
                        )}
                      </td>
                      <td className="py-4 px-2 text-xs text-secondary">{req.created_at}</td>
                      <td className="py-4 px-2 text-right">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                          req.status === 'completed' ? 'bg-green-100 text-green-800' :
                          req.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {req.status.replace('_', ' ')}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Floating Action Button (FAB) for New Request */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-6 right-6 z-40 bg-primary text-white p-4 rounded-full shadow-2xl hover:bg-primary-container hover:scale-110 transition-all flex items-center gap-2 group border border-white/20"
        title="Submit New Maintenance Request"
      >
        <Plus size={24} />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 font-bold text-sm whitespace-nowrap">
          New Request
        </span>
      </button>

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-background/60 backdrop-blur-sm">
          <div className="bg-surface border border-outline-variant rounded-2xl shadow-2xl w-full max-w-md p-6 relative">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-secondary hover:text-primary">
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold text-primary mb-4">New Maintenance Work Order</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                id="title"
                label="Request Title"
                placeholder="E.g., Broken fan in Room 102"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-on-surface">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full border border-outline rounded px-3 py-2 text-sm bg-transparent"
                  >
                    <option value="AC">❄️ AC / HVAC</option>
                    <option value="Furniture">🪑 Furniture</option>
                    <option value="Plumbing">🔧 Plumbing</option>
                    <option value="Electrical">⚡ Electrical</option>
                    <option value="Equipment">🖥️ Equipment</option>
                    <option value="Other">📦 Other</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-semibold text-on-surface">Priority</label>
                  <select
                    value={form.priority}
                    onChange={(e) => setForm({ ...form, priority: e.target.value })}
                    className="w-full border border-outline rounded px-3 py-2 text-sm bg-transparent"
                  >
                    <option value="Normal">Normal</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <Input
                id="location"
                label="Location"
                placeholder="E.g., CS Block, Room 102"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                required
              />

              <div className="space-y-1">
                <label className="text-sm font-semibold text-on-surface">Description</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full border border-outline rounded px-3 py-2 text-sm bg-transparent resize-none"
                  placeholder="Describe the issue..."
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <Button variant="secondary" type="button" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit Request'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
