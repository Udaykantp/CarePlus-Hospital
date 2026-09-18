import React from 'react';
import { motion, type Variants } from 'motion/react';

export type RevealDirection = 'up' | 'down' | 'left' | 'right' | 'none';

interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  distance?: number;
  direction?: RevealDirection;
  className?: string;
  viewportMargin?: string;
  once?: boolean;
  id?: string;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  delay = 0,
  duration = 0.55,
  distance = 28,
  direction = 'up',
  className = '',
  viewportMargin = '-60px',
  once = true,
  id
}) => {
  const getInitialPosition = () => {
    switch (direction) {
      case 'up':
        return { y: distance, x: 0 };
      case 'down':
        return { y: -distance, x: 0 };
      case 'left':
        return { x: distance, y: 0 };
      case 'right':
        return { x: -distance, y: 0 };
      case 'none':
      default:
        return { x: 0, y: 0 };
    }
  };

  const initialOffset = getInitialPosition();

  const variants: Variants = {
    hidden: {
      opacity: 0,
      x: initialOffset.x,
      y: initialOffset.y
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98]
      }
    }
  };

  return (
    <motion.div
      id={id}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: viewportMargin as any }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface ScrollRevealGroupProps {
  children: React.ReactNode;
  staggerDelay?: number;
  className?: string;
  viewportMargin?: string;
  once?: boolean;
  id?: string;
}

export const ScrollRevealGroup: React.FC<ScrollRevealGroupProps> = ({
  children,
  staggerDelay = 0.1,
  className = '',
  viewportMargin = '-60px',
  once = true,
  id
}) => {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.05
      }
    }
  };

  return (
    <motion.div
      id={id}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: viewportMargin as any }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface ScrollRevealItemProps {
  children: React.ReactNode;
  distance?: number;
  duration?: number;
  direction?: RevealDirection;
  className?: string;
}

export const ScrollRevealItem: React.FC<ScrollRevealItemProps> = ({
  children,
  distance = 24,
  duration = 0.5,
  direction = 'up',
  className = ''
}) => {
  const getInitialPosition = () => {
    switch (direction) {
      case 'up':
        return { y: distance, x: 0 };
      case 'down':
        return { y: -distance, x: 0 };
      case 'left':
        return { x: distance, y: 0 };
      case 'right':
        return { x: -distance, y: 0 };
      case 'none':
      default:
        return { x: 0, y: 0 };
    }
  };

  const initialOffset = getInitialPosition();

  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      x: initialOffset.x,
      y: initialOffset.y
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration,
        ease: [0.21, 0.47, 0.32, 0.98]
      }
    }
  };

  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  );
};
