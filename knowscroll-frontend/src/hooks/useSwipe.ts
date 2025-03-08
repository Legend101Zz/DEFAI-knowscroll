import { useState, useEffect } from "react";

export type SwipeDirection = "up" | "down" | "left" | "right" | null;
export type SwipeType = "series" | "topic" | null;

type SwipeHandlers = {
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeStart?: () => void;
  onSwipeEnd?: (direction: SwipeDirection, type: SwipeType) => void;
};

export function useSwipe(handlers: SwipeHandlers) {
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 });
  const [touchEnd, setTouchEnd] = useState({ x: 0, y: 0 });
  const [isSwiping, setIsSwiping] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<SwipeDirection>(null);
  const [swipeType, setSwipeType] = useState<SwipeType>(null);

  // Minimum distance required for a swipe
  const minSwipeDistance = 50;

  const handleSwipeStart = (x: number, y: number) => {
    setTouchStart({ x, y });
    setIsSwiping(true);
    setSwipeDirection(null);
    setSwipeType(null);
    handlers.onSwipeStart?.();
  };

  const handleSwipeMove = (x: number, y: number) => {
    if (!isSwiping) return;

    setTouchEnd({ x, y });

    // Determine preliminary direction during the move
    const diffX = touchStart.x - x;
    const diffY = touchStart.y - y;

    // Only update if we have a significant movement
    if (Math.abs(diffX) > 20 || Math.abs(diffY) > 20) {
      const isHorizontalSwipe = Math.abs(diffX) > Math.abs(diffY);

      if (isHorizontalSwipe) {
        setSwipeDirection(diffX > 0 ? "left" : "right");
        setSwipeType("topic");
      } else {
        setSwipeDirection(diffY > 0 ? "up" : "down");
        setSwipeType("series");
      }
    }
  };

  const handleSwipeEnd = () => {
    if (!isSwiping) return;

    const distanceX = touchStart.x - touchEnd.x;
    const distanceY = touchStart.y - touchEnd.y;
    const isHorizontalSwipe = Math.abs(distanceX) > Math.abs(distanceY);

    let finalDirection: SwipeDirection = null;
    let finalType: SwipeType = null;

    if (isHorizontalSwipe) {
      if (Math.abs(distanceX) > minSwipeDistance) {
        finalDirection = distanceX > 0 ? "left" : "right";
        finalType = "topic";

        if (distanceX > 0 && handlers.onSwipeLeft) {
          handlers.onSwipeLeft();
        } else if (distanceX < 0 && handlers.onSwipeRight) {
          handlers.onSwipeRight();
        }
      }
    } else {
      if (Math.abs(distanceY) > minSwipeDistance) {
        finalDirection = distanceY > 0 ? "up" : "down";
        finalType = "series";

        if (distanceY > 0 && handlers.onSwipeUp) {
          handlers.onSwipeUp();
        } else if (distanceY < 0 && handlers.onSwipeDown) {
          handlers.onSwipeDown();
        }
      }
    }

    handlers.onSwipeEnd?.(finalDirection, finalType);
    setIsSwiping(false);
  };

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      handleSwipeStart(e.targetTouches[0].clientX, e.targetTouches[0].clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      handleSwipeMove(e.targetTouches[0].clientX, e.targetTouches[0].clientY);
    };

    const handleMouseDown = (e: MouseEvent) => {
      handleSwipeStart(e.clientX, e.clientY);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (e.buttons === 1) {
        // Left mouse button is pressed
        handleSwipeMove(e.clientX, e.clientY);
      }
    };

    // Add event listeners
    document.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    document.addEventListener("touchmove", handleTouchMove, { passive: true });
    document.addEventListener("touchend", handleSwipeEnd);

    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleSwipeEnd);

    // Cleanup
    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleSwipeEnd);

      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleSwipeEnd);
    };
  }, [handlers, touchStart, touchEnd, minSwipeDistance, isSwiping]);

  return {
    isSwiping,
    swipeDirection,
    swipeType,
    touchStart,
    touchEnd,
  };
}
