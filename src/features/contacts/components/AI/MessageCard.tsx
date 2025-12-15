import { useState } from 'react';
import { Button } from '@shared/ui/button';
import { Badge } from '@shared/ui/badge';
import { Card } from '@shared/ui/card';
import { Copy, Check, Edit, Sparkles, Briefcase, Coffee } from 'lucide-react';

interface MessageSuggestion {
  tone: 'professional' | 'value_first' | 'casual';
  message: string;
  platform: string;
}

interface MessageCardProps {
  content: string;
  suggestions?: MessageSuggestion[];
}

export const MessageCard = ({ content, suggestions }: MessageCardProps) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const getToneIcon = (tone: string) => {
    switch (tone) {
      case 'professional':
        return <Briefcase className="h-3 w-3" />;
      case 'value_first':
        return <Sparkles className="h-3 w-3" />;
      case 'casual':
        return <Coffee className="h-3 w-3" />;
      default:
        return <Sparkles className="h-3 w-3" />;
    }
  };

  const getToneColor = (tone: string) => {
    switch (tone) {
      case 'professional':
        return 'bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400';
      case 'value_first':
        return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400';
      case 'casual':
        return 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400';
      default:
        return 'bg-muted border-border text-muted-foreground';
    }
  };

  const getToneLabel = (tone: string) => {
    switch (tone) {
      case 'professional':
        return 'Professional';
      case 'value_first':
        return 'Value-First';
      case 'casual':
        return 'Casual';
      default:
        return tone;
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card p-4 max-w-[90%] space-y-3">
      <p className="text-sm text-foreground">{content}</p>

      {suggestions && suggestions.length > 0 && (
        <div className="space-y-3">
          {suggestions.map((suggestion, idx) => {
            const suggestionId = `suggestion-${idx}`;
            const isCopied = copiedId === suggestionId;

            return (
              <div
                key={idx}
                className="rounded-lg border border-border bg-muted/30 p-3"
              >
                <div className="flex items-center justify-between mb-2 gap-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={`gap-1 text-[10px] px-2 py-0.5 ${getToneColor(suggestion.tone)}`}>
                      {getToneIcon(suggestion.tone)}
                      {getToneLabel(suggestion.tone)}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground">
                      via {suggestion.platform}
                    </span>
                  </div>

                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(suggestion.message, suggestionId)}
                      className="h-7 px-2 text-xs gap-1"
                    >
                      {isCopied ? (
                        <>
                          <Check className="h-3 w-3 text-emerald-500" />
                          <span className="text-emerald-500">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                <div className="text-sm text-foreground whitespace-pre-wrap rounded-md border border-border bg-background p-3">
                  {suggestion.message}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <p className="text-[10px] text-muted-foreground border-t border-border pt-2">
        Messages personalized based on your meeting context
      </p>
    </div>
  );
};
