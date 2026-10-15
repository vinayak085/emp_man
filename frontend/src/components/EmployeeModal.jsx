import React, { useState, useEffect } from 'react';
import { X, User, Mail, Briefcase, AlertCircle, Loader2 } from 'lucide-react';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function EmployeeModal({ isOpen, onClose, onSubmit, employee, isSubmitting, serverError }) {
  const isEditing = Boolean(employee);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    designation: '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Sync form when editing employee changes or modal opens
  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name || '',
        email: employee.email || '',
        designation: employee.designation || '',
      });
    } else {
      setFormData({
        name: '',
        email: '',
        designation: '',
      });
    }
    setErrors({});
    setTouched({});
  }, [employee, isOpen]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !isSubmitting) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen) return null;

  const validateField = (field, value) => {
    let error = '';
    const val = value.trim();

    if (field === 'name') {
      if (!val) error = 'Full name is required';
      else if (val.length < 2) error = 'Name must be at least 2 characters';
      else if (val.length > 100) error = 'Name cannot exceed 100 characters';
    }

    if (field === 'email') {
      if (!val) error = 'Email address is required';
      else if (!EMAIL_REGEX.test(val)) error = 'Please enter a valid email (e.g., name@example.com)';
    }

    if (field === 'designation') {
      if (!val) error = 'Job designation is required';
      else if (val.length < 2) error = 'Designation must be at least 2 characters';
      else if (val.length > 100) error = 'Designation cannot exceed 100 characters';
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const err = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: err }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const err = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: err }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate all fields
    const newErrors = {
      name: validateField('name', formData.name),
      email: validateField('email', formData.email),
      designation: validateField('designation', formData.designation),
    };

    setErrors(newErrors);
    setTouched({ name: true, email: true, designation: true });

    if (newErrors.name || newErrors.email || newErrors.designation) {
      return;
    }

    onSubmit({
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      designation: formData.designation.trim(),
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) onClose();
      }}
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden transform transition-all">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {isEditing ? 'Edit Employee Details' : 'Add New Employee'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {isEditing
                ? 'Update employee profile and company role information'
                : 'Fill in the information below to register a new employee record'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition disabled:opacity-50"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Server Error Alert */}
        {serverError && (
          <div className="mx-6 mt-4 p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3 text-rose-800 text-sm">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-semibold block mb-0.5">Submission Error</span>
              <span>{serverError}</span>
            </div>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} noValidate className="p-6 space-y-4">
          {/* Full Name */}
          <div>
            <label htmlFor="emp_name" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Full Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                id="emp_name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="e.g. Jane Doe"
                disabled={isSubmitting}
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm transition focus:outline-none focus:ring-2 disabled:bg-slate-50 disabled:cursor-not-allowed ${
                  errors.name && touched.name
                    ? 'border-rose-300 focus:ring-rose-500 bg-rose-50/30'
                    : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'
                }`}
              />
            </div>
            {errors.name && touched.name && (
              <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.name}
              </p>
            )}
          </div>

          {/* Email Address */}
          <div>
            <label htmlFor="emp_email" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Email Address <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="emp_email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="e.g. jane.doe@company.com"
                disabled={isSubmitting}
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm transition focus:outline-none focus:ring-2 disabled:bg-slate-50 disabled:cursor-not-allowed ${
                  errors.email && touched.email
                    ? 'border-rose-300 focus:ring-rose-500 bg-rose-50/30'
                    : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'
                }`}
              />
            </div>
            {errors.email && touched.email && (
              <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.email}
              </p>
            )}
          </div>

          {/* Designation */}
          <div>
            <label htmlFor="emp_designation" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Designation / Role <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Briefcase className="w-4 h-4" />
              </div>
              <input
                id="emp_designation"
                name="designation"
                type="text"
                value={formData.designation}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="e.g. Senior Software Engineer"
                disabled={isSubmitting}
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm transition focus:outline-none focus:ring-2 disabled:bg-slate-50 disabled:cursor-not-allowed ${
                  errors.designation && touched.designation
                    ? 'border-rose-300 focus:ring-rose-500 bg-rose-50/30'
                    : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'
                }`}
              />
            </div>
            {errors.designation && touched.designation && (
              <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.designation}
              </p>
            )}
          </div>

          {/* Footer Actions */}
          <div className="pt-4 mt-6 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-md shadow-blue-500/25 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{isEditing ? 'Save Changes' : 'Create Employee'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
