import React, {forwardRef, useImperativeHandle, useRef, useEffect, useState, useCallback} from "react";
import {loadPromotions} from "@/service/dataService";

export interface PromoSectionHandle {
    getDiscountInfo: () => {value: number; code: string};
}

const PromoSection = forwardRef<PromoSectionHandle>((_, ref) => {
    const promosRef = useRef<any[]>([]);
    const [appliedCode, setAppliedCode] = useState("");
    const [discount, setDiscount] = useState(0);

    useImperativeHandle(ref, () => ({
        getDiscountInfo: () => ({
            value: discount,
            code: appliedCode,
        }),
    }));

    useEffect(() => {
        loadPromotions().then((data) => {
            promosRef.current = data;
            forceRerender({}); // gọi để trigger render lại
        });
    }, []);
    const [, forceRerender] = useState({});

    const togglePromo = useCallback(
        (promo: any) => {
            if (!promo.canApply) {
                alert("Xem chi tiết khuyến mãi");
                return;
            }

            if (appliedCode === promo.voucherCode) {
                setAppliedCode("");
                setDiscount(0);
            } else {
                setAppliedCode(promo.voucherCode);
                setDiscount(promo.discountValue);
            }
        },
        [appliedCode]
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
                {promosRef.current.map((p: any) => (
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
});

export default PromoSection;
