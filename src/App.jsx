import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import StudentDashboard from './pages/StudentDashboard';
import NewComplaintForm from './pages/NewComplaintForm';
import TrackingTimeline from './pages/TrackingTimeline';
import AdminConsole from './pages/AdminConsole';
import AdminComplaintDetail from './pages/AdminComplaintDetail';
import AdminCaretakers from './pages/AdminCaretakers';
import ProfilePage from './pages/ProfilePage';
import EventsPage from './pages/EventsPage';
import NoticeBoard from './pages/NoticeBoard';
import AdminNotices from './pages/AdminNotices';
import LostFoundPage from './pages/LostFoundPage';
import MaintenanceTracker from './pages/MaintenanceTracker';
import AdminMaintenance from './pages/AdminMaintenance';
import Layout from './components/Layout';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<StudentDashboard />} />
            <Route path="/new-complaint" element={<NewComplaintForm />} />
            <Route path="/tracking" element={<TrackingTimeline />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/notices" element={<NoticeBoard />} />
            <Route path="/lost-found" element={<LostFoundPage />} />
            <Route path="/maintenance" element={<MaintenanceTracker />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminConsole />} />
            <Route path="/admin/complaint/:id" element={<AdminComplaintDetail />} />
            <Route path="/admin/caretakers" element={<AdminCaretakers />} />
            <Route path="/admin/notices" element={<AdminNotices />} />
            <Route path="/admin/maintenance" element={<AdminMaintenance />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
