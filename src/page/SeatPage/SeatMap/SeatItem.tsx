import React, {useCallback, useState, useImperativeHandle, forwardRef} from "react";
import type {SeatType} from "@/data/seat";
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

const SeatItem = forwardRef<SeatItemHandle, SeatItemProps>(({seat, onSeatClick}, ref) => {
    const [isSelected, setIsSelected] = useState(seat.isSelected || false);
    const [isHighlighted, setIsHighlighted] = useState(false);

    useImperativeHandle(ref, () => ({
        deselect: () => setIsSelected(false),
        highlight: () => {
            setIsHighlighted(true);
            setTimeout(() => setIsHighlighted(false), 2000);
        },
        isSelected: () => isSelected, // Thêm hàm này
    }));

    const handleClick = useCallback(() => {
        if (!seat.isEnable) return;
        const newSelected = !isSelected;
        setIsSelected(newSelected);
        onSeatClick(seat, newSelected);
    }, [isSelected, onSeatClick, seat]);

    const mapSeatTypeClass = (type: number): string => {
        switch (type) {
            case 0:
                return "normal";
            case 1:
                return "vip";
            default:
                return "unknown";
        }
    };

    const SeatSelectedIcon = () => (
        <div style={{display: "flex", justifyContent: "center"}}>
            <Icon name="seatSelectedPath" />
        </div>
    );

    const classNames = [
        "seat-item",
        `seat--type-${mapSeatTypeClass(seat.type)}`,
        !seat.isEnable && "seat--disabled",
        isSelected && "seat--selected",
        isHighlighted && "seat--highlighted",
    ]
    .filter(Boolean)
    .join(" ");

    return (
        <div className={classNames} onClick={handleClick} role="button" aria-pressed={isSelected}>
            <span className="seat-label">{seat.code}</span>
            {isSelected && (
                <span className="">
                    <SeatSelectedIcon />
                </span>
            )}
        </div>
    );
});

export default SeatItem;
