import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, ArrowLeft, Mail, Lock, Shield, User, Phone, Briefcase } from 'lucide-react';
import bcrypt from 'bcryptjs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/shared/Logo';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';

// Schema for registration/login
const consultantSchema = z.object({
  firstName: z.string().min(2, 'First Name is required'),
  lastName: z.string().min(2, 'Last Name is required'),
  phone: z.string().min(6, 'Phone is required'),
  specialization: z.string().min(2, 'Specialization is required'),
  email: z.string().email('Valid email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type ConsultantFormData = z.infer<typeof consultantSchema>;

export function ConsultantAuth() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<ConsultantFormData>({
    resolver: zodResolver(consultantSchema),
    defaultValues: { firstName: '', lastName: '', phone: '', specialization: '', email: '', password: '' },
  });

  // Check if user already logged in
  useEffect(() => {
    const existing = sessionStorage.getItem('user') || localStorage.getItem('consultant');
    if (existing) {
      const user = JSON.parse(existing);
      if (user.role === 'consultant') {
        sessionStorage.setItem("user", JSON.stringify(user));
        navigate('/consultant/dashboard');
      }
    }
  }, []);

  const handleLogin = async (data: ConsultantFormData) => {
    setIsLoading(true);
    try {
      // Check localStorage for existing consultant
      const stored = localStorage.getItem('consultant');
      if (!stored) throw new Error('Consultant not found. Please register first.');

      const user = JSON.parse(stored);

      const isMatch = await bcrypt.compare(data.password, user.password);
      if (!isMatch || data.email !== user.email) throw new Error('Invalid credentials');

      sessionStorage.setItem('user', JSON.stringify(user));
      toast({ title: 'Welcome back!', description: 'You have successfully logged in.' });
      navigate('/consultant/dashboard');
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (data: ConsultantFormData) => {
    setIsLoading(true);
    try {
      const hashedPassword = await bcrypt.hash(data.password, 10);

      const result = await axios.post("http://localhost:8081/consultant", {...data, password: hashedPassword})
      const response = result.data;

      const userData = { ...response, password: hashedPassword, role: 'consultant' };

      // Save in localStorage & sessionStorage
      localStorage.setItem('consultant', JSON.stringify(userData));
      sessionStorage.setItem('user', JSON.stringify(userData));

      toast({ title: 'Account created!', description: 'Welcome to Consultant Portal.' });
      navigate('/consultant/dashboard');
    } catch (error) {
      toast({ title: 'Error', description: 'Registration failed', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-primary-foreground/60 hover:text-primary-foreground transition-colors mb-6"
        >
          <ArrowLeft size={16} /> Back to Home
        </Link>

        <Card className="border-0 shadow-2xl">
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-4">
              <div className="bg-accent/10 p-4 rounded-2xl">
                <Shield className="w-12 h-12 text-accent" />
              </div>
            </div>
            <CardTitle className="font-display text-2xl">Consultant Portal</CardTitle>
            <CardDescription>Access your visa management dashboard</CardDescription>
          </CardHeader>

          <CardContent className="pt-4">
            <form
              onSubmit={form.handleSubmit(handleRegister)}
              className="space-y-4"
            >
              {/* First Name */}
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <Input id="firstName" placeholder="John" className="pl-10" {...form.register('firstName')} />
                </div>
                {form.formState.errors.firstName && <p className="text-sm text-destructive">{form.formState.errors.firstName.message}</p>}
              </div>

              {/* Last Name */}
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <Input id="lastName" placeholder="Doe" className="pl-10" {...form.register('lastName')} />
                </div>
                {form.formState.errors.lastName && <p className="text-sm text-destructive">{form.formState.errors.lastName.message}</p>}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <Input id="phone" placeholder="03001234567" className="pl-10" {...form.register('phone')} />
                </div>
                {form.formState.errors.phone && <p className="text-sm text-destructive">{form.formState.errors.phone.message}</p>}
              </div>

              {/* Specialization */}
              <div className="space-y-2">
                <Label htmlFor="specialization">Specialization</Label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <Input id="specialization" placeholder="Immigration" className="pl-10" {...form.register('specialization')} />
                </div>
                {form.formState.errors.specialization && <p className="text-sm text-destructive">{form.formState.errors.specialization.message}</p>}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <Input id="email" type="email" placeholder="consultant@visagate.com" className="pl-10" {...form.register('email')} />
                </div>
                {form.formState.errors.email && <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="••••••••" className="pl-10 pr-10" {...form.register('password')} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {form.formState.errors.password && <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>}
              </div>

              <Button type="submit" variant="hero" className="w-full" size="lg" disabled={isLoading}>
                {isLoading ? 'Processing...' : 'Register & Login'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Already registered?{' '}
                <button type="button" className="text-primary font-medium hover:underline" onClick={() => handleLogin(form.getValues())}>
                  Login here
                </button>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 flex justify-center">
          <Logo variant="light" size="sm" />
        </div>
      </motion.div>
    </div>
  );
}
