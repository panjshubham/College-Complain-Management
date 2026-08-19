import React, { useState } from 'react';
import { Outlet, NavLink, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { 
  LayoutDashboard, PlusCircle, Clock, PieChart, Menu, X, LogOut, Bell, User, 
  Calendar, Megaphone, Search, Wrench, ShieldCheck 
} from 'lucide-react';
import { cn } from '../utils/cn';
import { useAuth } from '../context/AuthContext';
import NotificationDropdown from './NotificationDropdown';

export default function Layout() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, getInitials, loading } = useAuth();

  const isAdminRoute = location.pathname.startsWith('/admin');

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-surface">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Redirect if not logged in
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // STEP 13: Strict role guard — redirect non-admins accessing /admin/* to /dashboard
  if (isAdminRoute && user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  // Determine navigation based on user's assigned role
  const isAdmin = user?.role === 'admin';

  const studentNav = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/new-complaint', icon: PlusCircle, label: 'New Complaint' },
    { to: '/tracking', icon: Clock, label: 'Tracking' },
    { to: '/events', icon: Calendar, label: 'Events Board' },
    { to: '/notices', icon: Megaphone, label: 'Notice Board' },
    { to: '/lost-found', icon: Search, label: 'Lost & Found' },
    { to: '/maintenance', icon: Wrench, label: 'Maintenance' },
    { to: '/profile', icon: User, label: 'Profile' },
  ];

  const adminNav = [
    { to: '/admin', icon: PieChart, label: 'Admin Console' },
    { to: '/admin/caretakers', icon: ShieldCheck, label: 'Caretakers' },
    { to: '/admin/notices', icon: Megaphone, label: 'Manage Notices' },
    { to: '/admin/maintenance', icon: Wrench, label: 'Maintenance Orders' },
    { to: '/lost-found', icon: Search, label: 'Lost & Found' },
    { to: '/profile', icon: User, label: 'Profile' },
  ];

  const navItems = isAdmin ? adminNav : studentNav;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-surface">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-on-background/20 z-20 md:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed md:static inset-y-0 left-0 z-30 w-64 bg-background border-r border-outline-variant transform transition-transform duration-200 ease-in-out flex flex-col",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="p-6 flex items-center justify-between">
          <div className="font-bold text-xl text-primary flex items-center gap-2 cursor-pointer" onClick={() => navigate(isAdmin ? '/admin' : '/dashboard')}>
             <div className="w-8 h-8 rounded bg-primary text-white flex items-center justify-center font-serif">A</div>
             Academic Resolve
          </div>
          <button className="md:hidden" onClick={() => setSidebarOpen(false)}>
            <X size={24} className="text-secondary" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/admin' || item.to === '/dashboard'}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium transition-colors text-sm",
                isActive 
                  ? "bg-primary text-white font-bold shadow-sm" 
                  : "text-secondary hover:bg-surface-variant hover:text-on-surface"
              )}
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-outline-variant">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium text-error hover:bg-error-container/50 transition-colors text-sm"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-background border-b border-outline-variant flex items-center justify-between px-4 sm:px-6 z-10">
          <button className="md:hidden p-2 -ml-2 text-secondary" onClick={() => setSidebarOpen(true)}>
            <Menu size={24} />
          </button>
          
          <div className="flex-1" />

          <div className="flex items-center gap-4">
            <NotificationDropdown />
            <div 
              className="flex items-center gap-3 pl-4 border-l border-outline-variant cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => navigate('/profile')}
            >
              <div className="w-8 h-8 rounded-full bg-tertiary text-white flex items-center justify-center text-sm font-semibold">
                {getInitials(user.full_name)}
              </div>
              <div className="hidden sm:block text-sm">
                <p className="font-semibold text-on-surface leading-tight">{user.full_name}</p>
                <p className="text-xs text-secondary">{user.department || (user.role === 'admin' ? 'Administrator' : 'Student')}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-surface p-4 sm:p-6 lg:p-8">
          <div className="max-w-5xl mx-auto">
            <Outlet />
          </div>
        </main>

        {/* Mobile Bottom Nav */}
        <nav className="md:hidden border-t border-outline-variant bg-background flex items-center justify-around p-2 pb-safe">
          {navItems.slice(0, 4).map((item) => (
             <NavLink
               key={item.to}
               to={item.to}
               className={({ isActive }) => cn(
                 "flex flex-col items-center p-2 text-xs font-medium rounded-lg",
                 isActive ? "text-primary bg-primary-container" : "text-secondary"
               )}
             >
               <item.icon size={20} className="mb-1" />
               {item.label}
             </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}
