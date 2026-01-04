import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, ArrowLeft, Mail, Lock, User } from 'lucide-react';
import bcrypt from "bcryptjs";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/shared/Logo';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import axios from "axios";

// Schemas
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const registerSchema = loginSchema.extend({
  firstName: z.string().min(2, 'First Name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last Name must be at least 2 characters'),
  phone: z.string().min(2, 'Phone must be at least 2 characters'),
  nationality: z.string().min(2, 'Nationality must be at least 2 characters'),
  dateOfBirth: z.string().min(1, 'Date of Birth is required'),
  passportNumber: z.string().min(2, 'Passport number must be at least 2 characters'),
  passportExpiryDate: z.string().min(1, 'Passport expiry is required'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Types
type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

export function ApplicantAuth() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '', lastName: '', phone: '', nationality: '', dateOfBirth: '',
      passportNumber: '', passportExpiryDate: '', email: '', password: '', confirmPassword: "",
    },
  });

  useEffect(() => {
    const fetchExisting = () => {
      const see = sessionStorage.getItem("user");
      if (see) {
        const final = JSON.parse(see);
        console.log(final)
        if (final.role == "applicant") {
          navigate('/applicant/dashboard');
        }
      }
    }
    fetchExisting();
  }, [])

  const handleLogin = async (data: LoginFormData) => {
  setIsLoading(true);
  console.log("Login Data:", data);
  try {
    const storedUser = localStorage.getItem("applicant");
    if (!storedUser) throw new Error("User not found");

    const user = JSON.parse(storedUser);

    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) throw new Error("Invalid credentials");

    sessionStorage.setItem("user", JSON.stringify(user));

    toast({ title: 'Welcome back!', description: 'You have successfully logged in.' });
    navigate('/applicant/dashboard');
  } catch (error: any) {
    console.error(error);
    toast({ title: 'Error', description: error.message || 'Invalid credentials', variant: 'destructive' });
  } finally {
    setIsLoading(false);
  }
};


  const handleRegister = async (data: RegisterFormData) => {
  setIsLoading(true);
  console.log("Register Data:", data);
  try {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const result = await axios.post("http://localhost:8081/applicants", { ...data, password: hashedPassword });

    const userData = { ...result.data, role: "applicant" };

    // Save to sessionStorage & localStorage
    sessionStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("applicant", JSON.stringify(userData));

    toast({ title: 'Account created!', description: 'Welcome to VisaGate.' });
    navigate('/applicant/dashboard');
  } catch (error) {
    console.error(error);
    toast({ title: 'Error', description: 'Registration failed', variant: 'destructive' });
  } finally {
    setIsLoading(false);
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background flex items-center justify-center p-4">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft size={16} /> Back to Home
        </Link>

        <Card className="border-0 shadow-xl">
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-4">
              <Logo size="lg" />
            </div>
            <CardTitle className="font-display text-2xl">{isLogin ? 'Welcome Back' : 'Create Account'}</CardTitle>
            <CardDescription>
              {isLogin ? 'Sign in to track your visa applications' : 'Start your visa journey with us'}
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-4">
            {/* Unified form */}
            <form
              onSubmit={isLogin ? loginForm.handleSubmit(handleLogin) : registerForm.handleSubmit(handleRegister)}
              className="space-y-4"
            >
              {isLogin ? (
                <>
                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                      <Input id="email" type="email" placeholder="you@example.com" className="pl-10" {...loginForm.register('email')} />
                    </div>
                    {loginForm.formState.errors.email && <p className="text-sm text-destructive">{loginForm.formState.errors.email.message}</p>}
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                      <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="••••••••" className="pl-10 pr-10" {...loginForm.register('password')} />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {loginForm.formState.errors.password && <p className="text-sm text-destructive">{loginForm.formState.errors.password.message}</p>}
                  </div>

                  <div className="flex justify-end">
                    <Link to="/applicant/forgot-password" className="text-sm text-primary hover:underline">Forgot password?</Link>
                  </div>
                </>
              ) : (
                <>
                  {/* First Name */}
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                      <Input id="firstName" type="text" placeholder="John" className="pl-10" {...registerForm.register('firstName')} />
                    </div>
                    {registerForm.formState.errors.firstName && <p className="text-sm text-destructive">{registerForm.formState.errors.firstName.message}</p>}
                  </div>

                  {/* Last Name */}
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                      <Input id="lastName" type="text" placeholder="Doe" className="pl-10" {...registerForm.register('lastName')} />
                    </div>
                    {registerForm.formState.errors.lastName && <p className="text-sm text-destructive">{registerForm.formState.errors.lastName.message}</p>}
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="text" placeholder="03001234567" {...registerForm.register('phone')} />
                    {registerForm.formState.errors.phone && <p className="text-sm text-destructive">{registerForm.formState.errors.phone.message}</p>}
                  </div>

                  {/* Nationality */}
                  <div className="space-y-2">
                    <Label htmlFor="phone">Nationality</Label>
                    <Input id="phone" type="text" placeholder="Pakistan" {...registerForm.register('nationality')} />
                    {registerForm.formState.errors.nationality && <p className="text-sm text-destructive">{registerForm.formState.errors.nationality.message}</p>}
                  </div>

                  {/* DOB */}
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input id="dateOfBirth" type="date" {...registerForm.register('dateOfBirth')} />
                    {registerForm.formState.errors.dateOfBirth && <p className="text-sm text-destructive">{registerForm.formState.errors.dateOfBirth.message}</p>}
                  </div>

                  {/* Passport Number */}
                  <div className="space-y-2">
                    <Label htmlFor="passportNumber">Passport Number</Label>
                    <Input id="passportNumber" type="text" {...registerForm.register('passportNumber')} />
                    {registerForm.formState.errors.passportNumber && <p className="text-sm text-destructive">{registerForm.formState.errors.passportNumber.message}</p>}
                  </div>

                  {/* Passport Expiry */}
                  <div className="space-y-2">
                    <Label htmlFor="passportExpiry">Passport Expiry</Label>
                    <Input id="passportExpiry" type="date" {...registerForm.register('passportExpiryDate')} />
                    {registerForm.formState.errors.passportExpiryDate && <p className="text-sm text-destructive">{registerForm.formState.errors.passportExpiryDate.message}</p>}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                      <Input id="email" type="email" placeholder="you@example.com" className="pl-10" {...registerForm.register('email')} />
                    </div>
                    {registerForm.formState.errors.email && <p className="text-sm text-destructive">{registerForm.formState.errors.email.message}</p>}
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                      <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="••••••••" className="pl-10 pr-10" {...registerForm.register('password')} />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {registerForm.formState.errors.password && <p className="text-sm text-destructive">{registerForm.formState.errors.password.message}</p>}
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                      <Input id="confirmPassword" type={showPassword ? 'text' : 'password'} placeholder="••••••••" className="pl-10 pr-10" {...registerForm.register('confirmPassword')} />
                    </div>
                    {registerForm.formState.errors.confirmPassword && <p className="text-sm text-destructive">{registerForm.formState.errors.confirmPassword.message}</p>}
                  </div>
                </>
              )}

              {/* Submit button */}
              <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                {isLogin ? (isLoading ? 'Signing in...' : 'Sign In') : (isLoading ? 'Creating account...' : 'Create Account')}
              </Button>
            </form>

            {/* Toggle login/register */}
            <div className="mt-6 text-center">
              <p className="text-muted-foreground">
                {isLogin ? "Don't have an account? " : 'Already have an account? '}
                <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-primary font-medium hover:underline">
                  {isLogin ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>

            {/* Consultant link */}
            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">
                Are you a consultant?{' '}
                <Link to="/consultant/login" className="text-accent font-medium hover:underline">
                  Login here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
