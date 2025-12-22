import { motion } from "framer-motion";
import { TemplateRenderer } from "./TemplateRenderer";
import { useCardStore } from "@profile/store/cardStore";

export const FlipAnimation = () => {
  const { cardData } = useCardStore();
  const { isFlipped } = cardData;

  return (
    <div className="perspective-1000">
      <motion.div
        className="relative w-[400px] h-[600px]"
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
          <TemplateRenderer side="front" width={400} height={600} />
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 backface-hidden"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <TemplateRenderer side="back" width={400} height={600} />
        </div>
      </motion.div>
    </div>
  );
};
