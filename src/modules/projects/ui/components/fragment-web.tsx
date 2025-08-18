"use client";

import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import { Fragment } from "@/generated/prisma";
import { ExternalLinkIcon, RefreshCcwIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface FragmentWebProps {
  data: Fragment;
}

export default function FragmentWeb({ data }: FragmentWebProps) {
  const [copied, setCopied] = useState(false);
  const [fragmentKey, setFragmentKey] = useState(0);
  const [iframeError, setIframeError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const onRefresh = () => {
    setFragmentKey((prev) => prev + 1);
    setIframeError(false);
    setIsLoading(true);
  };

  const onCopy = () => {
    if (!data.sandboxUrl) return;
    navigator.clipboard.writeText(data.sandboxUrl);
    toast.success("Website URL copied.");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
    setIframeError(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setIframeError(true);
    toast.error(
      "Failed to load preview. Try refreshing or opening in new tab."
    );
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
      <iframe
        key={fragmentKey}
        className="w-full h-full"
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-top-navigation allow-modals"
        loading="lazy"
        src={data.sandboxUrl}
        referrerPolicy="no-referrer-when-downgrade"
        allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media; usb"
      />
    </div>
  );
}
