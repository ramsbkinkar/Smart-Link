import React from 'react';
import { Header } from '@/components/Header';
import { UrlShortener } from '@/components/UrlShortener';
import { Analytics } from '@/components/Analytics';
import { FeatureHighlights } from '@/components/FeatureHighlights';
import { Footer } from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Link2, Shield, Zap } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero"></div>
        <div className="absolute inset-0 bg-gradient-radial"></div>
        <div className="container relative py-20 px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border">
                <Shield className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Privacy-First Link Shortening</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                <span className="bg-gradient-primary bg-clip-text text-transparent">Smart</span>
                <span className="text-foreground">Link</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Secure, analytics-powered URL shortening with password protection and zero hassle.
              </p>
            </div>

            <Card className="max-w-2xl mx-auto border-0 shadow-glow bg-card/80 backdrop-blur-xl transition-all duration-500 hover:shadow-glow hover:scale-[1.02]">
              <CardContent className="p-8">
                <UrlShortener />
              </CardContent>
            </Card>

            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-accent" />
                <span>Instant shortening</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                <span>Password protection</span>
              </div>
              <div className="flex items-center gap-2">
                <Link2 className="h-4 w-4 text-secondary" />
                <span>Custom expiry</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Analytics Section */}
      <section id="analytics" className="py-20 px-4 bg-muted/30">
        <div className="container max-w-4xl mx-auto">
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">
              Track Your Links
            </h2>
            <p className="text-lg text-muted-foreground">
              Get detailed insights into your shortened links performance and usage patterns.
            </p>
          </div>
          
          <Card className="border-0 shadow-glow bg-card/80 backdrop-blur-xl transition-all duration-500 hover:shadow-glow hover:scale-[1.02]">
            <CardContent className="p-8">
              <Analytics />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section id="features">
        <FeatureHighlights />
      </section>

      <Footer />
    </div>
  );
};

export default Index;
