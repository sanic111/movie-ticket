import React, { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import DropdownSection from "@/utils/DropdownSection";
import PaymentSummary from "@/page/PurchasePage/FilmContent/Payment/PaymentSummary";
import PromoSection from "../Promo/PromoSection";
import type { SeatType } from "@/data/seat";

interface PaymentSectionProps {
  seats: SeatType[];
}

export default function PaymentSection({ seats }: PaymentSectionProps) {
  const { t } = useTranslation();
  const [discount, setDiscount] = useState(0);
  const [code, setCode] = useState("");

  const handleApplyPromo = useCallback((value: number, code: string) => {
    setDiscount(value);
    setCode(code);
  }, []);

  return (
    <div className="payment-section">
      <DropdownSection title={t("paymentInfo")} isStaticTitle />

      <DropdownSection
        defaultOpen
        customHeader={<span className="custom-header">{t("movieTicket")} ({seats.length})</span>}
      >
        <PaymentSummary seats={seats} discount={discount} />
      </DropdownSection>

      <PromoSection onApply={handleApplyPromo} />
    </div>
  );
}
