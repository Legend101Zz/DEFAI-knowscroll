import { useState, useEffect } from "react";

type SwipeHandlers = {
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
};

export function useSwipe(handlers: SwipeHandlers) {
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 });
  const [touchEnd, setTouchEnd] = useState({ x: 0, y: 0 });

  // Minimum distance required for a swipe
  const minSwipeDistance = 50;

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      setTouchStart({
        x: e.targetTouches[0].clientX,
        y: e.targetTouches[0].clientY,
      });
    };

    const handleTouchMove = (e: TouchEvent) => {
      setTouchEnd({
        x: e.targetTouches[0].clientX,
        y: e.targetTouches[0].clientY,
      });
    };

    const handleTouchEnd = () => {
      const distanceX = touchStart.x - touchEnd.x;
      const distanceY = touchStart.y - touchEnd.y;
      const isHorizontalSwipe = Math.abs(distanceX) > Math.abs(distanceY);

      if (isHorizontalSwipe) {
        if (distanceX > minSwipeDistance && handlers.onSwipeLeft) {
          handlers.onSwipeLeft();
        } else if (distanceX < -minSwipeDistance && handlers.onSwipeRight) {
          handlers.onSwipeRight();
        }
      } else {
        if (distanceY > minSwipeDistance && handlers.onSwipeUp) {
          handlers.onSwipeUp();
        } else if (distanceY < -minSwipeDistance && handlers.onSwipeDown) {
          handlers.onSwipeDown();
        }
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      setTouchStart({ x: e.clientX, y: e.clientY });
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (e.buttons === 1) {
        // Left mouse button is pressed
        setTouchEnd({ x: e.clientX, y: e.clientY });
      }
    };

    const handleMouseUp = () => {
      const distanceX = touchStart.x - touchEnd.x;
      const distanceY = touchStart.y - touchEnd.y;
      const isHorizontalSwipe = Math.abs(distanceX) > Math.abs(distanceY);

      // Only trigger if we have valid start and end points
      if (touchStart.x !== 0 && touchEnd.x !== 0) {
        if (isHorizontalSwipe) {
          if (distanceX > minSwipeDistance && handlers.onSwipeLeft) {
            handlers.onSwipeLeft();
          } else if (distanceX < -minSwipeDistance && handlers.onSwipeRight) {
            handlers.onSwipeRight();
          }
        } else {
          if (distanceY > minSwipeDistance && handlers.onSwipeUp) {
            handlers.onSwipeUp();
          } else if (distanceY < -minSwipeDistance && handlers.onSwipeDown) {
            handlers.onSwipeDown();
          }
        }
      }

      // Reset
      setTouchStart({ x: 0, y: 0 });
      setTouchEnd({ x: 0, y: 0 });
    };

    // Add event listeners
    document.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    document.addEventListener("touchmove", handleTouchMove, { passive: true });
    document.addEventListener("touchend", handleTouchEnd);

    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    // Cleanup
    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);

      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handlers, touchStart, touchEnd, minSwipeDistance]);
}
