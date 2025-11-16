import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { cn } from '@shared/lib/utils';

export interface TabItem {
  icon: React.ReactNode;
  label: string;
  path: string;
  onClick: () => void;
}

interface MobileTabBarProps {
  items: TabItem[];
  className?: string;
}

export const MobileTabBar = ({ items, className }: MobileTabBarProps) => {
  const location = useLocation();

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 border-t border-border",
        className
      )}
    >
      <div className="flex items-center justify-around px-2 py-2 safe-area-bottom">
        {items.map((item, index) => {
          const isActive = location.pathname === item.path;

          return (
            <motion.button
              key={index}
              onClick={item.onClick}
              className={cn(
                "flex flex-col items-center justify-center px-3 py-2 rounded-lg transition-all duration-200 min-w-[60px]",
                isActive
                  ? "bg-accent text-accent-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              )}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex items-center justify-center w-6 h-6 mb-1">
                {item.icon}
              </div>
              <span className="text-xs font-medium leading-none">
                {item.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-accent-foreground rounded-full"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Safe area padding for devices with home indicators */}
      <div className="h-safe-area-bottom" />
    </motion.div>
  );
};
