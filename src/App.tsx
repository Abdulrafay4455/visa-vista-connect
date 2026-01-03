import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { ApplicantAuth } from "./pages/auth/ApplicantAuth";
import { ConsultantAuth } from "./pages/auth/ConsultantAuth";
import { ApplicantDashboard } from "./pages/applicant/ApplicantDashboard";
import { ConsultantDashboard } from "./pages/consultant/ConsultantDashboard";
import { ApplyVisa } from "./pages/applicant/ApplyVisa";
import { DocumentsPage } from "./pages/applicant/DocumentsPage";
import { TrackingPage } from "./pages/applicant/TrackingPage";
import { NotificationsPage } from "./pages/applicant/NotificationsPage";
import { ProfilePage } from "./pages/applicant/ProfilePage";
import { ApplicationsPage } from "./pages/consultant/ApplicationsPage";
import { ReviewPage } from "./pages/consultant/ReviewPage";
import { EmbassyPage } from "./pages/consultant/EmbassyPage";
import { MessagesPage } from "./pages/consultant/MessagesPage";
import { ReportsPage } from "./pages/consultant/ReportsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            
            {/* Auth routes */}
            <Route path="/applicant/login" element={<ApplicantAuth />} />
            <Route path="/consultant/login" element={<ConsultantAuth />} />
            
            {/* Applicant routes */}
            <Route path="/applicant/dashboard" element={<ApplicantDashboard />} />
            <Route path="/applicant/apply" element={<ApplyVisa />} />
            <Route path="/applicant/documents" element={<DocumentsPage />} />
            <Route path="/applicant/tracking" element={<TrackingPage />} />
            <Route path="/applicant/notifications" element={<NotificationsPage />} />
            <Route path="/applicant/profile" element={<ProfilePage />} />
            
            {/* Consultant routes */}
            <Route path="/consultant/dashboard" element={<ConsultantDashboard />} />
            <Route path="/consultant/applications" element={<ApplicationsPage />} />
            <Route path="/consultant/review" element={<ReviewPage />} />
            <Route path="/consultant/review/:id" element={<ReviewPage />} />
            <Route path="/consultant/embassy" element={<EmbassyPage />} />
            <Route path="/consultant/messages" element={<MessagesPage />} />
            <Route path="/consultant/reports" element={<ReportsPage />} />
            
            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
