import { motion } from 'framer-motion';
import { ConsultantLayout } from '@/components/layouts/ConsultantLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { CheckCircle, XCircle, FileText } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

export function ReviewPage() {
  const { id } = useParams();
  const [application, setApplication] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch application details
  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const result = await axios.get(`http://localhost:8081/applications/${id}`);
        setApplication(result.data);
      } catch (error) {
        console.error('Error fetching application:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchApplication();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!id || !application) return <p>No application found</p>;

  // ================= Handlers (mapped to backend endpoints) =================

  // Close Application → POST /applications/{id}/close
  const handleClose = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8081/applications/${id}/close`
      );
      setApplication(response.data);
      console.log('Application closed:', response.data);
    } catch (error) {
      console.error('Error closing application:', error);
    }
  };

  // Request More Documents → POST /applications/{id}/verify-documents
  const handleRequestDocuments = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8081/applications/${id}/verify-documents`
      );
      setApplication(response.data);
      console.log('Moved to document verification:', response.data);
    } catch (error) {
      console.error('Error requesting documents:', error);
    }
  };

  // Reject Application → also POST /applications/{id}/close
  const handleReject = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8081/applications/${id}/close`
      );
      setApplication(response.data);
      console.log('Application rejected/closed:', response.data);
    } catch (error) {
      console.error('Error rejecting application:', error);
    }
  };

  // Optional: disable buttons if application already CLOSED
  const isClosed = application.status === 'CLOSED';

  // ================= Render =================
  return (
    <ConsultantLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <h1 className="text-3xl font-display font-bold">Application Review</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Applicant Details */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Applicant Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Application ID</p>
                  <p className="font-medium">{application.applicationId}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Visa Type</p>
                  <p className="font-medium">{application.visaType}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <StatusBadge status={application.status} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Documents */}
          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {['Passport', 'Photo', 'Bank Statement'].map((doc) => (
                <div
                  key={doc}
                  className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <FileText size={16} />
                    <span className="text-sm">{doc}</span>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-success"
                    >
                      <CheckCircle size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                    >
                      <XCircle size={16} />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            variant="hero"
            onClick={handleClose}
            disabled={isClosed}
          >
            Close Application
          </Button>

          <Button
            variant="outline"
            onClick={handleRequestDocuments}
            disabled={isClosed}
          >
            Request More Documents
          </Button>

          <Button
            variant="destructive"
            onClick={handleReject}
            disabled={isClosed}
          >
            Reject Application
          </Button>
        </div>
      </motion.div>
    </ConsultantLayout>
  );
}
