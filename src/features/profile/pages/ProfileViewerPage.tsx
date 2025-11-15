import { useParams, useNavigate } from "react-router-dom";
import { useSavedCardsStore } from "../store/savedCardsStore";
import { useNetworkContactsStore } from "@contacts/store/networkContactsStore";
import { Button } from "@shared/ui/button";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useState, MouseEvent, useEffect } from "react";
import { Download, Mail, Phone, Linkedin, ArrowLeft, UserPlus } from "lucide-react";
import { useToast } from "@shared/hooks/use-toast";
import { toPng } from "html-to-image";
import { CardFront } from "../components/CardPreview/CardFront";
import { CardBack } from "../components/CardPreview/CardBack";
import { ContactTagModal } from "@contacts/components/ContactActions/ContactTagModal";

const ProfileViewerPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { savedCards } = useSavedCardsStore();
  const { settings } = useNetworkContactsStore();
  const { toast } = useToast();
  const [isFlipped, setIsFlipped] = useState(false);
  const [showTagModal, setShowTagModal] = useState(false);

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

  // Auto-show tag modal if setting is enabled
  useEffect(() => {
    if (settings.autoShowTagModal && id) {
      const timer = setTimeout(() => setShowTagModal(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [settings.autoShowTagModal, id]);

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
              className="relative w-[400px] h-[600px] cursor-pointer"
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
                className="w-full h-full"
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Front Side */}
                <div
                  id="card-front"
                  className="absolute inset-0"
                  style={{
                    backfaceVisibility: "hidden",
                  }}
                >
                  <CardFront cardData={card.cardData} />
                </div>

                {/* Back Side */}
                <div
                  id="card-back"
                  className="absolute inset-0"
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                  }}
                >
                  <CardBack cardData={card.cardData} />
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

          {/* Tag Contact Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex justify-center"
          >
            <Button
              size="lg"
              onClick={() => setShowTagModal(true)}
              className="gap-2 shadow-lg hover:shadow-xl transition-shadow"
            >
              <UserPlus className="h-5 w-5" />
              Tag This Contact
            </Button>
          </motion.div>

          {/* Quick Actions */}
          {!isFlipped && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
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

      {/* Contact Tag Modal */}
      <ContactTagModal
        open={showTagModal}
        onOpenChange={setShowTagModal}
        profileCardId={id || ""}
        onSuccess={() => {
          toast({
            title: "Success",
            description: "Contact saved to your network",
          });
          navigate("/contacts");
        }}
      />
    </div>
  );
};

export default ProfileViewerPage;
