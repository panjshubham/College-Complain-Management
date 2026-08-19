import React, { useState, useEffect } from 'react';
import { Card, Button, Input } from '../components/UI';
import { Bell, Plus, Trash2, Loader2, Calendar } from 'lucide-react';

export default function AdminNotices() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);

  const [priority, setPriority] = useState('Important');

  useEffect(() => {
    const fetchNotices = async () => {
      setLoading(true);
      // Mock GET /api/notices
      await new Promise(resolve => setTimeout(resolve, 500));
      setNotices([
        {
          id: '1',
          title: 'Mid-Semester Examination Schedule Announced',
          priority: 'Urgent',
          body: 'The mid-semester examinations for all 2nd and 3rd year B.Tech students will commence from September 10, 2026.',
          created_at: 'Aug 19, 2026',
        },
        {
          id: '2',
          title: 'Campus Library Timing Extension for Exam Season',
          priority: 'Important',
          body: 'In view of upcoming exams, the central library will remain open until 11:00 PM on weekdays.',
          created_at: 'Aug 17, 2026',
        }
      ]);
      setLoading(false);
    };

    fetchNotices();
  }, []);

  const handlePublish = async (e) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;

    setIsPublishing(true);
    // Mock POST /api/admin/notices
    await new Promise(resolve => setTimeout(resolve, 600));

    const newNotice = {
      id: String(Date.now()),
      title,
      priority,
      body,
      created_at: 'Just now'
    };

    setNotices(prev => [newNotice, ...prev]);
    setTitle('');
    setBody('');
    setIsPublishing(false);
    setShowForm(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this official notice?')) return;
    // Mock DELETE /api/admin/notices/:id
    setNotices(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-primary">Admin Notice Console</h1>
          <p className="text-secondary mt-1">Publish and manage campus circulars for all students.</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus size={18} className="mr-2" />
          {showForm ? 'Cancel' : 'Post New Notice'}
        </Button>
      </div>

      {showForm && (
        <Card className="p-6 bg-surface-container-low border-primary/30">
          <h2 className="text-lg font-bold text-primary mb-4">New Circular / Announcement</h2>
          <form onSubmit={handlePublish} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                id="title"
                label="Notice Title"
                placeholder="E.g., Mid-Semester Examination Seating Plan"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />

              <div className="space-y-1">
                <label className="text-sm font-semibold text-on-surface">Priority Level</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full border border-outline rounded px-3 py-2 text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-tertiary"
                >
                  <option value="Urgent">Urgent (Red Pin)</option>
                  <option value="Important">Important (Amber Pin)</option>
                  <option value="General">General (Blue Pin)</option>
                  <option value="Info">Info (Green Pin)</option>
                </select>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-on-surface">Notice Body</label>
              <textarea
                rows={4}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="w-full border border-outline rounded px-3 py-2 text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-tertiary resize-none"
                placeholder="Enter complete announcement details..."
                required
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button type="submit" disabled={isPublishing}>
                {isPublishing ? 'Publishing...' : 'Publish Notice'}
              </Button>
            </div>
          </form>
        </Card>
      )}

      <Card className="p-6">
        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-4">
            {notices.map((notice) => (
              <div key={notice.id} className="p-4 border border-outline-variant rounded-xl flex items-start justify-between gap-4 hover:bg-surface-variant/30 transition-colors">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2 text-xs font-semibold text-secondary">
                    <Calendar size={14} className="text-primary" />
                    {notice.created_at}
                  </div>
                  <h3 className="font-bold text-on-surface">{notice.title}</h3>
                  <p className="text-sm text-secondary line-clamp-2">{notice.body}</p>
                </div>
                <button 
                  onClick={() => handleDelete(notice.id)}
                  className="p-2 text-secondary hover:text-error transition-colors shrink-0"
                  title="Delete Notice"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
