import React from "react";
import seatmapRaw from "@/data/seatmap.json";
function Information() {
    const cinemaName = "TT Chiếu phim Quốc gia";
    const startTime = "10:20";
    const date = "20/06/2025";
    const roomName = seatmapRaw.roomName;
    const roomNumber = roomName?.replace("Screen", "") || "—";
    return (
        <div className="cinema-infor">
            <div className="left-block">
                <div>Rạp chiếu:</div>
                <div>Xuất chiếu:</div>
                <div>Phòng chiếu:</div>
            </div>
            <div className="right-block">
                <div>{cinemaName}</div>
                <div>
                    {startTime} | {date}
                </div>

                <div>{roomNumber}</div>
            </div>
        </div>
    );
}

export default Information;
