import React, {useMemo} from "react";
import DropdownSection from "@/utils/DropdownSection";
import type {SeatType} from "@/data/seat";

interface FilmInfoSectionProps {
    seatMap: any;
}

export default function FilmInfoSection({seatMap}: FilmInfoSectionProps) {
    const {
        sessionInfo: {filmName, duration, sessionTime, cinemaName, locationId},
        roomName,
        locations,
        seats: seatsRaw,
    } = seatMap;

    const selectedSeats = useMemo<SeatType[]>(() => seatsRaw.flat().filter((s: SeatType) => s.isSelected), [seatsRaw]);

    const total = useMemo(() => selectedSeats.reduce((sum, s) => sum + Number(s.price), 0), [selectedSeats]);

    const locationName = useMemo(
        () => locations?.find((loc: any) => loc.id === locationId)?.name || "Không rõ",
        [locations, locationId]
    );

    return (
        <DropdownSection title="THÔNG TIN PHIM" defaultOpen>
            <div className="info-section">
                <div className="info-row">
                    <span className="label">Tên phim</span>
                    <span className="value">{filmName}</span>
                </div>
                <div className="info-row">
                    <span className="label">Thời lượng</span>
                    <span className="value">{duration} phút</span>
                </div>
                <div className="info-row">
                    <span className="label">Suất chiếu</span>
                    <span className="value">{sessionTime}</span>
                </div>
                <div className="info-row">
                    <span className="label">Phòng chiếu</span>
                    <span className="value">{roomName}</span>
                </div>
                <div className="info-row">
                    <span className="label">Số ghế</span>
                    <span className="value">{selectedSeats.map((s) => s.code).join(", ") || "—"}</span>
                </div>
                <div className="info-row">
                    <span className="label">Rạp chiếu</span>
                    <span className="value">{cinemaName}</span>
                </div>
                <div className="info-row">
                    <span className="label">Địa chỉ</span>
                    <span className="value">{locationName}</span>
                </div>
            </div>
        </DropdownSection>
    );
}
