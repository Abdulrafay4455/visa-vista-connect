import { motion } from 'framer-motion';
import { Search, Filter } from 'lucide-react';
import { ConsultantLayout } from '@/components/layouts/ConsultantLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Link } from 'react-router-dom';
import { ApplicationStatus } from '@/types';

const applications = [
  { id: '1', name: 'John Smith', country: '🇺🇸 USA', type: 'Tourist', status: 'under_review' as ApplicationStatus, date: '2024-01-15' },
  { id: '2', name: 'Sarah Johnson', country: '🇬🇧 UK', type: 'Business', status: 'submitted' as ApplicationStatus, date: '2024-01-14' },
  { id: '3', name: 'Michael Brown', country: '🇨🇦 Canada', type: 'Student', status: 'sent_to_embassy' as ApplicationStatus, date: '2024-01-12' },
  { id: '4', name: 'Emily Davis', country: '🇩🇪 Germany', type: 'Work', status: 'approved' as ApplicationStatus, date: '2024-01-10' },
];

export function ApplicationsPage() {
  return (
    <ConsultantLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-display font-bold">Applications</h1>
          <div className="flex gap-3">
            <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} /><Input placeholder="Search..." className="pl-10 w-64" /></div>
            <Button variant="outline"><Filter size={16} />Filter</Button>
          </div>
        </div>
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader><TableRow><TableHead>Applicant</TableHead><TableHead>Destination</TableHead><TableHead>Type</TableHead><TableHead>Status</TableHead><TableHead>Date</TableHead><TableHead>Action</TableHead></TableRow></TableHeader>
              <TableBody>
                {applications.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell className="font-medium">{app.name}</TableCell>
                    <TableCell>{app.country}</TableCell>
                    <TableCell>{app.type}</TableCell>
                    <TableCell><StatusBadge status={app.status} size="sm" /></TableCell>
                    <TableCell>{app.date}</TableCell>
                    <TableCell><Button variant="ghost" size="sm" asChild><Link to={`/consultant/review/${app.id}`}>Review</Link></Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </ConsultantLayout>
  );
}
