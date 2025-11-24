import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

interface ShortIdProps {
  id: string;
  prefix?: string;
}

export const ShortId = ({ id, prefix = "ID" }: ShortIdProps) => {
  const [copied, setCopied] = useState(false);
  
  const shortId = id.slice(0, 8);
  
  const handleCopy = async () => {
    await navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="inline-flex items-center gap-2 px-2 py-1 rounded bg-muted/50 font-mono text-sm group cursor-pointer hover:bg-muted transition-colors">
            <span className="text-muted-foreground text-xs">{prefix}:</span>
            <span className="font-medium">{shortId}...</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handleCopy}
            >
              {copied ? (
                <Check className="h-3 w-3 text-green-500" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </Button>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="font-mono text-xs">{id}</p>
          <p className="text-xs text-muted-foreground mt-1">Click to copy</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
