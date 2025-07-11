import React, {useMemo} from "react";
import type {SeatType} from "@/data/seat";

interface PaymentSummaryProps {
    seats: SeatType[];
    discount?: number;
}

export default function PaymentSummary({seats, discount = 0}: PaymentSummaryProps) {
    const total = useMemo(() => seats.reduce((sum, s) => sum + Number(s.price), 0), [seats]);

    const totalAfterDiscount = Math.max(total - discount, 0);

    return (
        <div className="payment-summary">
            <div className="payment-row">
                <span>Tổng vé</span>
                <span className="value">{total.toLocaleString()} VND</span>
            </div>

            <div className="payment-row">
                <span>Giảm giá</span>
                <span className="discount-value">- {discount.toLocaleString()} VND</span>
            </div>

            <div className="payment-row">
                <span>Tổng thanh toán</span>
                <span className="total-value">{totalAfterDiscount.toLocaleString()} VND</span>
            </div>

            <span style={{display: "flex", justifyContent: "flex-end", marginBottom: "20px", color: "#999"}}>Đã bao gồm VAT</span>
        </div>
    );
}
