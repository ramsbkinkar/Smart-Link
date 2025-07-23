import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const BASE_URL =
  import.meta.env.VITE_API_BASE ??
  "https://qzeybbuf4g.execute-api.us-east-1.amazonaws.com";

const ApiDocs: React.FC = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero / URL section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-hero" />
          <div className="absolute inset-0 bg-gradient-radial" />

          <div className="container relative py-20 px-4 flex flex-col items-center gap-8">
            <h1 className="text-4xl md:text-5xl font-bold text-center bg-gradient-primary bg-clip-text text-transparent">
              SmartLink API Reference
            </h1>

            <div className="flex w-full max-w-md gap-2">
              <Input
                readOnly
                value={BASE_URL}
                className="cursor-text select-all shadow-soft backdrop-blur-lg"
              />
              <Button
                type="button"
                size="icon"
                variant="secondary"
                onClick={() => navigator.clipboard.writeText(BASE_URL)}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </section>

        <section className="container max-w-4xl py-16 px-4">
          <p className="mb-6 text-muted-foreground leading-relaxed text-center">
            Use these endpoints to integrate SmartLink capabilities into your own
            applications. All responses are JSON and CORS is enabled for browser
            usage.
          </p>

          {/* POST /shorten */}
          <Section
            method="POST"
            path="/shorten"
            description="Generate a new short URL. Optionally include a password to protect access."
            requestBody={`{
  "url": "https://example.com/really/long/path",
  "password": "optional-password"
}`}
            responseBody={`{
  "short_url": "${BASE_URL}/{short_code}",
  "original_url": "https://example.com/really/long/path",
  "password_protected": true
}`}
          />

          {/* GET /{short_code} */}
          <Section
            method="GET"
            path="/{short_code}"
            description="Redirects the user to the original URL. If the link is password-protected and the password query param isn’t provided, an HTML password prompt will be returned instead of a redirect."
            requestBody={null}
            responseBody="302 Redirect to original_url"
          />

          {/* GET /analytics/{short_code} */}
          <Section
            method="GET"
            path="/analytics/{short_code}"
            description="Return analytics & metadata for a short link."
            requestBody={null}
            responseBody={`{
  "short_code": "abc123",
  "original_url": "https://example.com/really/long/path",
  "clicks": 42,
  "created_at": 1699219200,
  "expiry_time": 1699824000,
  "password_protected": false
}`}
          />

          <hr className="my-10" />
          <p className="text-xs text-center text-muted-foreground">
            Need help? Open an issue or reach out on LinkedIn.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
};

interface SectionProps {
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  description: string;
  requestBody: string | null;
  responseBody: string;
}

const MethodBadge: React.FC<{ method: string }> = ({ method }) => {
  const colors: Record<string, string> = {
    GET: "bg-emerald-600",
    POST: "bg-indigo-600",
    PUT: "bg-amber-600",
    DELETE: "bg-rose-600",
  };
  return (
    <span
      className={`inline-block text-xs font-semibold uppercase tracking-wide text-white rounded px-2 py-1 ${colors[method]}`}
    >
      {method}
    </span>
  );
};

const CodeBlock: React.FC<{ code: string }> = ({ code }) => (
  <pre className="mt-3 rounded bg-muted p-4 text-sm overflow-x-auto">
    <code>{code}</code>
  </pre>
);

const Section: React.FC<SectionProps> = ({
  method,
  path,
  description,
  requestBody,
  responseBody,
}) => (
  <Card className="mb-10">
    <CardHeader>
      <CardTitle className="flex items-center gap-3 text-lg">
        <MethodBadge method={method} />
        <span>{path}</span>
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <p className="text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>

      {requestBody !== null && (
        <div>
          <p className="text-xs mb-1 font-medium">Request body</p>
          <CodeBlock code={requestBody} />
        </div>
      )}

      {responseBody && (
        <div>
          <p className="text-xs mb-1 font-medium">Response</p>
          <CodeBlock code={responseBody} />
        </div>
      )}
    </CardContent>
  </Card>
);

export default ApiDocs; 