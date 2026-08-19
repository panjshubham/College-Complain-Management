import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, Button, Input } from '../components/UI';
import { User, Mail, Phone, Building, Hash, Save, CheckCircle, Loader2 } from 'lucide-react';

export default function ProfilePage() {
  const { user, updateUser, getInitials } = useAuth();

  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    email: user?.email || '',
    student_roll: user?.student_roll || '',
    department: user?.department || '',
    phone: user?.phone || '',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMsg(false);

    // Mock PATCH /api/users/me
    await new Promise((resolve) => setTimeout(resolve, 800));

    updateUser({
      full_name: formData.full_name,
      student_roll: formData.student_roll,
      department: formData.department,
      phone: formData.phone,
    });

    setIsSaving(false);
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-primary">User Profile</h1>
        <p className="text-secondary mt-1">Manage your account information and contact details.</p>
      </div>

      <Card className="flex flex-col sm:flex-row items-center gap-6 p-6">
        <div className="w-20 h-20 rounded-full bg-tertiary text-white flex items-center justify-center text-2xl font-bold shadow-md">
          {getInitials(user?.full_name)}
        </div>
        <div className="text-center sm:text-left">
          <h2 className="text-xl font-bold text-on-surface">{user?.full_name}</h2>
          <p className="text-sm text-secondary">{user?.email}</p>
          <div className="inline-block mt-2 px-3 py-1 bg-primary-container text-primary rounded-full text-xs font-semibold uppercase tracking-wider">
            {user?.role === 'admin' ? 'Administrator' : 'Student'}
          </div>
        </div>
      </Card>

      <Card>
        {successMsg && (
          <div className="p-3 mb-6 bg-status-resolved-bg text-status-resolved-text rounded-md text-sm font-medium border border-green-200 flex items-center gap-2">
            <CheckCircle size={18} />
            <span>Profile updated successfully!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-1">
              <Input
                id="full_name"
                label="Full Name"
                value={formData.full_name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-on-surface flex items-center gap-1.5">
                <Mail size={16} className="text-secondary" />
                Email Address (Read-only)
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                disabled
                className="w-full border border-outline-variant rounded px-3 py-2 text-secondary bg-surface-container-low cursor-not-allowed"
              />
            </div>

            <div className="space-y-1">
              <Input
                id="student_roll"
                label="Roll Number / ID"
                value={formData.student_roll}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="department" className="text-sm font-semibold text-on-surface flex items-center gap-1.5">
                <Building size={16} className="text-secondary" />
                Department
              </label>
              <select
                id="department"
                value={formData.department}
                onChange={handleInputChange}
                className="w-full border border-outline rounded px-3 py-2 text-on-surface bg-transparent focus:outline-none focus:ring-2 focus:ring-tertiary"
              >
                <option value="Computer Science">Computer Science</option>
                <option value="Electrical Engineering">Electrical Engineering</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
                <option value="Civil Engineering">Civil Engineering</option>
                <option value="Business Administration">Business Administration</option>
              </select>
            </div>

            <div className="space-y-1 sm:col-span-2">
              <Input
                id="phone"
                label="Phone Number"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+1 234 567 8900"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-outline-variant flex justify-end">
            <Button type="submit" disabled={isSaving} className="min-w-[140px]">
              {isSaving ? (
                <>
                  <Loader2 size={18} className="animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} className="mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
