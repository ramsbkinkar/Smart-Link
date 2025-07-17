import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, BarChart3, Clock, UserCheck } from 'lucide-react';

const features = [
  {
    icon: Lock,
    title: "Password-Protected Links",
    description: "Secure your shortened links with custom passwords. Only authorized users can access your content.",
    gradient: "from-primary/10 to-primary/5",
    iconColor: "text-primary"
  },
  {
    icon: BarChart3,
    title: "Simple Analytics",
    description: "Track clicks, monitor performance, and gain insights into your link usage with easy-to-understand analytics.",
    gradient: "from-secondary/10 to-secondary/5",
    iconColor: "text-secondary"
  },
  {
    icon: Clock,
    title: "Auto Expiry",
    description: "Set automatic expiration dates for your links. Perfect for time-sensitive content and campaigns.",
    gradient: "from-accent/10 to-accent/5",
    iconColor: "text-accent"
  },
  {
    icon: UserCheck,
    title: "No Login Required",
    description: "Start shortening links immediately. No registration, no lengthy sign-up process - just simple, fast URL shortening.",
    gradient: "from-foreground/10 to-foreground/5",
    iconColor: "text-foreground"
  }
];

export const FeatureHighlights = () => {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Why Choose SmartLink?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience the perfect balance of simplicity, security, and functionality in our modern link shortening platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="border-0 shadow-card hover:shadow-soft transition-all duration-300 transform hover:-translate-y-1 group"
            >
              <CardHeader className="pb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`h-6 w-6 ${feature.iconColor}`} />
                </div>
                <CardTitle className="text-lg font-semibold">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-muted to-background rounded-full border shadow-soft">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-white text-xs font-bold">
                1K+
              </div>
              <div className="w-8 h-8 rounded-full bg-gradient-accent flex items-center justify-center text-white text-xs font-bold">
                50K+
              </div>
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-white text-xs font-bold">
                ∞
              </div>
            </div>
            <span className="text-sm text-muted-foreground">
              Trusted by thousands of users worldwide
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};