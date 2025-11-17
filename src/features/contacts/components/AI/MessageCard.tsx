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
        return 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-950/30 dark:border-blue-800 dark:text-blue-300';
      case 'value_first':
        return 'bg-green-50 border-green-200 text-green-700 dark:bg-green-950/30 dark:border-green-800 dark:text-green-300';
      case 'casual':
        return 'bg-orange-50 border-orange-200 text-orange-700 dark:bg-orange-950/30 dark:border-orange-800 dark:text-orange-300';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-700 dark:bg-gray-950/30 dark:border-gray-800 dark:text-gray-300';
    }
  };

  return (
    <div className="rounded-2xl border border-border/60 bg-white/80 p-5 shadow-sm max-w-[80%] space-y-5">
      <p className="text-sm text-foreground">{content}</p>

      {suggestions && suggestions.length > 0 && (
        <div className="space-y-3">
          {suggestions.map((suggestion, idx) => {
            const suggestionId = `suggestion-${idx}`;
            const isCopied = copiedId === suggestionId;

            return (
              <div
                key={idx}
                className="rounded-2xl border border-border/60 bg-[#F5F7FF] p-4 shadow-inner"
              >
                <div className="flex items-center justify-between mb-3 gap-2">
                  <Badge variant="outline" className={`gap-1 ${getToneColor(suggestion.tone)}`}>
                    {getToneIcon(suggestion.tone)}
                    {suggestion.tone.replace('_', ' ').toUpperCase()}
                  </Badge>

                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(suggestion.message, suggestionId)}
                      className="gap-1"
                    >
                      {isCopied ? (
                        <>
                          <Check className="h-3 w-3" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          Copy
                        </>
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        console.log('Refine message:', suggestion);
                      }}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <div className="text-sm text-foreground whitespace-pre-wrap rounded-xl border border-border/40 bg-white/90 p-3 font-mono">
                  {suggestion.message}
                </div>

                <p className="mt-2 text-[11px] text-muted-foreground">
                  Best for: <span className="font-medium text-foreground">{suggestion.platform}</span>
                </p>
              </div>
            );
          })}
        </div>
      )}

      <div className="text-xs text-muted-foreground border-t border-border/50 pt-2">
        💡 <em>Messages are personalized based on your meeting context and relationship history</em>
      </div>
    </div>
  );
};
