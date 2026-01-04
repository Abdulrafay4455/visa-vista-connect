import axios from 'axios';
import { motion } from 'framer-motion';
import { Eye, Calendar, MapPin } from 'lucide-react';

import { ApplicantLayout } from '@/components/layouts/ApplicantLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { ApplicationTimeline } from '@/components/shared/ApplicationTimeline';
import { ApplicationStatus } from '@/types';
import { useEffect, useState } from 'react';

// const applications = [
//   {
//     id: '1',
//     country: 'United States',
//     flag: '🇺🇸',
//     visaType: 'Tourist',
//     status: 'UNDER_REVIEW' as ApplicationStatus,
//     submittedAt: '2024-01-15',
//     travelDate: '2024-03-15',
//     lastUpdate: '2024-01-18',
//   },
//   {
//     id: '2',
//     country: 'United Kingdom',
//     flag: '🇬🇧',
//     visaType: 'Business',
//     status: 'SENT_TO_EMBASSY' as ApplicationStatus,
//     submittedAt: '2024-01-10',
//     travelDate: '2024-02-20',
//     lastUpdate: '2024-01-17',
//   },
//   {
//     id: '3',
//     country: 'Canada',
//     flag: '🇨🇦',
//     visaType: 'Student',
//     status: 'APPROVED' as ApplicationStatus,
//     submittedAt: '2023-12-01',
//     travelDate: '2024-01-10',
//     lastUpdate: '2024-01-05',
//   },
// ];

export function TrackingPage() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    if (!user) return;
    const AllApplications = async () => {
      const result = await axios.get(`http://localhost:8081/applications/applicant/${user.applicantId}`)
      const response = result.data;
      setApplications(response);
    } 
    AllApplications();
  }, [user])

  return (
    <ApplicantLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Header */}
        <div>
          <h1 className="text-3xl font-display font-bold">Track Applications</h1>
          <p className="text-muted-foreground mt-1">Monitor the status of your visa applications</p>
        </div>

        {/* Applications List */}
        <div className="space-y-6">
          {applications.map((app) => (
            <Card key={app.id}>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-4">
                    {/* <span className="text-5xl">{app.flag}</span> */}
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {app.country}
                        <StatusBadge status={app.status} size="lg" />
                      </CardTitle>
                      <CardDescription>
                        {app.visaType} Visa • Submitted {app.createdAt}
                      </CardDescription>
                    </div>
                  </div>
                  <Button variant="outline">
                    <Eye size={16} />
                    View Details
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Timeline */}
                <ApplicationTimeline currentStatus={app.status} />

                {/* Quick Info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border">
                  <div className="flex items-center gap-2">
                    <Calendar className="text-muted-foreground" size={16} />
                    <div>
                      {/* <p className="text-xs text-muted-foreground">Travel Date</p>
                      <p className="text-sm font-medium">{app.travelDate}</p> */}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="text-muted-foreground" size={16} />
                    <div>
                      {/* <p className="text-xs text-muted-foreground">Destination</p>
                      <p className="text-sm font-medium">{app.country}</p> */}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Application ID</p>
                    <p className="text-sm font-medium">ID-{app.applicationId}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Last Update</p>
                    <p className="text-sm font-medium">{app.updatedAt}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>
    </ApplicantLayout>
  );
}
