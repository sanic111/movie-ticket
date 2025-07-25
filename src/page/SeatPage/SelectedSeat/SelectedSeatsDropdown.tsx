import React, {forwardRef, useImperativeHandle, useState, useRef, useEffect, useCallback} from "react";
import type {SeatType} from "@/data/seat";
import Icon from "@/assets/icons/Icon";
import {useTranslation} from "react-i18next";
import {formatCurrency} from "@/utils/formatCurrency";

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
        const {t, i18n} = useTranslation("common");
        const lang = i18n.language;
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

        //gán open
        useEffect(() => {
            const container = containerRef.current;
            if (!container) return;

            if (isOpen) {
                container.classList.add("open");
            } else {
                container.classList.remove("open");
            }
        }, [isOpen]);

        const toggleOpen = useCallback(() => {
            if (!containerRef.current) return;

            if (!isOpen && selectedSeats.length === 0) return;

            setOpen(!isOpen);
        }, [isOpen, selectedSeats.length, containerRef]);

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
                            {t("selectedSeats")} ({selectedSeats.length}){" "}
                        </div>
                        <div style={{color: "#999"}}> {t("editSeatsInstruction")}</div>
                    </div>
                    <button onClick={toggleOpen}>
                        <DropdownIcon />
                    </button>
                </div>

                <div
                    className="dropdown-menu"
                    ref={menuRef}
                    style={{
                        opacity: 1,
                        pointerEvents: "auto",
                    }}
                >
                    <ul className="seat-list" ref={listRef}>
                        {selectedSeats.map((seat) => (
                            <li key={seat.seatId} data-id={seat.seatId} className="seat-card">
                                <div className="seat-box" style={{backgroundColor: seat.color}}>
                                    <span className="seat-text">
                                        {" "}
                                        {t("seat")} {seat.code}
                                    </span>
                                    <span className="seat-price">{formatCurrency(Number(seat.price), lang)}</span>
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
