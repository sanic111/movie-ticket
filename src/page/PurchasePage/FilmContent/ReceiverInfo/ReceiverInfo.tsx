import React, {useState, useCallback} from "react";
import {useTranslation} from "react-i18next";
import DropdownSection from "@/utils/DropdownSection";

export default function ReceiverInfoSection() {
    const {t} = useTranslation();
    const [name, setName] = useState("NGUYEN THUC ANH");
    const [phone, setPhone] = useState("123456789");
    const [email, setEmail] = useState("@gmail.com");

    const onChangeFactory = useCallback(
        (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement>) =>
            setter(e.target.value),
        []
    );

    return (
        <DropdownSection title={t("receiverInfo")}>
            <div className="form-section">
                <p className="note-text">{t("infoNote")}</p>

                <div className="form-row">
                    <div className="label-section">
                        <label className="form-label">{t("fullName")}</label>
                        <input type="text" className="form-input" value={name} onChange={onChangeFactory(setName)} />
                    </div>
                </div>

                <div className="form-row">
                    <div className="label-section">
                        <label className="form-label">{t("phone")}</label>
                        <input type="tel" className="form-input" value={phone} onChange={onChangeFactory(setPhone)} />
                    </div>
                </div>

                <div className="form-row">
                    <div className="label-section">
                        <label className="form-label">{t("email")}</label>
                        <input type="email" className="form-input" value={email} onChange={onChangeFactory(setEmail)} />
                    </div>
                </div>
            </div>
        </DropdownSection>
    );
}
