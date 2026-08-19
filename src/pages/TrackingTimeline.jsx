import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Loader2, CheckCircle2, Clock, XCircle, FileText, AlertCircle, Phone, UserCheck, Star } from 'lucide-react';
import { Card, Button, StatusChip } from '../components/UI';
import { cn } from '../utils/cn';
import { toast } from 'sonner';

export default function TrackingTimeline() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const complaintIdParam = searchParams.get('id') || 'CMP-1042';

  const [timeline, setTimeline] = useState(null);
  const [loading, setLoading] = useState(true);
  const [animate, setAnimate] = useState(false);

  // Step 10 Rating state
  const [rating, setRating] = useState(0);
  const [submittedRating, setSubmittedRating] = useState(null);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) return;
    setIsSubmittingRating(true);
    // Mock POST /api/complaints/:id/feedback
    await new Promise(resolve => setTimeout(resolve, 600));
    setSubmittedRating(rating);
    setIsSubmittingRating(false);
    toast.success('Feedback submitted successfully!');
  };

  useEffect(() => {
    // Mock GET /api/complaints/:id/timeline
    const fetchTimeline = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const mockTimeline = {
        id: complaintIdParam,
        title: complaintIdParam === 'CMP-1038' ? 'Wi-Fi keeps dropping in hostel' : 'Broken AC in Room 302',
        status: complaintIdParam === 'CMP-1038' ? 'Submitted' : 'In Progress',
        caretaker: (complaintIdParam !== 'CMP-1038') ? {
          name: 'Robert Vance (Senior Technician)',
          phone: '+1 555-0198',
          department: 'Maintenance & Electrical'
        } : null,
        steps: [
          { status: 'Submitted', date: 'Aug 18, 10:00 AM', description: 'Complaint received by the system.', completed: true },
          { status: 'Under Review', date: 'Aug 18, 11:30 AM', description: 'Reviewed by administration.', completed: complaintIdParam !== 'CMP-1038' },
          { status: 'Assigned', date: 'Aug 19, 09:00 AM', description: 'Assigned to Robert Vance.', completed: complaintIdParam !== 'CMP-1038' },
          { status: 'In Progress', date: 'Aug 19, 10:15 AM', description: 'Technicians are working on the issue.', completed: complaintIdParam !== 'CMP-1038' },
          { status: 'Resolved', date: null, description: 'Pending confirmation of resolution.', completed: false },
        ]
      };

      setTimeline(mockTimeline);
      setLoading(false);
      
      setTimeout(() => setAnimate(true), 100);
    };
    
    fetchTimeline();
  }, [complaintIdParam]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const getIconForStatus = (status, completed) => {
    if (!completed) return <Clock className="text-secondary w-5 h-5" />;
    switch(status) {
      case 'Submitted': return <FileText className="text-white w-5 h-5" />;
      case 'Under Review': return <AlertCircle className="text-white w-5 h-5" />;
      case 'Assigned': return <UserCheck className="text-white w-5 h-5" />;
      case 'In Progress': return <Loader2 className="text-white w-5 h-5 animate-spin" />;
      case 'Resolved': return <CheckCircle2 className="text-white w-5 h-5" />;
      case 'Rejected': return <XCircle className="text-white w-5 h-5" />;
      default: return <CheckCircle2 className="text-white w-5 h-5" />;
    }
  };

  const getBgClass = (status, completed) => {
    if (!completed) return 'bg-surface-variant border-2 border-outline-variant';
    switch(status) {
      case 'Submitted': return 'bg-primary border-primary';
      case 'Under Review': return 'bg-yellow-500 border-yellow-500';
      case 'Assigned': return 'bg-indigo-500 border-indigo-500';
      case 'In Progress': return 'bg-blue-600 border-blue-600';
      case 'Resolved': return 'bg-green-600 border-green-600';
      case 'Rejected': return 'bg-red-600 border-red-600';
      default: return 'bg-primary border-primary';
    }
  };

  // Check if status is assigned or later
  const isAssignedOrLater = ['Assigned', 'In Progress', 'Resolved'].includes(timeline.status);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <button 
        onClick={() => navigate('/dashboard')} 
        className="flex items-center text-sm font-medium text-secondary hover:text-primary transition-colors"
      >
        <ArrowLeft size={16} className="mr-1" />
        Back to Dashboard
      </button>

      <Card className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-sm font-mono text-secondary mb-1">{timeline.id}</p>
          <h1 className="text-xl font-bold text-primary">{timeline.title}</h1>
        </div>
        <div>
          <StatusChip status={timeline.status} />
        </div>
      </Card>

      {/* STEP 6: Assigned Caretaker Contact Card (Only shown if assigned or later) */}
      {isAssignedOrLater && timeline.caretaker && (
        <Card className="bg-primary-container/20 border-tertiary/30 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-tertiary text-white flex items-center justify-center">
                <UserCheck size={24} />
              </div>
              <div>
                <p className="text-xs font-semibold text-tertiary uppercase tracking-wider">Assigned Caretaker</p>
                <h3 className="text-lg font-bold text-on-surface">{timeline.caretaker.name}</h3>
                <p className="text-xs text-secondary">{timeline.caretaker.department}</p>
              </div>
            </div>

            <a
              href={`tel:${timeline.caretaker.phone}`}
              className="inline-flex items-center justify-center gap-2 bg-tertiary text-white font-medium text-sm px-4 py-2.5 rounded-lg hover:bg-tertiary-container transition-colors"
            >
              <Phone size={16} />
              Call {timeline.caretaker.phone}
            </a>
          </div>
        </Card>
      )}

      {/* STEP 10: Feedback & Rating Component (Shown when Resolved) */}
      {timeline.status === 'Resolved' && (
        <Card className="p-6 bg-surface-container-lowest border-yellow-200">
          <h3 className="text-lg font-bold text-on-surface mb-2 flex items-center gap-2">
            <Star className="text-yellow-500 fill-yellow-500" size={20} />
            Rate Complaint Resolution
          </h3>

          {submittedRating ? (
            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star} 
                    size={20} 
                    className={star <= submittedRating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"} 
                  />
                ))}
                <span className="ml-2 font-bold text-sm text-on-surface">{submittedRating} / 5</span>
              </div>
              {feedbackComment && (
                <p className="text-sm text-secondary italic bg-surface-variant p-3 rounded-lg mt-2">
                  "{feedbackComment}"
                </p>
              )}
              <p className="text-xs text-status-resolved-text font-semibold pt-1">
                Thank you! Your feedback has been recorded.
              </p>
            </div>
          ) : (
            <form onSubmit={handleFeedbackSubmit} className="space-y-4 pt-2">
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 hover:scale-110 transition-transform focus:outline-none"
                  >
                    <Star 
                      size={28} 
                      className={star <= rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300 hover:text-yellow-400"} 
                    />
                  </button>
                ))}
              </div>

              <textarea
                rows={3}
                placeholder="Optional feedback comment on how the issue was handled..."
                value={feedbackComment}
                onChange={(e) => setFeedbackComment(e.target.value)}
                className="w-full border border-outline rounded-lg p-3 text-sm bg-background resize-none focus:ring-1 focus:ring-primary"
              />

              <Button type="submit" disabled={rating === 0 || isSubmittingRating}>
                {isSubmittingRating ? 'Submitting...' : 'Submit Rating'}
              </Button>
            </form>
          )}
        </Card>
      )}

      {/* Timeline Card */}
      <Card className="p-8">
        <h2 className="text-lg font-bold text-on-surface mb-8">Tracking Timeline</h2>
        
        <div className="relative">
          {/* Background line */}
          <div className="absolute left-[1.15rem] top-4 bottom-4 w-1 bg-outline-variant rounded-full" />
          
          {/* Animated fill line */}
          <div 
            className="absolute left-[1.15rem] top-4 w-1 bg-primary rounded-full transition-all duration-1000 ease-out origin-top"
            style={{ 
              height: animate ? `${(timeline.steps.filter(s => s.completed).length - 1) / (timeline.steps.length - 1) * 100}%` : '0%',
              opacity: animate ? 1 : 0
            }}
          />

          <div className="space-y-8 relative">
            {timeline.steps.map((step, index) => (
              <div key={index} className="flex gap-6">
                <div className="relative z-10 flex-shrink-0">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-500",
                    getBgClass(step.status, step.completed)
                  )}>
                    {getIconForStatus(step.status, step.completed)}
                  </div>
                </div>
                
                <div className={cn("pt-2 pb-1 transition-opacity duration-500", step.completed ? "opacity-100" : "opacity-60")}>
                  <h3 className="text-base font-bold text-on-surface">{step.status}</h3>
                  <p className="text-sm text-secondary mt-1">{step.description}</p>
                  {step.date && (
                    <p className="text-xs font-medium text-secondary mt-2 flex items-center">
                      <Clock size={12} className="mr-1" />
                      {step.date}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
