import React, { useState, useEffect } from 'react';
import { Card, Button, Input, StatusChip } from '../components/UI';
import { Search, Plus, MapPin, Calendar, Tag, Image as ImageIcon, Loader2, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LostFoundPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [activeTab, setActiveTab] = useState('lost'); // 'lost' | 'found'
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    type: 'lost',
    item_name: '',
    description: '',
    location: '',
    image: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      // Mock GET /api/lost-found
      await new Promise(resolve => setTimeout(resolve, 500));
      setItems([
        {
          id: '1',
          type: 'lost',
          item_name: 'Blue Boat Earbuds in Charging Case',
          description: 'Left behind in CS Lab 2 near computer station #14.',
          location: 'Computer Science Block, Lab 2',
          student_name: 'Jane Doe',
          status: 'open',
          created_at: 'Aug 18, 2026',
          image_url: '/hero-bg.png'
        },
        {
          id: '2',
          type: 'found',
          item_name: 'Casio Scientific Calculator FX-991EX',
          description: 'Found on the bench in the main playground lawn.',
          location: 'Campus Playground',
          student_name: 'Alex Smith',
          status: 'open',
          created_at: 'Aug 17, 2026',
          image_url: null
        },
        {
          id: '3',
          type: 'lost',
          item_name: 'Black Leather Wallet with ID',
          description: 'Contains RFID college library card and Metro card.',
          location: 'Canteen Area',
          student_name: 'Rahul Kumar',
          status: 'claimed',
          created_at: 'Aug 10, 2026',
          image_url: null
        }
      ]);
      setLoading(false);
    };

    fetchItems();
  }, []);

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    if (!form.item_name || !form.location) return;

    setIsSubmitting(true);
    // Mock POST /api/lost-found
    await new Promise(resolve => setTimeout(resolve, 800));

    const newItem = {
      id: String(Date.now()),
      type: form.type,
      item_name: form.item_name,
      description: form.description,
      location: form.location,
      student_name: user?.full_name || 'Anonymous Student',
      status: 'open',
      created_at: 'Just now',
      image_url: form.image ? URL.createObjectURL(form.image) : null
    };

    setItems(prev => [newItem, ...prev]);
    setIsSubmitting(false);
    setShowModal(false);
  };

  const handleStatusUpdate = async (id, newStatus) => {
    // Mock PATCH /api/lost-found/:id
    setItems(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
  };

  const filteredItems = items.filter(item => item.type === activeTab);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-primary">Lost & Found Portal</h1>
          <p className="text-secondary mt-1">Report lost belongings or check items found around the TMSL campus.</p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus size={18} className="mr-2" />
          Report Item
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-outline-variant">
        <button
          onClick={() => setActiveTab('lost')}
          className={`py-3 px-6 font-semibold text-sm border-b-2 transition-colors ${
            activeTab === 'lost'
              ? 'border-primary text-primary'
              : 'border-transparent text-secondary hover:text-on-surface'
          }`}
        >
          Lost Items ({items.filter(i => i.type === 'lost').length})
        </button>
        <button
          onClick={() => setActiveTab('found')}
          className={`py-3 px-6 font-semibold text-sm border-b-2 transition-colors ${
            activeTab === 'found'
              ? 'border-primary text-primary'
              : 'border-transparent text-secondary hover:text-on-surface'
          }`}
        >
          Found Items ({items.filter(i => i.type === 'found').length})
        </button>
      </div>

      {/* Content Grid */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : filteredItems.length === 0 ? (
        <Card className="text-center py-16">
          <Tag size={48} className="mx-auto text-secondary mb-4 opacity-50" />
          <h2 className="text-xl font-bold text-on-surface mb-2">No {activeTab} items reported</h2>
          <p className="text-secondary">Be the first to report a {activeTab} item.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredItems.map((item) => (
            <Card key={item.id} className="p-6 flex flex-col justify-between border-outline-variant">
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider mb-2 ${
                      item.type === 'lost' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {item.type}
                    </span>
                    <h3 className="text-lg font-bold text-on-surface">{item.item_name}</h3>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    item.status === 'open' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-200 text-gray-700'
                  }`}>
                    {item.status}
                  </span>
                </div>

                <p className="text-sm text-secondary mb-4 leading-relaxed">{item.description}</p>

                {item.image_url && (
                  <div className="mb-4 rounded-lg overflow-hidden border border-outline-variant bg-surface-variant max-h-48 flex items-center justify-center">
                    <img src={item.image_url} alt={item.item_name} className="object-cover w-full h-48" />
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-outline-variant space-y-2 text-xs text-secondary">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1 font-medium text-on-surface">
                    <MapPin size={14} className="text-primary" /> {item.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={14} /> {item.created_at}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span>Reported by: <strong className="text-on-surface">{item.student_name}</strong></span>
                  {isAdmin && item.status === 'open' && (
                    <div className="space-x-1">
                      <button 
                        onClick={() => handleStatusUpdate(item.id, 'claimed')}
                        className="px-2 py-1 bg-green-600 text-white rounded text-xs font-semibold"
                      >
                        Mark Claimed
                      </button>
                      <button 
                        onClick={() => handleStatusUpdate(item.id, 'closed')}
                        className="px-2 py-1 bg-gray-600 text-white rounded text-xs font-semibold"
                      >
                        Close
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Report Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-background/50 backdrop-blur-sm">
          <div className="bg-surface border border-outline-variant rounded-2xl shadow-xl w-full max-w-md p-6 relative">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-secondary hover:text-primary">
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold text-primary mb-4">Report Lost / Found Item</h2>

            <form onSubmit={handleReportSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-on-surface">Report Type</label>
                <select 
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full border border-outline rounded px-3 py-2 text-sm bg-transparent"
                >
                  <option value="lost">Lost Item (I lost something)</option>
                  <option value="found">Found Item (I found something)</option>
                </select>
              </div>

              <Input
                id="item_name"
                label="Item Name"
                placeholder="E.g., Blue Boat Earbuds"
                value={form.item_name}
                onChange={(e) => setForm({ ...form, item_name: e.target.value })}
                required
              />

              <Input
                id="location"
                label="Location"
                placeholder="E.g., Computer Science Lab 2"
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
                  placeholder="Provide identifying features..."
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <Button variant="secondary" type="button" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit Report'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
