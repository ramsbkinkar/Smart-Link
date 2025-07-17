import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Cloud, 
  Github, 
  Linkedin, 
  FileText, 
  Code2, 
  Database, 
  Server,
  Zap,
  Shield,
  Globe
} from 'lucide-react';

// Public asset path – place architecture diagram at /public/architecture.png
const ARCH_IMG = '/architecture.png';

const About = () => {
  const techStack = [
    { name: 'AWS Lambda', icon: Zap, description: 'Serverless compute functions' },
    { name: 'API Gateway', icon: Globe, description: 'RESTful API management' },
    { name: 'DynamoDB', icon: Database, description: 'NoSQL database storage' },
    { name: 'Python', icon: Code2, description: 'Backend logic & processing' },
    { name: 'Terraform', icon: Cloud, description: 'Infrastructure as Code' },
    { name: 'GitHub Actions', icon: Github, description: 'CI/CD automation' },
    // { name: 'Lovable UI', icon: Shield, description: 'Modern React frontend' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5"></div>
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-primary/2 to-transparent"></div>
        
        <div className="container relative px-4 max-w-4xl mx-auto">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border">
                <Cloud className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Cloud & DevOps Engineer</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                About <span className="bg-gradient-primary bg-clip-text text-transparent">SmartLink</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                A modern link shortening service built as a portfolio project to showcase
                cloud architecture and full-stack development skills.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <a href="https://github.com/ramsbkinkar" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="bg-gradient-primary hover:opacity-90 transition-all duration-300 transform hover:scale-105">
                  <Github className="h-5 w-5 mr-2" />
                  GitHub Profile
                </Button>
              </a>
              <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="lg" className="transition-all duration-300 transform hover:scale-105">
                  <FileText className="h-5 w-5 mr-2" />
                  View Resume
                </Button>
              </a>
              <a href="https://www.linkedin.com/in/technophile7/" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="lg" className="transition-all duration-300 transform hover:scale-105">
                  <Linkedin className="h-5 w-5 mr-2" />
                  LinkedIn
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Architecture Diagram */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">
              System Architecture
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              A high-level view of SmartLink’s serverless workflow from user request to redirect.
            </p>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <div className="w-full h-[540px] rounded-xl border shadow-xl overflow-hidden bg-gradient-to-br from-blue-950 via-gray-900 to-indigo-900 p-6 flex items-center justify-center cursor-zoom-in">
                <img
                  src={ARCH_IMG}
                  alt="SmartLink architecture diagram (click to enlarge)"
                  className="max-h-full object-contain"
                />
              </div>
            </DialogTrigger>
            <DialogContent className="w-full max-w-6xl bg-transparent border-none shadow-none p-0">
              <img src={ARCH_IMG} alt="SmartLink architecture diagram" className="w-full h-auto rounded-lg" />
            </DialogContent>
          </Dialog>

          <div className="space-y-6 text-muted-foreground text-lg leading-relaxed">
            <p>
              1. <strong>Frontend.</strong> The React interface is built with Tailwind CSS and served from an S3 bucket (or any static host). Users create short links and view analytics directly from their browser.
            </p>
            <p>
              2. <strong>API Gateway.</strong> All requests hit an AWS HTTP API which provides an HTTPS endpoint and handles CORS.
            </p>
            <p>
              3. <strong>Lambda Functions.</strong> One function handles <em>shorten / analytics</em> and one handles <em>redirect</em>. They run only on demand, keeping the running cost close to $0.
            </p>
            <p>
              4. <strong>DynamoDB.</strong> Stores the original URL, password hash, click counts, and TTL-based expiry (7 days). Reads are in single-digit ms.
            </p>
            <p>
              5. <strong>CI/CD.</strong> Source is in GitHub. Terraform plans apply on every push via GitHub Actions; the React build is deployed to the S3 web bucket.
            </p>
          </div>
        </div>
      </section>

      {/* Project Overview removed as per request */}

      {/* Technology Stack */}
      <section className="py-20 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">
              Technology Stack
            </h2>
            <p className="text-lg text-muted-foreground">
              Modern tools and services for cloud-native development
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {techStack.map((tech, index) => (
              <Card 
                key={tech.name} 
                className="border-0 shadow-card bg-card/50 backdrop-blur transition-all duration-300 hover:shadow-glow hover:scale-105 hover:-translate-y-1"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6 text-center">
                  <div className="space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-primary mx-auto flex items-center justify-center">
                      <tech.icon className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">{tech.name}</h3>
                      <p className="text-sm text-muted-foreground">{tech.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container max-w-4xl mx-auto text-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold">
                Let's Connect
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Interested in discussing cloud architecture, DevOps practices, or potential collaborations? 
                I'd love to hear from you.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <a href="https://github.com/ramsbkinkar" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="bg-gradient-primary hover:opacity-90 transition-all duration-300 transform hover:scale-105">
                  <Github className="h-5 w-5 mr-2" />
                  More Projects
                </Button>
              </a>
              <a href="https://www.linkedin.com/in/technophile7/" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="lg" className="transition-all duration-300 transform hover:scale-105">
                  <Linkedin className="h-5 w-5 mr-2" />
                  LinkedIn Profile
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;