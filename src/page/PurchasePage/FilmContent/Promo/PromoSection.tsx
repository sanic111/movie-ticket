import React, { useState, useEffect, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { loadPromotions } from "@/service/dataService";
import Icon from "@/assets/icons/Icon";
import { IoMdPricetag } from "react-icons/io";
import { useAlert } from "@/utils/AlertProvider";

interface PromoSectionProps {
    onApply: (discount: number, code: string) => void;
}

export default function PromoSection({ onApply }: PromoSectionProps) {
  const { t } = useTranslation();
  const [promos, setPromos] = useState<any[]>([]);
  const [appliedCode, setAppliedCode] = useState<string>("");
  const { showAlert } = useAlert();
  const promoListRef = useRef<HTMLDivElement>(null);
  const promoRefs = useRef<Record<string, HTMLDivElement | null>>({});

    useEffect(() => {
        loadPromotions().then(setPromos);
    }, []);

  const togglePromo = useCallback(
    (promo: any) => {
      if (!promo.canApply) {
        showAlert(t("promo.detailsRequired"));
        return;
      }

      if (appliedCode === promo.voucherCode) {
        // Remove
        setAppliedCode("");
        onApply(0, "");
      } else {
        // Apply
        setAppliedCode(promo.voucherCode);
        onApply(promo.discountValue, promo.voucherCode);
      }
    },
    [appliedCode, onApply, t]
  );

  return (
    <div className="promo-section relative">
      <div className="applied-voucher">
        <label className="promo-label">{t("promo.label")}</label>
        {appliedCode ? (
          <div className="promo-code">
            <span
              style={{ marginRight: "8px", cursor: "pointer" }}
              onClick={() => {
                const el = promoRefs.current[appliedCode];
                const container = promoListRef.current;
                if (el && container) {
                  const offset =
                    el.offsetLeft - container.offsetWidth / 2 + el.offsetWidth / 2;
                  container.scrollTo({ left: offset, behavior: "smooth" });
                }
              }}
            >
              <strong>{appliedCode}</strong>
            </span>
            <div className="divider">|</div>
            <Icon
              name="close"
              onClick={() => {
                setAppliedCode("");
                onApply(0, "");
              }}
            />
          </div>
        ) : (
          <div className="promo-empty">
            <IoMdPricetag />
            <p style={{ marginLeft: "4px" }}>{t("promo.placeholder")}</p>
          </div>
        )}
      </div>

      <div className="promo-list" ref={promoListRef}>
        {promos.map((p: any) => (
          <div
            key={p.voucherCode}
            ref={(el) => {
              promoRefs.current[p.voucherCode] = el;
            }}
            className={`promo-card ${appliedCode === p.voucherCode ? "promo-selected" : ""}`}
          >
            <p className="promo-title">{p.promotionTitle}</p>
            <p className={p.canApply ? "promo-desc" : "promo-unavailable"}>
              {p.canApply ? p.information : t("promo.notEligible")}
            </p>
            <div className="expiry-and-option">
              <p className="promo-expiry">
                {t("promo.expiry")}: {p.promotionExpiry}
              </p>
              <button className="promo-action" onClick={() => togglePromo(p)}>
                {appliedCode === p.voucherCode
                  ? t("promo.remove")
                  : p.canApply
                  ? t("promo.apply")
                  : t("promo.details")}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

