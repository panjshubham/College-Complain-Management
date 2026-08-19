import React from 'react';
import { cn } from '../utils/cn'; // We'll create this utility

export const Button = ({ children, variant = 'primary', className, ...props }) => {
  const baseStyle = "inline-flex items-center justify-center rounded transition-colors font-medium text-sm px-4 py-2";
  const variants = {
    primary: "bg-primary text-white hover:bg-primary-container hover:text-on-primary-container",
    secondary: "bg-surface text-secondary hover:bg-surface-variant border border-outline",
  };

  return (
    <button className={cn(baseStyle, variants[variant], className)} {...props}>
      {children}
    </button>
  );
};

export const Input = ({ label, id, className, ...props }) => {
  return (
    <div className="flex flex-col space-y-1">
      {label && <label htmlFor={id} className="text-sm font-semibold text-on-surface">{label}</label>}
      <input
        id={id}
        className={cn(
          "border border-outline rounded px-3 py-2 text-on-surface bg-transparent",
          "focus:outline-none focus:ring-2 focus:ring-tertiary focus:border-tertiary",
          className
        )}
        {...props}
      />
    </div>
  );
};

export const StatusChip = ({ status }) => {
  const normalizedStatus = status.toLowerCase();
  
  const statusStyles = {
    submitted: "bg-status-submitted-bg text-status-submitted-text",
    review: "bg-status-review-bg text-status-review-text",
    assigned: "bg-status-assigned-bg text-status-assigned-text",
    progress: "bg-status-progress-bg text-status-progress-text",
    resolved: "bg-status-resolved-bg text-status-resolved-text",
  };

  const style = statusStyles[normalizedStatus] || statusStyles.submitted;

  return (
    <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide", style)}>
      {status}
    </span>
  );
};

export const Card = ({ children, className }) => {
  return (
    <div className={cn("bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-sm p-6", className)}>
      {children}
    </div>
  );
};
