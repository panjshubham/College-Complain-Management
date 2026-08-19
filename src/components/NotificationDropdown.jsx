import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCircle2, Clock, AlertCircle, X } from 'lucide-react';
import { cn } from '../utils/cn';

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      // Mock GET /api/notifications
      await new Promise(resolve => setTimeout(resolve, 300));
      setNotifications([
        {
          id: '1',
          title: 'Status Updated to In Progress',
          message: 'Your complaint CMP-1042 (Broken AC) has been assigned to Maintenance.',
          complaint_id: 'CMP-1042',
          read: false,
          created_at: '10 mins ago'
        },
        {
          id: '2',
          title: 'Complaint Under Review',
          message: 'Your complaint CMP-1038 (Wi-Fi dropping) is under review.',
          complaint_id: 'CMP-1038',
          read: false,
          created_at: '2 hours ago'
        },
        {
          id: '3',
          title: 'Complaint Resolved',
          message: 'CMP-1021 (Water cooler leaking) has been marked as resolved.',
          complaint_id: 'CMP-1021',
          read: true,
          created_at: '1 day ago'
        }
      ]);
      setLoading(false);
    };

    fetchNotifications();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = async (id, complaintId) => {
    // Mock PATCH /api/notifications/:id/read
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    setIsOpen(false);
    if (complaintId) {
      navigate('/tracking');
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-secondary hover:text-primary transition-colors focus:outline-none"
        aria-label="Notifications"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 min-w-[18px] h-[18px] bg-error text-white text-[10px] font-bold flex items-center justify-center rounded-full px-1 border-2 border-background">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-surface border border-outline-variant rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in duration-150">
          <div className="p-4 border-b border-outline-variant flex items-center justify-between bg-background">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-on-surface">Notifications</h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 text-xs font-semibold bg-primary-container text-primary rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
            <button onClick={() => setIsOpen(false)} className="text-secondary hover:text-primary">
              <X size={18} />
            </button>
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-outline-variant">
            {loading ? (
              <div className="p-6 text-center text-sm text-secondary">Loading notifications...</div>
            ) : notifications.length === 0 ? (
              <div className="p-6 text-center text-sm text-secondary">No notifications found</div>
            ) : (
              notifications.map((item) => (
                <div 
                  key={item.id}
                  onClick={() => markAsRead(item.id, item.complaint_id)}
                  className={cn(
                    "p-4 cursor-pointer hover:bg-surface-variant transition-colors flex gap-3 items-start",
                    !item.read ? "bg-primary-container/30" : "bg-transparent"
                  )}
                >
                  <div className="mt-0.5">
                    {!item.read ? (
                      <AlertCircle size={16} className="text-tertiary shrink-0" />
                    ) : (
                      <CheckCircle2 size={16} className="text-secondary shrink-0" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn("text-sm font-medium text-on-surface leading-tight", !item.read && "font-bold")}>
                      {item.title}
                    </p>
                    <p className="text-xs text-secondary mt-1 line-clamp-2">{item.message}</p>
                    <span className="text-[10px] text-secondary mt-1.5 flex items-center gap-1 font-mono">
                      <Clock size={10} />
                      {item.created_at}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
