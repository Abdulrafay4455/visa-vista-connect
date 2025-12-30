import { motion } from 'framer-motion';
import { Bell, CheckCircle, AlertCircle, Info, Check } from 'lucide-react';

import { ApplicantLayout } from '@/components/layouts/ApplicantLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const notifications = [
  {
    id: '1',
    title: 'Document Approved',
    message: 'Your passport copy has been verified and approved by our team.',
    type: 'success',
    time: '2 hours ago',
    read: false,
  },
  {
    id: '2',
    title: 'Additional Document Required',
    message: 'Please upload your bank statement for the last 3 months to proceed with your application.',
    type: 'warning',
    time: '1 day ago',
    read: false,
  },
  {
    id: '3',
    title: 'Application Sent to Embassy',
    message: 'Your UK Business Visa application has been forwarded to the British Embassy.',
    type: 'info',
    time: '2 days ago',
    read: true,
  },
  {
    id: '4',
    title: 'Visa Approved!',
    message: 'Congratulations! Your Canada Student Visa has been approved. You can collect your passport.',
    type: 'success',
    time: '5 days ago',
    read: true,
  },
  {
    id: '5',
    title: 'Interview Scheduled',
    message: 'Your visa interview has been scheduled for January 25, 2024 at 10:00 AM.',
    type: 'info',
    time: '1 week ago',
    read: true,
  },
];

export function NotificationsPage() {
  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="text-success" size={20} />;
      case 'warning':
        return <AlertCircle className="text-warning" size={20} />;
      default:
        return <Info className="text-info" size={20} />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-success/10';
      case 'warning':
        return 'bg-warning/10';
      default:
        return 'bg-info/10';
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <ApplicantLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold flex items-center gap-3">
              Notifications
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 text-sm bg-accent text-accent-foreground rounded-full">
                  {unreadCount} new
                </span>
              )}
            </h1>
            <p className="text-muted-foreground mt-1">Stay updated on your visa applications</p>
          </div>
          <Button variant="outline">
            <Check size={16} />
            Mark all as read
          </Button>
        </div>

        {/* Notifications List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell size={18} />
              All Notifications
            </CardTitle>
            <CardDescription>Click on a notification to view details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-4 rounded-xl transition-colors cursor-pointer ${
                  notif.read ? 'bg-secondary/30' : 'bg-secondary/70'
                } hover:bg-secondary`}
              >
                <div className="flex gap-4">
                  <div className={`w-10 h-10 rounded-lg ${getBgColor(notif.type)} flex items-center justify-center flex-shrink-0`}>
                    {getIcon(notif.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className={`font-medium ${!notif.read && 'text-foreground'}`}>
                        {notif.title}
                      </h4>
                      {!notif.read && (
                        <div className="w-2 h-2 rounded-full bg-accent flex-shrink-0 mt-2" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{notif.message}</p>
                    <p className="text-xs text-muted-foreground mt-2">{notif.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    </ApplicantLayout>
  );
}
