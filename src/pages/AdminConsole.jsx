import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend
} from 'recharts';
import { FileText, Clock, Loader2, CheckCircle, XCircle, Search, Filter } from 'lucide-react';
import { Card, StatusChip, SkeletonCard, Button, Input } from '../components/UI';
import { apiClient } from '../utils/apiClient';
import { toast } from 'sonner';

export default function AdminConsole() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Inline update state
  const [updatingId, setUpdatingId] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateForm, setUpdateForm] = useState({ status: '', admin_note: '' });

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [statsRes, complaintsRes] = await Promise.all([
          apiClient('/api/admin/stats'),
          apiClient('/api/complaints') // No user filter returns all for admins
        ]);
        
        if (statsRes.ok && complaintsRes.ok) {
          const statsData = await statsRes.json();
          const complaintsData = await complaintsRes.json();
          
          setStats(statsData);
          setAnalytics(statsData); // The new API returns everything needed in stats
          setComplaints(complaintsData);
        }
      } catch (error) {
        console.error("Failed to fetch admin data:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  const handleInlineStatusChange = (e, complaint) => {
    e.stopPropagation(); // Prevent row click
    setUpdateForm({ status: e.target.value, admin_note: '' });
    setUpdatingId(complaint.id);
    setShowUpdateModal(true);
  };

  const submitStatusUpdate = async () => {
    try {
      const res = await apiClient(`/api/admin/complaints/${updatingId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateForm)
      });
      if (res.ok) {
        toast.success("Complaint updated successfully!");
        const updatedComp = await res.json();
        setComplaints(prev => prev.map(c => c.id === updatingId ? { ...c, status: updatedComp.status } : c));
        setShowUpdateModal(false);
        setUpdatingId(null);
      } else {
        toast.error("Failed to update status.");
      }
    } catch (err) {
      toast.error("Network error.");
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <SkeletonCard key={i} type="stat" />)}
        </div>
        <SkeletonCard type="list" />
      </div>
    );
  }

  const statCards = [
    { label: 'Total', value: stats.total, icon: FileText, color: 'text-primary', bg: 'bg-primary-container' },
    { label: 'Pending', value: stats.pending, icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100' },
    { label: 'In Progress', value: stats.inProgress, icon: Loader2, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Resolved', value: stats.resolved, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Avg Time (Hrs)', value: stats.avgResolutionTime, icon: Clock, color: 'text-purple-600', bg: 'bg-purple-100' },
  ];

  const COLORS = ['#1a365d', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  const filteredComplaints = complaints.filter(c => {
    const matchesSearch = c.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.id?.toString().toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    const matchesCategory = categoryFilter === 'All' || c.category_name === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const categories = [...new Set(complaints.map(c => c.category_name).filter(Boolean))];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-primary">Admin Console</h1>
        <p className="text-secondary mt-1">Platform overview and resolution analytics.</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {statCards.map((stat, i) => (
          <Card key={i} className="flex flex-col p-4 sm:p-5">
            <div className={`p-2 rounded-lg w-fit mb-3 ${stat.bg} ${stat.color}`}>
              <stat.icon size={20} />
            </div>
            <p className="text-2xl font-bold text-on-surface">{stat.value}</p>
            <p className="text-xs font-medium text-secondary">{stat.label}</p>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Chart */}
        <Card className="lg:col-span-2 p-6">
          <h2 className="text-lg font-bold text-on-surface mb-6">Complaint Volume Trend (7 Days)</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics.trend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e3e5" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 12}} dx={-10} />
                <Tooltip 
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} 
                />
                <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Category Pie */}
        <Card className="p-6 flex flex-col">
          <h2 className="text-lg font-bold text-on-surface mb-2">By Category</h2>
          <div className="flex-1 min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics.byCategory}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {analytics.byCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department Bar Chart */}
        <Card className="lg:col-span-1 p-6">
          <h2 className="text-lg font-bold text-on-surface mb-6">Department Performance</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.byDepartment} layout="vertical" margin={{top: 0, right: 0, left: -20, bottom: 0}}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e0e3e5" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 12}} width={80} />
                <Tooltip cursor={{fill: '#f1f5f9'}} />
                <Bar dataKey="resolved" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} name="Resolved" barSize={20} />
                <Bar dataKey="pending" stackId="a" fill="#f59e0b" radius={[0, 4, 4, 0]} name="Pending" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Recent Complaints Table */}
        <Card className="lg:col-span-2 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-on-surface">Recent Complaints</h2>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-3 text-secondary" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-3 py-1.5 border border-outline rounded text-sm bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <select 
                className="border border-outline rounded px-3 py-1.5 text-sm bg-background text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="All">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              <select 
                className="border border-outline rounded px-3 py-1.5 text-sm bg-background text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Statuses</option>
                <option value="open">Open</option>
                <option value="assigned">Assigned</option>
                <option value="in-progress">In Progress</option>
                <option value="review">Review</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant text-sm text-secondary">
                  <th className="pb-3 font-semibold px-2">ID</th>
                  <th className="pb-3 font-semibold px-2">Title</th>
                  <th className="pb-3 font-semibold px-2">Department</th>
                  <th className="pb-3 font-semibold px-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredComplaints.length > 0 ? filteredComplaints.map((comp) => (
                  <tr 
                    key={comp.id} 
                    className="border-b border-outline-variant last:border-0 hover:bg-surface-variant/50 transition-colors cursor-pointer"
                    onClick={() => navigate(`/admin/complaint/${comp.id}`)}
                  >
                    <td className="py-3 px-2 font-mono text-sm text-secondary">{comp.id}</td>
                    <td className="py-3 px-2 font-medium text-on-surface">{comp.title}</td>
                    <td className="py-3 px-2 text-secondary text-sm">{comp.category_name || 'N/A'}</td>
                    <td className="py-3 px-2 text-right" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={comp.status}
                        onChange={(e) => handleInlineStatusChange(e, comp)}
                        className="border border-outline rounded px-2 py-1 text-xs bg-surface text-on-surface"
                      >
                        <option value="open">Open</option>
                        <option value="assigned">Assigned</option>
                        <option value="in-progress">In Progress</option>
                        <option value="review">Review</option>
                        <option value="resolved">Resolved</option>
                      </select>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="4" className="py-8 text-center text-secondary">
                      No complaints matching this status.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {showUpdateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-background/60 backdrop-blur-md">
          <div className="bg-surface border border-outline-variant rounded-xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold mb-4 text-primary">Update Status (ID: {updatingId})</h3>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-semibold">New Status</label>
                <select 
                  className="w-full border border-outline rounded px-3 py-2 text-sm bg-transparent"
                  value={updateForm.status}
                  onChange={(e) => setUpdateForm({...updateForm, status: e.target.value})}
                >
                  <option value="open">Open</option>
                  <option value="assigned">Assigned</option>
                  <option value="in-progress">In Progress</option>
                  <option value="review">Review</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
              <Input
                label="Admin Note (Optional)"
                placeholder="Message to the student..."
                value={updateForm.admin_note}
                onChange={(e) => setUpdateForm({...updateForm, admin_note: e.target.value})}
              />
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>Cancel</Button>
                <Button onClick={submitStatusUpdate}>Update & Notify</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
