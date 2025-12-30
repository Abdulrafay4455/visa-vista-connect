import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, Image, CheckCircle, XCircle, Clock, Trash2, Eye } from 'lucide-react';

import { ApplicantLayout } from '@/components/layouts/ApplicantLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const documents = [
  {
    id: '1',
    name: 'Passport Copy',
    type: 'passport',
    status: 'approved',
    uploadedAt: '2024-01-15',
    required: true,
  },
  {
    id: '2',
    name: 'Photograph',
    type: 'photo',
    status: 'approved',
    uploadedAt: '2024-01-15',
    required: true,
  },
  {
    id: '3',
    name: 'Bank Statement',
    type: 'financial',
    status: 'pending',
    uploadedAt: '2024-01-16',
    required: true,
  },
  {
    id: '4',
    name: 'Employment Letter',
    type: 'employment',
    status: 'rejected',
    uploadedAt: '2024-01-14',
    feedback: 'Document is not on company letterhead',
    required: false,
  },
];

const requiredDocuments = [
  { type: 'passport', label: 'Passport Copy', description: 'Clear scan of passport bio page' },
  { type: 'photo', label: 'Photograph', description: 'Recent passport-size photo (white background)' },
  { type: 'financial', label: 'Bank Statement', description: 'Last 3 months bank statements' },
  { type: 'employment', label: 'Employment Proof', description: 'Letter from employer or enrollment certificate' },
];

export function DocumentsPage() {
  const [dragActive, setDragActive] = useState(false);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="text-success" size={18} />;
      case 'rejected':
        return <XCircle className="text-destructive" size={18} />;
      default:
        return <Clock className="text-warning" size={18} />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Approved';
      case 'rejected':
        return 'Rejected';
      default:
        return 'Pending Review';
    }
  };

  return (
    <ApplicantLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Header */}
        <div>
          <h1 className="text-3xl font-display font-bold">Documents</h1>
          <p className="text-muted-foreground mt-1">Upload and manage your visa application documents</p>
        </div>

        {/* Upload Area */}
        <Card>
          <CardHeader>
            <CardTitle>Upload Documents</CardTitle>
            <CardDescription>Drag and drop files or click to browse</CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                dragActive ? 'border-accent bg-accent/5' : 'border-border hover:border-accent/50'
              }`}
              onDragEnter={() => setDragActive(true)}
              onDragLeave={() => setDragActive(false)}
              onDrop={() => setDragActive(false)}
            >
              <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="font-medium mb-1">Drop files here or click to upload</p>
              <p className="text-sm text-muted-foreground mb-4">
                Supported formats: PDF, JPG, PNG (max 10MB)
              </p>
              <Button variant="outline">Browse Files</Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Required Documents */}
          <Card>
            <CardHeader>
              <CardTitle>Required Documents</CardTitle>
              <CardDescription>Documents needed for your application</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {requiredDocuments.map((doc) => {
                const uploaded = documents.find((d) => d.type === doc.type);
                return (
                  <div
                    key={doc.type}
                    className="flex items-center justify-between p-4 rounded-xl bg-secondary/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        uploaded ? 'bg-success/10' : 'bg-muted'
                      }`}>
                        {uploaded ? (
                          <CheckCircle className="text-success" size={20} />
                        ) : (
                          <FileText className="text-muted-foreground" size={20} />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{doc.label}</p>
                        <p className="text-xs text-muted-foreground">{doc.description}</p>
                      </div>
                    </div>
                    {!uploaded && (
                      <Button variant="outline" size="sm">Upload</Button>
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Uploaded Documents */}
          <Card>
            <CardHeader>
              <CardTitle>Uploaded Documents</CardTitle>
              <CardDescription>Your submitted documents and their status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="p-4 rounded-xl bg-secondary/50"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                        <Image className="text-accent" size={20} />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{doc.name}</p>
                        <p className="text-xs text-muted-foreground">Uploaded {doc.uploadedAt}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(doc.status)}
                      <span className={`text-xs font-medium ${
                        doc.status === 'approved' ? 'text-success' :
                        doc.status === 'rejected' ? 'text-destructive' : 'text-warning'
                      }`}>
                        {getStatusLabel(doc.status)}
                      </span>
                    </div>
                  </div>
                  {doc.feedback && (
                    <p className="text-xs text-destructive bg-destructive/10 p-2 rounded-lg mt-2">
                      {doc.feedback}
                    </p>
                  )}
                  <div className="flex gap-2 mt-3">
                    <Button variant="ghost" size="sm">
                      <Eye size={14} />
                      View
                    </Button>
                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                      <Trash2 size={14} />
                      Delete
                    </Button>
                    {doc.status === 'rejected' && (
                      <Button variant="outline" size="sm">
                        Re-upload
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </ApplicantLayout>
  );
}
