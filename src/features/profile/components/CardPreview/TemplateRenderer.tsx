import { useTemplateStore } from "@profile/store/templateStore";
import { useCardStore } from "@profile/store/cardStore";
import { CardElement, CardSide, resolveDataBinding, CardDataFields } from "@profile/types/cardElements";
import { Badge } from "@shared/ui/badge";

interface TemplateRendererProps {
  side: 'front' | 'back';
  width?: number;
  height?: number;
}

export const TemplateRenderer = ({ side, width = 400, height = 600 }: TemplateRendererProps) => {
  const { activeTemplateId, getTemplate } = useTemplateStore();
  const { cardData } = useCardStore();
  
  const template = activeTemplateId ? getTemplate(activeTemplateId) : null;
  const currentSide = template?.[side];

  // Convert cardData to CardDataFields format
  const dataFields: CardDataFields = {
    fullName: cardData.fullName,
    firstName: cardData.fullName.split(' ')[0] || '',
    lastName: cardData.fullName.split(' ').slice(1).join(' ') || '',
    role: cardData.role,
    companyName: cardData.companyName,
    companyWebsite: cardData.companyWebsite,
    companyLogo: cardData.companyLogo,
    profileImage: cardData.profileImage,
    tagline: cardData.tagline,
    bio: cardData.bio,
    email: cardData.email,
    phone: cardData.phone,
    interests: cardData.interests,
    ctaText: cardData.ctaText,
    quickLinks: cardData.quickLinks,
  };

  if (!currentSide) {
    return (
      <div 
        className="rounded-lg bg-muted flex items-center justify-center"
        style={{ width, height }}
      >
        <p className="text-muted-foreground text-sm">No template selected</p>
      </div>
    );
  }

  const renderElement = (element: CardElement) => {
    const left = (element.x / 100) * width;
    const top = (element.y / 100) * height;
    const elemWidth = (element.width / 100) * width;
    const elemHeight = (element.height / 100) * height;

    const baseStyle: React.CSSProperties = {
      position: 'absolute',
      left,
      top,
      width: elemWidth,
      height: elemHeight,
      transform: `rotate(${element.rotation}deg)`,
      zIndex: element.zIndex,
      opacity: element.styles.opacity ?? 1,
    };

    switch (element.type) {
      case 'text': {
        const content = element.dataBinding 
          ? resolveDataBinding(element.dataBinding, dataFields)
          : element.content || '';
        
        // Handle special case for interests (array)
        const displayContent = element.dataBinding === '{{interests}}' 
          ? dataFields.interests.join(' • ')
          : content;

        return (
          <div
            key={element.id}
            style={{
              ...baseStyle,
              color: element.styles.color || '#000000',
              fontSize: element.styles.fontSize || 16,
              fontWeight: element.styles.fontWeight || 'normal',
              fontFamily: element.styles.fontFamily || 'Inter, sans-serif',
              textAlign: element.styles.textAlign || 'left',
              letterSpacing: element.styles.letterSpacing,
              lineHeight: element.styles.lineHeight,
              writingMode: element.styles.writingMode,
              display: 'flex',
              alignItems: 'flex-start',
              overflow: 'hidden',
            }}
          >
            {displayContent}
          </div>
        );
      }

      case 'shape': {
        return (
          <div
            key={element.id}
            style={{
              ...baseStyle,
              backgroundColor: element.styles.backgroundColor || '#cccccc',
              borderRadius: element.styles.borderRadius,
            }}
          />
        );
      }

      case 'image': {
        const imageUrl = element.dataBinding 
          ? resolveDataBinding(element.dataBinding, dataFields)
          : element.content;

        if (!imageUrl) {
          return (
            <div
              key={element.id}
              style={{
                ...baseStyle,
                backgroundColor: '#e5e7eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span className="text-muted-foreground text-xs">No image</span>
            </div>
          );
        }

        return (
          <div
            key={element.id}
            style={{
              ...baseStyle,
              overflow: 'hidden',
            }}
          >
            <img
              src={imageUrl}
              alt=""
              className={element.styles.grayscale ? 'grayscale' : ''}
              style={{
                width: '100%',
                height: '100%',
                objectFit: element.styles.objectFit || 'cover',
              }}
            />
          </div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div 
      className="relative rounded-lg overflow-hidden shadow-elevation"
      style={{ 
        width, 
        height,
        backgroundColor: currentSide.backgroundColor,
        backgroundImage: currentSide.backgroundImage ? `url(${currentSide.backgroundImage})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {currentSide.elements.map(renderElement)}
    </div>
  );
};
