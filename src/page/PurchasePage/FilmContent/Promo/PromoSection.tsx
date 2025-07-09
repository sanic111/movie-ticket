import React, {useState, useEffect, useCallback} from "react";
import {loadPromotions} from "@/service/dataService";

interface PromoSectionProps {
    onApply: (discount: number, code: string) => void;
}

export default function PromoSection({onApply}: PromoSectionProps) {
    const [promos, setPromos] = useState<any[]>([]);
    const [appliedCode, setAppliedCode] = useState<string>("");

    useEffect(() => {
        loadPromotions().then(setPromos);
    }, []);

    const togglePromo = useCallback(
        (promo: any) => {
            if (!promo.canApply) {
                alert("Xem chi tiết khuyến mãi");
                return;
            }
            if (appliedCode === promo.voucherCode) {
                // Hủy bỏ
                setAppliedCode("");
                onApply(0, "");
            } else {
                // Áp dụng
                setAppliedCode(promo.voucherCode);
                onApply(promo.discountValue, promo.voucherCode);
            }
        },
        [appliedCode, onApply]
    );

    return (
        <div className="promo-section">
            <div className="applied-voucher">
                <label className="promo-label">MÃ GIẢM GIÁ</label>
                {appliedCode && (
                    <div className="promo-code">
                      <strong>{appliedCode}</strong>
                    </div>
                )}
            </div>
            <div className="promo-list">
                {promos.map((p: any) => (
                    <div
                        key={p.voucherCode}
                        className={`promo-card ${appliedCode === p.voucherCode ? "promo-selected" : ""}`}
                    >
                        <p className="promo-title">{p.promotionTitle}</p>
                        <p className={p.canApply ? "promo-desc" : "promo-unavailable"}>
                            {p.canApply ? p.information : "Chưa thỏa mãn điều kiện"}
                        </p>
                        <div className="expiry-and-option">
                            <p className="promo-expiry">HSD: {p.promotionExpiry}</p>
                            <button className="promo-action" onClick={() => togglePromo(p)}>
                                {appliedCode === p.voucherCode ? "Hủy bỏ" : p.canApply ? "Áp dụng" : "Chi tiết"}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

