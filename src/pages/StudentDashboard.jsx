import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, FileText, Clock, CheckCircle, Loader2, Search, Filter } from 'lucide-react';
import { Card, Button, StatusChip } from '../components/UI';

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      // Simulate network delay for skeletons
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Mock GET /api/categories
      setCategories(['Classroom', 'Electrical', 'Wi-Fi', 'Hostel', 'Library', 'Canteen', 'Cleaning', 'Water', 'Transport']);

      // Mock GET /api/student/dashboard-stats
      setStats({
        total: 5,
        pending: 2,
        inProgress: 1,
        resolved: 2
      });

      // Mock GET /api/complaints/mine
      setComplaints([
        { id: 'CMP-1042', title: 'Broken AC in Room 302', category: 'Electrical', date: '2026-08-18', status: 'In Progress' },
        { id: 'CMP-1038', title: 'Wi-Fi keeps dropping in hostel', category: 'Wi-Fi', date: '2026-08-15', status: 'Submitted' },
        { id: 'CMP-1021', title: 'Water cooler leaking third floor', category: 'Water', date: '2026-08-10', status: 'Resolved' },
        { id: 'CMP-1019', title: 'Projector bulb broken in lab', category: 'Classroom', date: '2026-08-05', status: 'Resolved' },
        { id: 'CMP-1012', title: 'Library study room light flickering', category: 'Electrical', date: '2026-08-01', status: 'Under Review' },
      ]);
      
      setLoading(false);
    };

    fetchDashboardData();
  }, []);

  // Filter complaints logic
  const filteredComplaints = complaints.filter(comp => {
    const matchesSearch = comp.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          comp.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || comp.status === statusFilter;
    const matchesCategory = categoryFilter === 'All' || comp.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const statCards = [
    { label: 'Total', value: stats?.total, icon: FileText, color: 'text-primary', bg: 'bg-primary-container' },
    { label: 'Pending', value: stats?.pending, icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100' },
    { label: 'In Progress', value: stats?.inProgress, icon: Loader2, color: 'text-tertiary', bg: 'bg-status-progress-bg' },
    { label: 'Resolved', value: stats?.resolved, icon: CheckCircle, color: 'text-status-resolved-text', bg: 'bg-status-resolved-bg' },
  ];

  // Pagination state
  const [showAll, setShowAll] = useState(false);
  const displayedComplaints = showAll ? filteredComplaints : filteredComplaints.slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-primary">Student Dashboard</h1>
          <p className="text-secondary mt-1">Welcome back. Here is the overview of your complaints.</p>
        </div>
        <Button onClick={() => navigate('/new-complaint')} className="w-full sm:w-auto">
          <PlusCircle size={20} className="mr-2" />
          Submit Complaint
        </Button>
      </div>

      {/* Stats Cards (with Skeleton Loading) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {loading ? (
          [1, 2, 3, 4].map(i => (
            <Card key={i} className="p-4 sm:p-6 animate-pulse">
              <div className="h-4 bg-outline-variant/60 rounded w-16 mb-2" />
              <div className="h-8 bg-outline-variant/80 rounded w-12" />
            </Card>
          ))
        ) : (
          statCards.map((stat, i) => (
            <Card key={i} className="flex items-center gap-4 p-4 sm:p-6">
              <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-secondary">{stat.label}</p>
                <p className="text-2xl font-bold text-on-surface">{stat.value}</p>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Recent Complaints Section */}
      <Card className="mt-8 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h2 className="text-xl font-bold text-on-surface">Recent Complaints</h2>

          {/* Search & Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 sm:w-64">
              <Search size={16} className="absolute left-3 top-3 text-secondary" />
              <input
                type="text"
                placeholder="Search complaints..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 border border-outline rounded-lg text-sm bg-background focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-outline rounded-lg px-3 py-1.5 text-sm bg-background text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="All">All Statuses</option>
              <option value="Submitted">Submitted</option>
              <option value="Under Review">Under Review</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="border border-outline rounded-lg px-3 py-1.5 text-sm bg-background text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="All">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-12 bg-outline-variant/40 rounded animate-pulse" />
            ))}
          </div>
        ) : filteredComplaints.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-surface-variant mb-4">
              <FileText size={32} className="text-secondary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              {complaints.length === 0 ? "No complaints yet" : "No matching complaints found"}
            </h3>
            <p className="text-secondary mb-6">
              {complaints.length === 0 
                ? "You haven't submitted any complaints. Report your first issue now." 
                : "Try adjusting your search criteria or clearing filters."}
            </p>
            {complaints.length === 0 && (
              <Button onClick={() => navigate('/new-complaint')}>
                Submit your first complaint
              </Button>
            )}
          </div>
        ) : (
          <div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-outline-variant text-sm text-secondary">
                    <th className="pb-3 font-semibold px-2">ID</th>
                    <th className="pb-3 font-semibold px-2">Title</th>
                    <th className="pb-3 font-semibold px-2">Category</th>
                    <th className="pb-3 font-semibold px-2">Date</th>
                    <th className="pb-3 font-semibold px-2 text-right">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedComplaints.map((comp) => (
                    <tr 
                      key={comp.id} 
                      className="border-b border-outline-variant last:border-0 hover:bg-surface-variant/50 cursor-pointer transition-colors" 
                      onClick={() => navigate(`/tracking?id=${comp.id}`)}
                    >
                      <td className="py-4 px-2 font-mono text-sm text-secondary">{comp.id}</td>
                      <td className="py-4 px-2 font-medium text-on-surface">{comp.title}</td>
                      <td className="py-4 px-2 text-secondary">{comp.category}</td>
                      <td className="py-4 px-2 text-secondary">{comp.date}</td>
                      <td className="py-4 px-2 text-right">
                        <StatusChip status={comp.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredComplaints.length > 5 && (
              <div className="mt-4 pt-3 border-t border-outline-variant flex justify-center">
                <Button variant="secondary" onClick={() => setShowAll(!showAll)} className="text-sm">
                  {showAll ? 'Show less' : `View all complaints (${filteredComplaints.length})`}
                </Button>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
