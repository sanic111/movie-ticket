import React, {useRef, useImperativeHandle, forwardRef, useState} from "react";
import type {SeatType} from "@/data/seat";
import SeatRow from "@/page/SeatPage/SeatMap/SeatRow";
import type {SeatItemHandle} from "./SeatItem";
import AlertBox from "@/components/AlertBox";

export interface SeatMapHandle {
    deselectSeat: (seatId: string) => void;
    highlightSeats: (seatIds: string[]) => void;
}

interface SeatMapProps {
    seatRows: SeatType[][];
    onSeatClick: (seat: SeatType, selected: boolean) => void;
}

const SeatMap = forwardRef<SeatMapHandle, SeatMapProps>(({seatRows, onSeatClick}, ref) => {
    const seatItemRefs = useRef<Record<string, React.RefObject<SeatItemHandle>>>({});
    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const [highlightQueue, setHighlightQueue] = useState<string[]>([]);
    const [currentHighlight, setCurrentHighlight] = useState<string | null>(null);

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
                setAlertMessage("Bạn chỉ được chọn tối đa 10 ghế.");
                seatItemRefs.current[seat.seatId]?.current?.deselect();
                return;
            }

            // Nếu chọn đúng ghế đang highlight loại khỏi queue, nhưng không highlight tiếp
            if (seat.seatId === currentHighlight) {
                const newQueue = highlightQueue.filter((id) => id !== seat.seatId);
                setHighlightQueue(newQueue);
                setCurrentHighlight(null); // clear highlight cho đến khi bấm tiếp tục
            }
        }

        onSeatClick(seat, selected);
    };

    useImperativeHandle(ref, () => ({
        deselectSeat: (seatId: string) => {
            seatItemRefs.current[seatId]?.current?.deselect();
        },

        highlightSeats: (seatIds: string[]) => {
            if (!seatIds.length) return;
            setHighlightQueue(seatIds); // luôn giữ lại danh sách còn lại
            const first = seatIds[0];
            setCurrentHighlight(first);
            seatItemRefs.current[first]?.current?.highlight();
        },
    }));

    return (
        <div className="seat-map relative">
            {alertMessage && <AlertBox message={alertMessage} onClose={() => setAlertMessage(null)} />}
            {seatRows.map((row, idx) => (
                <SeatRow key={idx} rowData={row} onSeatClick={handleSeatClick} registerSeatRef={registerSeatRef} />
            ))}
        </div>
    );
});
export default SeatMap;
