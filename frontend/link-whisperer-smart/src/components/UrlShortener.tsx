import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Copy, Link, Lock, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useShortenUrl } from '@/hooks/use-url-shortener';

interface ShortenedLink {
  short_url: string;
  original_url: string;
  password_protected: boolean;
  short_code: string;
}

export const UrlShortener = () => {
  const [url, setUrl] = useState('');
  const [password, setPassword] = useState('');
  const [shortenedLink, setShortenedLink] = useState<ShortenedLink | null>(null);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const { mutate: shortenUrl, isPending: isLoading } = useShortenUrl();

  const handleShorten = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate URL
    try {
      new URL(url); // This will throw if URL is invalid
    } catch (e) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL including http:// or https://",
        variant: "destructive"
      });
      return;
    }

    shortenUrl(
      { url, password: password || undefined },
      {
        onSuccess: (data) => {
          console.log('Shorten success:', data);
          const code = data.short_url.split('/').pop() || '';
          setShortenedLink({
            short_url: data.short_url,
            original_url: data.original_url,
            password_protected: data.password_protected,
            short_code: code,
          });
          toast({
            title: "Link shortened successfully!",
            description: data.password_protected ? "Your link is password protected." : "Your link is ready to share.",
          });
        },
        onError: (error) => {
          console.error('Shorten error:', error);
          toast({
            title: "Error",
            description: error instanceof Error ? error.message : "Failed to shorten URL. Please try again.",
            variant: "destructive"
          });
        }
      }
    );
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Link copied to clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Copy error:', error);
      toast({
        title: "Failed to copy",
        description: "Please copy the link manually.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleShorten} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="url" className="text-sm font-medium">
            Enter your long URL
          </Label>
          <Input
            id="url"
            type="url"
            placeholder="https://example.com/very/long/url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
            pattern="https?://.*"
            title="Please include http:// or https://"
            className="h-12 text-base transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:shadow-soft"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Password Protection (Optional)
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter password to protect your link"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-12 text-base transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:shadow-soft"
          />
        </div>

        <Button
          type="submit"
          disabled={isLoading || !url}
          className="w-full h-12 text-base font-medium bg-gradient-primary hover:shadow-glow transition-all duration-300 transform hover:scale-[1.02]"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Shortening...
            </div>
          ) : (
            <>
              <Link className="h-4 w-4 mr-2" />
              Shorten URL
            </>
          )}
        </Button>
      </form>

      {shortenedLink && (
        <Card className="border-0 shadow-card bg-gradient-to-br from-background to-muted/50 transition-all duration-500 animate-in slide-in-from-bottom-4">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Check className="h-4 w-4 text-secondary" />
              Link shortened successfully!
              {shortenedLink.password_protected && (
                <div className="flex items-center gap-1 ml-auto">
                  <Lock className="h-4 w-4 text-accent" />
                  <span className="text-accent font-medium">Password Protected</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-3 p-4 rounded-lg bg-background border">
              <div className="flex-1 min-w-0">
                <p className="text-sm text-muted-foreground mb-1">Your shortened link:</p>
                <p className="font-mono text-primary truncate">{shortenedLink.short_url}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(shortenedLink.short_url)}
                className="shrink-0 hover:bg-primary hover:text-primary-foreground transition-all duration-200"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>

            {/* Short Code Section */}
            <div className="flex items-center gap-3 p-4 rounded-lg bg-background border">
              <div className="flex-1 min-w-0">
                <p className="text-sm text-muted-foreground mb-1">Analytics Code:</p>
                <p className="font-mono text-secondary truncate">{shortenedLink.short_code}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(shortenedLink.short_code)}
                className="shrink-0 hover:bg-secondary hover:text-secondary-foreground transition-all duration-200"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>

            <div className="text-xs text-muted-foreground">
              Original: <span className="text-foreground">{shortenedLink.original_url}</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};