import React, {useCallback, memo} from "react";
import {useNavigate, useMatches} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {PiDotsThreeOutlineFill} from "react-icons/pi";
import Icon from "@/assets/icons/Icon";
import LanguageSwitcher from "./LanguageSwitcher";

type IconClickProps = {onClick?: () => void};

const BackIcon = memo(({onClick}: IconClickProps) => (
    <div className="backIcon" style={{cursor: "pointer"}} onClick={onClick}>
        <Icon name="back" />
    </div>
));

const DotsIcon = memo(() => (
    <div className="threedots">
        <PiDotsThreeOutlineFill color="#fff" />
    </div>
));

const CloseIcon = memo(({onClick}: IconClickProps) => (
    <div className="rightCloseIcon" style={{cursor: onClick ? "pointer" : "default"}} onClick={onClick}>
        <Icon name="close" />
    </div>
));

interface TitleProps {
    title: string;
}

const Title = memo(({title}: TitleProps) => <div className="header-title">{title}</div>);

const Header: React.FC = () => {
    const navigate = useNavigate();
    const matches = useMatches();
    const {t} = useTranslation();

    const handleBack = useCallback(() => {
        navigate(-1);
    }, [navigate]);

    // === Lấy title từ handle.titleKey hoặc handle.title ===
    let title = "";
    for (let i = matches.length - 1; i >= 0; i--) {
        const match = matches[i];
        const handle = match?.handle as {title?: string; titleKey?: string};

        if (handle?.titleKey) {
            title = t(handle.titleKey);
            break;
        }

        if (handle?.title) {
            title = handle.title;
            break;
        }
    }

    // Fallback cuối cùng từ document.title nếu không có gì
    if (!title) {
        title = document.title;
    }

    return (
        <div className="header">
            <BackIcon onClick={handleBack} />
            <div className="textAndControl">
                <Title title={title} />
                <div style={{display: "flex", alignItems: "center", gap: "8px"}}>
                    <LanguageSwitcher />
                    <div className="inlineControl">
                        <DotsIcon />
                        <div className="divider">|</div>
                        <CloseIcon />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;
