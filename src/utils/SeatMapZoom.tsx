import React, {useRef, useImperativeHandle, forwardRef, useEffect} from "react";
import SeatMap, {type SeatMapHandle} from "@/page/SeatPage/SeatMap/SeatMap";
import type {SeatType} from "@/data/seat";

interface SeatMapZoomProps {
    seatRows: SeatType[][];
    onSeatClick: (seat: SeatType, selected: boolean) => void;
}

const SeatMapZoom = forwardRef<SeatMapHandle, SeatMapZoomProps>(({seatRows, onSeatClick}, ref) => {
    const seatMapRef = useRef<SeatMapHandle>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    // transformRef là state gốc
    const transformRef = useRef({
        scale: 1,
        translate: {x: 0, y: 0},
    });

    const lastTouch = useRef<{x: number; y: number} | null>(null);
    const lastDistance = useRef<number | null>(null);

    useImperativeHandle(ref, () => ({
        deselectSeat: (seatId: string) => {
            seatMapRef.current?.deselectSeat(seatId);
        },
        highlightSeats: (seatIds: string[]) => {
            seatMapRef.current?.highlightSeats(seatIds);
        },
    }));

    const getDistance = (touches: TouchList) => {
        const dx = touches[0].clientX - touches[1].clientX;
        const dy = touches[0].clientY - touches[1].clientY;
        return Math.hypot(dx, dy);
    };

    // Hàm giới hạn vị trí translate với tâm giới hạn luôn ở (0,0) - giữa màn hình
    const constrainTranslate = (translate: {x: number; y: number}, scale: number) => {
        // Tâm giới hạn luôn ở (0,0) - giữa màn hình
        // Giới hạn căn bản là 150px, nhân với scale để điều chỉnh theo zoom
        const baseLimit = 150;
        const limit = baseLimit * scale;
        
        return {
            x: Math.max(-limit, Math.min(limit, translate.x)),
            y: Math.max(-limit, Math.min(limit, translate.y))
        };
    };

    const applyTransform = () => {
        if (contentRef.current) {
            const {scale, translate} = transformRef.current;
            
            // Áp dụng giới hạn theo tỉ lệ scale
            const constrainedTranslate = constrainTranslate(translate, scale);
            transformRef.current.translate = constrainedTranslate;
            
            contentRef.current.style.transform = `translate(${constrainedTranslate.x}px, ${constrainedTranslate.y}px) scale(${scale})`;
        }
    };

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;

        // Drag state
        let isDragging = false;
        let lastMousePos: {x: number; y: number} | null = null;

        // Touch helpers
        const getDistance = (touches: TouchList) => {
            const dx = touches[0].clientX - touches[1].clientX;
            const dy = touches[0].clientY - touches[1].clientY;
            return Math.hypot(dx, dy);
        };

        // Touch events
        const handleTouchStart = (e: TouchEvent) => {
            if (e.touches.length === 1) {
                lastTouch.current = {
                    x: e.touches[0].clientX,
                    y: e.touches[0].clientY,
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
                    y: e.touches[0].clientY,
                };

                applyTransform();
            } else if (e.touches.length === 2 && lastDistance.current) {
                const newDist = getDistance(e.touches);
                let scaleRatio = newDist / lastDistance.current;

                const nextScale = Math.max(0.5, Math.min(t.scale * scaleRatio, 3));

                // Không cần điều chỉnh translate vì transformOrigin đã là center
                t.scale = nextScale;

                lastDistance.current = newDist;

                applyTransform();
            }
        };

        const handleTouchEnd = () => {
            lastTouch.current = null;
            lastDistance.current = null;
        };

        // Mouse drag
        const handleMouseDown = (e: MouseEvent) => {
            if (e.button !== 0) return;
            isDragging = true;
            lastMousePos = {x: e.clientX, y: e.clientY};
        };

        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging || !lastMousePos) return;

            const dx = e.clientX - lastMousePos.x;
            const dy = e.clientY - lastMousePos.y;

            const t = transformRef.current;
            t.translate.x += dx;
            t.translate.y += dy;

            lastMousePos = {x: e.clientX, y: e.clientY};
            applyTransform();
        };

        const handleMouseUp = () => {
            isDragging = false;
            lastMousePos = null;
        };

        // Wheel zoom - zoom về tâm với transformOrigin center
        const handleWheel = (e: WheelEvent) => {
            e.preventDefault();

            const t = transformRef.current;

            let scaleNew = t.scale * (1 - e.deltaY * 0.001);
            scaleNew = Math.max(0.5, Math.min(scaleNew, 3));

            if (scaleNew === t.scale) return;

            // Không cần điều chỉnh translate vì transformOrigin đã là center
            t.scale = scaleNew;

            applyTransform();
        };

        // Luôn lắng nghe wheel để test zoom lăn chuột
        el.addEventListener("wheel", handleWheel, {passive: false});

        if (isTouchDevice) {
            el.addEventListener("touchstart", handleTouchStart, {passive: false});
            el.addEventListener("touchmove", handleTouchMove, {passive: false});
            el.addEventListener("touchend", handleTouchEnd);
        } else {
            el.addEventListener("mousedown", handleMouseDown);
            window.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("mouseup", handleMouseUp);
        }

        return () => {
            el.removeEventListener("wheel", handleWheel);

            if (isTouchDevice) {
                el.removeEventListener("touchstart", handleTouchStart);
                el.removeEventListener("touchmove", handleTouchMove);
                el.removeEventListener("touchend", handleTouchEnd);
            } else {
                el.removeEventListener("mousedown", handleMouseDown);
                window.removeEventListener("mousemove", handleMouseMove);
                window.removeEventListener("mouseup", handleMouseUp);
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
                margin: "10px 0",
            }}
        >
            <div
                ref={contentRef}
                style={{
                    transform: "translate(0px, 0px) scale(1)",
                    transformOrigin: "center center", // Đặt tâm transform ở giữa
                    willChange: "transform", // (quan trọng) Tối ưu hiệu suất trên mobile
                }}
            >
                <SeatMap ref={seatMapRef} seatRows={seatRows} onSeatClick={onSeatClick} />
            </div>
        </div>
    );
});

export default SeatMapZoom;