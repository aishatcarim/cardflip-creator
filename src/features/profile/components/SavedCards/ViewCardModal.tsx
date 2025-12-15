import { useState, useRef } from "react";
import { Dialog, DialogContent } from "@shared/ui/dialog";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { CardData } from "@profile/store/cardStore";
import { Mail, Phone, Linkedin, Twitter, Globe, X } from "lucide-react";
import { Badge } from "@shared/ui/badge";
import { Button } from "@shared/ui/button";

const iconMap: Record<string, any> = {
  Linkedin,
  Twitter,
  Globe,
};

interface ViewCardModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cardData: CardData;
}

export const ViewCardModal = ({ open, onOpenChange, cardData }: ViewCardModalProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[500px] p-0 border-0 bg-transparent">
        <Button
          variant="ghost"
          size="icon"
          className="absolute -top-12 right-0 text-white hover:bg-white/20 z-50"
          onClick={() => onOpenChange(false)}
        >
          <X className="h-6 w-6" />
        </Button>
        
        <InteractiveCard 
          cardData={cardData} 
          isFlipped={isFlipped}
          onFlip={() => setIsFlipped(!isFlipped)}
        />
      </DialogContent>
    </Dialog>
  );
};

interface InteractiveCardProps {
  cardData: CardData;
  isFlipped: boolean;
  onFlip: () => void;
}

const InteractiveCard = ({ cardData, isFlipped, onFlip }: InteractiveCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const rotateX = useTransform(mouseY, [0, 1], [8, -8]);
  const rotateY = useTransform(mouseX, [0, 1], [-8, 8]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  return (
    <motion.div
      ref={cardRef}
      className="relative w-[400px] h-[600px] cursor-pointer"
      style={{
        perspective: "1000px",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onFlip}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="relative w-full h-full"
        style={{
          transformStyle: "preserve-3d",
          rotateX,
          rotateY,
        }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 backface-hidden"
          style={{
            backfaceVisibility: "hidden",
          }}
        >
          <ViewCardFront cardData={cardData} />
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 backface-hidden"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <ViewCardBack cardData={cardData} />
        </div>
      </motion.div>
    </motion.div>
  );
};

const ViewCardFront = ({ cardData }: { cardData: CardData }) => {
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
      className="relative w-full h-full rounded-lg overflow-hidden shadow-2xl"
      style={{ backgroundColor }}
    >
      {/* Company Logo */}
      {showLogo && companyLogo && (
        <div className="absolute top-6 right-6 w-12 h-12 z-10">
          <img 
            src={companyLogo} 
            alt="Company Logo" 
            className="w-full h-full object-contain"
          />
        </div>
      )}

      {/* Name and Role */}
      <div className={`absolute top-6 ${portraitOrientation === 'left' ? 'left-6' : 'right-6'} z-10 max-w-[45%]`}>
        <h1 className="text-2xl font-light leading-tight mb-1" style={{ color: textColor }}>
          {fullName.split(' ')[0]}<br />
          {fullName.split(' ').slice(1).join(' ')}
        </h1>
        <p className="text-xs pt-1" style={{ color: textColor, borderTop: `1px solid ${brandColor}` }}>
          {role}
        </p>
      </div>

      {/* Website (vertical text) */}
      <div className={`absolute ${portraitOrientation === 'left' ? 'left-6' : 'right-6'} top-1/2 -translate-y-1/2 z-10`}>
        <p 
          className="text-xs tracking-wider"
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
              <p className="text-muted-foreground text-sm">No Image</p>
            </div>
          )}
        </div>
      </div>

      {/* Company Name Footer */}
      <div 
        className="absolute bottom-0 left-0 right-0 px-6"
        style={{
          paddingTop: `${1 * bandHeight}rem`,
          paddingBottom: `${1 * bandHeight}rem`,
          backgroundColor: brandColor
        }}
      >
        <p className="text-center text-sm font-light tracking-[0.3em] text-white">
          {companyName}
        </p>
      </div>
    </div>
  );
};

const ViewCardBack = ({ cardData }: { cardData: CardData }) => {
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
      className="relative w-full h-full rounded-lg overflow-hidden shadow-2xl p-8 flex flex-col"
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
