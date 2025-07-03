import React from "react";
import rawSeatmap from "@/data/seatmap.json";

interface TicketType {
  id: number;
  nameVi: string;
  price: number;
  colorCode: string;
}

// Pre-compute once ngoài component
const ticketTypes: TicketType[] = rawSeatmap.ticketTypes.map((t) => ({
  id: t.id,
  nameVi: t.nameVi,
  price: t.price,
  colorCode: t.colorCode,
}));

const SeatLegend: React.FC = () => {
  return (
    <div className="seat-legend">
      {ticketTypes.map((type) => (
        <div key={type.id} className="legend-item">
          <span
            className="legend-color"
            style={{ backgroundColor: type.colorCode }}
          />
          <span className="legend-label">
            {type.nameVi} ({type.price.toLocaleString()} đ)
          </span>
        </div>
      ))}
    </div>
  );
};

export default SeatLegend;
