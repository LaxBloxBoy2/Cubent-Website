"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedListItem {
  id: string | number;
  content: React.ReactNode;
}

interface AnimatedListProps {
  items: AnimatedListItem[];
  className?: string;
  itemClassName?: string;
  delay?: number;
  duration?: number;
}

export const AnimatedList: React.FC<AnimatedListProps> = ({
  items,
  className,
  itemClassName,
  delay = 0.1,
  duration = 0.5,
}) => {
  const [visibleItems, setVisibleItems] = useState<AnimatedListItem[]>([]);

  useEffect(() => {
    items.forEach((item, index) => {
      setTimeout(() => {
        setVisibleItems((prev) => [...prev, item]);
      }, index * delay * 1000);
    });

    return () => setVisibleItems([]);
  }, [items, delay]);

  return (
    <div className={cn("space-y-2", className)}>
      <AnimatePresence>
        {visibleItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{
              duration,
              delay: index * delay,
              ease: "easeOut",
            }}
            className={cn("w-full", itemClassName)}
          >
            {item.content}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

interface UsageItemProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  value?: string;
  timestamp?: string;
  className?: string;
}

export const UsageItem: React.FC<UsageItemProps> = ({
  icon,
  title,
  description,
  value,
  timestamp,
  className,
}) => {
  return (
    <div
      className={cn(
        "flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-3 backdrop-blur-sm",
        className
      )}
    >
      <div className="flex items-center space-x-3">
        {icon && (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
            {icon}
          </div>
        )}
        <div>
          <div className="text-sm font-medium text-white">{title}</div>
          <div className="text-xs text-white/60">{description}</div>
        </div>
      </div>
      <div className="text-right">
        {value && (
          <div className="text-sm font-medium text-white">{value}</div>
        )}
        {timestamp && (
          <div className="text-xs text-white/60">{timestamp}</div>
        )}
      </div>
    </div>
  );
};

interface AnimatedUsageListProps {
  className?: string;
}

export const AnimatedUsageList: React.FC<AnimatedUsageListProps> = ({
  className,
}) => {
  const usageItems: AnimatedListItem[] = [
    {
      id: 1,
      content: (
        <UsageItem
          title="API Key Created"
          description="New key generated for production"
          value="1"
          timestamp="2 min ago"
        />
      ),
    },
    {
      id: 2,
      content: (
        <UsageItem
          title="Rate Limit Hit"
          description="Threshold reached for user_123"
          value="429"
          timestamp="5 min ago"
        />
      ),
    },
    {
      id: 3,
      content: (
        <UsageItem
          title="Successful Request"
          description="Authentication verified"
          value="200"
          timestamp="7 min ago"
        />
      ),
    },
    {
      id: 4,
      content: (
        <UsageItem
          title="Key Revoked"
          description="Security policy triggered"
          value="1"
          timestamp="12 min ago"
        />
      ),
    },
  ];

  return (
    <AnimatedList
      items={usageItems}
      className={cn("max-h-64 overflow-hidden", className)}
      delay={0.5}
      duration={0.3}
    />
  );
};
