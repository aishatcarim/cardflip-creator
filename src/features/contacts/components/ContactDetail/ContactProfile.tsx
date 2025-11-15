import { NetworkContact } from "@contacts/store/networkContactsStore";
import { Card } from "@shared/ui/card";
import { Badge } from "@shared/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@shared/ui/avatar";
import { MapPin, Calendar, Building, Mail, Phone, Globe, Star } from "lucide-react";

interface ContactProfileProps {
  contact: NetworkContact;
}

export const ContactProfile = ({ contact }: ContactProfileProps) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getDaysSinceContact = () => {
    const taggedDate = new Date(contact.taggedAt);
    const now = new Date();
    return Math.floor((now.getTime() - taggedDate.getTime()) / (1000 * 60 * 60 * 24));
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start gap-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src="" alt={contact.contactName} />
            <AvatarFallback className="text-lg">
              {getInitials(contact.contactName)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <h2 className="text-xl font-bold text-foreground">{contact.contactName}</h2>
            <p className="text-muted-foreground">{contact.title || contact.industry}</p>
            {contact.company && (
              <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                <Building className="h-3 w-3" />
                {contact.company}
              </p>
            )}
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-3">
          {contact.email && (
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{contact.email}</span>
            </div>
          )}

          {contact.phone && (
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{contact.phone}</span>
            </div>
          )}

          {contact.quickLinks?.find(link => link.icon === 'Website') && (
            <div className="flex items-center gap-2 text-sm">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <span>{contact.quickLinks.find(link => link.icon === 'Website')?.url}</span>
            </div>
          )}
        </div>

        {/* Meeting Context */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>Met at {contact.event}</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{getDaysSinceContact()} days ago</span>
          </div>
        </div>

        {/* Interests */}
        {contact.interests.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2">Interests</h4>
            <div className="flex flex-wrap gap-1">
              {contact.interests.map((interest) => (
                <Badge key={interest} variant="secondary" className="text-xs">
                  {interest}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Industry */}
        {contact.industry && (
          <div className="flex items-center gap-2">
            <Badge variant="outline">{contact.industry}</Badge>
          </div>
        )}

        {/* Follow-up Status */}
        <div className="pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Follow-up Status</span>
            <Badge
              variant={
                contact.followUpStatus === 'done' ? 'default' :
                contact.followUpStatus === 'pending' ? 'secondary' :
                contact.followUpStatus === 'snoozed' ? 'outline' : 'secondary'
              }
            >
              {contact.followUpStatus || 'none'}
            </Badge>
          </div>

          {contact.followUpDueDate && (
            <div className="mt-2 text-xs text-muted-foreground">
              Due: {new Date(contact.followUpDueDate).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
