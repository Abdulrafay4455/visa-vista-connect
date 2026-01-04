import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Upload, FileText, Image, CheckCircle, XCircle, Clock, Trash2, Eye
} from 'lucide-react';
import { ApplicantLayout } from '@/components/layouts/ApplicantLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

type Document = {
  id: number;
  type: string;
  label: string;
  description: string;
  url?: string;
  status?: 'PENDING' | 'APPROVED' | 'REJECTED';
  uploadedAt?: string;
};

export function DocumentsPage() {
  const cloudName = 'dci23acfu'; // replace with your Cloudinary cloud name
  const uploadPreset = 'mirinda'; // replace with your unsigned upload preset

  const [documents, setDocuments] = useState<Document[]>([
    { id: 1, type: 'passport', label: 'Passport Copy', description: 'Clear scan of passport bio page' },
    { id: 2, type: 'photo', label: 'Photograph', description: 'Recent passport-size photo (white background)' },
    { id: 3, type: 'financial', label: 'Bank Statement', description: 'Last 3 months bank statements' },
    { id: 4, type: 'employment', label: 'Employment Proof', description: 'Letter from employer or enrollment certificate' },
  ]);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadingDocId, setUploadingDocId] = useState<number | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = (docId: number) => {
    setUploadingDocId(docId);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setSelectedFile(e.target.files[0]);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, docId: number) => {
    e.preventDefault();
    setDragActive(false);
    if (!e.dataTransfer.files) return;
    setSelectedFile(e.dataTransfer.files[0]);
    setUploadingDocId(docId);
    handleUpload();
  };

  const handleUpload = async () => {
    if (!selectedFile || !uploadingDocId) return;

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('upload_preset', uploadPreset);

      const cloudRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
        method: 'POST',
        body: formData
      });

      const data = await cloudRes.json();
      const fileUrl = data.secure_url;

      // Update document state
      setDocuments(prev =>
        prev.map(doc =>
          doc.id === uploadingDocId
            ? { ...doc, url: fileUrl, status: 'PENDING', uploadedAt: new Date().toLocaleString() }
            : doc
        )
      );

      setSelectedFile(null);
      setUploadingDocId(null);
    } catch (err) {
      console.error('Upload failed:', err);
    }
  };

  const handleDelete = (docId: number) => {
    setDocuments(prev =>
      prev.map(doc =>
        doc.id === docId ? { ...doc, url: undefined, status: undefined, uploadedAt: undefined } : doc
      )
    );
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'APPROVED': return <CheckCircle className="text-success" size={18} />;
      case 'REJECTED': return <XCircle className="text-destructive" size={18} />;
      default: return <Clock className="text-warning" size={18} />;
    }
  };

  const getStatusLabel = (status?: string) => {
    switch (status) {
      case 'APPROVED': return 'Approved';
      case 'REJECTED': return 'Rejected';
      default: return 'Pending Review';
    }
  };

  return (
    <ApplicantLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
        <h1 className="text-3xl font-display font-bold">Documents</h1>
        <p className="text-muted-foreground mt-1">Upload and manage your visa application documents</p>

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
          onClick={(e) => (e.currentTarget.value = '')} // reset selected file
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Required Documents */}
          <Card>
            <CardHeader>
              <CardTitle>Required Documents</CardTitle>
              <CardDescription>Drag and drop or click to upload</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {documents.map((doc) => (
                <div
                  key={doc.type}
                  className="flex items-center justify-between p-4 rounded-xl bg-secondary/50"
                  onDragOver={(e) => e.preventDefault()}
                  onDragEnter={() => setDragActive(true)}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={(e) => handleDrop(e, doc.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${doc.url ? 'bg-success/10' : 'bg-muted'}`}>
                      {doc.url ? <CheckCircle className="text-success" size={20} /> : <FileText className="text-muted-foreground" size={20} />}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{doc.label}</p>
                      <p className="text-xs text-muted-foreground">{doc.description}</p>
                    </div>
                  </div>
                  {!doc.url && (
                    <Button variant="outline" size="sm" onClick={() => handleUploadClick(doc.id)}>Upload</Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Uploaded Documents */}
          <Card>
            <CardHeader>
              <CardTitle>Uploaded Documents</CardTitle>
              <CardDescription>Preview and manage your uploaded files</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {documents.filter(doc => doc.url).map((doc) => (
                <div key={doc.id} className="p-4 rounded-xl bg-secondary/50">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                        <Image className="text-accent" size={20} />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{doc.label}</p>
                        <p className="text-xs text-muted-foreground">Uploaded {doc.uploadedAt}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(doc.status)}
                      <span className={`text-xs font-medium ${
                        doc.status === 'APPROVED' ? 'text-success' :
                        doc.status === 'REJECTED' ? 'text-destructive' : 'text-warning'
                      }`}>
                        {getStatusLabel(doc.status)}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <a href={doc.url} target="_blank" rel="noopener noreferrer">
                      <Button variant="ghost" size="sm"><Eye size={14} />View</Button>
                    </a>
                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => handleDelete(doc.id)}>
                      <Trash2 size={14} />Delete
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {selectedFile && (
          <Button variant="hero" onClick={handleUpload}>Upload Selected File</Button>
        )}
      </motion.div>
    </ApplicantLayout>
  );
}
