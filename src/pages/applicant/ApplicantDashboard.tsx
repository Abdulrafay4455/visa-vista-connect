import { motion } from 'framer-motion';
import { 
  FileText, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight,
  Plus,
  Bell,
} from 'lucide-react';

import { ApplicantLayout } from '@/components/layouts/ApplicantLayout';
import { StatsCard } from '@/components/shared/StatsCard';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { ApplicationTimeline } from '@/components/shared/ApplicationTimeline';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';

// Mock data
const recentApplications = [
  {
    id: '1',
    country: 'United States',
    flag: '🇺🇸',
    visaType: 'Tourist',
    status: 'under_review' as const,
    submittedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    country: 'United Kingdom',
    flag: '🇬🇧',
    visaType: 'Business',
    status: 'sent_to_embassy' as const,
    submittedAt: new Date('2024-01-10'),
  },
];

const notifications = [
  {
    id: '1',
    title: 'Document Approved',
    message: 'Your passport copy has been verified',
    type: 'success' as const,
    time: '2 hours ago',
  },
  {
    id: '2',
    title: 'Additional Document Required',
    message: 'Please upload your bank statement',
    type: 'warning' as const,
    time: '1 day ago',
  },
];

export function ApplicantDashboard() {
  const { user } = useAuth();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <ApplicantLayout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold">
              Welcome back, <span className="text-accent">{user?.name?.split(' ')[0]}</span>
            </h1>
            <p className="text-muted-foreground mt-1">
              Track your visa applications and manage documents
            </p>
          </div>
          <Button asChild variant="hero" size="lg">
            <Link to="/applicant/apply">
              <Plus size={18} />
              New Application
            </Link>
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Applications"
            value={3}
            icon={FileText}
            variant="primary"
          />
          <StatsCard
            title="In Progress"
            value={2}
            icon={Clock}
            variant="warning"
          />
          <StatsCard
            title="Approved"
            value={1}
            icon={CheckCircle2}
            variant="success"
          />
          <StatsCard
            title="Action Required"
            value={1}
            icon={AlertCircle}
            variant="info"
          />
        </motion.div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Applications */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Applications</CardTitle>
                  <CardDescription>Your latest visa applications</CardDescription>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/applicant/tracking">
                    View all <ArrowRight size={16} />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentApplications.map((app) => (
                  <div
                    key={app.id}
                    className="p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{app.flag}</span>
                        <div>
                          <h4 className="font-semibold">{app.country}</h4>
                          <p className="text-sm text-muted-foreground">{app.visaType} Visa</p>
                        </div>
                      </div>
                      <StatusBadge status={app.status} />
                    </div>
                    <ApplicationTimeline currentStatus={app.status} />
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Notifications */}
          <motion.div variants={itemVariants}>
            <Card className="h-full">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Bell size={18} />
                    Notifications
                  </CardTitle>
                  <CardDescription>Recent updates</CardDescription>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/applicant/notifications">
                    View all
                  </Link>
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className="p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        notif.type === 'success' ? 'bg-success' :
                        notif.type === 'warning' ? 'bg-warning' : 'bg-info'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{notif.title}</p>
                        <p className="text-xs text-muted-foreground truncate">{notif.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">{notif.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks at your fingertips</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Upload Documents', icon: FileText, path: '/applicant/documents' },
                  { label: 'Track Status', icon: Clock, path: '/applicant/tracking' },
                  { label: 'Contact Support', icon: Bell, path: '/applicant/support' },
                  { label: 'Edit Profile', icon: CheckCircle2, path: '/applicant/profile' },
                ].map((action) => (
                  <Link
                    key={action.label}
                    to={action.path}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-all hover:scale-[1.02]"
                  >
                    <action.icon className="w-6 h-6 text-accent" />
                    <span className="text-sm font-medium text-center">{action.label}</span>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </ApplicantLayout>
  );
}
