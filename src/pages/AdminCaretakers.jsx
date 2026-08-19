import React, { useState, useEffect } from 'react';
import { Card, Button, Input } from '../components/UI';
import { UserCheck, Phone, Plus, Edit2, Trash2, Loader2, X, CheckCircle } from 'lucide-react';

export default function AdminCaretakers() {
  const [caretakers, setCaretakers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: '',
    phone: '',
    department: 'Maintenance & Electrical',
    category: 'Electrical'
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchCaretakers = async () => {
      setLoading(true);
      // Mock GET /api/admin/caretakers
      await new Promise(resolve => setTimeout(resolve, 500));
      setCaretakers([
        { id: '1', name: 'Robert Vance', phone: '+1 555-0198', department: 'Maintenance & Electrical', category: 'Electrical' },
        { id: '2', name: 'Sarah Connor', phone: '+1 555-0245', department: 'IT Infrastructure', category: 'Wi-Fi' },
        { id: '3', name: 'Michael Scott', phone: '+1 555-0371', department: 'Facilities & Sanitation', category: 'Cleaning' },
        { id: '4', name: 'David Wallace', phone: '+1 555-0412', department: 'Plumbing & Water', category: 'Water' }
      ]);
      setLoading(false);
    };

    fetchCaretakers();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setForm({ name: '', phone: '', department: 'Maintenance & Electrical', category: 'Electrical' });
    setShowModal(true);
  };

  const openEditModal = (ct) => {
    setEditingId(ct.id);
    setForm({ name: ct.name, phone: ct.phone, department: ct.department, category: ct.category });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this caretaker?')) return;
    // Mock DELETE /api/admin/caretakers/:id
    setCaretakers(prev => prev.filter(c => c.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone) return;

    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 600));

    if (editingId) {
      // Mock PATCH /api/admin/caretakers/:id
      setCaretakers(prev => prev.map(c => c.id === editingId ? { ...c, ...form } : c));
    } else {
      // Mock POST /api/admin/caretakers
      const newCt = { id: String(Date.now()), ...form };
      setCaretakers(prev => [...prev, newCt]);
    }

    setIsSaving(false);
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-primary">Caretakers Management</h1>
          <p className="text-secondary mt-1">Assign and manage department caretakers for resolution workflows.</p>
        </div>
        <Button onClick={openAddModal}>
          <Plus size={18} className="mr-2" />
          Add Caretaker
        </Button>
      </div>

      <Card className="p-6">
        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant text-sm text-secondary">
                  <th className="pb-3 font-semibold px-2">Name</th>
                  <th className="pb-3 font-semibold px-2">Phone</th>
                  <th className="pb-3 font-semibold px-2">Department</th>
                  <th className="pb-3 font-semibold px-2">Assigned Category</th>
                  <th className="pb-3 font-semibold px-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {caretakers.map((ct) => (
                  <tr key={ct.id} className="border-b border-outline-variant last:border-0 hover:bg-surface-variant/50 transition-colors">
                    <td className="py-4 px-2 font-medium text-on-surface flex items-center gap-2">
                      <UserCheck size={18} className="text-tertiary" />
                      {ct.name}
                    </td>
                    <td className="py-4 px-2 text-secondary font-mono text-sm">
                      <a href={`tel:${ct.phone}`} className="hover:underline flex items-center gap-1">
                        <Phone size={14} />
                        {ct.phone}
                      </a>
                    </td>
                    <td className="py-4 px-2 text-secondary">{ct.department}</td>
                    <td className="py-4 px-2 text-secondary">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-container text-primary">
                        {ct.category}
                      </span>
                    </td>
                    <td className="py-4 px-2 text-right space-x-2">
                      <button onClick={() => openEditModal(ct)} className="p-1.5 text-secondary hover:text-primary transition-colors">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(ct.id)} className="p-1.5 text-secondary hover:text-error transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-background/50 backdrop-blur-sm">
          <div className="bg-surface border border-outline-variant rounded-2xl shadow-xl w-full max-w-md p-6 relative">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-secondary hover:text-primary">
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold text-primary mb-4">
              {editingId ? 'Edit Caretaker' : 'Add New Caretaker'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                id="name"
                label="Full Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
              <Input
                id="phone"
                label="Phone Number"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+1 555-0000"
                required
              />
              <div className="space-y-1">
                <label className="text-sm font-semibold text-on-surface">Department</label>
                <input
                  type="text"
                  value={form.department}
                  onChange={(e) => setForm({ ...form, department: e.target.value })}
                  className="w-full border border-outline rounded px-3 py-2 text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-tertiary"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-on-surface">Primary Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full border border-outline rounded px-3 py-2 text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-tertiary"
                >
                  <option value="Electrical">Electrical</option>
                  <option value="Wi-Fi">Wi-Fi</option>
                  <option value="Cleaning">Cleaning</option>
                  <option value="Water">Water</option>
                  <option value="Classroom">Classroom</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <Button variant="secondary" type="button" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? 'Saving...' : editingId ? 'Update Caretaker' : 'Add Caretaker'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
