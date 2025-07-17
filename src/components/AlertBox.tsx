    import React, {useEffect, useState} from "react";

interface Props {
    message: string;
    onClose: () => void;
}

const AlertBox: React.FC<Props> = ({message, onClose}) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        setVisible(true);
        const timeout = setTimeout(() => {
            setVisible(false);
            setTimeout(onClose, 300); // chờ animation fade-out
        }, 1500);

        return () => clearTimeout(timeout);
    }, [onClose]);

    return (
        <div className={`alert-box ${visible ? "show" : "hide"}`}>
            {message}
        </div>
    );
};

export default AlertBox;
