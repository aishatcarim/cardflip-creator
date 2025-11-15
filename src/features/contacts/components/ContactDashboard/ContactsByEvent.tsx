import { useState, useMemo } from "react";
import { NetworkContact } from "@contacts/store/networkContactsStore";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@shared/ui/collapsible";
import { Button } from "@shared/ui/button";
import { Badge } from "@shared/ui/badge";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ContactsByEventProps {
  contacts: NetworkContact[];
}

export const ContactsByEvent = ({ contacts }: ContactsByEventProps) => {
  const navigate = useNavigate();

  const eventGroups = useMemo(() => {
    const groups = new Map<string, NetworkContact[]>();

    contacts.forEach(contact => {
      const event = contact.event;
      if (!groups.has(event)) {
        groups.set(event, []);
      }
      groups.get(event)!.push(contact);
    });

    // Sort by contact count, show top 5 events
    return Array.from(groups.entries())
      .sort((a, b) => b[1].length - a[1].length)
      .slice(0, 5);
  }, [contacts]);

  return (
    <div className="space-y-2">
      {eventGroups.map(([event, eventContacts]) => {
        const industries = new Map<string, number>();
        eventContacts.forEach(c => {
          industries.set(c.industry, (industries.get(c.industry) || 0) + 1);
        });

        return (
          <Collapsible key={event}>
            <CollapsibleTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-between hover:bg-accent"
              >
                <div className="flex items-center gap-3">
                  <span className="font-medium">{event}</span>
                  <Badge variant="secondary">{eventContacts.length}</Badge>
                </div>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </CollapsibleTrigger>

            <CollapsibleContent className="mt-2 ml-4 space-y-1">
              {Array.from(industries.entries()).map(([industry, count]) => (
                <Button
                  key={industry}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-muted-foreground"
                  onClick={() => {
                    navigate(`/contacts?event=${encodeURIComponent(event)}&industry=${encodeURIComponent(industry)}`);
                  }}
                >
                  <ChevronRight className="h-4 w-4 mr-2" />
                  {industry} ({count})
                </Button>
              ))}
            </CollapsibleContent>
          </Collapsible>
        );
      })}
    </div>
  );
};
