import React, {useState, useCallback} from "react";
import DropdownSection from "@/utils/DropdownSection";

export default function ReceiverInfoSection() {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");

    const onChangeFactory = useCallback(
        (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement>) =>
            setter(e.target.value),
        []
    );

    return (
        <DropdownSection title="THÔNG TIN NHẬN VÉ">
            <div className="form-section">
                <p className="note-text">
                    Thông tin vé sẽ được gửi tới email; mục "Thông báo" trên ứng dụng hoặc mục "Vé của tôi" trong dịch
                    vụ Đặt vé xem phim
                </p>

                <div className="form-row">
                    <div className="label-section">
                        <label className="form-label">Họ và Tên</label>
                        <div>NGUYEN THUC ANH</div>
                    </div>
                    {/* <input type="text" className="form-input" value={name} onChange={onChangeFactory(setName)} /> */}
                </div>

                <div className="form-row">
                    <div className="label-section">
                        <label className="form-label">Số điện thoại</label>
                        <div>123456789</div>
                    </div>
                    {/* <input type="tel" className="form-input" value={phone} onChange={onChangeFactory(setPhone)} /> */}
                </div>

                <div className="form-row">
                    <div className="label-section">
                        <label className="form-label">E-mail</label>
                        <div>@gmail.com</div>
                    </div>
                    {/* <input type="email" className="form-input" value={email} onChange={onChangeFactory(setEmail)} /> */}
                </div>
            </div>
        </DropdownSection>
    );
}
