import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, Save, MessageSquare, Image as ImageIcon, UserCheck } from 'lucide-react';
import { Card, Button, StatusChip } from '../components/UI';

export default function AdminComplaintDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [caretakersList, setCaretakersList] = useState([]);
  
  // PATCH Form states
  const [status, setStatus] = useState('');
  const [department, setDepartment] = useState('');
  const [priority, setPriority] = useState('');
  const [selectedCaretaker, setSelectedCaretaker] = useState('');
  
  // Response state
  const [response, setResponse] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveNotice, setSaveNotice] = useState('');

  useEffect(() => {
    const fetchComplaintAndCaretakers = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockCaretakers = [
        { id: '1', name: 'Robert Vance', category: 'Electrical', phone: '+1 555-0198' },
        { id: '2', name: 'Sarah Connor', category: 'Wi-Fi', phone: '+1 555-0245' },
        { id: '3', name: 'Michael Scott', category: 'Cleaning', phone: '+1 555-0371' },
        { id: '4', name: 'David Wallace', category: 'Water', phone: '+1 555-0412' }
      ];
      setCaretakersList(mockCaretakers);

      const mockData = {
        id: id || 'CMP-1042',
        title: 'Broken AC in Room 302',
        description: 'The air conditioning unit in classroom 302 has been leaking water and not cooling since yesterday morning.',
        category: 'Electrical',
        location: 'CS Block, 3rd Floor, Room 302',
        evidenceUrl: '/hero-bg.png',
        createdAt: '2026-08-18 10:00 AM',
        status: 'In Progress',
        department: 'CS Block',
        priority: 'High',
        caretaker_id: '1',
        student: {
          name: 'Jane Doe',
          id: 'STU-2023-0102',
          email: 'jane.doe@student.college.edu',
          phone: '+1 234 567 8900'
        },
        history: [
          { status: 'Submitted', date: 'Aug 18, 10:00 AM', user: 'Jane Doe' },
          { status: 'Under Review', date: 'Aug 18, 11:30 AM', user: 'System' },
          { status: 'Assigned', date: 'Aug 19, 09:00 AM', user: 'Admin User' },
          { status: 'In Progress', date: 'Aug 19, 10:15 AM', user: 'Robert Vance' }
        ]
      };
      
      setComplaint(mockData);
      setStatus(mockData.status);
      setDepartment(mockData.department);
      setPriority(mockData.priority);
      setSelectedCaretaker(mockData.caretaker_id || '');
      
      setLoading(false);
    };

    fetchComplaintAndCaretakers();
  }, [id]);

  const handleUpdate = async () => {
    setIsSaving(true);
    // Mock PATCH /api/admin/complaints/:id
    await new Promise(resolve => setTimeout(resolve, 800));

    const assignedCt = caretakersList.find(c => c.id === selectedCaretaker);

    setComplaint(prev => ({
      ...prev,
      status,
      department,
      priority,
      caretaker_id: selectedCaretaker,
      history: [
        ...prev.history,
        {
          status,
          date: 'Just now',
          user: assignedCt ? assignedCt.name : 'Admin User'
        }
      ]
    }));

    setIsSaving(false);
    setSaveNotice('Details updated successfully!');
    setTimeout(() => setSaveNotice(''), 3000);
  };

  const handleResponse = async () => {
    if (!response.trim()) return;
    setIsSaving(true);
    // Mock POST /api/admin/complaints/:id/respond
    await new Promise(resolve => setTimeout(resolve, 600));
    setResponse('');
    setIsSaving(false);
    setSaveNotice('Response sent to student!');
    setTimeout(() => setSaveNotice(''), 3000);
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Auto-suggest caretaker by category
  const suggestedCaretaker = caretakersList.find(c => c.category === complaint.category);

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate('/admin')} 
          className="flex items-center text-sm font-medium text-secondary hover:text-primary transition-colors"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Console
        </button>
        <StatusChip status={complaint.status} />
      </div>

      {saveNotice && (
        <div className="p-3 bg-status-resolved-bg text-status-resolved-text rounded-lg text-sm font-semibold border border-green-200">
          {saveNotice}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info Column */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm font-mono text-secondary mb-1">{complaint.id}</p>
                <h1 className="text-2xl font-bold text-primary">{complaint.title}</h1>
              </div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y border-outline-variant mb-4">
              <div>
                <p className="text-xs text-secondary mb-1">Category</p>
                <p className="font-semibold text-sm">{complaint.category}</p>
              </div>
              <div>
                <p className="text-xs text-secondary mb-1">Location</p>
                <p className="font-semibold text-sm">{complaint.location}</p>
              </div>
              <div>
                <p className="text-xs text-secondary mb-1">Submitted</p>
                <p className="font-semibold text-sm">{complaint.createdAt}</p>
              </div>
              <div>
                <p className="text-xs text-secondary mb-1">Priority</p>
                <p className="font-semibold text-sm text-error">{complaint.priority}</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-on-surface mb-2">Description</h3>
              <p className="text-secondary text-sm leading-relaxed whitespace-pre-wrap">
                {complaint.description}
              </p>
            </div>
          </Card>

          <Card>
            <h3 className="font-semibold text-on-surface mb-4 flex items-center">
              <ImageIcon size={18} className="mr-2 text-secondary" />
              Evidence Media
            </h3>
            <div className="bg-surface-variant rounded-lg p-2 border border-outline-variant inline-block">
              <img src={complaint.evidenceUrl} alt="Evidence" className="rounded max-h-64 object-cover" />
            </div>
          </Card>

          <Card>
            <h3 className="font-semibold text-on-surface mb-4">Status History Timeline</h3>
            <div className="space-y-4">
              {complaint.history.map((step, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 mt-2 rounded-full bg-primary" />
                  <div>
                    <p className="text-sm font-semibold">{step.status}</p>
                    <p className="text-xs text-secondary">
                      {step.date} • <span className="font-medium text-on-surface">{step.user}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar Controls */}
        <div className="space-y-6">
          <Card>
            <h3 className="font-semibold text-on-surface mb-4 border-b border-outline-variant pb-2">Student Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-secondary">Name:</span>
                <span className="font-medium">{complaint.student.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary">ID:</span>
                <span className="font-medium">{complaint.student.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary">Email:</span>
                <span className="font-medium">{complaint.student.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary">Phone:</span>
                <span className="font-medium">{complaint.student.phone}</span>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="font-semibold text-on-surface mb-4 border-b border-outline-variant pb-2">Admin Controls</h3>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-secondary">Status</label>
                <select 
                  className="w-full border border-outline rounded px-3 py-2 text-sm bg-background"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="Submitted">Submitted</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Assigned">Assigned</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-secondary">Department</label>
                <select 
                  className="w-full border border-outline rounded px-3 py-2 text-sm bg-background"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                >
                  <option value="CS Block">CS Block</option>
                  <option value="Hostel A">Hostel A</option>
                  <option value="Hostel B">Hostel B</option>
                  <option value="Library">Library</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-secondary">Assign Caretaker</label>
                <select 
                  className="w-full border border-outline rounded px-3 py-2 text-sm bg-background"
                  value={selectedCaretaker}
                  onChange={(e) => setSelectedCaretaker(e.target.value)}
                >
                  <option value="">-- Unassigned --</option>
                  {caretakersList.map(ct => (
                    <option key={ct.id} value={ct.id}>
                      {ct.name} ({ct.category})
                    </option>
                  ))}
                </select>
                {suggestedCaretaker && !selectedCaretaker && (
                  <p className="text-[11px] text-tertiary mt-1">
                    Suggested for {complaint.category}: {suggestedCaretaker.name}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-secondary">Priority</label>
                <select 
                  className="w-full border border-outline rounded px-3 py-2 text-sm bg-background"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <option value="Low">Low</option>
                  <option value="Normal">Normal</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
              
              <Button onClick={handleUpdate} disabled={isSaving} className="w-full">
                {isSaving ? <Loader2 size={16} className="animate-spin mr-2" /> : <Save size={16} className="mr-2" />}
                Save Changes
              </Button>
            </div>
          </Card>

          <Card>
            <h3 className="font-semibold text-on-surface mb-4 flex items-center border-b border-outline-variant pb-2">
              <MessageSquare size={16} className="mr-2" />
              Response to Student
            </h3>
            <textarea 
              rows={4}
              className="w-full border border-outline rounded px-3 py-2 text-sm bg-background resize-none focus:ring-1 focus:ring-primary focus:border-primary mb-3"
              placeholder="Type a response..."
              value={response}
              onChange={(e) => setResponse(e.target.value)}
            />
            <Button onClick={handleResponse} disabled={isSaving || !response.trim()} className="w-full bg-tertiary hover:bg-tertiary-container hover:text-white">
              Send Response
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
