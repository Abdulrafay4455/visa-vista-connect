import { cn } from '@/lib/utils';
import { ApplicationStatus } from '@/types';
import { Check, Circle, Clock } from 'lucide-react';

interface TimelineStep {
  status: ApplicationStatus;
  label: string;
  date?: string;
}

interface ApplicationTimelineProps {
  currentStatus: ApplicationStatus;
  className?: string;
}

const timelineSteps: TimelineStep[] = [
  { status: 'SUBMITTED', label: 'Submitted' },
  { status: 'UNDER_REVIEW', label: 'Under Review' },
  { status: 'SENT_TO_EMBASSY', label: 'Sent to Embassy' },
  { status: 'APPROVED', label: 'Decision' },
];

const statusOrder: ApplicationStatus[] = [
  'DRAFT',
  'SUBMITTED',
  'UNDER_REVIEW',
  'DOCUMENTS_REQUESTED',
  'SENT_TO_EMBASSY',
  'APPROVED',
  'REJECTED',
];

export function ApplicationTimeline({ currentStatus, className }: ApplicationTimelineProps) {
  const currentIndex = statusOrder.indexOf(currentStatus);
  const isRejected = currentStatus === 'REJECTED';

  const getStepStatus = (stepStatus: ApplicationStatus) => {
    const stepIndex = statusOrder.indexOf(stepStatus);
    
    if (isRejected && stepStatus === 'APPROVED') {
      return 'rejected';
    }
    
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'pending';
  };

  return (
    <div className={cn('w-full', className)}>
      <div className="flex items-center justify-between relative">
        {/* Progress line */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-border" />
        <div 
          className={cn(
            'absolute top-5 left-0 h-0.5 transition-all duration-500',
            isRejected ? 'bg-destructive' : 'bg-success'
          )}
          style={{ 
            width: `${Math.min(((currentIndex) / (timelineSteps.length - 1)) * 100, 100)}%` 
          }}
        />

        {timelineSteps.map((step, index) => {
          const status = getStepStatus(step.status);
          
          return (
            <div key={step.status} className="flex flex-col items-center relative z-10">
              <div className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300',
                status === 'completed' && 'bg-success text-success-foreground',
                status === 'current' && 'bg-info text-info-foreground ring-4 ring-info/20',
                status === 'rejected' && 'bg-destructive text-destructive-foreground',
                status === 'pending' && 'bg-secondary text-muted-foreground'
              )}>
                {status === 'completed' ? (
                  <Check size={20} />
                ) : status === 'current' ? (
                  <Clock size={20} className="animate-pulse" />
                ) : status === 'rejected' ? (
                  <span className="text-lg font-bold">✕</span>
                ) : (
                  <Circle size={20} />
                )}
              </div>
              <span className={cn(
                'mt-2 text-sm font-medium text-center max-w-[80px]',
                status === 'current' && 'text-foreground',
                status === 'completed' && 'text-success',
                status === 'rejected' && 'text-destructive',
                status === 'pending' && 'text-muted-foreground'
              )}>
                {step.status === 'APPROVED' && isRejected ? 'Rejected' : step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
