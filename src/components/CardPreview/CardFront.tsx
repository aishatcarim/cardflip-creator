import { useCardStore } from "@/store/cardStore";

export const CardFront = () => {
  const { cardData } = useCardStore();
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
      className="relative w-full h-full rounded-lg overflow-hidden shadow-elevation"
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
