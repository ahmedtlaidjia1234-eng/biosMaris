import { useEffect, useState } from 'react';

export const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    document.addEventListener('mousemove', updatePosition);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      document.removeEventListener('mousemove', updatePosition);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed pointer-events-none z-50 mix-blend-difference" style={{zIndex : '99'}}>
      <div
        className={`absolute rounded-full bg-white transition-all  ease-out ${
          isClicking ? 'w-4 h-4' : 'w-6 h-6'
        }`}
        style={{
          left: position.x - (isClicking ? 8 : 12),
          top: position.y - (isClicking ? 8 : 12),
          transitionDuration : "1s"
        }}
      />
   

        <div
        className="absolute w-1 h-1 bg-white rounded-full"
        style={{
          left: position.x - 2,
          top: position.y - 2,
        }}
      />
      
      
    </div>
  );
};