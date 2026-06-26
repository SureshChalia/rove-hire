"use client";

import { useState } from "react";
import { Check, Copy, ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function MagicLinkActions({
  applicationPath,
}: {
  applicationPath: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    const url = new URL(applicationPath, window.location.origin).toString();
    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button type="button" size="sm" variant="outline" onClick={copyLink}>
        {copied ? <Check /> : <Copy />}
        {copied ? "Copied" : "Copy Link"}
      </Button>
      <Button asChild type="button" size="sm" variant="outline">
        <a href={applicationPath} target="_blank" rel="noreferrer">
          <ExternalLink /> Open Link
        </a>
      </Button>
    </div>
  );
}
