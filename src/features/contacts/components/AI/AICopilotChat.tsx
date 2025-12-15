import { useState, useRef, useEffect } from 'react';
import { NetworkContact } from '@contacts/store/networkContactsStore';
import { Card } from '@shared/ui/card';
import { Button } from '@shared/ui/button';
import { Textarea } from '@shared/ui/textarea';
import { ScrollArea } from '@shared/ui/scroll-area';
import { MessageCard } from './MessageCard';
import { Send, Loader2, Sparkles } from 'lucide-react';

interface AICopilotChatProps {
  contact: NetworkContact;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestions?: MessageSuggestion[];
}

interface MessageSuggestion {
  tone: 'professional' | 'value_first' | 'casual';
  message: string;
  platform: string;
}

export const AICopilotChat = ({ contact }: AICopilotChatProps) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hi! I'm your AI networking assistant. I can help you craft the perfect follow-up message for ${contact.contactName}. What would you like to do?`,
      timestamp: new Date().toISOString(),
      suggestions: [
        {
          tone: 'professional',
          message: `Hi ${contact.contactName}, I enjoyed our conversation at ${contact.event}. I'd love to continue our discussion about ${contact.interests[0] || 'your work'}.`,
          platform: 'LinkedIn'
        },
        {
          tone: 'value_first',
          message: `Hi ${contact.contactName}, following up on our meeting at ${contact.event}. I thought you might find this resource helpful.`,
          platform: 'Email'
        },
        {
          tone: 'casual',
          message: `Hey ${contact.contactName}! Great meeting you at ${contact.event}. Let's grab coffee sometime?`,
          platform: 'Text'
        }
      ]
    }
  ]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response (for UI demo - will be replaced with real API)
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: `Based on ${contact.contactName}'s profile and your meeting at ${contact.event}, here are some personalized follow-up suggestions:`,
        timestamp: new Date().toISOString(),
        suggestions: [
          {
            tone: 'professional',
            message: `Dear ${contact.contactName},\n\nI hope this email finds you well. It was a pleasure meeting you at ${contact.event} and learning about your work in ${contact.industry}.\n\nI'd be interested in exploring potential collaboration opportunities. Would you be available for a brief call next week?\n\nBest regards,\n[Your Name]`,
            platform: 'Email'
          },
          {
            tone: 'value_first',
            message: `Hi ${contact.contactName},\n\nFollowing up on our conversation at ${contact.event} about ${contact.interests[0] || 'your projects'}.\n\nI came across this article that reminded me of our discussion: [link]\n\nWould love to hear your thoughts when you have a moment.\n\nBest,\n[Your Name]`,
            platform: 'LinkedIn'
          },
          {
            tone: 'casual',
            message: `Hey ${contact.contactName}! 👋\n\nReally enjoyed our chat at ${contact.event}. You mentioned being interested in ${contact.interests[0] || 'tech'}. Have you seen the latest developments in that space?\n\nLet's stay in touch!\n\nCheers,\n[Your Name]`,
            platform: 'WhatsApp'
          }
        ]
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickPrompts = [
    "Help me write a follow-up email",
    "Suggest a LinkedIn message",
    "Create a casual check-in",
    "What should I say next?"
  ];

  return (
    <Card className="flex flex-col h-full rounded-xl border border-border bg-card shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border px-4 py-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <Sparkles className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-foreground">AI Networking Copilot</h3>
          <p className="text-xs text-muted-foreground">
            Personalized messages for {contact.contactName}
          </p>
        </div>
        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-primary">
          Beta
        </span>
      </div>

      {/* Chat Messages */}
      <ScrollArea className="flex-1 px-4 py-4">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'user' ? (
                <div className="max-w-[85%] rounded-xl bg-primary text-primary-foreground px-4 py-2.5 text-sm">
                  {msg.content}
                </div>
              ) : (
                <MessageCard content={msg.content} suggestions={msg.suggestions} />
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="rounded-xl border border-border bg-muted/50 px-4 py-2.5 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Generating suggestions...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {/* Quick Prompts */}
      {messages.filter((m) => m.role === "user").length === 0 && (
        <div className="px-4 pb-3">
          <p className="text-xs font-medium text-muted-foreground mb-2">Quick prompts</p>
          <div className="flex flex-wrap gap-2">
            {quickPrompts.map((prompt, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => setInput(prompt)}
                className="rounded-lg text-xs h-8"
              >
                {prompt}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="border-t border-border px-4 py-3">
        <div className="flex items-end gap-2">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask AI to help craft a follow-up message..."
            className="flex-1 resize-none rounded-lg border-border bg-background px-3 py-2 text-sm min-h-[40px] max-h-[120px]"
            rows={1}
            onKeyDown={handleKeyPress}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            size="icon"
            className="h-10 w-10 rounded-lg shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-[10px] text-muted-foreground mt-1.5">
          Press Enter to send • Shift+Enter for new line
        </p>
      </div>
    </Card>
  );
};
