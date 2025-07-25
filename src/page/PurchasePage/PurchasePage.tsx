import React, {useCallback, useEffect, useRef, useState} from "react";
import {useNavigate, useLocation} from "react-router-dom";

import FilmInfo from "@/page/PurchasePage/FilmContent/FilmInfo/FilmInfo";
import ReceiverInfo from "@/page/PurchasePage/FilmContent/ReceiverInfo/ReceiverInfo";
import PaymentSummary from "@/page/PurchasePage/FilmContent/Payment/PaymentSummary";
import PromoSection from "@/page/PurchasePage/FilmContent/Promo/PromoSection";
import NotesAgreeSection, {type NotesAgreeSectionHandle} from "@/page/PurchasePage/FilmContent/Note/NotesAgreeSection";
import SectionWrapper from "@/utils/SectionWrapper";

import type {SeatType} from "@/data/seat";
import {loadSeatMap} from "@/service/dataService";
import PaymentSection from "./FilmContent/Payment/PaymentSection";
import {useAlert} from "@/utils/AlertProvider";
import {useTranslation} from "react-i18next";

export default function PurchasePage() {
    const navigate = useNavigate();
    const location = useLocation();
    const {seats = []} = location.state || {};
    const [seatMap, setSeatMap] = useState<any>(null);
    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const {showAlert} = useAlert();
    const agreeRef = useRef<NotesAgreeSectionHandle>(null);
    const {t} = useTranslation();

    useEffect(() => {
        loadSeatMap().then((data) => {
            const selectedSeatIds = seats.map((s: SeatType) => s.seatId);
            const updatedSeats = data.seats.map((row: any[]) =>
                row.map((seat: any) => ({
                    ...seat,
                    ishow_orgPrice: seat.ishow_orgPrice?.toString() ?? "0",
                    ticketTypeId: seat.type?.toString() ?? "",
                    coupleTag: seat.coupleTag ?? "",
                    isSelected: selectedSeatIds.includes(seat.seatId),
                }))
            );
            setSeatMap({...data, seats: updatedSeats});
        });
    }, [seats]);

    const selectedSeats: SeatType[] = seatMap?.seats?.flat().filter((s: SeatType) => s.isSelected) ?? [];

    const handleBook = () => {
        if (!agreeRef.current?.isAgree()) {
            showAlert(t("agreeRequired"));
            return;
        }
        console.log("Đặt vé với:", selectedSeats);
        navigate("/seat", {state: {seats: selectedSeats}});
    };

    if (!seatMap) return <div>Loading...</div>;

    return (
        <div className="purchase-page relative">
            <SectionWrapper>
                <FilmInfo seatMap={seatMap} />
            </SectionWrapper>

            <SectionWrapper>
                <ReceiverInfo />
            </SectionWrapper>

            <SectionWrapper>
                <PaymentSection seats={selectedSeats} />
            </SectionWrapper>

            <SectionWrapper>
                <ul className="note-list">
                    <h3>*{t("notes")}:</h3>
                    <li>{t("note1")}</li>
                    <li>{t("note2")}</li>
                    <li>{t("note3")}</li>
                    <li>{t("note4")}</li>
                </ul>
            </SectionWrapper>

            <SectionWrapper>
                <NotesAgreeSection ref={agreeRef} />
            </SectionWrapper>

            <SectionWrapper>
                <div>
                    <button onClick={handleBook} className="button active" style={{width: "100%"}}>
                        {t("bookTicket")}
                    </button>
                </div>
            </SectionWrapper>
        </div>
    );
}
