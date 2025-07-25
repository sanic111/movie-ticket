import React, {useMemo} from "react";
import {useTranslation} from "react-i18next";
import type {SeatType} from "@/data/seat";
import {formatCurrency} from "@/utils/formatCurrency";

interface PaymentSummaryProps {
    seats: SeatType[];
    discount?: number;
}

export default function PaymentSummary({seats, discount = 0}: PaymentSummaryProps) {
    const {t, i18n} = useTranslation();
    const total = useMemo(() => seats.reduce((sum, s) => sum + Number(s.price), 0), [seats]);
    const totalAfterDiscount = Math.max(total - discount, 0);
    const lang = i18n.language;

    return (
        <div className="payment-summary">
            <div className="payment-row">
                <span>{t("totalPrice")}</span>
                <span className="value">{formatCurrency(total, lang)}</span>
            </div>

            <div className="payment-row">
                <span>{t("applyPromo")}</span>
                <span className="discount-value">- {formatCurrency(discount, lang)}</span>
            </div>

            <div className="payment-row">
                <span>{t("bookTicket")}</span>
                <span className="total-value">{formatCurrency(totalAfterDiscount, lang)}</span>
            </div>

            <span style={{display: "flex", justifyContent: "flex-end", marginBottom: "20px", color: "#999"}}>
                {t("VATIncluded")}
            </span>
        </div>
    );
}
