import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  variant?: 'full' | 'icon' | 'text';
}

const Logo: React.FC<LogoProps> = ({ 
  className = '', 
  size = 'md', 
  variant = 'full' 
}) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
    '2xl': 'h-20 w-20'
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
    '2xl': 'text-4xl'
  };

  const LogoSVG = () => (
    <svg
      viewBox="0 0 200 60"
      className={`${sizeClasses[size]} ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Wood grain background pattern */}
      <defs>
        <pattern id="woodGrain" patternUnits="userSpaceOnUse" width="20" height="20">
          <rect width="20" height="20" fill="#8B4513"/>
          <path d="M0,10 Q5,5 10,10 T20,10" stroke="#A0522D" strokeWidth="0.5" fill="none" opacity="0.3"/>
          <path d="M0,15 Q5,12 10,15 T20,15" stroke="#A0522D" strokeWidth="0.3" fill="none" opacity="0.2"/>
        </pattern>
        <linearGradient id="woodGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B4513"/>
          <stop offset="50%" stopColor="#A0522D"/>
          <stop offset="100%" stopColor="#654321"/>
        </linearGradient>
      </defs>
      
      {/* Main logo icon - stylized tree/wood symbol */}
      <g transform="translate(10, 10)">
        {/* Tree trunk */}
        <rect x="8" y="25" width="4" height="15" fill="url(#woodGradient)" rx="2"/>
        
        {/* Tree branches/leaves */}
        <circle cx="10" cy="20" r="8" fill="#228B22" opacity="0.8"/>
        <circle cx="6" cy="18" r="6" fill="#32CD32" opacity="0.7"/>
        <circle cx="14" cy="18" r="6" fill="#32CD32" opacity="0.7"/>
        <circle cx="10" cy="15" r="5" fill="#90EE90" opacity="0.9"/>
        
        {/* Wood rings */}
        <circle cx="10" cy="32" r="2" fill="none" stroke="#654321" strokeWidth="0.5" opacity="0.6"/>
        <circle cx="10" cy="32" r="1" fill="none" stroke="#654321" strokeWidth="0.3" opacity="0.4"/>
      </g>
      
      {/* Company text */}
      <g transform="translate(45, 15)">
        <text 
          x="0" 
          y="15" 
          fontFamily="Montserrat, sans-serif" 
          fontSize="14" 
          fontWeight="700" 
          fill="#8B4513"
          className="logo-text-primary"
        >
          New India
        </text>
        <text 
          x="0" 
          y="30" 
          fontFamily="Montserrat, sans-serif" 
          fontSize="12" 
          fontWeight="600" 
          fill="#A0522D"
          className="logo-text-secondary"
        >
          TIMBER
        </text>
        <text 
          x="0" 
          y="42" 
          fontFamily="Inter, sans-serif" 
          fontSize="8" 
          fontWeight="400" 
          fill="#654321"
          opacity="0.8"
          className="logo-text-tagline"
        >
          Premium Wood Solutions
        </text>
      </g>
    </svg>
  );

  const IconOnly = () => (
    <svg
      viewBox="0 0 40 40"
      className={`${sizeClasses[size]} ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="iconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B4513"/>
          <stop offset="50%" stopColor="#A0522D"/>
          <stop offset="100%" stopColor="#654321"/>
        </linearGradient>
      </defs>
      
      {/* Tree trunk */}
      <rect x="16" y="25" width="8" height="12" fill="url(#iconGradient)" rx="4"/>
      
      {/* Tree branches/leaves */}
      <circle cx="20" cy="20" r="12" fill="#228B22" opacity="0.8"/>
      <circle cx="12" cy="16" r="8" fill="#32CD32" opacity="0.7"/>
      <circle cx="28" cy="16" r="8" fill="#32CD32" opacity="0.7"/>
      <circle cx="20" cy="12" r="6" fill="#90EE90" opacity="0.9"/>
      
      {/* Wood rings */}
      <circle cx="20" cy="30" r="3" fill="none" stroke="#654321" strokeWidth="0.8" opacity="0.6"/>
      <circle cx="20" cy="30" r="1.5" fill="none" stroke="#654321" strokeWidth="0.4" opacity="0.4"/>
    </svg>
  );

  const TextOnly = () => (
    <div className={`flex items-center leading-tight ${className}`}>
      <span className={`font-bold font-montserrat ${textSizeClasses[size]} text-timber-700 logo-text-primary tracking-wide`}>
        NEW INDIA TIMBERS
      </span>
    </div>
  );

  switch (variant) {
    case 'icon':
      return <IconOnly />;
    case 'text':
      return <TextOnly />;
    case 'full':
    default:
      return <LogoSVG />;
  }
};

export default Logo;
