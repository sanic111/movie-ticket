import React, { useRef, useImperativeHandle, forwardRef, useState } from "react";
import type { SeatType } from "@/data/seat";
import SeatRow from "@/page/SeatPage/SeatMap/SeatRow";
import type { SeatItemHandle } from "./SeatItem";

export interface SeatMapHandle {
  deselectSeat: (seatId: string) => void;
  highlightSeats: (seatIds: string[]) => void; 
}

interface SeatMapProps {
  seatRows: SeatType[][];
  onSeatClick: (seat: SeatType, selected: boolean) => void;
}

const SeatMap = forwardRef<SeatMapHandle, SeatMapProps>(
  ({ seatRows, onSeatClick }, ref) => {
    const seatItemRefs = useRef<Record<string, React.RefObject<SeatItemHandle>>>({});

    const registerSeatRef = (seatId: string, seatRef: React.RefObject<SeatItemHandle>) => {
      seatItemRefs.current[seatId] = seatRef;
    };

const handleSeatClick = (seat: SeatType, selected: boolean) => {
  if (selected) {
    const selectedCount = Object.values(seatItemRefs.current).reduce(
      (count, ref) => count + (ref.current?.isSelected() ? 1 : 0),
      0
    );
    if (selectedCount >= 10) {
      alert("Bạn chỉ được chọn tối đa 10 ghế.");
      seatItemRefs.current[seat.seatId]?.current?.deselect();
      return;
    }
  }

  onSeatClick(seat, selected);
};



    useImperativeHandle(ref, () => ({
      deselectSeat: (seatId: string) => {
        seatItemRefs.current[seatId]?.current?.deselect();
      },
      highlightSeats: (seatIds: string[]) => {
        seatIds.forEach((id) => {
          seatItemRefs.current[id]?.current?.highlight();
        });
      },
    }));

    return (
      <div className="seat-map">
        {seatRows.map((row, idx) => (
          <SeatRow
            key={idx}
            rowData={row}
            onSeatClick={handleSeatClick}
            registerSeatRef={registerSeatRef}
          />
        ))}
      </div>
    );
  }
);

export default SeatMap;
