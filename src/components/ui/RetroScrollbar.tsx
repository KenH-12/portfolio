import { ReactNode, HTMLAttributes, useRef, useEffect } from 'react';

interface RetroScrollbarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  children: ReactNode;
  maxHeight?: string;
}

export function RetroScrollbar({ children, className = '', maxHeight, style, ...props }: RetroScrollbarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const isOverScrollbar = (e: MouseEvent): boolean => {
      const rect = container.getBoundingClientRect();
      const scrollbarWidth = 8; // Match the scrollbar width
      const padding = 4; // Extra padding for easier interaction
      // Check if mouse is in the scrollbar area (right side of container)
      return e.clientX >= rect.right - scrollbarWidth - padding && 
             e.clientX <= rect.right + padding &&
             e.clientY >= rect.top &&
             e.clientY <= rect.bottom;
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (isOverScrollbar(e)) {
        isDraggingRef.current = true;
        // Dispatch custom event to hide crosshair cursor
        window.dispatchEvent(new CustomEvent('scrollbarDragStart'));
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      // If dragging, keep dispatching to maintain hidden state
      if (isDraggingRef.current && isOverScrollbar(e)) {
        // Keep the drag state active
        return;
      }
    };

    const handleMouseUp = () => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        // Dispatch custom event to show crosshair cursor
        window.dispatchEvent(new CustomEvent('scrollbarDragEnd'));
      }
    };

    const handleMouseLeave = () => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        window.dispatchEvent(new CustomEvent('scrollbarDragEnd'));
      }
    };

    container.addEventListener('mousedown', handleMouseDown);
    container.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      container.removeEventListener('mousedown', handleMouseDown);
      container.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <>
      <style>{`
        .retro-scrollbar {
          ${maxHeight ? `max-height: ${maxHeight};` : ''}
          overflow-y: auto;
          overflow-x: hidden;
          scrollbar-width: thin;
          scrollbar-color: hsla(174, 72%, 56%, 0.8) hsla(174, 72%, 56%, 0.15);
          padding-right: 4px;
        }
        
        .retro-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        
        .retro-scrollbar::-webkit-scrollbar-track {
          background: hsla(174, 72%, 56%, 0.15);
          border-left: 1px solid hsla(174, 72%, 56%, 0.3);
          margin: 4px 0;
        }
        
        .retro-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(
            180deg,
            hsla(174, 72%, 56%, 0.6) 0%,
            hsla(174, 72%, 56%, 0.9) 50%,
            hsla(174, 72%, 56%, 0.6) 100%
          );
          border: 1px solid hsla(174, 72%, 56%, 0.8);
          border-radius: 2px;
          box-shadow: 
            0 0 8px hsla(174, 72%, 56%, 0.5),
            inset 0 0 4px hsla(174, 72%, 56%, 0.3);
        }
        
        .retro-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(
            180deg,
            hsla(174, 72%, 56%, 0.6) 0%,
            hsla(174, 72%, 56%, 1) 50%,
            hsla(174, 72%, 56%, 0.6) 100%
          );
          box-shadow: 
            0 0 12px hsla(174, 72%, 56%, 0.7),
            inset 0 0 6px hsla(174, 72%, 56%, 0.4);
          border-color: hsla(174, 72%, 56%, 0.9);
        }
        
        .retro-scrollbar::-webkit-scrollbar-thumb:active {
          background: linear-gradient(
            180deg,
            hsla(174, 72%, 56%, 0.8) 0%,
            hsla(174, 72%, 56%, 1) 50%,
            hsla(174, 72%, 56%, 0.8) 100%
          );
          box-shadow: 
            0 0 16px hsla(174, 72%, 56%, 0.9),
            inset 0 0 8px hsla(174, 72%, 56%, 0.5);
        }
        
        /* Add scan line effect on scrollbar track */
        .retro-scrollbar::-webkit-scrollbar-track::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent 0%,
            hsla(174, 72%, 56%, 0.3) 50%,
            transparent 100%
          );
          animation: scanLine 2s linear infinite;
        }
        
        @keyframes scanLine {
          0% {
            transform: translateY(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(100%);
            opacity: 0;
          }
        }
      `}</style>
      <div
        ref={containerRef}
        className={`retro-scrollbar ${className}`} 
        style={{ maxHeight: maxHeight, ...style }}
        {...props}
      >
        {children}
      </div>
    </>
  );
}
