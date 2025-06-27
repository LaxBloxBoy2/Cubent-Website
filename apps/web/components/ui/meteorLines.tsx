"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MeteorProps {
  className?: string;
  delay?: number;
  duration?: number;
}

const Meteor: React.FC<MeteorProps> = ({ 
  className, 
  delay = 0, 
  duration = 2 
}) => {
  return (
    <motion.div
      className={cn(
        "absolute h-0.5 w-0.5 rounded-full bg-slate-500 shadow-[0_0_0_1px_#ffffff10]",
        className
      )}
      initial={{ 
        opacity: 0, 
        x: -100, 
        y: -100 
      }}
      animate={{
        opacity: [0, 1, 0],
        x: [0, 300],
        y: [0, 300],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        repeatDelay: Math.random() * 5 + 2,
        ease: "linear",
      }}
      style={{
        background: "linear-gradient(90deg, #64748b, transparent)",
      }}
    />
  );
};

interface MeteorLinesProps {
  number?: number;
  className?: string;
}

export const MeteorLines: React.FC<MeteorLinesProps> = ({ 
  number = 20, 
  className 
}) => {
  const [meteors, setMeteors] = useState<Array<{ id: number; delay: number; duration: number }>>([]);

  useEffect(() => {
    const meteorArray = Array.from({ length: number }, (_, i) => ({
      id: i,
      delay: Math.random() * 5,
      duration: Math.random() * 2 + 1,
    }));
    setMeteors(meteorArray);
  }, [number]);

  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)}>
      {meteors.map((meteor) => (
        <Meteor
          key={meteor.id}
          delay={meteor.delay}
          duration={meteor.duration}
          className="meteor-line"
        />
      ))}
    </div>
  );
};

interface AnimatedMeteorProps {
  className?: string;
  children?: React.ReactNode;
}

export const AnimatedMeteor: React.FC<AnimatedMeteorProps> = ({ 
  className, 
  children 
}) => {
  return (
    <div className={cn("relative", className)}>
      <MeteorLines number={10} />
      {children}
    </div>
  );
};

interface MeteorShowerProps {
  className?: string;
  intensity?: "light" | "medium" | "heavy";
}

export const MeteorShower: React.FC<MeteorShowerProps> = ({ 
  className, 
  intensity = "medium" 
}) => {
  const meteorCount = {
    light: 5,
    medium: 15,
    heavy: 30,
  };

  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      <MeteorLines number={meteorCount[intensity]} />
    </div>
  );
};
