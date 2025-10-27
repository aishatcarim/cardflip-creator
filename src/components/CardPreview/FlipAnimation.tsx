import { motion } from "framer-motion";
import { CardFront } from "./CardFront";
import { CardBack } from "./CardBack";
import { useCardStore } from "@/store/cardStore";

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
          <CardFront />
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 backface-hidden"
          style={{
            backfaceVisibility: "hidden",
          }}
        >
          <CardBack />
        </div>
      </motion.div>
    </div>
  );
};
