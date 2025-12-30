import { Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LogoProps {
  variant?: 'default' | 'light';
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function Logo({ variant = 'default', showText = true, size = 'md' }: LogoProps) {
  const sizes = {
    sm: { icon: 20, text: 'text-lg' },
    md: { icon: 28, text: 'text-xl' },
    lg: { icon: 36, text: 'text-2xl' },
  };

  const colors = {
    default: {
      icon: 'text-accent',
      text: 'text-foreground',
      accent: 'text-accent',
    },
    light: {
      icon: 'text-accent',
      text: 'text-primary-foreground',
      accent: 'text-accent',
    },
  };

  return (
    <Link to="/" className="flex items-center gap-2 group">
      <div className="relative">
        <Globe 
          size={sizes[size].icon} 
          className={`${colors[variant].icon} transition-transform duration-300 group-hover:rotate-12`} 
        />
        <div className="absolute inset-0 bg-accent/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      {showText && (
        <div className="flex flex-col leading-none">
          <span className={`font-display font-bold ${sizes[size].text} ${colors[variant].text}`}>
            Visa<span className={colors[variant].accent}>Gate</span>
          </span>
          {size !== 'sm' && (
            <span className={`text-xs ${variant === 'light' ? 'text-primary-foreground/60' : 'text-muted-foreground'}`}>
              Consultancy
            </span>
          )}
        </div>
      )}
    </Link>
  );
}
