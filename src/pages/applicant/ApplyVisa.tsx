import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Globe, Plane, Calendar, DollarSign, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

import { ApplicantLayout } from '@/components/layouts/ApplicantLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';

const countries = [
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
];

const visaTypes = [
  { value: 'tourist', label: 'Tourist Visa', description: 'For leisure and tourism' },
  { value: 'business', label: 'Business Visa', description: 'For business meetings and conferences' },
  { value: 'student', label: 'Student Visa', description: 'For academic studies' },
  { value: 'work', label: 'Work Visa', description: 'For employment purposes' },
];

const steps = [
  { id: 1, title: 'Destination', icon: Globe },
  { id: 2, title: 'Travel Details', icon: Plane },
  { id: 3, title: 'Personal Info', icon: FileText },
  { id: 4, title: 'Financial', icon: DollarSign },
];

export function ApplyVisa() {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    country: '',
    visaType: '',
    travelDate: '',
    returnDate: '',
    purpose: '',
    firstName: user?.firstName,
    lastName: user?.lastName,
    passportNumber: user?.passportNumber,
    dateOfBirth: user?.dateOfBirth,
    nationality: user?.nationality,
    occupation: '',
    annualIncome: '',
    fundingSource: '',
  });

  useEffect(() => {
    if (!user) return
    setFormData({
    country: '',
    visaType: '',
    travelDate: '',
    returnDate: '',
    purpose: '',
    firstName: user?.firstName,
    lastName: user?.lastName,
    passportNumber: user?.passportNumber,
    dateOfBirth: user?.dateOfBirth,
    nationality: user?.nationality,
    occupation: '',
    annualIncome: '',
    fundingSource: '',
    })
  }, [user])

  const handleNext = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    // Handle form submission
    console.log('Form submitted:', formData);
    try {
      let dataToAdd: any;
      const res = localStorage.getItem("consultant");
      console.log(user)
      if (res) {
        const consult = JSON.parse(res);
        const consultId  = consult.consultantId;
        dataToAdd = {
          applicantId: user.applicantId,
          consultantId: consultId,
          visaType: formData.visaType,
        }
      }
      dataToAdd = {
        applicantId: user.applicantId,
        consultantId: 5,
        visaType: formData.visaType,
      }

      const result = await axios.post("http://localhost:8081/applications", dataToAdd);
      const respinse = result.data;
      console.log(result.data);
      toast.success("Application Submitted!")
      setCurrentStep(1);
    } catch (error) {
      toast.error("Error Creating Application")
      console.error(error);
    }
  };

  return (
    <ApplicantLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-8"
      >
        {/* Header */}
        <div>
          <Link 
            to="/applicant/dashboard" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-display font-bold">Apply for Visa</h1>
          <p className="text-muted-foreground mt-1">Complete all steps to submit your application</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center gap-2 ${
                step.id === currentStep ? 'text-accent' :
                step.id < currentStep ? 'text-success' : 'text-muted-foreground'
              }`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step.id === currentStep ? 'bg-accent text-accent-foreground' :
                  step.id < currentStep ? 'bg-success text-success-foreground' : 'bg-secondary'
                }`}>
                  <step.icon size={18} />
                </div>
                <span className="hidden sm:inline font-medium">{step.title}</span>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-12 md:w-24 h-0.5 mx-2 ${
                  step.id < currentStep ? 'bg-success' : 'bg-border'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Form Steps */}
        <Card>
          <CardHeader>
            <CardTitle>{steps[currentStep - 1].title}</CardTitle>
            <CardDescription>
              {currentStep === 1 && 'Select your destination country and visa type'}
              {currentStep === 2 && 'Provide your travel dates and purpose'}
              {currentStep === 3 && 'Enter your personal information'}
              {currentStep === 4 && 'Provide financial details'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {currentStep === 1 && (
              <>
                <div className="space-y-2">
                  <Label>Destination Country</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {countries.map((country) => (
                      <button
                        key={country.code}
                        type="button"
                        onClick={() => setFormData({ ...formData, country: country.code })}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          formData.country === country.code
                            ? 'border-accent bg-accent/10'
                            : 'border-border hover:border-accent/50'
                        }`}
                      >
                        <span className="text-3xl block mb-2">{country.flag}</span>
                        <span className="font-medium text-sm">{country.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Visa Type</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {visaTypes.map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, visaType: type.value })}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${
                          formData.visaType === type.value
                            ? 'border-accent bg-accent/10'
                            : 'border-border hover:border-accent/50'
                        }`}
                      >
                        <span className="font-medium block">{type.label}</span>
                        <span className="text-sm text-muted-foreground">{type.description}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {currentStep === 2 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="travelDate">Travel Date</Label>
                    <Input
                      id="travelDate"
                      type="date"
                      value={formData.travelDate}
                      onChange={(e) => setFormData({ ...formData, travelDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="returnDate">Return Date</Label>
                    <Input
                      id="returnDate"
                      type="date"
                      value={formData.returnDate}
                      onChange={(e) => setFormData({ ...formData, returnDate: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="purpose">Purpose of Visit</Label>
                  <Textarea
                    id="purpose"
                    placeholder="Describe the purpose of your visit..."
                    value={formData.purpose}
                    onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                    rows={4}
                  />
                </div>
              </>
            )}

            {currentStep === 3 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="passportNumber">Passport Number</Label>
                    <Input
                      id="passportNumber"
                      placeholder="AB1234567"
                      value={formData.passportNumber}
                      onChange={(e) => setFormData({ ...formData, passportNumber: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nationality">Nationality</Label>
                    <Input
                    id="nationality"
                    type="text"
                      value={formData.nationality}
                      onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="occupation">Occupation</Label>
                    <Input
                      id="occupation"
                      placeholder="Software Engineer"
                      value={formData.occupation}
                      onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                    />
                  </div>
                </div>
              </>
            )}

            {currentStep === 4 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="annualIncome">Annual Income (USD)</Label>
                    <Input
                      id="annualIncome"
                      type="number"
                      placeholder="50000"
                      value={formData.annualIncome}
                      onChange={(e) => setFormData({ ...formData, annualIncome: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fundingSource">Source of Funding</Label>
                    <Select
                      value={formData.fundingSource}
                      onValueChange={(value) => setFormData({ ...formData, fundingSource: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select funding source" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="self">Self-funded</SelectItem>
                        <SelectItem value="employer">Employer Sponsored</SelectItem>
                        <SelectItem value="family">Family Support</SelectItem>
                        <SelectItem value="scholarship">Scholarship</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-secondary/50 border border-border">
                  <h4 className="font-medium mb-2">Required Documents</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    You will need to upload these documents in the next step:
                  </p>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Valid passport (minimum 6 months validity)</li>
                    <li>• Recent passport-size photograph</li>
                    <li>• Bank statements (last 3 months)</li>
                    <li>• Employment/enrollment proof</li>
                  </ul>
                </div>
              </>
            )}

            {/* Navigation */}
            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1}
              >
                <ArrowLeft size={16} />
                Back
              </Button>
              {currentStep < 4 ? (
                <Button variant="hero" onClick={handleNext}>
                  Continue
                  <ArrowRight size={16} />
                </Button>
              ) : (
                <Button variant="hero" onClick={handleSubmit}>
                  Submit Application
                  <ArrowRight size={16} />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </ApplicantLayout>
  );
}
