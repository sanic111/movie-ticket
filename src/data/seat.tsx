import i18n from "@/i18n";

export type SeatType = {
    seatId: string; //"22831385";
    status: number; //0;
    arrRowIndex: string; //"0";
    arrColIndex: string; //"0";
    code: string; //"A12";
    price: string; //"75000";
    originalPrice: string; //"75000";
    ishow_orgPrice: string; //"1", "0"
    area_id: string; //"0";
    type: number; //0;
    seatVendorId: string; //"1319421638";
    ticketTypeId: string;

    isSelected: boolean;
    coupleTag: string;
    isEnable: boolean;
    color: string;
    des: string;
};

export class MV3_SEAT_STATUS {
    public static SEAT_STATUS_TRONG = 0; //0: trống
    public static SEAT_STATUS_DA_BAN_HOAC_CHUA_MO_BAN = 1; //1: đã bán hoặc chưa mở bán
    public static SEAT_STATUS_KHONG_MO_BAN = 2; //2: không mở bán
}

//0 - Normal, 1 - VIP, 2 - Couple, 3 - Couple Pack, 5 - Deluxe, 9 khoảng trống, 10 - Row Title, 11 - cửa vào ra, 12 - lối đi
export class MV3_SEAT {
    public static NORMAL = 0;
    public static VIP = 1;
    public static COUPLE = 2;
    public static COUPLE_PACK = 3;
    public static DELUXE = 5;
    public static FIRST_CLASS = 6;
    public static SOFA = 7;
    public static SPACE = 8;
    public static ROW_TITLE = 10;
    public static ENTRANCE_EXIT = 11;
    public static AISLE = 12;
}

export class MV3_AREAID {
    public static COUPLE = "4";
}

export const _validateSeatAllowSelect = (seatObj: SeatType): boolean => {
    if (!_validateSeatIsBooked(seatObj) && _validateIsSeat(seatObj)) {
        return true;
    } else {
        return false;
    }
};

export const _validateIsSeat = (seatObj: SeatType): boolean => {
    if (
        seatObj.type == MV3_SEAT.NORMAL ||
        seatObj.type == MV3_SEAT.VIP ||
        seatObj.type == MV3_SEAT.COUPLE ||
        seatObj.type == MV3_SEAT.COUPLE_PACK ||
        seatObj.type == MV3_SEAT.DELUXE ||
        seatObj.type == MV3_SEAT.FIRST_CLASS ||
        seatObj.type == MV3_SEAT.SOFA
    ) {
        return true;
    } else {
        return false;
    }
};

export const _validateSeatIsBooked = (seatObj: SeatType): boolean => {
    if (seatObj.status == MV3_SEAT_STATUS.SEAT_STATUS_TRONG) {
        return false;
    } else {
        return true;
    }
};

export const _validateIsCouple = (seatObj: SeatType): boolean => {
    return seatObj.type == MV3_SEAT.COUPLE || seatObj.type == MV3_SEAT.COUPLE_PACK;
};

/**
 * Kiểm tra danh sách ghế đã chọn có hợp lệ không.
 * @param selectedSeats - Mảng ghế đang chọn
 * @param seatRows - Toàn bộ danh sách ghế theo hàng
 * @returns null nếu hợp lệ, hoặc object chứa message + ghế cần highlight
 */
export function validateSeatSelection(
  selectedSeats: SeatType[],
  seatRows: SeatType[][]
):
  | null
  | {
      message: string;
      seatIdsToHighlight: string[];
    } {
  for (const row of seatRows) {
    const rowSeatMap: Record<number, boolean> = {};
    row.forEach((s) => {
      const idx = parseInt(s.arrColIndex);
      rowSeatMap[idx] = selectedSeats.some((sel) => sel.seatId === s.seatId);
    });

    const indices = Object.keys(rowSeatMap)
      .map(Number)
      .sort((a, b) => a - b);

    // Kiểm tra trống 1 ghế giữa
    for (let i = 0; i < indices.length - 2; i++) {
      const idx1 = indices[i];
      const idx2 = indices[i + 1];
      const idx3 = indices[i + 2];
      if (rowSeatMap[idx1] && !rowSeatMap[idx2] && rowSeatMap[idx3]) {
        const seatInMiddle = row.find(
          (s) => parseInt(s.arrColIndex) === idx2
        );
        return {
          message: i18n.t("seatValidation.leaveGapInMiddle"),
          seatIdsToHighlight: seatInMiddle ? [seatInMiddle.seatId] : [],
        };
      }
    }

    // Kiểm tra ghế sát cuối mà không chọn ghế cuối
    const maxIdx = Math.max(...indices);
    if (rowSeatMap[maxIdx - 1] && !rowSeatMap[maxIdx]) {
      const seatAtEnd = row.find(
        (s) => parseInt(s.arrColIndex) === maxIdx
      );
      return {
        message: i18n.t("seatValidation.mustPickLastSeat"),
        seatIdsToHighlight: seatAtEnd ? [seatAtEnd.seatId] : [],
      };
    }
  }

  return null;
}
