import React, { useEffect, useState } from 'react';
import { Calendar, Loader2, Pin } from 'lucide-react';

export default function NoticeBoard() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotices = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 400));
      setNotices([
        {
          id: '1',
          title: 'Urgent: Mid-Semester Seating Plan & Admit Card Notice',
          priority: 'Urgent',
          body: 'The mid-semester examinations for all 2nd and 3rd year B.Tech students will commence from September 10, 2026. Admit cards must be printed and verified by the head of department prior to entering exam halls.',
          created_at: 'Aug 19, 2026',
          is_new: true,
          unread: true,
        },
        {
          id: '2',
          title: 'Campus Central Library Extension Hours',
          priority: 'Important',
          body: 'In view of upcoming mid-sem exams, the central library will remain open until 11:00 PM on weekdays. Reading halls and high-speed Wi-Fi zones will be operational at full capacity.',
          created_at: 'Aug 18, 2026',
          is_new: true,
          unread: false,
        },
        {
          id: '3',
          title: 'Mandatory RFID ID Card Check at Campus Main Gate',
          priority: 'General',
          body: 'All students are instructed to wear their official TMSL RFID ID cards around their neck while entering the campus grounds. Guards will restrict entry for non-compliant students.',
          created_at: 'Aug 15, 2026',
          is_new: false,
          unread: false,
        },
        {
          id: '4',
          title: 'Annual Sports Club Registration Open',
          priority: 'Info',
          body: 'Registrations are open for Cricket, Football, Table Tennis, and Badminton college teams. Interested students can sign up in the Gymkhana office between 3 PM - 5 PM.',
          created_at: 'Aug 12, 2026',
          is_new: false,
          unread: false,
        }
      ]);
      setLoading(false);
    };

    fetchNotices();
  }, []);

  const getPriorityTheme = (priority) => {
    switch (priority) {
      case 'Urgent':
        return {
          pin: 'bg-[#ef4444]',
          border: 'border-l-4 border-l-[#ef4444]',
          bg: 'bg-[#fef2f2]',
          badge: 'bg-red-100 text-red-800'
        };
      case 'Important':
        return {
          pin: 'bg-[#f59e0b]',
          border: 'border-l-4 border-l-[#f59e0b]',
          bg: 'bg-[#fffbeb]',
          badge: 'bg-amber-100 text-amber-800'
        };
      case 'General':
        return {
          pin: 'bg-[#3b82f6]',
          border: 'border-l-4 border-l-[#3b82f6]',
          bg: 'bg-[#eff6ff]',
          badge: 'bg-blue-100 text-blue-800'
        };
      case 'Info':
      default:
        return {
          pin: 'bg-[#10b981]',
          border: 'border-l-4 border-l-[#10b981]',
          bg: 'bg-[#f0fdf4]',
          badge: 'bg-emerald-100 text-emerald-800'
        };
    }
  };

  return (
    <div className="min-h-screen bg-[#fafaf5] -m-4 sm:-m-6 lg:-m-8 p-4 sm:p-6 lg:p-8 space-y-6">
      <style>{`
        /* CSS Nth-Child Fixed Rotations for Pinned Paper Feel */
        .pinned-paper:nth-child(4n+1) { transform: rotate(-1.2deg); }
        .pinned-paper:nth-child(4n+2) { transform: rotate(1.4deg); }
        .pinned-paper:nth-child(4n+3) { transform: rotate(-0.8deg); }
        .pinned-paper:nth-child(4n+4) { transform: rotate(1.1deg); }

        .pinned-paper:hover {
          transform: translateY(-4px) rotate(0deg) !important;
          box-shadow: 4px 12px 24px rgba(0, 0, 0, 0.12) !important;
        }

        /* Diagonal NEW Ribbon */
        .ribbon-wrapper {
          position: absolute;
          top: 0;
          right: 0;
          width: 75px;
          height: 75px;
          overflow: hidden;
          pointer-events: none;
        }
        .ribbon {
          font-size: 9px;
          font-weight: 800;
          color: white;
          text-transform: uppercase;
          text-align: center;
          line-height: 18px;
          transform: rotate(45deg);
          position: absolute;
          padding: 0 20px;
          top: 14px;
          right: -24px;
          background-color: #ef4444;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>

      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-primary flex items-center gap-2">
          <Pin className="text-red-500 transform -rotate-45" size={28} />
          Digital College Notice Board
        </h1>
        <p className="text-secondary mt-1">Official pinned circulars and institutional announcements.</p>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : notices.length === 0 ? (
        <div className="text-center py-16 bg-white/60 border border-amber-200 rounded-2xl">
          <p className="text-secondary text-base">No pinned notices on the board right now.</p>
        </div>
      ) : (
        /* CSS Columns Masonry Grid */
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {notices.map((notice) => {
            const theme = getPriorityTheme(notice.priority);

            return (
              <div
                key={notice.id}
                className={`pinned-paper break-inside-avoid bg-white rounded-xl p-6 relative transition-all duration-300 ${theme.border} ${
                  notice.unread ? 'bg-white font-medium' : `${theme.bg}`
                }`}
                style={{
                  boxShadow: '2px 6px 16px rgba(0, 0, 0, 0.08)',
                }}
              >
                {/* Diagonal NEW Ribbon for notices < 24h */}
                {notice.is_new && (
                  <div className="ribbon-wrapper">
                    <div className="ribbon">NEW</div>
                  </div>
                )}

                {/* Top-Center Colored Pin Circle */}
                <div className="flex justify-center -mt-8 mb-4">
                  <div className={`w-5 h-5 rounded-full ${theme.pin} shadow-md border-2 border-white flex items-center justify-center relative`}>
                    {notice.unread && (
                      <span className="w-2 h-2 rounded-full bg-white animate-ping absolute" />
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${theme.badge}`}>
                    {notice.priority} Notice
                  </span>
                  <span className="text-[11px] text-secondary flex items-center gap-1 font-mono">
                    <Calendar size={12} /> {notice.created_at}
                  </span>
                </div>

                <h3 className={`text-base font-bold text-on-surface mb-3 leading-snug ${notice.unread ? 'text-primary' : ''}`}>
                  {notice.title}
                </h3>

                <p className="text-xs text-secondary leading-relaxed whitespace-pre-wrap">
                  {notice.body}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
