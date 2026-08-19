import React, { useEffect, useState } from 'react';
import { Card, Button } from '../components/UI';
import { Calendar, MapPin, Clock, Loader2, Sparkles, X, ChevronRight } from 'lucide-react';

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 400));
      
      setEvents([
        {
          id: '1',
          title: 'Annual Tech Fest: InnovateX 2026',
          type: 'Technical',
          event_date: '2026-08-20 10:00 AM', // Tomorrow
          location: 'TMSL Main Auditorium & Campus Field',
          description: 'Join us for 3 days of hackathons, robotics competitions, gaming events, and guest tech keynotes from industry leaders.',
          days_away: 1,
          is_featured: true,
        },
        {
          id: '2',
          title: 'Spring Inter-Department Cricket Tournament',
          type: 'Sports',
          event_date: '2026-08-22 08:30 AM',
          location: 'TMSL Main Ground',
          description: 'Inter-department T20 cricket matches. Support your department team in the annual championship trophy matches.',
          days_away: 3,
          is_featured: false,
        },
        {
          id: '3',
          title: 'Cultural Night & Music Fest: Rhythm 2026',
          type: 'Cultural',
          event_date: '2026-08-25 05:00 PM',
          location: 'Open Air Amphitheatre',
          description: 'Live musical performances, battle of the bands, classical dance showcases, and food stalls hosted by student clubs.',
          days_away: 6,
          is_featured: false,
        },
        {
          id: '4',
          title: 'Campus Placement & Internship Drive',
          type: 'Academic',
          event_date: '2026-09-01 09:30 AM',
          location: 'Seminar Hall B, Block 3',
          description: 'Top IT and Engineering recruiters visiting campus for final year placements and 3rd-year internships.',
          days_away: 12,
          is_featured: false,
        },
        {
          id: '5',
          title: 'Blood Donation & Free Health Camp',
          type: 'General',
          event_date: '2026-09-10 09:00 AM',
          location: 'Student Activity Center (SAC)',
          description: 'Organized by NSS and Rotaract Club of TMSL. All donating students receive certificates and refreshments.',
          days_away: 21,
          is_featured: false,
        }
      ]);
      setLoading(false);
    };

    fetchEvents();
  }, []);

  const eventTypes = [
    { name: 'All', color: 'bg-primary text-white' },
    { name: 'Academic', color: 'bg-[#1a365d] text-white' },
    { name: 'Cultural', color: 'bg-[#7c3aed] text-white' },
    { name: 'Sports', color: 'bg-[#059669] text-white' },
    { name: 'Technical', color: 'bg-[#ea580c] text-white' },
    { name: 'General', color: 'bg-[#475569] text-white' },
  ];

  const getTypeTheme = (type) => {
    switch (type) {
      case 'Academic':
        return {
          gradient: 'from-[#1a365d] to-[#4338ca]',
          btn: 'bg-[#1a365d] hover:bg-[#4338ca]',
          emoji: '🎓',
          badge: 'bg-[#1a365d]/10 text-[#1a365d]'
        };
      case 'Cultural':
        return {
          gradient: 'from-[#7c3aed] to-[#db2777]',
          btn: 'bg-[#7c3aed] hover:bg-[#db2777]',
          emoji: '🎭',
          badge: 'bg-[#7c3aed]/10 text-[#7c3aed]'
        };
      case 'Sports':
        return {
          gradient: 'from-[#059669] to-[#0891b2]',
          btn: 'bg-[#059669] hover:bg-[#0891b2]',
          emoji: '⚽',
          badge: 'bg-[#059669]/10 text-[#059669]'
        };
      case 'Technical':
        return {
          gradient: 'from-[#ea580c] to-[#dc2626]',
          btn: 'bg-[#ea580c] hover:bg-[#dc2626]',
          emoji: '💻',
          badge: 'bg-[#ea580c]/10 text-[#ea580c]'
        };
      case 'General':
      default:
        return {
          gradient: 'from-[#475569] to-[#2563eb]',
          btn: 'bg-[#475569] hover:bg-[#2563eb]',
          emoji: '📢',
          badge: 'bg-[#475569]/10 text-[#475569]'
        };
    }
  };

  const getCountdownChip = (days) => {
    if (days === 0) return { label: 'Today!', style: 'bg-red-500 text-white font-bold animate-pulse' };
    if (days === 1) return { label: 'Tomorrow', style: 'bg-amber-500 text-white font-bold' };
    if (days <= 3) return { label: `${days} days away`, style: 'bg-amber-100 text-amber-800 font-semibold' };
    return { label: `${days} days away`, style: 'bg-emerald-100 text-emerald-800 font-semibold' };
  };

  const featuredEvent = events.find(e => e.is_featured);
  const filteredEvents = activeFilter === 'All' 
    ? events 
    : events.filter(e => e.type === activeFilter);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-primary">Campus Events Board</h1>
        <p className="text-secondary mt-1">Discover upcoming workshops, hackathons, sports, and cultural events.</p>
      </div>

      {/* Featured Event Banner */}
      {!loading && featuredEvent && (activeFilter === 'All' || activeFilter === featuredEvent.type) && (
        <div className="relative overflow-hidden rounded-2xl shadow-xl border border-white/20">
          <div className={`p-8 sm:p-10 bg-gradient-to-r ${getTypeTheme(featuredEvent.type).gradient} text-white relative`}>
            {/* Subtle shimmer animation overlay */}
            <div className="absolute inset-0 bg-white/5 opacity-50 animate-pulse pointer-events-none" />
            
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-3 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur rounded-full text-xs font-bold uppercase tracking-wider text-white">
                  <Sparkles size={14} />
                  Featured Upcoming Event
                </div>
                <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">{featuredEvent.title}</h2>
                <p className="text-white/90 text-sm sm:text-base leading-relaxed line-clamp-2">{featuredEvent.description}</p>
                
                <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm pt-2 text-white/80">
                  <span className="flex items-center gap-1.5 font-semibold">
                    <Calendar size={16} /> {featuredEvent.event_date}
                  </span>
                  <span className="flex items-center gap-1.5 font-semibold">
                    <MapPin size={16} /> {featuredEvent.location}
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-start md:items-end gap-3 shrink-0">
                <span className={`px-4 py-1.5 rounded-full text-xs font-extrabold shadow-md ${getCountdownChip(featuredEvent.days_away).style}`}>
                  {getCountdownChip(featuredEvent.days_away).label}
                </span>
                <button
                  onClick={() => setSelectedEvent(featuredEvent)}
                  className="px-6 py-3 bg-white text-primary font-bold text-sm rounded-xl shadow-lg hover:bg-surface transition-transform hover:scale-105 flex items-center gap-2"
                >
                  View Details
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter Bar with Colored Pill Buttons */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {eventTypes.map(t => (
          <button
            key={t.name}
            onClick={() => setActiveFilter(t.name)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 ${
              activeFilter === t.name
                ? `${t.color} shadow-md scale-105`
                : 'bg-surface border border-outline-variant text-secondary hover:bg-surface-variant'
            }`}
          >
            {t.name}
          </button>
        ))}
      </div>

      {/* Events Card Grid */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : filteredEvents.length === 0 ? (
        <Card className="text-center py-16">
          <p className="text-secondary text-base">No events found under this category.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => {
            const theme = getTypeTheme(event.type);
            const countdown = getCountdownChip(event.days_away);

            return (
              <div 
                key={event.id} 
                className="bg-surface border border-outline-variant rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                {/* 80px Gradient Header Band with centered Emoji */}
                <div className={`h-20 bg-gradient-to-r ${theme.gradient} flex items-center justify-center relative`}>
                  <span className="text-4xl transform hover:scale-125 transition-transform cursor-pointer drop-shadow-md">
                    {theme.emoji}
                  </span>
                  <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/30 text-white backdrop-blur">
                    {event.type}
                  </span>
                </div>

                {/* Card Body */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-bold text-lg text-on-surface leading-tight line-clamp-2">
                      {event.title}
                    </h3>
                    <div className="space-y-1 text-xs text-secondary pt-1">
                      <p className="flex items-center gap-1.5 font-medium">
                        <Clock size={14} className="text-primary shrink-0" />
                        {event.event_date}
                      </p>
                      <p className="flex items-center gap-1.5 font-medium truncate">
                        <MapPin size={14} className="text-primary shrink-0" />
                        {event.location}
                      </p>
                    </div>
                    <p className="text-xs text-secondary line-clamp-2 leading-relaxed pt-2">
                      {event.description}
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="pt-4 border-t border-outline-variant flex items-center justify-between gap-2">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] ${countdown.style}`}>
                      {countdown.label}
                    </span>
                    <button
                      onClick={() => setSelectedEvent(event)}
                      className={`px-4 py-2 text-white font-semibold text-xs rounded-lg transition-colors shadow-sm ${theme.btn}`}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Event Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-background/60 backdrop-blur-sm">
          <div className="bg-surface border border-outline-variant rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-150">
            <div className={`p-6 bg-gradient-to-r ${getTypeTheme(selectedEvent.type).gradient} text-white relative`}>
              <button 
                onClick={() => setSelectedEvent(null)}
                className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
              <div className="text-3xl mb-2">{getTypeTheme(selectedEvent.type).emoji}</div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-white/20 text-white backdrop-blur">
                {selectedEvent.type}
              </span>
              <h2 className="text-2xl font-bold mt-2 leading-tight">{selectedEvent.title}</h2>
            </div>

            <div className="p-6 space-y-4">
              <div className="space-y-2 text-sm text-secondary">
                <p className="flex items-center gap-2 font-semibold text-on-surface">
                  <Calendar size={16} className="text-tertiary" /> {selectedEvent.event_date}
                </p>
                <p className="flex items-center gap-2 font-semibold text-on-surface">
                  <MapPin size={16} className="text-tertiary" /> {selectedEvent.location}
                </p>
              </div>

              <div className="pt-2 border-t border-outline-variant">
                <h4 className="text-xs font-bold uppercase text-secondary mb-1">About the Event</h4>
                <p className="text-sm text-on-surface leading-relaxed whitespace-pre-wrap">{selectedEvent.description}</p>
              </div>

              <div className="pt-4 flex justify-end">
                <Button onClick={() => setSelectedEvent(null)}>Close</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
