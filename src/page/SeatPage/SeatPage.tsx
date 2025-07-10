    import React, {useRef, useCallback} from "react";
    import {useNavigate} from "react-router-dom";
    import SeatMap, {type SeatMapHandle} from "./SeatMap/SeatMap";
    import type {SeatType} from "@/data/seat";
    import seatmapRaw from "@/data/seatmap.json";
    import DropdownAndPrice, {type DropdownAndPriceHandle} from "@/page/SeatPage/SelectedSeat/DropdownAndPrice";
    import SelectedSeatsDropdown, {
        type SelectedSeatsDropdownHandle,
    } from "@/page/SeatPage/SelectedSeat/SelectedSeatsDropdown";
    import Icon from "@/assets/icons/Icon";
    import SeatLegend from "@/page/SeatPage/SeatType/SeatLegend";
    import CinemaInformation from "./Information/CinemaInformation";
    import SeatMapZoom from "@/utils/SeatMapZoom";
    const SeatPage: React.FC = () => {
        const navigate = useNavigate();
        const selectedContainerRef = useRef<HTMLDivElement>(null);
        const selectedSeatsRef = useRef<SeatType[]>([]);
        const dropdownRef = useRef<DropdownAndPriceHandle>(null);
        const selectedSeatsDropdownRef = useRef<SelectedSeatsDropdownHandle>(null);
        const seatMapRef = useRef<SeatMapHandle>(null);
        const ScreenSeatMapIcon = React.memo(() => (
            <div style={{display: "flex", justifyContent: "center"}}>
                <Icon name="screenSeatmap" />
            </div>
        ));
        const triggerUpdate = useCallback(() => {
            dropdownRef.current?.updateFromRef();
            selectedSeatsDropdownRef.current?.updateFromRef();
        }, []);

        const handleSeatClick = useCallback(
            (seat: SeatType, selected: boolean) => {
                const curr = selectedSeatsRef.current;
                if (selected && !curr.some((s) => s.seatId === seat.seatId)) {
                    selectedSeatsRef.current = [...curr, seat];
                    triggerUpdate();
                } else if (!selected && curr.some((s) => s.seatId === seat.seatId)) {
                    selectedSeatsRef.current = curr.filter((s) => s.seatId !== seat.seatId);
                    triggerUpdate();
                }
            },
            [triggerUpdate]
        );

        const handleRemoveFromDropdown = useCallback(
            (seat: SeatType) => {
                selectedSeatsRef.current = selectedSeatsRef.current.filter((s) => s.seatId !== seat.seatId);
                seatMapRef.current?.deselectSeat(seat.seatId);
                triggerUpdate();
            },
            [triggerUpdate]
        );

        const handleContinue = useCallback(() => {
            navigate("/purchase", {state: {seats: selectedSeatsRef.current}});
        }, [navigate]);

        const seatRowsRef = useRef<SeatType[][]>(
            seatmapRaw.seats.map((row: any[]) =>
                row.map((raw) => ({
                    seatId: raw.seatId,
                    status: raw.status,
                    arrRowIndex: String(raw.arrRowIndex),
                    arrColIndex: String(raw.arrColIndex),
                    code: raw.code,
                    price: raw.price,
                    originalPrice: raw.originalPrice,
                    ishow_orgPrice: raw.ishow_orgPrice?.toString() ?? "0",
                    area_id: raw.area_id,
                    type: raw.type,
                    seatVendorId: raw.seatVendorId,
                    color: raw.color,
                    des: raw.des,
                    isEnable: raw.isEnable,
                    ticketTypeId: raw.type?.toString() ?? "",
                    coupleTag: raw.coupleTag ?? "",
                    isSelected: false,
                }))
            )
        );

        return (
            <div className="seat-page">
                <SeatLegend />
                <CinemaInformation />
                <div className="screen-seatmap-icon-container">
                    <ScreenSeatMapIcon />
                </div>
                <SeatMapZoom ref={seatMapRef} seatRows={seatRowsRef.current} onSeatClick={handleSeatClick} />

                <div className="selected-seats-dropdown-container" ref={selectedContainerRef}>
                    <SelectedSeatsDropdown
                        ref={selectedSeatsDropdownRef}
                        selectedSeatsRef={selectedSeatsRef}
                        onRemoveSeat={handleRemoveFromDropdown}
                        containerRef={selectedContainerRef}
                    />  
                </div>
                <div className="dropdown-and-price-container">
                    <DropdownAndPrice
                        ref={dropdownRef}
                        selectedSeatsRef={selectedSeatsRef}
                        seatRows={seatRowsRef.current}
                        seatMapRef={seatMapRef}
                        onContinue={handleContinue}
                        onRemoveSeat={handleRemoveFromDropdown}
                    />
                </div>
            </div>
        );
    };

    export default SeatPage;
