import { cn } from '@/lib/utils';
import { ApplicationStatus } from '@/types';
import { 
  Clock, 
  FileSearch, 
  Send, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  FileText
} from 'lucide-react';

interface StatusBadgeProps {
  status: ApplicationStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

const statusConfig: Record<ApplicationStatus, {
  label: string;
  className: string;
  icon: React.ElementType;
}> = {
  DRAFT: {
    label: 'Draft',
    className: 'bg-muted text-muted-foreground',
    icon: FileText,
  },
  SUBMITTED: {
    label: 'Submitted',
    className: 'bg-info/10 text-info',
    icon: Clock,
  },
  UNDER_REVIEW: {
    label: 'Under Review',
    className: 'bg-warning/10 text-warning',
    icon: FileSearch,
  },
  DOCUMENTS_REQUESTED: {
    label: 'Documents Requested',
    className: 'bg-warning/10 text-warning',
    icon: AlertCircle,
  },
  SENT_TO_EMBASSY: {
    label: 'Sent to Embassy',
    className: 'bg-info/10 text-info',
    icon: Send,
  },
  APPROVED: {
    label: 'Approved',
    className: 'bg-success/10 text-success',
    icon: CheckCircle2,
  },
  REJECTED: {
    label: 'Rejected',
    className: 'bg-destructive/10 text-destructive',
    icon: XCircle,
  },
};

export function StatusBadge({ status, size = 'md', showIcon = true }: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  const sizes = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-2.5 py-1 text-sm gap-1.5',
    lg: 'px-3 py-1.5 text-base gap-2',
  };

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16,
  };

  return (
    <span className={cn(
      'inline-flex items-center rounded-full font-medium',
      sizes[size],
      config.className
    )}>
      {showIcon && <Icon size={iconSizes[size]} />}
      {config.label}
    </span>
  );
}
