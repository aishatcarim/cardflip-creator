import { useParams, useNavigate } from "react-router-dom";
import { useSavedCardsStore } from "@/store/savedCardsStore";
import { Button } from "@/components/ui/button";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useState, MouseEvent } from "react";
import { Download, Mail, Phone, Linkedin, ArrowLeft } from "lucide-react";
import { CardData } from "@/store/cardStore";
import { useToast } from "@/hooks/use-toast";
import { toPng } from "html-to-image";

const ProfileViewer = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { savedCards } = useSavedCardsStore();
  const { toast } = useToast();
  const [isFlipped, setIsFlipped] = useState(false);

  const card = savedCards.find((c) => c.id === id);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useTransform(mouseY, [-300, 300], [10, -10]);
  const rotateY = useTransform(mouseX, [-300, 300], [-10, 10]);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleExport = async (side: 'front' | 'back') => {
    const element = document.getElementById(`card-${side}`);
    if (!element) return;

    try {
      const dataUrl = await toPng(element, { 
        quality: 1,
        pixelRatio: 2,
      });
      
      const link = document.createElement('a');
      link.download = `${card?.title || 'profile'}-${side}.png`;
      link.href = dataUrl;
      link.click();

      toast({
        title: "Success",
        description: `Card ${side} exported as PNG`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export card",
        variant: "destructive",
      });
    }
  };

  const handleEmailCopy = (email: string) => {
    navigator.clipboard.writeText(email);
    toast({
      title: "Copied",
      description: "Email copied to clipboard",
    });
  };

  const handlePhoneDial = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const handleLinkedInOpen = (linkedin: string) => {
    window.open(linkedin, '_blank');
  };

  if (!card) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-foreground">Profile Not Found</h1>
          <p className="text-muted-foreground">This profile card doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/')}>Go Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-accent/70 flex items-center justify-center">
                <span className="text-white font-bold text-sm">NC</span>
              </div>
              <span className="font-semibold text-foreground hidden sm:inline">
                Networking Co-pilot
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Card Title */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              {card.title}
            </h1>
            <p className="text-muted-foreground">
              Click card to flip • Interact with links below
            </p>
          </div>

          {/* Interactive 3D Card */}
          <div className="flex justify-center perspective-1000">
            <motion.div
              className="relative w-full max-w-[400px] cursor-pointer"
              style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
              }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              onClick={() => setIsFlipped(!isFlipped)}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Front Side */}
                <div
                  id="card-front"
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(0deg)",
                  }}
                  className={isFlipped ? "hidden" : ""}
                >
                  <ViewCardFront cardData={card.cardData} />
                </div>

                {/* Back Side */}
                <div
                  id="card-back"
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                  }}
                  className={!isFlipped ? "hidden" : ""}
                >
                  <ViewCardBack 
                    cardData={card.cardData}
                    onEmailCopy={handleEmailCopy}
                    onPhoneDial={handlePhoneDial}
                    onLinkedInOpen={handleLinkedInOpen}
                  />
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Export Buttons */}
          <div className="flex flex-wrap justify-center gap-3">
            <Button
              variant="outline"
              onClick={() => handleExport('front')}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Export Front (PNG)
            </Button>
            <Button
              variant="outline"
              onClick={() => handleExport('back')}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Export Back (PNG)
            </Button>
          </div>

          {/* Quick Actions */}
          {!isFlipped && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4"
            >
              {card.cardData.email && (
                <Button
                  variant="secondary"
                  onClick={() => handleEmailCopy(card.cardData.email)}
                  className="gap-2"
                >
                  <Mail className="h-4 w-4" />
                  Copy Email
                </Button>
              )}
              {card.cardData.phone && (
                <Button
                  variant="secondary"
                  onClick={() => handlePhoneDial(card.cardData.phone)}
                  className="gap-2"
                >
                  <Phone className="h-4 w-4" />
                  Call Phone
                </Button>
              )}
          {card.cardData.quickLinks?.find(link => link.icon === 'Linkedin') && (
            <Button
              variant="secondary"
              onClick={() => {
                const linkedin = card.cardData.quickLinks?.find(link => link.icon === 'Linkedin');
                if (linkedin) handleLinkedInOpen(linkedin.url);
              }}
              className="gap-2"
            >
              <Linkedin className="h-4 w-4" />
              LinkedIn
            </Button>
          )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

// Card Front Component
const ViewCardFront = ({ cardData }: { cardData: CardData }) => {
  return (
    <div
      className="w-full aspect-[2/3] rounded-2xl shadow-2xl overflow-hidden"
      style={{
        background: cardData.backgroundColor || "hsl(var(--card))",
      }}
    >
      <div className="h-full flex flex-col p-8">
        {/* Logo and Name Section */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            {cardData.showLogo && cardData.companyLogo && (
              <img
                src={cardData.companyLogo}
                alt="Company Logo"
                className="h-12 w-auto mb-4 object-contain"
              />
            )}
            <h2
              className="text-2xl font-bold mb-1"
              style={{ color: cardData.textColor || "hsl(var(--foreground))" }}
            >
              {cardData.fullName || "Your Name"}
            </h2>
            <p
              className="text-sm opacity-90"
              style={{ color: cardData.textColor || "hsl(var(--foreground))" }}
            >
              {cardData.role || "Your Role"}
            </p>
            {cardData.companyWebsite && (
              <p
                className="text-xs mt-1 opacity-75"
                style={{ color: cardData.textColor || "hsl(var(--foreground))" }}
              >
                {cardData.companyWebsite}
              </p>
            )}
          </div>
        </div>

        {/* Profile Image */}
        <div className="flex-1 flex items-end justify-end">
          {cardData.profileImage && (
            <div
              className="w-48 h-48 rounded-xl overflow-hidden shadow-lg"
            >
              <img
                src={cardData.profileImage}
                alt="Profile"
                className="w-full h-full object-cover"
                style={{
                  objectPosition: `${cardData.imagePositionX || 0}% ${cardData.imagePositionY || 0}%`,
                  filter: cardData.grayscale ? 'grayscale(100%)' : 'none',
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Card Back Component
const ViewCardBack = ({ 
  cardData,
  onEmailCopy,
  onPhoneDial,
  onLinkedInOpen 
}: { 
  cardData: CardData;
  onEmailCopy: (email: string) => void;
  onPhoneDial: (phone: string) => void;
  onLinkedInOpen: (url: string) => void;
}) => {
  return (
    <div
      className="w-full aspect-[2/3] rounded-2xl shadow-2xl overflow-hidden"
      style={{
        background: cardData.backgroundColor || "hsl(var(--card))",
      }}
    >
      <div className="h-full flex flex-col p-8">
        {/* Bio Section */}
        <div className="mb-6">
          <h3
            className="text-lg font-semibold mb-2"
            style={{ color: cardData.textColor || "hsl(var(--foreground))" }}
          >
            About
          </h3>
          <p
            className="text-sm opacity-90 leading-relaxed"
            style={{ color: cardData.textColor || "hsl(var(--foreground))" }}
          >
            {cardData.bio || "Your bio goes here"}
          </p>
        </div>

        {/* Interests */}
        {cardData.interests && cardData.interests.length > 0 && (
          <div className="mb-6">
            <h3
              className="text-lg font-semibold mb-2"
              style={{ color: cardData.textColor || "hsl(var(--foreground))" }}
            >
              Interests
            </h3>
            <div className="flex flex-wrap gap-2">
              {cardData.interests.map((interest, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: `${cardData.textColor || "hsl(var(--foreground))"}20`,
                    color: cardData.textColor || "hsl(var(--foreground))",
                  }}
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Contact Info - Interactive */}
        <div className="space-y-3 mb-6">
          {cardData.email && (
            <button
              onClick={() => onEmailCopy(cardData.email)}
              className="w-full text-left p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" style={{ color: cardData.textColor }} />
                <span
                  className="text-sm"
                  style={{ color: cardData.textColor || "hsl(var(--foreground))" }}
                >
                  {cardData.email}
                </span>
              </div>
            </button>
          )}
          {cardData.phone && (
            <button
              onClick={() => onPhoneDial(cardData.phone)}
              className="w-full text-left p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" style={{ color: cardData.textColor }} />
                <span
                  className="text-sm"
                  style={{ color: cardData.textColor || "hsl(var(--foreground))" }}
                >
                  {cardData.phone}
                </span>
              </div>
            </button>
          )}
        </div>

        {/* Quick Links - Interactive */}
        {cardData.quickLinks && cardData.quickLinks.length > 0 && (
          <div className="space-y-2">
            {cardData.quickLinks.map((link, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (link.icon === 'Linkedin') {
                    onLinkedInOpen(link.url);
                  } else {
                    window.open(link.url, '_blank');
                  }
                }}
                className="w-full text-left p-2 rounded-lg hover:bg-white/10 transition-colors flex items-center gap-2"
              >
                <Linkedin className="h-4 w-4" style={{ color: cardData.textColor }} />
                <span
                  className="text-sm"
                  style={{ color: cardData.textColor || "hsl(var(--foreground))" }}
                >
                  {link.label}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* CTA */}
        {cardData.ctaText && (
          <div className="mt-auto pt-6 border-t border-white/10">
            <p
              className="text-center text-sm font-medium"
              style={{ color: cardData.textColor || "hsl(var(--foreground))" }}
            >
              {cardData.ctaText}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileViewer;
