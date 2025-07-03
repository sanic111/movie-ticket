import React, {
  useRef,
  useImperativeHandle,
  forwardRef,
  useEffect
} from "react";
import SeatMap, { type SeatMapHandle } from "@/page/SeatPage/SeatMap/SeatMap";
import type { SeatType } from "@/data/seat";

interface SeatMapZoomProps {
  seatRows: SeatType[][];
  onSeatClick: (seat: SeatType, selected: boolean) => void;
}

const SeatMapZoom = forwardRef<SeatMapHandle, SeatMapZoomProps>(
  ({ seatRows, onSeatClick }, ref) => {
    const seatMapRef = useRef<SeatMapHandle>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    // transformRef là state gốc
    const transformRef = useRef({
      scale: 1,
      translate: { x: 0, y: 0 }
    });

    const lastTouch = useRef<{ x: number; y: number } | null>(null);
    const lastDistance = useRef<number | null>(null);

    useImperativeHandle(ref, () => ({
      deselectSeat: (seatId: string) => {
        seatMapRef.current?.deselectSeat(seatId);
      },
      highlightSeats: (seatIds: string[]) => {
        seatMapRef.current?.highlightSeats(seatIds);
      }
    }));

    const getDistance = (touches: TouchList) => {
      const dx = touches[0].clientX - touches[1].clientX;
      const dy = touches[0].clientY - touches[1].clientY;
      return Math.hypot(dx, dy);
    };

    const applyTransform = () => {
      if (contentRef.current) {
        const { scale, translate } = transformRef.current;
        contentRef.current.style.transform = `translate(${translate.x}px, ${translate.y}px) scale(${scale})`;
      }
    };

    useEffect(() => {
      const el = containerRef.current;
      if (!el) return;

      const handleTouchStart = (e: TouchEvent) => {
        if (e.touches.length === 1) {
          lastTouch.current = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY
          };
        } else if (e.touches.length === 2) {
          lastDistance.current = getDistance(e.touches);
        }
      };

      const handleTouchMove = (e: TouchEvent) => {
        e.preventDefault();
        const t = transformRef.current;

        if (e.touches.length === 1 && lastTouch.current) {
          const dx = e.touches[0].clientX - lastTouch.current.x;
          const dy = e.touches[0].clientY - lastTouch.current.y;

          t.translate.x += dx;
          t.translate.y += dy;

          lastTouch.current = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY
          };

          applyTransform();
        } else if (e.touches.length === 2 && lastDistance.current) {
          const newDist = getDistance(e.touches);
          let scaleRatio = newDist / lastDistance.current;

          const nextScale = Math.max(
            0.5,
            Math.min(t.scale * scaleRatio, 3)
          );

          // Tính tỉ lệ để điều chỉnh translate giữ nguyên tâm zoom
          const centerX =
            (e.touches[0].clientX + e.touches[1].clientX) / 2 -
            el.getBoundingClientRect().left;
          const centerY =
            (e.touches[0].clientY + e.touches[1].clientY) / 2 -
            el.getBoundingClientRect().top;

          t.translate.x = centerX - ((centerX - t.translate.x) * nextScale) / t.scale;
          t.translate.y = centerY - ((centerY - t.translate.y) * nextScale) / t.scale;
          t.scale = nextScale;

          lastDistance.current = newDist;

          applyTransform();
        }
      };

      const handleTouchEnd = () => {
        lastTouch.current = null;
        lastDistance.current = null;
      };

      const handleWheel = (e: WheelEvent) => {
        e.preventDefault();
        const rect = el.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const t = transformRef.current;
        let scaleNew = t.scale * (1 - e.deltaY * 0.001);
        scaleNew = Math.max(0.5, Math.min(scaleNew, 3));

        if (scaleNew === t.scale) return;

        t.translate.x = mouseX - ((mouseX - t.translate.x) * scaleNew) / t.scale;
        t.translate.y = mouseY - ((mouseY - t.translate.y) * scaleNew) / t.scale;
        t.scale = scaleNew;

        applyTransform();
      };

      el.addEventListener("touchstart", handleTouchStart, { passive: false });
      el.addEventListener("touchmove", handleTouchMove, { passive: false });
      el.addEventListener("touchend", handleTouchEnd);
      el.addEventListener("wheel", handleWheel, { passive: false });

      return () => {
        el.removeEventListener("touchstart", handleTouchStart);
        el.removeEventListener("touchmove", handleTouchMove);
        el.removeEventListener("touchend", handleTouchEnd);
        el.removeEventListener("wheel", handleWheel);
      };
    }, []);

    return (
      <div
        ref={containerRef}
        style={{
          overflow: "hidden",
      touchAction: "none",
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxSizing: "border-box",
      padding: "10px" 
        }}
      >
        <div
          ref={contentRef}
          style={{
            transform: "translate(0px, 0px) scale(1)",
            transformOrigin: "0 0"
          }}
        >
          <SeatMap
            ref={seatMapRef}
            seatRows={seatRows}
            onSeatClick={onSeatClick}
          />
        </div>
      </div>
    );
  }
);

export default SeatMapZoom;
