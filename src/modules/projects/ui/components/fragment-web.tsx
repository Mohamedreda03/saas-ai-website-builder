"use client";

import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import { Fragment } from "@/generated/prisma";
import { ExternalLinkIcon, RefreshCcwIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface FragmentWebProps {
  data: Fragment;
}

export default function FragmentWeb({ data }: FragmentWebProps) {
  const [copied, setCopied] = useState(false);
  const [fragmentKey, setFragmentKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const onRefresh = () => {
    setFragmentKey((prev) => prev + 1);
    setIsLoading(true);
    setHasError(false);
  };

  // Timeout للتعامل مع الحالات التي لا تُحمّل
  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        setIsLoading(false);
        setHasError(true);
        toast.error("Preview timed out. The sandbox might be expired.");
      }, 15000); // 15 ثانية timeout

      return () => clearTimeout(timer);
    }
  }, [isLoading, fragmentKey]);

  const onCopy = () => {
    if (!data.sandboxUrl) return;
    navigator.clipboard.writeText(data.sandboxUrl);
    toast.success("Website URL copied.");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col w-full h-full">
      <div className="p-2 border-b bg-sidebar flex items-center gap-x-2">
        <Hint text="Refresh the preview" side="bottom" align="start">
          <Button size="sm" variant="outline" onClick={onRefresh}>
            <RefreshCcwIcon />
          </Button>
        </Hint>

        <Hint text="Copy website URL" side="bottom" align="center">
          <Button
            variant="outline"
            onClick={onCopy}
            disabled={!data.sandboxUrl || copied}
            className="flex flex-1 font-normal justify-start text-start"
          >
            <span className="truncate">{data.sandboxUrl}</span>
          </Button>
        </Hint>

        <Hint text="Open in new tab" side="bottom" align="end">
          <Button
            size="sm"
            variant="outline"
            disabled={!data.sandboxUrl}
            onClick={() => {
              if (!data.sandboxUrl) return;
              window.open(data.sandboxUrl, "_blank");
            }}
          >
            <ExternalLinkIcon />
          </Button>
        </Hint>
      </div>

      <div className="relative flex-1">
        {/* Loading State */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background z-10">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-sm text-muted-foreground">
                Loading preview...
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-background z-10">
            <div className="text-center space-y-4 p-6">
              <ExternalLinkIcon className="h-12 w-12 mx-auto text-muted-foreground" />
              <div className="space-y-2">
                <h3 className="font-semibold text-foreground">
                  Preview unavailable
                </h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  The sandbox might be expired or temporarily unavailable.
                </p>
                {data.sandboxUrl && (
                  <p className="text-xs text-muted-foreground font-mono break-all bg-muted p-2 rounded">
                    {data.sandboxUrl}
                  </p>
                )}
              </div>
              <div className="flex gap-2 justify-center">
                <Button onClick={onRefresh} variant="outline" size="sm">
                  <RefreshCcwIcon className="h-4 w-4 mr-2" />
                  Retry
                </Button>
                <Button
                  onClick={() =>
                    data.sandboxUrl && window.open(data.sandboxUrl, "_blank")
                  }
                  variant="default"
                  size="sm"
                  disabled={!data.sandboxUrl}
                >
                  <ExternalLinkIcon className="h-4 w-4 mr-2" />
                  Open in New Tab
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Iframe */}
        <iframe
          key={fragmentKey}
          className="w-full h-full border-0"
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-top-navigation"
          loading="lazy"
          src={data.sandboxUrl}
          onLoad={() => {
            setIsLoading(false);
            setHasError(false);
          }}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
          style={{
            display: hasError ? "none" : "block",
            minHeight: "400px",
          }}
        />
      </div>
    </div>
  );
}
