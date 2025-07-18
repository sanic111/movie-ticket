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

    useImperativeHandle(ref, () => ({
        deselect: () => setIsSelected(false),

        highlight: () => {
            const el = document.getElementById(`seat-${seat.seatId}`);
            if (!el) return;

            // Clone node
            const newEl = el.cloneNode(true) as HTMLElement;
            el.replaceWith(newEl);

            // Add lại class để trigger animation
            newEl.classList.add("seat--highlighted");

            // Gắn lại event listener nếu cần (nếu element có click)
            newEl.onclick = handleClick;
        },

        isSelected: () => isSelected,
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
    ]
    .filter(Boolean)
    .join(" ");

    return (
        <div
            id={`seat-${seat.seatId}`}
            className={classNames}
            onClick={handleClick}
            role="button"
            aria-pressed={isSelected}
        >
            <span className="seat-label">{seat.code}</span>
            {isSelected && <SeatSelectedIcon />}
        </div>
    );
});

export default SeatItem;
