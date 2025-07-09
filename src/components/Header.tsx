import React, {useCallback, memo} from "react";
import {useNavigate, useMatches} from "react-router-dom";
import {PiDotsThreeOutlineFill} from "react-icons/pi";
import Icon from "@/assets/icons/Icon";

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

    const handleBack = useCallback(() => {
        navigate(-1);
    }, [navigate]);

    let title = "";
    for (let i = matches.length - 1; i >= 0; i--) {
        const m = matches[i];
        if (m.data && (m.data as any).title) {
            title = (m.data as any).title;
            break;
        }
        if (m.handle && (m.handle as any).title) {
            title = (m.handle as any).title;
            break;
        }
    }

    return (
        <div className="header">
            <BackIcon onClick={handleBack} />
            <div className="textAndControl">
                <Title title={title} />
                <div className="inlineControl">
                    <DotsIcon />
                    <div className="divider">|</div>
                    <CloseIcon />
                </div>
            </div>
        </div>
    );
};

export default Header;
