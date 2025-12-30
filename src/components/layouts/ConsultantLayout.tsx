import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  FileSearch,
  Globe,
  MessageSquare,
  BarChart3,
  User,
  LogOut,
  ChevronLeft,
  Menu,
  Settings,
} from 'lucide-react';

import { Logo } from '@/components/shared/Logo';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

interface ConsultantLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/consultant/dashboard' },
  { icon: Users, label: 'Applications', path: '/consultant/applications' },
  { icon: FileSearch, label: 'Review', path: '/consultant/review' },
  { icon: Globe, label: 'Embassy Tracking', path: '/consultant/embassy' },
  { icon: MessageSquare, label: 'Messages', path: '/consultant/messages' },
  { icon: BarChart3, label: 'Reports', path: '/consultant/reports' },
  { icon: Settings, label: 'Settings', path: '/consultant/settings' },
];

export function ConsultantLayout({ children }: ConsultantLayoutProps) {
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
      {/* Sidebar - Dark theme for consultant */}
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 80 : 280 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="bg-sidebar border-r border-sidebar-border flex flex-col fixed h-screen z-40"
      >
        {/* Logo */}
        <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
          <Logo variant="light" showText={!collapsed} size={collapsed ? 'sm' : 'md'} />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex text-sidebar-foreground hover:bg-sidebar-accent"
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
                      'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent',
                      isActive && 'bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90',
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
        <div className="p-4 border-t border-sidebar-border">
          {!collapsed && user && (
            <div className="mb-3 px-2">
              <p className="font-medium text-sm text-sidebar-foreground truncate">{user.name}</p>
              <p className="text-xs text-sidebar-foreground/60 truncate">{user.email}</p>
            </div>
          )}
          <Button
            variant="ghost"
            onClick={handleLogout}
            className={cn(
              'w-full justify-start gap-3 text-sidebar-foreground/70 hover:text-destructive hover:bg-destructive/10',
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
        <header className="lg:hidden sticky top-0 z-30 bg-sidebar backdrop-blur border-b border-sidebar-border px-4 py-3 flex items-center justify-between">
          <Button variant="ghost" size="icon" className="text-sidebar-foreground">
            <Menu size={20} />
          </Button>
          <Logo variant="light" size="sm" />
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
