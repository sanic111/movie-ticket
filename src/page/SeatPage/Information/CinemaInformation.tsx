import React from "react";
import {useTranslation} from "react-i18next";
import seatmapRaw from "@/data/seatmap.json";

function Information() {
    const {t} = useTranslation("common");
    const cinemaName = "TT Chiếu phim Quốc gia";
    const startTime = "10:20";
    const date = "20/06/2025";
    const roomName = seatmapRaw.roomName;
    const roomNumber = roomName?.replace("Screen", "") || "—";

    return (
        <div className="cinema-infor">
            <div className="left-block">
                <div>{t("cinema")}</div>
                <div>{t("showTime")}</div>
                <div>{t("room")}</div>
            </div>
            <div className="right-block">
                <div>{t(cinemaName)}</div>
                <div>
                    {t(startTime)} | {t(date)}
                </div>
                <div>{t(roomNumber)}</div>
            </div>
        </div>
    );
}

export default Information;
