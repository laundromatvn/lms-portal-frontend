import React, { useState, useEffect, useRef } from 'react';

import { Button } from 'antd';
import { MenuOutlined } from '@ant-design/icons';

import { useTheme } from '@shared/theme/useTheme';

interface Props {
  onClick: () => void;
}

export const MobileFAB: React.FC<Props> = ({ onClick }) => {
  const theme = useTheme();
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const fabRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Set initial position to bottom right with mobile browser spacing
    const setInitialPosition = () => {
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;

      // Account for mobile browser UI (address bar, navigation bar)
      const safeAreaBottom = 20; // Safe area for mobile browsers
      const safeAreaRight = 20;

      setPosition({
        x: viewportWidth - 80 - safeAreaRight, // 80px is button width + margin
        y: viewportHeight - 80 - safeAreaBottom // 80px is button height + margin
      });
    };

    setInitialPosition();
    window.addEventListener('resize', setInitialPosition);

    return () => window.removeEventListener('resize', setInitialPosition);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;

    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;

    // Constrain to viewport bounds
    const maxX = window.innerWidth - 64; // 64px is button size
    const maxY = window.innerHeight - 64;

    setPosition({
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(0, Math.min(newY, maxY))
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    setIsDragging(true);
    setDragStart({
      x: touch.clientX - position.x,
      y: touch.clientY - position.y
    });
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return;

    const touch = e.touches[0];
    const newX = touch.clientX - dragStart.x;
    const newY = touch.clientY - dragStart.y;

    // Constrain to viewport bounds
    const maxX = window.innerWidth - 64;
    const maxY = window.innerHeight - 64;

    setPosition({
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(0, Math.min(newY, maxY))
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, dragStart]);

  return (
    <div
      ref={fabRef}
      style={{
        position: 'fixed',
        left: position.x,
        top: position.y,
        zIndex: 1001,
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none',
        touchAction: 'none',
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      <Button
        type="primary"
        shape="circle"
        size="large"
        icon={<MenuOutlined />}
        onClick={onClick}
        style={{
          width: 64,
          height: 64,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          border: 'none',
          backgroundColor: theme.custom.colors.primary.default,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px',
          color: 'white',
        }}
      />
    </div>
  );
};
