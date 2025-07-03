import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import type {SeatType} from "@/data/seat";
import Icon from "@/assets/icons/Icon";

export interface SelectedSeatsDropdownHandle {
  updateFromRef: () => void;
}

interface SelectedSeatsDropdownProps {
  selectedSeatsRef: React.RefObject<SeatType[]>;
  onRemoveSeat: (seat: SeatType) => void;
}

const SelectedSeatsDropdown = forwardRef<
  SelectedSeatsDropdownHandle,
  SelectedSeatsDropdownProps
>(({selectedSeatsRef, onRemoveSeat}, ref) => {
  const [selectedSeats, setSelectedSeats] = useState<SeatType[]>([]);
  const [isOpen, setOpen] = useState<boolean>(false);

  // Ref để chứa ul
  const containerRef = useRef<HTMLUListElement>(null);
  // Ref lưu vị trí cũ
  const positionsRef = useRef<Map<string, DOMRect>>(new Map());

  const updateFromRef = () => {
    setSelectedSeats(
      [...selectedSeatsRef.current!].sort((a, b) =>
        a.code.localeCompare(b.code, "vi", {numeric: true})
      )
    );
  };

  useImperativeHandle(ref, () => ({
    updateFromRef,
  }));

  useEffect(() => {
    updateFromRef();
  }, []);

  const toggleOpen = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  //  Bước core: FLIP animation khi danh sách thay đổi
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Lưu FIRST positions
    const newPositions = new Map<string, DOMRect>();
    container.childNodes.forEach((node) => {
      const el = node as HTMLElement;
      if (el.dataset.id) {
        newPositions.set(el.dataset.id, el.getBoundingClientRect());
      }
    });

    // Compare với positionsRef (cũ)
    newPositions.forEach((newRect, id) => {
      const prevRect = positionsRef.current.get(id);
      if (!prevRect) return;

      const dx = prevRect.left - newRect.left;
      const dy = prevRect.top - newRect.top;

      if (dx !== 0 || dy !== 0) {
        const el = container.querySelector(`[data-id="${id}"]`) as HTMLElement;
        if (!el) return;

        // Invert
        el.style.transform = `translate(${dx}px, ${dy}px)`;
        el.style.transition = "transform 0s";

        // Play
        requestAnimationFrame(() => {
          el.style.transform = "";
          el.style.transition = "transform 300ms ease";
        });
      }
    });

    // Update positionsRef
    positionsRef.current = newPositions;
  }, [selectedSeats]);

  // Icon component
  const DropdownDownIcon = React.memo(() => (
    <div style={{display: "flex", justifyContent: "center"}}>
      <Icon name="dropdownDown" />
    </div>
  ));

  const DropdownUpIcon = React.memo(() => (
    <div style={{display: "flex", justifyContent: "center"}}>
      <Icon name="dropdownUp" />
    </div>
  ));

  if (selectedSeats.length === 0) {
    return null;
  }

  return (
    <div className="selected-seats-dropdown">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          marginBottom: isOpen ? "0" : "50px",
          padding: "5px 5px 0 20px",
        }}
      >
        <div>
          <div style={{fontWeight: "bold", fontSize: "1rem"}}>
            Danh sách ghế đã chọn ({selectedSeats.length})
          </div>
          <div style={{color: "#999"}}>
            Chỉnh sửa vị trí ghế bên trên hoặc tại đây
          </div>
        </div>
        <button onClick={toggleOpen}>
          {isOpen ? <DropdownDownIcon /> : <DropdownUpIcon />}
        </button>
      </div>

      {isOpen && (
        <div className="dropdown-menu">
          <ul className="seat-list" ref={containerRef}>
            {selectedSeats.map((seat) => (
              <li
                key={seat.seatId}
                data-id={seat.seatId}
                className="seat-card"
              >
                <div
                  className="seat-box"
                  style={{backgroundColor: seat.color}}
                >
                  <span className="seat-text">Ghế {seat.code}</span>
                  <span className="seat-price">
                    {(typeof seat.price === "string"
                      ? parseInt(seat.price)
                      : seat.price
                    ).toLocaleString()}{" "}
                    VND
                  </span>
                  <button
                    className="remove-btn"
                    onClick={() => onRemoveSeat(seat)}
                  >
                    ×
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
});

export default SelectedSeatsDropdown;
