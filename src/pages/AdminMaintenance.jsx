import React, { useState, useEffect } from 'react';
import { Card } from '../components/UI';
import { Loader2, MapPin, Calendar, UserCheck } from 'lucide-react';
import { DndContext, useDroppable, useDraggable, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';

// Droppable Column Component
function KanbanColumn({ id, title, headerBg, colBg, countBg, children }) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div 
      ref={setNodeRef}
      className={`rounded-2xl overflow-hidden border transition-colors ${
        isOver ? 'border-primary ring-2 ring-primary/30' : 'border-outline-variant'
      } ${colBg} min-h-[500px] flex flex-col`}
    >
      <div className={`p-4 ${headerBg} flex items-center justify-between font-bold shadow-sm`}>
        <span>{title}</span>
        <span className={`px-2.5 py-0.5 rounded-full text-xs ${countBg}`}>
          {children.length}
        </span>
      </div>
      <div className="p-4 space-y-4 flex-1">
        {children.length === 0 ? (
          <div className="text-center py-12 text-secondary/60 text-xs font-medium border-2 border-dashed border-outline-variant/60 rounded-xl">
            Drop requests here
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}

// Draggable Card Component
function KanbanCard({ req, theme, caretakersList, onCaretakerChange }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: req.id,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    opacity: isDragging ? 0.6 : 1,
    zIndex: isDragging ? 999 : 1,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all ${theme.border} space-y-3 cursor-grab active:cursor-grabbing border border-outline-variant/60`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{theme.emoji}</span>
          <div>
            <span className="font-mono text-[10px] text-secondary">{req.id}</span>
            <h3 className="font-bold text-sm text-on-surface leading-tight">{req.title}</h3>
          </div>
        </div>
      </div>

      <p className="text-xs text-secondary line-clamp-2 leading-relaxed">{req.description}</p>

      <div className="space-y-1 text-[11px] text-secondary pt-2 border-t border-outline-variant">
        <p className="flex items-center gap-1">
          <MapPin size={12} className="text-primary shrink-0" />
          <span className="truncate">{req.location}</span>
        </p>
      </div>

      {/* Quick Caretaker Assignment Dropdown directly on Card */}
      <div className="pt-2 flex items-center justify-between gap-2 bg-surface-variant p-2 rounded-lg" onPointerDown={(e) => e.stopPropagation()}>
        <span className="text-[10px] font-bold text-secondary uppercase shrink-0">Assign:</span>
        <select
          value={req.caretaker_id || ''}
          onChange={(e) => onCaretakerChange(req.id, e.target.value)}
          className="w-full border border-outline rounded px-2 py-1 text-xs bg-background text-on-surface focus:outline-none"
        >
          <option value="">-- Unassigned --</option>
          {caretakersList.map(ct => (
            <option key={ct.id} value={ct.id}>{ct.name}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default function AdminMaintenance() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [caretakersList, setCaretakersList] = useState([]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 400));
      
      setCaretakersList([
        { id: '1', name: 'Robert Vance' },
        { id: '2', name: 'Sarah Connor' },
        { id: '3', name: 'Michael Scott' },
        { id: '4', name: 'David Wallace' }
      ]);

      setRequests([
        {
          id: 'MNT-201',
          title: 'AC Filter Cleaning & Servicing',
          category: 'AC',
          location: 'Computer Science Lab 3',
          description: 'AC blowing warm air, needs filter cleaning.',
          status: 'in_progress',
          caretaker_id: '1',
          created_at: 'Aug 18, 2026'
        },
        {
          id: 'MNT-198',
          title: 'Desk Chair Replacement',
          category: 'Furniture',
          location: 'Library Reading Hall Desk #12',
          description: 'Wheel broken on study desk chair.',
          status: 'pending',
          caretaker_id: '',
          created_at: 'Aug 16, 2026'
        },
        {
          id: 'MNT-185',
          title: 'Restroom Sink Faucet Repair',
          category: 'Plumbing',
          location: 'Block 2, Ground Floor Restroom',
          description: 'Low water pressure in main tap.',
          status: 'completed',
          caretaker_id: '4',
          created_at: 'Aug 10, 2026'
        }
      ]);
      setLoading(false);
    };

    fetchData();
  }, []);

  const getCategoryTheme = (cat) => {
    switch (cat) {
      case 'AC':
        return { emoji: '❄️', border: 'border-l-4 border-l-[#0891b2]' };
      case 'Furniture':
        return { emoji: '🪑', border: 'border-l-4 border-l-[#92400e]' };
      case 'Plumbing':
        return { emoji: '🔧', border: 'border-l-4 border-l-[#1d4ed8]' };
      case 'Electrical':
        return { emoji: '⚡', border: 'border-l-4 border-l-[#ca8a04]' };
      case 'Equipment':
        return { emoji: '🖥️', border: 'border-l-4 border-l-[#7c3aed]' };
      default:
        return { emoji: '📦', border: 'border-l-4 border-l-[#64748b]' };
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over) return;

    const requestId = active.id;
    const newStatus = over.id;

    // Update state locally
    setRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        return { ...req, status: newStatus };
      }
      return req;
    }));

    // Mock PATCH /api/admin/maintenance-requests/:id
  };

  const handleCaretakerChange = (reqId, caretakerId) => {
    setRequests(prev => prev.map(req => req.id === reqId ? { ...req, caretaker_id: caretakerId } : req));
  };

  const columns = [
    {
      id: 'pending',
      title: 'Pending',
      headerBg: 'bg-[#f59e0b] text-white',
      colBg: 'bg-[#fffbeb]',
      countBg: 'bg-amber-100 text-amber-900',
    },
    {
      id: 'in_progress',
      title: 'In Progress',
      headerBg: 'bg-[#2563eb] text-white',
      colBg: 'bg-[#eff6ff]',
      countBg: 'bg-blue-100 text-blue-900',
    },
    {
      id: 'completed',
      title: 'Completed',
      headerBg: 'bg-[#16a34a] text-white',
      colBg: 'bg-[#f0fdf4]',
      countBg: 'bg-green-100 text-green-900',
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-primary">Admin Maintenance Kanban</h1>
        <p className="text-secondary mt-1">Drag cards between columns to instantly update request status.</p>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {columns.map((col) => {
              const colRequests = requests.filter(r => r.status === col.id);

              return (
                <KanbanColumn
                  key={col.id}
                  id={col.id}
                  title={col.title}
                  headerBg={col.headerBg}
                  colBg={col.colBg}
                  countBg={col.countBg}
                >
                  {colRequests.map((req) => (
                    <KanbanCard
                      key={req.id}
                      req={req}
                      theme={getCategoryTheme(req.category)}
                      caretakersList={caretakersList}
                      onCaretakerChange={handleCaretakerChange}
                    />
                  ))}
                </KanbanColumn>
              );
            })}
          </div>
        </DndContext>
      )}
    </div>
  );
}
