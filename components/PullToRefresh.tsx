"use client";

import { useState, useRef, useCallback } from "react";
import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

interface PullToRefreshProps {
  children: React.ReactNode;
}

export default function PullToRefresh({ children }: PullToRefreshProps) {
  const router = useRouter();
  const [pulling, setPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const startY = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const threshold = 80;

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (containerRef.current && containerRef.current.scrollTop === 0) {
      startY.current = e.touches[0].clientY;
      setPulling(true);
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!pulling) return;
    const currentY = e.touches[0].clientY;
    const diff = Math.max(0, (currentY - startY.current) * 0.4);
    setPullDistance(Math.min(diff, 120));
  }, [pulling]);

  const handleTouchEnd = useCallback(async () => {
    if (pullDistance >= threshold && !refreshing) {
      setRefreshing(true);
      router.refresh();
      await new Promise(resolve => setTimeout(resolve, 500));
      setRefreshing(false);
    }
    setPulling(false);
    setPullDistance(0);
  }, [pullDistance, refreshing, router]);

  return (
    <div
      ref={containerRef}
      className="relative overflow-y-auto h-full"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="flex items-center justify-center transition-all duration-200 overflow-hidden"
        style={{ height: pullDistance > 0 ? `${pullDistance}px` : '0px' }}
      >
        <RefreshCw
          className={`w-5 h-5 text-blue-500 transition-transform ${refreshing ? 'animate-spin' : ''}`}
          style={{ transform: `rotate(${pullDistance * 3}deg)` }}
        />
      </div>
      {children}
    </div>
  );
}
