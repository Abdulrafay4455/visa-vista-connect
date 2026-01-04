import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  FileText,
  Upload,
  Clock,
  Bell,
  User,
  MessageCircle,
  LogOut,
  ChevronLeft,
  Menu,
} from 'lucide-react';

import { Logo } from '@/components/shared/Logo';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

interface ApplicantLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/applicant/dashboard' },
  { icon: FileText, label: 'Apply for Visa', path: '/applicant/apply' },
  { icon: Upload, label: 'Documents', path: '/applicant/documents' },
  { icon: Clock, label: 'Track Application', path: '/applicant/tracking' },
  { icon: Bell, label: 'Notifications', path: '/applicant/notifications' },
  { icon: User, label: 'Profile', path: '/applicant/profile' },
];

export function ApplicantLayout({ children }: ApplicantLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 80 : 280 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="bg-card border-r border-border flex flex-col fixed h-screen z-40"
      >
        {/* Logo */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          <Logo showText={!collapsed} size={collapsed ? 'sm' : 'md'} />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex"
          >
            <ChevronLeft className={cn('transition-transform', collapsed && 'rotate-180')} size={18} />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto">
          <ul className="space-y-1 px-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                      'hover:bg-secondary',
                      isActive && 'bg-primary text-primary-foreground hover:bg-primary/90',
                      collapsed && 'justify-center'
                    )}
                  >
                    <item.icon size={20} />
                    {!collapsed && <span className="font-medium">{item.label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-border">
          {!collapsed && user && (
            <div className="mb-3 px-2">
              <p className="font-medium text-sm truncate">{user.firstName}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
          )}
          <Button
            variant="ghost"
            onClick={handleLogout}
            className={cn(
              'w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10',
              collapsed && 'justify-center px-2'
            )}
          >
            <LogOut size={20} />
            {!collapsed && 'Logout'}
          </Button>
        </div>
      </motion.aside>

      {/* Main content */}
      <main 
        className={cn(
          'flex-1 transition-all duration-300',
          collapsed ? 'ml-20' : 'ml-[280px]'
        )}
      >
        {/* Mobile header */}
        <header className="lg:hidden sticky top-0 z-30 bg-card/95 backdrop-blur border-b border-border px-4 py-3 flex items-center justify-between">
          <Button variant="ghost" size="icon">
            <Menu size={20} />
          </Button>
          <Logo size="sm" />
          <div className="w-10" />
        </header>

        {/* Content */}
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
