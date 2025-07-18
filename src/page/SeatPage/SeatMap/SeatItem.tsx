import React, {
  useCallback,
  useState,
  useImperativeHandle,
  forwardRef,
  useRef,
  useEffect
} from "react";
import type { SeatType } from "@/data/seat";
import Icon from "@/assets/icons/Icon";

export interface SeatItemHandle {
  deselect: () => void;
  highlight: () => void;
  isSelected: () => boolean;
}

interface SeatItemProps {
  seat: SeatType;
  onSeatClick: (seat: SeatType, newSelected: boolean) => void;
}

const SeatItem = forwardRef<SeatItemHandle, SeatItemProps>(({ seat, onSeatClick }, ref) => {
  const [isSelected, setIsSelected] = useState(seat.isSelected || false);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [highlightId, setHighlightId] = useState(0);
  const isMounted = useRef(false);
  const latestSelectedRef = useRef(isSelected);

  useImperativeHandle(ref, () => ({
    deselect: () => {
      setIsSelected(false);
      latestSelectedRef.current = false;
    },

    highlight: () => {
      if (!isMounted.current) return; // tránh animation lần đầu render
      setHighlightId((prev) => prev + 1);
      setShouldAnimate(true);
    },

    isSelected: () => latestSelectedRef.current
  }));

  useEffect(() => {
    isMounted.current = true;
  }, []);

  const handleClick = useCallback(() => {
    if (!seat.isEnable) return;
    const newSelected = !latestSelectedRef.current;
    latestSelectedRef.current = newSelected;
    setIsSelected(newSelected);
    onSeatClick(seat, newSelected);
  }, [onSeatClick, seat]);

  const mapSeatTypeClass = (type: number): string => {
    switch (type) {
      case 0: return "normal";
      case 1: return "vip";
      default: return "unknown";
    }
  };

  const SeatSelectedIcon = () => (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Icon name="seatSelectedPath" />
    </div>
  );

  const classNames = [
    "seat-item",
    `seat--type-${mapSeatTypeClass(seat.type)}`,
    !seat.isEnable && "seat--disabled",
    isSelected && "seat--selected",
    shouldAnimate && "seat--highlighted"
  ]
    .filter(Boolean)
    .join(" ");

  // Reset animation class sau khi animation chạy xong
  const handleAnimationEnd = () => {
    setShouldAnimate(false);
  };

  return (
    <div
      id={`seat-${seat.seatId}`}
      data-highlight-id={highlightId}
      className={classNames}
      onClick={handleClick}
      onAnimationEnd={handleAnimationEnd}
      role="button"
      aria-pressed={isSelected}
    >
      <span className="seat-label">{seat.code}</span>
      {isSelected && <SeatSelectedIcon />}
    </div>
  );
});

export default SeatItem;
