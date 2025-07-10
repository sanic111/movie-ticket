import React, {useState, useCallback} from "react";
import DropdownSection from "@/utils/DropdownSection";

export default function ReceiverInfoSection() {
    const [name, setName] = useState("NGUYEN THUC ANH");
    const [phone, setPhone] = useState("123456789");
    const [email, setEmail] = useState("@gmail.com");

    const onChangeFactory = useCallback(
        (setter: React.Dispatch<React.SetStateAction<string>>) =>
            (e: React.ChangeEvent<HTMLInputElement>) => setter(e.target.value),
        []
    );

    return (
        <DropdownSection title="THÔNG TIN NHẬN VÉ">
            <div className="form-section">
                <p className="note-text">
                    Thông tin vé sẽ được gửi tới email; mục "Thông báo" trên ứng dụng hoặc mục "Vé của tôi" trong dịch vụ Đặt vé xem phim
                </p>

                <div className="form-row">
                    <div className="label-section">
                        <label className="form-label">Họ và Tên</label>
                        <input type="text" className="form-input" value={name} onChange={onChangeFactory(setName)} />
                    </div>
                </div>

                <div className="form-row">
                    <div className="label-section">
                        <label className="form-label">Số điện thoại</label>
                        <input type="tel" className="form-input" value={phone} onChange={onChangeFactory(setPhone)} />
                    </div>
                </div>

                <div className="form-row">
                    <div className="label-section">
                        <label className="form-label">E-mail</label>
                        <input type="email" className="form-input" value={email} onChange={onChangeFactory(setEmail)} />
                    </div>
                </div>
            </div>
        </DropdownSection>
    );
}
