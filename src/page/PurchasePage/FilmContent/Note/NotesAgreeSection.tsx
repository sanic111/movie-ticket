import React, { useState, useCallback, forwardRef, useImperativeHandle } from "react";
import { useTranslation } from "react-i18next";
import Icon from "@/assets/icons/Icon";

export interface NotesAgreeSectionHandle {
  isAgree: () => boolean;
}

const NotesAgreeSection = forwardRef<NotesAgreeSectionHandle>((_, ref) => {
  const { t } = useTranslation();
  const [agree, setAgree] = useState(false);

  const toggleAgree = useCallback(() => setAgree((v) => !v), []);

  useImperativeHandle(ref, () => ({
    isAgree: () => agree,
  }));

  return (
    <div
      className="agree-section"
      onClick={toggleAgree}
      style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
    >
      <span className="checkbox-icon" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "20px", height: "20px", marginRight: "8px" }}>
        {agree ? (
          <Icon name="termChecked" style={{ width: "20px", height: "20px" }} />
        ) : (
          <span style={{ width: "20px", height: "20px", border: "1px solid #ccc", borderRadius: "7px" }} />
        )}
      </span>

      <span className="agree-label">
        {t("termsAgreement")}
        <a
          href="/movie-ticket/terms-and-policy"
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          style={{ color: "#1e4894", textDecoration: "underline" }}
        >
          {t("termsPolicy")}
        </a>
      </span>
    </div>
  );
});

export default NotesAgreeSection;
