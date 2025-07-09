import React, {forwardRef, useImperativeHandle, useState, useRef, useEffect, useCallback} from "react";
import type {SeatType} from "@/data/seat";
import Icon from "@/assets/icons/Icon";

export interface SelectedSeatsDropdownHandle {
    updateFromRef: () => void;
}

interface SelectedSeatsDropdownProps {
    selectedSeatsRef: React.RefObject<SeatType[]>;
    onRemoveSeat: (seat: SeatType) => void;
    containerRef: React.RefObject<HTMLDivElement | null>;
}

const SelectedSeatsDropdown = forwardRef<SelectedSeatsDropdownHandle, SelectedSeatsDropdownProps>(
    ({selectedSeatsRef, onRemoveSeat, containerRef}, ref) => {
        const [selectedSeats, setSelectedSeats] = useState<SeatType[]>([]);
        const [isOpen, setOpen] = useState(false);

        const listRef = useRef<HTMLUListElement>(null);
        const menuRef = useRef<HTMLDivElement>(null);
        const positionsRef = useRef<Map<string, DOMRect>>(new Map());

        const updateFromRef = useCallback(() => {
            if (!listRef.current || !selectedSeatsRef.current) return;

            const firstPositions = new Map<string, DOMRect>();
            listRef.current.childNodes.forEach((node) => {
                const el = node as HTMLElement;
                if (el.dataset.id) {
                    firstPositions.set(el.dataset.id, el.getBoundingClientRect());
                }
            });
            positionsRef.current = firstPositions;

            const sorted = [...selectedSeatsRef.current].sort((a, b) =>
                a.code.localeCompare(b.code, "vi", {numeric: true})
            );
            setSelectedSeats(sorted);
        }, [selectedSeatsRef]);

        useImperativeHandle(ref, () => ({updateFromRef}));

        useEffect(() => {
            updateFromRef();
        }, [updateFromRef]);

        // FLIP animation khi danh sách thay đổi
        useEffect(() => {
            if (!isOpen || !listRef.current) return;

            setTimeout(() => {
                requestAnimationFrame(() => {
                    const newPositions = new Map<string, DOMRect>();
                    listRef.current!.childNodes.forEach((node) => {
                        const el = node as HTMLElement;
                        if (el.dataset.id) {
                            newPositions.set(el.dataset.id, el.getBoundingClientRect());
                        }
                    });

                    newPositions.forEach((newRect, id) => {
                        const prevRect = positionsRef.current.get(id);
                        if (!prevRect) return;

                        const dx = prevRect.left - newRect.left;
                        const dy = prevRect.top - newRect.top;

                        if (dx !== 0 || dy !== 0) {
                            const el = listRef.current!.querySelector(`[data-id="${id}"]`) as HTMLElement;
                            if (!el) return;
                            el.style.transition = "none";
                            el.style.transform = `translate(${dx}px, ${dy}px)`;
                            requestAnimationFrame(() => {
                                el.style.transition = "transform 300ms ease";
                                el.style.transform = "";
                            });
                        }
                    });

                    positionsRef.current = newPositions;
                });
            }, 0);
        }, [selectedSeats, isOpen]);

        // Gán class open/close vào container
        useEffect(() => {
            const container = containerRef.current;
            if (!container) return;

            if (isOpen && selectedSeats.length > 0) {
                container.classList.add("open");
            } else {
                container.classList.remove("open");
            }
        }, [isOpen, selectedSeats.length]);

        const toggleOpen = useCallback(() => {
            const container = containerRef.current;
            if (!container) return;

            if (isOpen) {
                container.classList.remove("open");
                container.classList.add("closing");
                setTimeout(() => {
                    container.classList.remove("closing");
                    setOpen(false);
                }, 300);
            } else {
                setOpen(true);
                container.classList.add("open");
            }
        }, [isOpen, containerRef]);

        // Effect 1: Khi mở dropdown → đặt max-height theo scrollHeight
        useEffect(() => {
            const menu = menuRef.current;
            if (!menu) return;

            menu.style.overflow = "hidden";
            menu.style.transition = "max-height 400ms ease";

            const id = requestAnimationFrame(() => {
                const maxHeight = isOpen ? menu.scrollHeight : 0;
                menu.style.maxHeight = `${maxHeight}px`;
            });

            return () => cancelAnimationFrame(id);
        }, [isOpen]);

        // Effect 2: Khi danh sách ghế thay đổi (chỉ khi dropdown đang mở)
        useEffect(() => {
            if (!isOpen) return;
            const menu = menuRef.current;
            if (!menu) return;

            const id = requestAnimationFrame(() => {
                const maxHeight = menu.scrollHeight;
                menu.style.maxHeight = `${maxHeight}px`;
            });

            return () => cancelAnimationFrame(id);
        }, [selectedSeats.length]);

        const DropdownIcon = React.memo(() => (
            <div style={{display: "flex", justifyContent: "center"}}>
                <Icon name={isOpen ? "dropdownDown" : "dropdownUp"} />
            </div>
        ));

        return (
            <div className="selected-seats-dropdown">
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "100%",

                        padding: "5px 5px 0 20px",
                    }}
                >
                    <div>
                        <div style={{fontWeight: "bold", fontSize: "1rem"}}>
                            Danh sách ghế đã chọn ({selectedSeats.length})
                        </div>
                        <div style={{color: "#999"}}>Chỉnh sửa vị trí ghế bên trên hoặc tại đây</div>
                    </div>
                    <button onClick={toggleOpen}>
                        <DropdownIcon />
                    </button>
                </div>
                {selectedSeats.length > 0 && (
                    <div
                        className={`dropdown-menu${isOpen ? " open" : ""}`}
                        ref={menuRef}
                        style={{
                            opacity: isOpen ? 1 : 0.3,
                            pointerEvents: isOpen ? "auto" : "none",
                            transition: "opacity 300ms ease",
                        }}
                    >
                        <ul className="seat-list" ref={listRef}>
                            {selectedSeats.map((seat) => (
                                <li key={seat.seatId} data-id={seat.seatId} className="seat-card">
                                    <div className="seat-box" style={{backgroundColor: seat.color}}>
                                        <span className="seat-text">Ghế {seat.code}</span>
                                        <span className="seat-price">
                                            {(typeof seat.price === "string"
                                                ? parseInt(seat.price)
                                                : seat.price
                                            ).toLocaleString()}{" "}
                                            VND
                                        </span>
                                        <button className="remove-btn" onClick={() => onRemoveSeat(seat)}>
                                            ×
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        );
    }
);

export default SelectedSeatsDropdown;
