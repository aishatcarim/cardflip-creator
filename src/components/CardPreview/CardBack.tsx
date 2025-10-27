import { useCardStore } from "@/store/cardStore";
import { Mail, Phone, Linkedin, Twitter, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const iconMap: Record<string, any> = {
  Linkedin,
  Twitter,
  Globe,
};

export const CardBack = () => {
  const { cardData } = useCardStore();
  const {
    bio,
    interests,
    email,
    phone,
    quickLinks,
    ctaText,
    companyName,
    companyLogo,
    backgroundColor,
    backLayoutStyle,
  } = cardData;

  return (
    <div 
      className="relative w-full h-full rounded-lg overflow-hidden shadow-elevation p-8 flex flex-col"
      style={{ 
        backgroundColor,
        transform: 'rotateY(180deg)'
      }}
    >
      {/* Bio Section */}
      <div className="mb-6">
        <p className="text-sm text-foreground leading-relaxed">
          {bio}
        </p>
      </div>

      {/* Interests */}
      {interests.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xs font-medium text-muted-foreground mb-2">INTERESTS</h3>
          <div className="flex flex-wrap gap-2">
            {interests.map((interest, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {interest}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Contact Info */}
      {(email || phone) && (
        <div className="mb-6 space-y-2">
          {email && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Mail className="w-3 h-3" />
              <span>{email}</span>
            </div>
          )}
          {phone && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Phone className="w-3 h-3" />
              <span>{phone}</span>
            </div>
          )}
        </div>
      )}

      {/* Quick Links */}
      {quickLinks.length > 0 && (
        <div className="mb-auto">
          <h3 className="text-xs font-medium text-muted-foreground mb-2">CONNECT</h3>
          <div className="space-y-2">
            {quickLinks.map((link, index) => {
              const Icon = iconMap[link.icon] || Globe;
              return (
                <div key={index} className="flex items-center gap-2 text-xs text-foreground">
                  <Icon className="w-3 h-3" />
                  <span className="truncate">{link.url}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* CTA */}
      {ctaText && (
        <div className="mt-4">
          <p className="text-xs text-center font-medium text-accent italic">
            {ctaText}
          </p>
        </div>
      )}

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-border flex items-center justify-center">
        {companyLogo ? (
          <img 
            src={companyLogo} 
            alt="Company Logo" 
            className="h-6 object-contain opacity-50"
          />
        ) : (
          <p className="text-xs text-muted-foreground tracking-[0.2em]">
            {companyName}
          </p>
        )}
      </div>
    </div>
  );
};
