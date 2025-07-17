import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import FilmInfo from "@/page/PurchasePage/FilmContent/FilmInfo/FilmInfo";
import ReceiverInfo from "@/page/PurchasePage/FilmContent/ReceiverInfo/ReceiverInfo";
import PaymentSummary from "@/page/PurchasePage/FilmContent/Payment/PaymentSummary";
import PromoSection from "@/page/PurchasePage/FilmContent/Promo/PromoSection";
import NotesAgreeSection, { type NotesAgreeSectionHandle } from "@/page/PurchasePage/FilmContent/Note/NotesAgreeSection";
import SectionWrapper from "@/utils/SectionWrapper";

import type { SeatType } from "@/data/seat";
import { loadSeatMap } from "@/service/dataService";
import PaymentSection from "./FilmContent/Payment/PaymentSection";
import AlertBox from "@/components/AlertBox";

export default function PurchasePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { seats = [] } = location.state || {};
  const [seatMap, setSeatMap] = useState<any>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  const agreeRef = useRef<NotesAgreeSectionHandle>(null);

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
      setSeatMap({ ...data, seats: updatedSeats });
    });
  }, [seats]);

  const selectedSeats: SeatType[] = seatMap?.seats?.flat().filter((s: SeatType) => s.isSelected) ?? [];

  const handleBook = () => {
    if (!agreeRef.current?.isAgree()) {
      setAlertMessage("Bạn phải đồng ý với điều khoản!");
      return;
    }
    console.log("Đặt vé với:", selectedSeats);
    navigate("/seat", { state: { seats: selectedSeats } });
  };

  if (!seatMap) return <div>Loading...</div>;

  return (
    <div className="purchase-page relative">
      {alertMessage && (
        <AlertBox message={alertMessage} onClose={() => setAlertMessage(null)} />
      )}

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
          <h3>*Lưu ý:</h3>
          <li>Phim dành cho mọi lứa tuổi.</li>
          <li>Vé đã mua không thể đổi hoặc trả lại.</li>
          <li>
            Nếu không nhận được mã vé sau 30 phút kể từ thời điểm hoàn tất thanh toán,
            vui lòng liên hệ tổng đài CSKH *6789 để hỗ trợ.
          </li>
          <li>
            Rạp phim không được phép phục vụ khách hàng dưới 13 tuổi cho các suất chiếu
            sau 22:00 và 16 tuổi cho các suất chiếu kết thúc sau 23:00
          </li>
        </ul>
      </SectionWrapper>

      <SectionWrapper>
        <NotesAgreeSection ref={agreeRef} />
      </SectionWrapper>

      <SectionWrapper>
        <div>
          <button onClick={handleBook} className="button active" style={{ width: "100%" }}>
            Đặt vé
          </button>
        </div>
      </SectionWrapper>
    </div>
  );
}
