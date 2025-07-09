import React, {useState, useImperativeHandle, forwardRef, useCallback} from "react";
import {validateSeatSelection, type SeatType} from "@/data/seat";
import type {SeatMapHandle} from "../SeatMap/SeatMap";

export interface DropdownAndPriceHandle {
    updateFromRef: () => void;
}

interface Props {
    selectedSeatsRef: React.RefObject<SeatType[]>;
    seatRows: SeatType[][]; // truyền thêm vào để logic check chọn ghế đúng quy định chưa
    seatMapRef: React.RefObject<SeatMapHandle | null>; // ref đề xuất chỗ cần chọn
    onContinue: () => void;
    onRemoveSeat: (seat: SeatType) => void;
}

const DropdownAndPrice = forwardRef<DropdownAndPriceHandle, Props>(
    ({selectedSeatsRef, seatRows, onContinue, onRemoveSeat, seatMapRef}, ref) => {
        const [seats, setSeats] = useState<SeatType[]>([]);

        const updateFromRef = useCallback(() => {
            const current = (selectedSeatsRef.current || []).slice().sort((a, b) => a.seatId.localeCompare(b.seatId));

            setSeats((prevSeats) => {
                const prevSorted = prevSeats.slice().sort((a, b) => a.seatId.localeCompare(b.seatId));
                const isDifferent =
                    current.length !== prevSorted.length || current.some((s, i) => s.seatId !== prevSorted[i]?.seatId);

                if (isDifferent) {
                    return [...current];
                }
                return prevSeats;
            });
        }, [selectedSeatsRef]);

        useImperativeHandle(ref, () => ({updateFromRef}));

        const handleRemove = useCallback(
            (seat: SeatType) => {
                onRemoveSeat(seat);
                updateFromRef();
            },
            [onRemoveSeat, updateFromRef]
        );

        const handleContinue = () => {
            const error = validateSeatSelection(seats, seatRows);

            if (error) {
                // alert(typeof error === "string" ? error : JSON.stringify(error));
                alert(typeof error === "string" ? error : error.message);

                // Nếu lỗi là ghế giữa hoặc ghế cuối, highlight ghế cần chọn
                const highlightIds: string[] = [];
                for (const row of seatRows) {
                    const selectedMap: Record<number, boolean> = {};
                    row.forEach((s) => {
                        selectedMap[parseInt(s.arrColIndex)] = seats.some((sel) => sel.seatId === s.seatId);
                    });

                    const indices = Object.keys(selectedMap)
                    .map(Number)
                    .sort((a, b) => a - b);

                    for (let i = 0; i < indices.length - 2; i++) {
                        const idx1 = indices[i];
                        const idx2 = indices[i + 1];
                        const idx3 = indices[i + 2];
                        if (selectedMap[idx1] && !selectedMap[idx2] && selectedMap[idx3]) {
                            const seatToHighlight = row.find((s) => parseInt(s.arrColIndex) === idx2);
                            if (seatToHighlight) highlightIds.push(seatToHighlight.seatId);
                        }
                    }

                    const maxIdx = Math.max(...indices);
                    if (selectedMap[maxIdx - 1] && !selectedMap[maxIdx]) {
                        const seatToHighlight = row.find((s) => parseInt(s.arrColIndex) === maxIdx);
                        if (seatToHighlight) highlightIds.push(seatToHighlight.seatId);
                    }
                }

                seatMapRef.current?.highlightSeats(highlightIds);
                return;
            }

            onContinue();
        };

        const total = seats.reduce((sum, s) => sum + Number(s.price), 0);

        return (
            <div className="dropdown-and-price">
                {seats.length > 0 ? (
                    <>
                        <div className="total-price">
                            <div className="text">
                                <div className="total">Tổng tiền vé: </div>
                                <div className="price">{total.toLocaleString()} VND</div>
                            </div>
                            <button className="button active" onClick={handleContinue}>
                                Tiếp tục
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="choose-seat">
                        <div className="empty-message">Quý khách vui lòng chọn vị trí ghế ngồi để tiếp tục</div>
                        <button className="button disabled" disabled>
                            Tiếp tục
                        </button>
                    </div>
                )}
            </div>
        );
    }
);

export default DropdownAndPrice;
