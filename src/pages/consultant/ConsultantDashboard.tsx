import { motion } from 'framer-motion';
import { 
  Users, 
  Clock, 
  CheckCircle2, 
  XCircle,
  FileSearch,
  Globe,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react';

import { ConsultantLayout } from '@/components/layouts/ConsultantLayout';
import { StatsCard } from '@/components/shared/StatsCard';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

// Mock data
const recentApplications = [
  {
    id: '1',
    applicantName: 'John Smith',
    country: 'United States',
    flag: '🇺🇸',
    visaType: 'Tourist',
    status: 'UNDER_REVIEW' as const,
    submittedAt: '2024-01-15',
    priority: 'high',
  },
  {
    id: '2',
    applicantName: 'Sarah Johnson',
    country: 'United Kingdom',
    flag: '🇬🇧',
    visaType: 'Business',
    status: 'SUBMITTED' as const,
    submittedAt: '2024-01-14',
    priority: 'normal',
  },
  {
    id: '3',
    applicantName: 'Michael Brown',
    country: 'Canada',
    flag: '🇨🇦',
    visaType: 'Student',
    status: 'SENT_TO_EMBASSY' as const,
    submittedAt: '2024-01-12',
    priority: 'normal',
  },
  {
    id: '4',
    applicantName: 'Emily Davis',
    country: 'Germany',
    flag: '🇩🇪',
    visaType: 'Work',
    status: 'DOCUMENTS_REQUESTED' as const,
    submittedAt: '2024-01-10',
    priority: 'urgent',
  },
];

const urgentActions = [
  { id: '1', message: '3 applications pending document review', type: 'warning' },
  { id: '2', message: '2 applicants waiting for response > 48h', type: 'error' },
  { id: '3', message: '5 applications ready for embassy submission', type: 'info' },
];

export function ConsultantDashboard() {
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
    <ConsultantLayout>
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
              Good morning, <span className="text-accent">{user?.firstName}</span>
            </h1>
            <p className="text-muted-foreground mt-1">
              Here's what needs your attention today
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" asChild>
              <Link to="/consultant/reports">
                <TrendingUp size={18} />
                Reports
              </Link>
            </Button>
            <Button variant="hero" asChild>
              <Link to="/consultant/applications">
                <FileSearch size={18} />
                Review Applications
              </Link>
            </Button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Applications"
            value={156}
            icon={Users}
            variant="primary"
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard
            title="Pending Review"
            value={24}
            icon={Clock}
            variant="warning"
          />
          <StatsCard
            title="Approved This Month"
            value={38}
            icon={CheckCircle2}
            variant="success"
            trend={{ value: 8, isPositive: true }}
          />
          <StatsCard
            title="At Embassy"
            value={15}
            icon={Globe}
            variant="info"
          />
        </motion.div>

        {/* Urgent Actions */}
        <motion.div variants={itemVariants}>
          <Card className="border-warning/30 bg-warning/5">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-warning">
                <AlertTriangle size={20} />
                Requires Attention
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {urgentActions.map((action) => (
                  <div
                    key={action.id}
                    className={`p-3 rounded-lg border ${
                      action.type === 'error' ? 'bg-destructive/5 border-destructive/30' :
                      action.type === 'warning' ? 'bg-warning/5 border-warning/30' :
                      'bg-info/5 border-info/30'
                    }`}
                  >
                    <p className="text-sm font-medium">{action.message}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Recent Applications Table */}
          <motion.div variants={itemVariants} className="xl:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Applications</CardTitle>
                  <CardDescription>Latest submissions requiring action</CardDescription>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/consultant/applications">View all</Link>
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Applicant</TableHead>
                      <TableHead>Destination</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentApplications.map((app) => (
                      <TableRow key={app.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-sm font-medium text-primary">
                                {app.applicantName.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium">{app.applicantName}</p>
                              <p className="text-xs text-muted-foreground">{app.submittedAt}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span>{app.flag}</span>
                            <span>{app.country}</span>
                          </div>
                        </TableCell>
                        <TableCell>{app.visaType}</TableCell>
                        <TableCell>
                          <StatusBadge status={app.status} size="sm" />
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" asChild>
                            <Link to={`/consultant/review/${app.id}`}>Review</Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Stats / Actions */}
          <motion.div variants={itemVariants} className="space-y-6">
            {/* Embassy Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe size={18} />
                  Embassy Status
                </CardTitle>
                <CardDescription>Applications at embassies</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { country: '🇺🇸 USA', count: 5, status: 'Processing' },
                  { country: '🇬🇧 UK', count: 3, status: 'Decision pending' },
                  { country: '🇨🇦 Canada', count: 4, status: 'Interview scheduled' },
                  { country: '🇩🇪 Germany', count: 3, status: 'Processing' },
                ].map((embassy) => (
                  <div
                    key={embassy.country}
                    className="flex items-center justify-between p-3 rounded-lg bg-secondary/50"
                  >
                    <div>
                      <p className="font-medium text-sm">{embassy.country}</p>
                      <p className="text-xs text-muted-foreground">{embassy.status}</p>
                    </div>
                    <span className="text-lg font-bold text-primary">{embassy.count}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Performance */}
            <Card>
              <CardHeader>
                <CardTitle>This Month</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Approval Rate</span>
                  <span className="text-2xl font-bold text-success">92%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Avg. Processing</span>
                  <span className="text-2xl font-bold">4.2 days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Client Satisfaction</span>
                  <span className="text-2xl font-bold text-accent">4.8/5</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </ConsultantLayout>
  );
}
