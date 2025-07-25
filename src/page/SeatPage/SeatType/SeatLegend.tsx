import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import seatmapRaw from "@/data/seatmap.json";

type TicketType = {
    nameVi: string;
    price: number;
    colorCode: string;
};

const SeatLegend: React.FC = () => {
    const [ticketTypes, setTicketTypes] = useState<TicketType[]>([]);
    const {t} = useTranslation("common");
    useEffect(() => {
        const types = seatmapRaw.ticketTypes;
        const mapped = types.map((type: any) => ({
            nameVi: type.nameVi,
            price: type.price,
            colorCode: type.colorCode,
        }));
        setTicketTypes(mapped);
    }, []);

    return (
        <div className="seatsection">
            {ticketTypes.map((type, idx) => (
                <div key={idx}>
                    <div className="seattype">
                        <div
                            style={{
                                width: 14,
                                height: 14,
                                backgroundColor: type.colorCode,
                                borderRadius: 5,
                                border: "1px solid #ccc",
                            }}
                        ></div>
                        <div style={{fontWeight: "bold", fontSize: "0.8rem"}}>
                            {t(`ticketType.${type.nameVi}`, type.nameVi)}
                        </div>
                    </div>
                    <div style={{color: "#999", fontSize: "0.75rem"}}>{type.price.toLocaleString()} đ</div>
                </div>
            ))}
        </div>
    );
};

export default SeatLegend;
