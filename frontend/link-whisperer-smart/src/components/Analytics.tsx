import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Calendar, Eye, Lock, Link } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUrlAnalytics } from '@/hooks/use-url-shortener';

interface AnalyticsData {
  short_code: string;
  original_url: string;
  clicks: number;
  created_at: number;
  expiry_time: number;
  password_protected: boolean;
}

export const Analytics = () => {
  const [shortCode, setShortCode] = useState('');
  const { toast } = useToast();
  
  const { 
    data: analyticsData,
    isLoading,
    error,
    refetch
  } = useUrlAnalytics(shortCode);

  const handleGetAnalytics = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await refetch();
    
    if (result.error) {
      toast({
        title: "Error",
        description: result.error instanceof Error ? result.error.message : "Failed to retrieve analytics. Please check the short code.",
        variant: "destructive"
      });
    } else if (result.data) {
      toast({
        title: "Analytics loaded",
        description: "Link analytics retrieved successfully.",
      });
    }
  };

  const formatDate = (timestamp: number) => {
    // Convert seconds to milliseconds
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleGetAnalytics} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="shortCode" className="text-sm font-medium flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Enter Short Code for Analytics
          </Label>
          <div className="flex gap-3">
            <Input
              id="shortCode"
              type="text"
              placeholder="abc123"
              value={shortCode}
              onChange={(e) => setShortCode(e.target.value)}
              required
              className="h-12 text-base transition-all duration-300 focus:ring-2 focus:ring-secondary/20 focus:shadow-soft"
            />
            <Button
              type="submit"
              disabled={isLoading || !shortCode}
              className="h-12 px-6 bg-gradient-accent hover:shadow-glow transition-all duration-300 transform hover:scale-[1.02]"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Loading...
                </div>
              ) : (
                <>
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Analytics
                </>
              )}
            </Button>
          </div>
        </div>
      </form>

      {analyticsData && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-bottom-4">
          <Card className="border-0 shadow-card hover:shadow-soft transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Link className="h-5 w-5 text-primary" />
                Link Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Short Code</p>
                <p className="font-mono text-primary bg-muted/50 px-3 py-2 rounded">{analyticsData.short_code}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Original URL</p>
                <p className="text-sm break-all bg-muted/50 px-3 py-2 rounded">{analyticsData.original_url}</p>
              </div>
              <div className="flex items-center gap-2">
                {analyticsData.password_protected ? (
                  <>
                    <Lock className="h-4 w-4 text-accent" />
                    <span className="text-accent font-medium text-sm">Password Protected</span>
                  </>
                ) : (
                  <span className="text-muted-foreground text-sm">Public Link</span>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-card hover:shadow-soft transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Eye className="h-5 w-5 text-secondary" />
                Usage Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-6 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg">
                <div className="text-3xl font-bold text-primary mb-1">{analyticsData.clicks}</div>
                <div className="text-sm text-muted-foreground">Total Clicks</div>
              </div>
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Created</p>
                    <p className="text-sm font-medium">{formatDate(analyticsData.created_at)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Expires</p>
                    <p className="text-sm font-medium">{formatDate(analyticsData.expiry_time)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};