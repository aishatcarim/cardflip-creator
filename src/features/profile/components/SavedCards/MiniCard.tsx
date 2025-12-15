import { useState } from "react";
import { motion } from "framer-motion";
import { CardData } from "@profile/store/cardStore";
import { Mail, Phone, Linkedin, Twitter, Globe } from "lucide-react";
import { Badge } from "@shared/ui/badge";

const iconMap: Record<string, any> = {
  Linkedin,
  Twitter,
  Globe,
};

interface MiniCardProps {
  cardData: CardData;
  onClick?: () => void;
}

export const MiniCard = ({ cardData, onClick }: MiniCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFlipped(!isFlipped);
  };

  return (
    <div 
      className="perspective-1000 cursor-pointer"
      onClick={onClick}
      onDoubleClick={handleFlip}
    >
      <motion.div
        className="relative w-full aspect-[2/3]"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 backface-hidden"
          style={{
            backfaceVisibility: "hidden",
          }}
        >
          <MiniCardFront cardData={cardData} />
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 backface-hidden"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <MiniCardBack cardData={cardData} />
        </div>
      </motion.div>
    </div>
  );
};

const MiniCardFront = ({ cardData }: { cardData: CardData }) => {
  const {
    fullName,
    role,
    profileImage,
    grayscale,
    companyName,
    companyWebsite,
    companyLogo,
    showLogo,
    backgroundColor,
    brandColor,
    textColor,
    portraitOrientation,
    imageWidth,
    imageHeight,
    imageScale,
    imagePositionX,
    imagePositionY,
    bandHeight,
  } = cardData;

  return (
    <div 
      className="relative w-full h-full rounded-lg overflow-hidden shadow-lg"
      style={{ backgroundColor }}
    >
      {/* Company Logo */}
      {showLogo && companyLogo && (
        <div className="absolute top-3 right-3 w-6 h-6 z-10">
          <img 
            src={companyLogo} 
            alt="Company Logo" 
            className="w-full h-full object-contain"
          />
        </div>
      )}

      {/* Name and Role */}
      <div className={`absolute top-3 ${portraitOrientation === 'left' ? 'left-3' : 'right-3'} z-10 max-w-[45%]`}>
        <h1 className="text-xs font-light leading-tight mb-0.5" style={{ color: textColor }}>
          {fullName.split(' ')[0]}<br />
          {fullName.split(' ').slice(1).join(' ')}
        </h1>
        <p className="text-[8px] pt-0.5" style={{ color: textColor, borderTop: `1px solid ${brandColor}` }}>
          {role}
        </p>
      </div>

      {/* Website (vertical text) */}
      <div className={`absolute ${portraitOrientation === 'left' ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 z-10`}>
        <p 
          className="text-[8px] tracking-wider"
          style={{ 
            writingMode: 'vertical-rl',
            textOrientation: 'mixed',
            color: textColor
          }}
        >
          {companyWebsite}
        </p>
      </div>

      {/* Profile Image */}
      <div 
        className={`absolute ${portraitOrientation === 'left' ? 'right-0' : 'left-0'} top-0 overflow-hidden`}
        style={{
          width: `${imageWidth}%`,
          height: `${imageHeight}%`
        }}
      >
        <div className="w-full h-full overflow-hidden">
          {profileImage ? (
            <img
              src={profileImage}
              alt={fullName}
              className={`w-full h-full object-cover ${grayscale ? 'grayscale' : ''}`}
              style={{
                transform: `scale(${imageScale}) translate(${imagePositionX}%, ${imagePositionY}%)`,
                transformOrigin: 'center center'
              }}
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <p className="text-muted-foreground text-[8px]">No Image</p>
            </div>
          )}
        </div>
      </div>

      {/* Company Name Footer */}
      <div 
        className="absolute bottom-0 left-0 right-0 px-3"
        style={{
          paddingTop: `${0.5 * bandHeight}rem`,
          paddingBottom: `${0.5 * bandHeight}rem`,
          backgroundColor: brandColor
        }}
      >
        <p className="text-center text-[8px] font-light tracking-[0.3em] text-white">
          {companyName}
        </p>
      </div>
    </div>
  );
};

const MiniCardBack = ({ cardData }: { cardData: CardData }) => {
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
    textColor,
    accentColor,
  } = cardData;

  return (
    <div 
      className="relative w-full h-full rounded-lg overflow-hidden shadow-lg p-4 flex flex-col"
      style={{ 
        backgroundColor
      }}
    >
      {/* Bio Section */}
      <div className="mb-3">
        <p className="text-[8px] leading-relaxed line-clamp-3" style={{ color: textColor }}>
          {bio}
        </p>
      </div>

      {/* Interests */}
      {interests.length > 0 && (
        <div className="mb-3">
          <h3 className="text-[7px] font-medium mb-1" style={{ color: textColor, opacity: 0.7 }}>INTERESTS</h3>
          <div className="flex flex-wrap gap-1">
            {interests.slice(0, 3).map((interest, index) => (
              <Badge key={index} variant="secondary" className="text-[7px] px-1 py-0" style={{ color: textColor }}>
                {interest}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Contact Info */}
      {(email || phone) && (
        <div className="mb-3 space-y-1">
          {email && (
            <div className="flex items-center gap-1 text-[7px]" style={{ color: textColor, opacity: 0.7 }}>
              <Mail className="w-2 h-2" />
              <span className="truncate">{email}</span>
            </div>
          )}
          {phone && (
            <div className="flex items-center gap-1 text-[7px]" style={{ color: textColor, opacity: 0.7 }}>
              <Phone className="w-2 h-2" />
              <span>{phone}</span>
            </div>
          )}
        </div>
      )}

      {/* Quick Links */}
      {quickLinks.length > 0 && (
        <div className="mb-auto">
          <h3 className="text-[7px] font-medium mb-1" style={{ color: textColor, opacity: 0.7 }}>CONNECT</h3>
          <div className="space-y-1">
            {quickLinks.slice(0, 2).map((link, index) => {
              const Icon = iconMap[link.icon] || Globe;
              return (
                <div key={index} className="flex items-center gap-1 text-[7px]" style={{ color: textColor }}>
                  <Icon className="w-2 h-2" style={{ color: textColor }} />
                  <span className="truncate">{link.url}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* CTA */}
      {ctaText && (
        <div className="mt-2">
          <p className="text-[7px] text-center font-medium italic" style={{ color: accentColor }}>
            {ctaText}
          </p>
        </div>
      )}

      {/* Footer */}
      <div className="mt-2 pt-2 border-t border-border flex items-center justify-center">
        {companyLogo ? (
          <img 
            src={companyLogo} 
            alt="Company Logo" 
            className="h-3 object-contain opacity-50"
          />
        ) : (
          <p className="text-[7px] tracking-[0.2em]" style={{ color: textColor, opacity: 0.5 }}>
            {companyName}
          </p>
        )}
      </div>
    </div>
  );
};
