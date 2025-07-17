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
        const [isAnimating, setIsAnimating] = useState(false);

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

        // Gán visibility cho container
        useEffect(() => {
            const container = containerRef.current;
            if (!container) return;

            if (selectedSeats.length > 0) {
                container.classList.add("visible");
            } else {
                container.classList.remove("visible");
                setOpen(false);
            }
        }, [selectedSeats.length]);

        // Gán open với delay để tránh conflict
        useEffect(() => {
            const container = containerRef.current;
            if (!container) return;

            if (isOpen) {
                container.classList.add("open");
            } else {
                // Delay để menu animation hoàn thành trước
                const timer = setTimeout(() => {
                    container.classList.remove("open");
                }, 50); // Delay ngắn để menu đóng trước
                
                return () => clearTimeout(timer);
            }
        }, [isOpen]);

        const toggleOpen = useCallback(() => {
            if (!containerRef.current || isAnimating) return;

            if (!isOpen && selectedSeats.length === 0) return;

            setIsAnimating(true);
            setOpen(!isOpen);
            
            // Reset animation state
            setTimeout(() => {
                setIsAnimating(false);
            }, 300);
        }, [isOpen, selectedSeats.length, containerRef, isAnimating]);

        // Menu animation với height transition mượt mà
        useEffect(() => {
            const menu = menuRef.current;
            if (!menu) return;

            // Set transition cho tất cả properties
            menu.style.transition = "max-height 250ms ease, opacity 250ms ease, transform 250ms ease";
            
            const id = requestAnimationFrame(() => {
                if (isOpen) {
                    // Mở: set max-height theo scrollHeight thực tế
                    menu.style.maxHeight = `${menu.scrollHeight}px`;
                    menu.style.opacity = "1";
                    menu.style.transform = "translateY(0)";
                } else {
                    // Đóng: co lại về 0 từ từ
                    menu.style.maxHeight = "0px";
                    menu.style.opacity = "0";
                    menu.style.transform = "translateY(-10px)";
                }
            });

            return () => cancelAnimationFrame(id);
        }, [isOpen]);

        // Update max-height khi số lượng ghế thay đổi (chỉ khi đang mở)
        useEffect(() => {
            if (!isOpen) return;
            const menu = menuRef.current;
            if (!menu) return;

            const id = requestAnimationFrame(() => {
                menu.style.maxHeight = `${menu.scrollHeight}px`;
            });

            return () => cancelAnimationFrame(id);
        }, [selectedSeats.length, isOpen]);

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
                    <button onClick={toggleOpen} disabled={isAnimating}>
                        <DropdownIcon />
                    </button>
                </div>

                <div
                    className="dropdown-menu"
                    ref={menuRef}
                    style={{
                        overflow: "hidden", // Luôn hidden để tránh scroll bar
                        pointerEvents: isOpen ? "auto" : "none",
                        // Để CSS transition xử lý max-height
                        maxHeight: "0px", // Default state
                        opacity: 0, // Default state
                        transform: "translateY(-10px)" // Default state
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
            </div>
        );
    }
);

export default SelectedSeatsDropdown;