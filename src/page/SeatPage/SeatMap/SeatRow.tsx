import React, { useRef, useEffect } from "react";
import  {_validateIsSeat,type SeatType } from "@/data/seat";
import SeatItem, { type SeatItemHandle } from "@/page/SeatPage/SeatMap/SeatItem";

interface SeatRowProps {
  rowData: SeatType[];
  onSeatClick: (seat: SeatType, selected: boolean) => void;
  registerSeatRef?: (seatId: string, ref: React.RefObject<SeatItemHandle>) => void;
}

const SeatRow: React.FC<SeatRowProps> = ({ rowData, onSeatClick, registerSeatRef }) => {
  return (
    <div className="seat-row">
      {rowData.filter(_validateIsSeat).map((seat) => {
const ref = useRef<SeatItemHandle>(null!); 
        useEffect(() => {
          registerSeatRef?.(seat.seatId, ref);
        }, [seat.seatId]);
        return (
          <SeatItem
            key={seat.seatId}
            ref={ref}
            seat={seat}
            onSeatClick={onSeatClick}
          />
        );
      })}
    </div>
  );
};

export default SeatRow;
