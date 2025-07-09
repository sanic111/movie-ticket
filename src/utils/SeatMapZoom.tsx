import React, { useRef, useImperativeHandle, forwardRef, useEffect } from "react";
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

    // transform state
    const transformRef = useRef({
      scale: 1,
      translate: { x: 0, y: 0 },
    });

    // throttle với RAF
    const rafId = useRef<number | null>(null);
    const scheduleApply = () => {
      if (rafId.current === null) {
        rafId.current = requestAnimationFrame(() => {
          applyTransform();
          rafId.current = null;
        });
      }
    };

    // clamp helper
    const clamp = (val: number, min: number, max: number) =>
      Math.min(Math.max(val, min), max);

    // tính transform + clamp
  const applyTransform = () => {
  const container = containerRef.current;
  const content = contentRef.current;
  if (!container || !content) return;

  const { scale, translate } = transformRef.current;

  // Dùng kích thước gốc (chưa scale) của content
  const bw = content.offsetWidth;
  const bh = content.offsetHeight;
  // Kích thước khung container hiện tại
  const cw = container.clientWidth;
  const ch = container.clientHeight;

  // tổng kích thước sau scale
  const w = bw * scale;
  const h = bh * scale;

  // clamp translate
  const minX = Math.min(0, cw - w);
  const maxX = 0;
  const minY = Math.min(0, ch - h);
  const maxY = 0;

  translate.x = Math.min(Math.max(translate.x, minX), maxX);
  translate.y = Math.min(Math.max(translate.y, minY), maxY);

  content.style.transform =
    `translate(${translate.x}px, ${translate.y}px) scale(${scale})`;
};

    useImperativeHandle(ref, () => ({
      deselectSeat: (seatId: string) => {
        seatMapRef.current?.deselectSeat(seatId);
      },
      highlightSeats: (seatIds: string[]) => {
        seatMapRef.current?.highlightSeats(seatIds);
      },
    }));

    // chỉ 1 hàm tính khoảng cách 2 touch
    const getDistance = (touches: TouchList) => {
      const dx = touches[0].clientX - touches[1].clientX;
      const dy = touches[0].clientY - touches[1].clientY;
      return Math.hypot(dx, dy);
    };

    useEffect(() => {
      const el = containerRef.current;
      if (!el) return;

      const isTouchDevice =
        "ontouchstart" in window || navigator.maxTouchPoints > 0;

      // drag state
      let isDragging = false;
      let lastMousePos: { x: number; y: number } | null = null;
      const lastTouch = { x: 0, y: 0 };
      let lastDistance: number | null = null;

      // touch handlers
      const onTouchStart = (e: TouchEvent) => {
        if (e.touches.length === 1) {
          lastTouch.x = e.touches[0].clientX;
          lastTouch.y = e.touches[0].clientY;
        } else if (e.touches.length === 2) {
          lastDistance = getDistance(e.touches);
        }
      };
      const onTouchMove = (e: TouchEvent) => {
        e.preventDefault();
        const t = transformRef.current;

        if (e.touches.length === 1 && lastTouch) {
          const dx = e.touches[0].clientX - lastTouch.x;
          const dy = e.touches[0].clientY - lastTouch.y;
          t.translate.x += dx;
          t.translate.y += dy;
          lastTouch.x = e.touches[0].clientX;
          lastTouch.y = e.touches[0].clientY;
        } else if (
          e.touches.length === 2 &&
          lastDistance !== null
        ) {
          const newDist = getDistance(e.touches);
          const scaleRatio = newDist / lastDistance;
          const nextScale = Math.max(
            0.5,
            Math.min(t.scale * scaleRatio, 3)
          );

          // zoom quanh điểm chạm
          const rect = el.getBoundingClientRect();
          const cx =
            (e.touches[0].clientX + e.touches[1].clientX) / 2 -
            rect.left;
          const cy =
            (e.touches[0].clientY + e.touches[1].clientY) / 2 -
            rect.top;

          t.translate.x =
            cx -
            ((cx - t.translate.x) * nextScale) / t.scale;
          t.translate.y =
            cy -
            ((cy - t.translate.y) * nextScale) / t.scale;
          t.scale = nextScale;
          lastDistance = newDist;
        }

        scheduleApply();
      };
      const onTouchEnd = () => {
        lastDistance = null;
      };

      // mouse handlers
      const onMouseDown = (e: MouseEvent) => {
        if (e.button !== 0) return;
        isDragging = true;
        lastMousePos = { x: e.clientX, y: e.clientY };
      };
      const onMouseMove = (e: MouseEvent) => {
        if (!isDragging || !lastMousePos) return;
        const dx = e.clientX - lastMousePos.x;
        const dy = e.clientY - lastMousePos.y;
        transformRef.current.translate.x += dx;
        transformRef.current.translate.y += dy;
        lastMousePos = { x: e.clientX, y: e.clientY };
        scheduleApply();
      };
      const onMouseUp = () => {
        isDragging = false;
        lastMousePos = null;
      };

      // wheel zoom
      const onWheel = (e: WheelEvent) => {
        e.preventDefault();
        const rect = el.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        const t = transformRef.current;
        const scaleNew = Math.max(
          0.5,
          Math.min(t.scale * (1 - e.deltaY * 0.001), 3)
        );
        if (scaleNew === t.scale) return;
        t.translate.x =
          mx - ((mx - t.translate.x) * scaleNew) / t.scale;
        t.translate.y =
          my - ((my - t.translate.y) * scaleNew) / t.scale;
        t.scale = scaleNew;
        scheduleApply();
      };

      el.addEventListener("wheel", onWheel, { passive: false });
      if (isTouchDevice) {
        el.addEventListener("touchstart", onTouchStart, {
          passive: false,
        });
        el.addEventListener("touchmove", onTouchMove, {
          passive: false,
        });
        el.addEventListener("touchend", onTouchEnd);
      } else {
        el.addEventListener("mousedown", onMouseDown);
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
      }

      return () => {
        el.removeEventListener("wheel", onWheel);
        if (isTouchDevice) {
          el.removeEventListener("touchstart", onTouchStart);
          el.removeEventListener("touchmove", onTouchMove);
          el.removeEventListener("touchend", onTouchEnd);
        } else {
          el.removeEventListener("mousedown", onMouseDown);
          window.removeEventListener("mousemove", onMouseMove);
          window.removeEventListener("mouseup", onMouseUp);
        }
        if (rafId.current !== null) {
          cancelAnimationFrame(rafId.current);
        }
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
          padding: "10px",
        }}
      >
        <div
          ref={contentRef}
          style={{
            transform: "translate(0px, 0px) scale(1)",
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
