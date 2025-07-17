import React from 'react';
import { Link2, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                <Link2 className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-bold bg-gradient-primary bg-clip-text text-transparent">
                SmartLink
              </h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Privacy-focused link shortener with advanced security features and detailed analytics.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Features</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Password Protection
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Link Analytics
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Auto Expiry
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Custom Domains
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  API Documentation
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Contact</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="mailto:support@smartlink.io" className="hover:text-foreground transition-colors">
                  support@smartlink.io
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Twitter
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  GitHub
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Discord
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2024 SmartLink. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-red-500 fill-current" />
            <span>for the web</span>
          </div>
        </div>
      </div>
    </footer>
  );
};