---
name: implementing-page-transitions
description: Defines standards for smooth route navigation and complex parallax card carousel effects. Use when building page transitions or swipeable carousel interfaces.
---

# Implementing Page Transitions & Carousels

## When to use this skill
- When animating between routes or page states.
- When the user requests a horizontal scroll or swipe-based carousel.
- When creating overlapping parallax depth effects in UI components.

## Route Changes Guidelines

Smooth Navigation heuristics for basic route or section changes:
- **Fade**: `opacity` transition over `200ms`
- **Slide**: `translateX(-100% -> 0)` over `300ms`
- **Blur**: `filter: blur(0 -> 10px -> 0)` for stylistic entries
- **Crossfade**: Overlap old/new content during the transition window

## Example: Parallax Swipe Card Carousel

When instructed to add a parallax swipe carousel (e.g., for room cards or feature lists), implement based on the following standard:

### Key Effect Breakdown
| Property    | Active Card | Background Cards |
| ----------- | ----------- | ---------------- |
| **Opacity** | 1 (fully visible) | 0.4–0.6 (faded) |
| **Scale**   | 1.05 (slightly enlarged) | 0.9 (shrunk) |
| **Blur**    | None | `blur(2–4px)` |
| **Z-index** | Highest (e.g., 10) | Lower (e.g., 0) |
| **Transition** | Smooth ease-in-out | Smooth ease-in-out |

### Framer Motion Implementation Template

Use Framer Motion to map swipe position to parallax effects smoothly.

```tsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { wrap } from "popmotion"; // Or simple manual wrapping

const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

export function ParallaxCarousel({ items }: { items: any[] }) {
  const [[page, direction], setPage] = useState([0, 0]);
  
  // Wrap index so it loops
  const activeIndex = wrap(0, items.length, page);

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };

  return (
    <div className="relative flex items-center justify-center w-full h-[500px] overflow-hidden">
      <AnimatePresence initial={false} custom={direction}>
        {items.map((item, index) => {
          const isActive = index === activeIndex;
          
          return (
            <motion.div
              key={index}
              className="absolute w-[300px] h-[400px] rounded-2xl bg-white shadow-xl"
              initial={{ 
                opacity: 0, 
                scale: 0.8, 
                x: direction > 0 ? 300 : -300 
              }}
              animate={{
                opacity: isActive ? 1 : 0.5,
                scale: isActive ? 1.05 : 0.9,
                filter: isActive ? "blur(0px)" : "blur(3px)",
                x: isActive ? 0 : (index > activeIndex ? 150 : -150),
                zIndex: isActive ? 10 : 0
              }}
              exit={{
                opacity: 0,
                scale: 0.8,
                x: direction > 0 ? -300 : 300,
                zIndex: 0
              }}
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.3 },
                scale: { duration: 0.4 },
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={1}
              onDragEnd={(e, { offset, velocity }) => {
                const swipe = swipePower(offset.x, velocity.x);
                if (swipe < -10000) {
                  paginate(1);
                } else if (swipe > 10000) {
                  paginate(-1);
                }
              }}
            >
              {/* Card Content Here */}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
```

## Resources
- Framer Motion documentation for `useTransform` and gesture interactions.
- Avoid using pure CSS horizontally scrolling containers for complex stacked depth transitions, rely on Framer Motion's AnimatePresence.
