import React from "react";
import DropdownSection from "@/utils/DropdownSection";
import PaymentSummary from "@/page/PurchasePage/FilmContent/Payment/PaymentSummary";
import type { SeatType } from "@/data/seat";

interface PaymentSectionProps {
  seats: SeatType[];
  discount: number;
}

export default function PaymentSection({ seats, discount }: PaymentSectionProps) {
  return (
    <div className="payment-section">
      <DropdownSection title="THÔNG TIN THANH TOÁN" isStaticTitle />

      <DropdownSection
        defaultOpen
        customHeader={<span className="custom-header">Vé xem phim ({seats.length})</span>}
      >
        <PaymentSummary seats={seats} discount={discount} />
      </DropdownSection>
    </div>
  );
}
