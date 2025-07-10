import React, {useState, useCallback} from "react";
import DropdownSection from "@/utils/DropdownSection";
import PaymentSummary from "@/page/PurchasePage/FilmContent/Payment/PaymentSummary";
import PromoSection from "../Promo/PromoSection";
import type {SeatType} from "@/data/seat";

interface PaymentSectionProps {
    seats: SeatType[];
}

export default function PaymentSection({seats}: PaymentSectionProps) {
    const [discount, setDiscount] = useState(0);
    const [code, setCode] = useState("");

    const handleApplyPromo = useCallback((value: number, code: string) => {
        setDiscount(value);
        setCode(code);
    }, []);

    return (
        <div className="payment-section">
            <DropdownSection title="THÔNG TIN THANH TOÁN" isStaticTitle />

            <DropdownSection
                defaultOpen
                customHeader={<span className="custom-header">Vé xem phim ({seats.length})</span>}
            >
                <PaymentSummary seats={seats} discount={discount} />
            </DropdownSection>

            <PromoSection onApply={handleApplyPromo} />
        </div>
    );
}
