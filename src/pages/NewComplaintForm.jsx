import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Card, Button, Input } from '../components/UI';

export default function NewComplaintForm() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    department: '',
    location: '',
    description: '',
    evidence: null
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    // Mock GET /api/categories
    setTimeout(() => {
      setCategories(['Classroom', 'Electrical', 'Wi-Fi', 'Hostel', 'Library', 'Canteen', 'Cleaning', 'Water', 'Transport']);
      setLoadingCategories(false);
    }, 500);
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    // Clear error when user types
    if (errors[id]) setErrors(prev => ({ ...prev, [id]: null }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, evidence: file }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.department.trim()) newErrors.department = 'Department is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    else if (formData.description.length < 20) newErrors.description = 'Description must be at least 20 characters';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsSubmitting(true);
    
    // Mock POST /api/complaints
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <Card className="max-w-xl mx-auto text-center py-16">
        <div className="flex justify-center mb-6">
          <CheckCircle2 size={64} className="text-status-resolved-text" />
        </div>
        <h2 className="text-2xl font-bold text-primary mb-2">Complaint Submitted</h2>
        <p className="text-secondary mb-8">Your complaint has been successfully recorded. You will be notified of any updates.</p>
        <div className="flex justify-center gap-4">
          <Button variant="secondary" onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
          <Button onClick={() => navigate('/tracking')}>
            Track Status
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <button 
        onClick={() => navigate('/dashboard')} 
        className="flex items-center text-sm font-medium text-secondary hover:text-primary transition-colors mb-6"
      >
        <ArrowLeft size={16} className="mr-1" />
        Back
      </button>

      <Card>
        <h1 className="text-2xl font-bold text-primary mb-2">New Complaint</h1>
        <p className="text-secondary mb-8">Please provide detailed information about the issue to help us resolve it quickly.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <Input 
              id="title" 
              label="Complaint Title" 
              placeholder="E.g., Broken projector in Room 302"
              value={formData.title}
              onChange={handleInputChange}
              className={errors.title ? "border-error focus:ring-error focus:border-error" : ""}
            />
            {errors.title && <p className="text-xs text-error mt-1">{errors.title}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col space-y-1">
              <label htmlFor="category" className="text-sm font-semibold text-on-surface">Category</label>
              <select 
                id="category"
                className={`border rounded px-3 py-2 text-on-surface bg-transparent focus:outline-none focus:ring-2 focus:ring-tertiary focus:border-tertiary ${errors.category ? "border-error focus:ring-error" : "border-outline"}`}
                value={formData.category}
                onChange={handleInputChange}
                disabled={loadingCategories}
              >
                <option value="">Select a category</option>
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              {errors.category && <p className="text-xs text-error">{errors.category}</p>}
            </div>
            
            <div className="space-y-1">
              <Input 
                id="department" 
                label="Department / Block" 
                placeholder="E.g., Computer Science Block"
                value={formData.department}
                onChange={handleInputChange}
                className={errors.department ? "border-error focus:ring-error" : ""}
              />
              {errors.department && <p className="text-xs text-error">{errors.department}</p>}
            </div>
          </div>

          <div className="space-y-1">
            <Input 
              id="location" 
              label="Exact Location" 
              placeholder="E.g., Third floor, near the elevator"
              value={formData.location}
              onChange={handleInputChange}
              className={errors.location ? "border-error focus:ring-error" : ""}
            />
            {errors.location && <p className="text-xs text-error">{errors.location}</p>}
          </div>

          <div className="flex flex-col space-y-1">
            <label htmlFor="description" className="text-sm font-semibold text-on-surface">Description</label>
            <textarea 
              id="description"
              rows={4}
              className={`border rounded px-3 py-2 text-on-surface bg-transparent focus:outline-none focus:ring-2 focus:ring-tertiary focus:border-tertiary resize-none ${errors.description ? "border-error focus:ring-error" : "border-outline"}`}
              placeholder="Describe the issue in detail..."
              value={formData.description}
              onChange={handleInputChange}
            />
            {errors.description && <p className="text-xs text-error">{errors.description}</p>}
          </div>

          <div className="flex flex-col space-y-1">
            <label className="text-sm font-semibold text-on-surface">Evidence (Optional)</label>
            <div className="border-2 border-dashed border-outline-variant rounded-lg p-6 flex flex-col items-center justify-center bg-surface-container-low hover:bg-surface-variant transition-colors cursor-pointer relative">
              <input 
                type="file" 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                accept="image/*"
                onChange={handleFileChange}
              />
              <UploadCloud size={32} className="text-secondary mb-2" />
              <p className="text-sm font-medium text-on-surface">
                {formData.evidence ? formData.evidence.name : "Click to upload an image"}
              </p>
              <p className="text-xs text-secondary mt-1">PNG, JPG up to 5MB</p>
            </div>
          </div>

          <div className="pt-4 border-t border-outline-variant flex justify-end gap-4">
            <Button variant="secondary" type="button" onClick={() => navigate('/dashboard')} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="min-w-[140px]">
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="animate-spin mr-2" />
                  Submitting...
                </>
              ) : 'Submit Complaint'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
