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
    textColor,
    accentColor,
  } = cardData;

  return (
    <div 
      className="relative w-full h-full rounded-lg overflow-hidden shadow-elevation p-8 flex flex-col"
      style={{ 
        backgroundColor
      }}
    >
      {/* Bio Section */}
      <div className="mb-6">
        <p className="text-sm leading-relaxed" style={{ color: textColor }}>
          {bio}
        </p>
      </div>

      {/* Interests */}
      {interests.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xs font-medium mb-2" style={{ color: textColor, opacity: 0.7 }}>INTERESTS</h3>
          <div className="flex flex-wrap gap-2">
            {interests.map((interest, index) => (
              <Badge key={index} variant="secondary" className="text-xs" style={{ color: textColor }}>
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
            <div className="flex items-center gap-2 text-xs" style={{ color: textColor, opacity: 0.7 }}>
              <Mail className="w-3 h-3" />
              <span>{email}</span>
            </div>
          )}
          {phone && (
            <div className="flex items-center gap-2 text-xs" style={{ color: textColor, opacity: 0.7 }}>
              <Phone className="w-3 h-3" />
              <span>{phone}</span>
            </div>
          )}
        </div>
      )}

      {/* Quick Links */}
      {quickLinks.length > 0 && (
        <div className="mb-auto">
          <h3 className="text-xs font-medium mb-2" style={{ color: textColor, opacity: 0.7 }}>CONNECT</h3>
          <div className="space-y-2">
            {quickLinks.map((link, index) => {
              const Icon = iconMap[link.icon] || Globe;
              return (
                <div key={index} className="flex items-center gap-2 text-xs" style={{ color: textColor }}>
                  <Icon className="w-3 h-3" style={{ color: textColor }} />
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
          <p className="text-xs text-center font-medium italic" style={{ color: accentColor }}>
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
          <p className="text-xs tracking-[0.2em]" style={{ color: textColor, opacity: 0.5 }}>
            {companyName}
          </p>
        )}
      </div>
    </div>
  );
};
