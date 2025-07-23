import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Link2 } from 'lucide-react';

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <RouterLink to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
            <Link2 className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            SmartLink
          </h1>
        </RouterLink>
        
        <nav className="hidden md:flex items-center gap-6">
          <RouterLink to="/#analytics" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Analytics
          </RouterLink>
          <RouterLink to="/about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            About
          </RouterLink>
          <RouterLink to="/api" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            API Docs
          </RouterLink>
        </nav>
      </div>
    </header>
  );
};