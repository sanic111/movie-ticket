import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import DropdownSection from "@/utils/DropdownSection";
import type { SeatType } from "@/data/seat";

interface FilmInfoSectionProps {
  seatMap: any;
}

export default function FilmInfoSection({ seatMap }: FilmInfoSectionProps) {
  const { t } = useTranslation();
  const {
    sessionInfo: { filmName, duration, sessionTime, cinemaName, locationId },
    roomName,
    locations,
    seats: seatsRaw,
  } = seatMap;

  const selectedSeats = useMemo<SeatType[]>(() => seatsRaw.flat().filter((s: SeatType) => s.isSelected), [seatsRaw]);

  const locationName = useMemo(
    () => locations?.find((loc: any) => loc.id === locationId)?.name || "Không rõ",
    [locations, locationId]
  );

  return (
    <DropdownSection title={t("filmInfo")} defaultOpen>
      <div className="info-section">
        <div className="info-row">
          <span className="label">{t("movieName")}</span>
          <span className="value">{t(filmName)}</span>
        </div>
        <div className="info-row">
          <span className="label">{t("duration")}</span>
          <span className="value">
            {duration} {t("minutes")}
          </span>
        </div>
        <div className="info-row">
          <span className="label">{t("showTime")}</span>
          <span className="value">{t(sessionTime)}</span>
        </div>
        <div className="info-row">
          <span className="label">{t("room")}</span>
          <span className="value">{t(roomName)}</span>
        </div>
        <div className="info-row">
          <span className="label">{t("seats")}</span>
          <span className="value">{selectedSeats.map((s) => s.code).join(", ") || "—"}</span>
        </div>
        <div className="info-row">
          <span className="label">{t("cinema")}</span>
          <span className="value">{t(cinemaName)}</span>
        </div>
        <div className="info-row">
          <span className="label">{t("address")}</span>
          <span className="value">{t(locationName)}</span>
        </div>
      </div>
    </DropdownSection>
  );
}
