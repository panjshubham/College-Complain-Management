import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend
} from 'recharts';
import { FileText, Clock, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { Card, StatusChip } from '../components/UI';

export default function AdminConsole() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    const fetchAdminData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock stats
      setStats({
        total: 124,
        pending: 15,
        inProgress: 24,
        resolved: 78,
        rejected: 7
      });

      // Mock analytics
      setAnalytics({
        trend: [
          { name: 'Mon', count: 12 },
          { name: 'Tue', count: 19 },
          { name: 'Wed', count: 15 },
          { name: 'Thu', count: 22 },
          { name: 'Fri', count: 30 },
          { name: 'Sat', count: 10 },
          { name: 'Sun', count: 16 }
        ],
        byCategory: [
          { name: 'Electrical', value: 35 },
          { name: 'Wi-Fi', value: 25 },
          { name: 'Plumbing', value: 20 },
          { name: 'Cleaning', value: 20 }
        ],
        byDepartment: [
          { name: 'CS Block', resolved: 40, pending: 10 },
          { name: 'Hostel A', resolved: 30, pending: 15 },
          { name: 'Library', resolved: 25, pending: 5 }
        ]
      });

      // Mock complaints
      setComplaints([
        { id: 'CMP-1042', title: 'Broken AC in Room 302', department: 'CS Block', status: 'In Progress' },
        { id: 'CMP-1041', title: 'Wi-Fi drops frequently', department: 'Hostel A', status: 'Submitted' },
        { id: 'CMP-1040', title: 'Projector not working', department: 'CS Block', status: 'Resolved' },
        { id: 'CMP-1039', title: 'Water leakage', department: 'Library', status: 'Assigned' },
        { id: 'CMP-1038', title: 'Noisy fan', department: 'Hostel B', status: 'Rejected' },
      ]);
      
      setLoading(false);
    };

    fetchAdminData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const statCards = [
    { label: 'Total', value: stats.total, icon: FileText, color: 'text-primary', bg: 'bg-primary-container' },
    { label: 'Pending', value: stats.pending, icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100' },
    { label: 'In Progress', value: stats.inProgress, icon: Loader2, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Resolved', value: stats.resolved, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Rejected', value: stats.rejected, icon: XCircle, color: 'text-red-600', bg: 'bg-red-100' },
  ];

  const COLORS = ['#1a365d', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  const filteredComplaints = statusFilter === 'All' 
    ? complaints 
    : complaints.filter(c => c.status === statusFilter);

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
            <select 
              className="border border-outline rounded px-3 py-1.5 text-sm bg-background text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Submitted">Submitted</option>
              <option value="Assigned">Assigned</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Rejected">Rejected</option>
            </select>
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
                    <td className="py-3 px-2 text-secondary text-sm">{comp.department}</td>
                    <td className="py-3 px-2 text-right">
                      <StatusChip status={comp.status} />
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
    </div>
  );
}
