import type { IconName } from "@/assets/icons/icon.types";
import ClearVoucher from "@/assets/icons/ic_clear_voucher.svg?react";
import DropdownDown from "@/assets/icons/ic_dropdown_down.svg?react";
import DropdownUp from "@/assets/icons/ic_dropdown_up.svg?react";
import MultiUnselect from "@/assets/icons/ic_multi_unselect.svg?react";
import RemoveSeat from "@/assets/icons/ic_remove_seat.svg?react";
import ScreenSeatmap from "@/assets/icons/ic_screen_seatmap.svg?react";
import SeatSelectedPath from "@/assets/icons/ic_seat_selected_path.svg?react";
import SelectContact from "@/assets/icons/ic_select_contact.svg?react";
import TermChecked from "@/assets/icons/ic_term_checked.svg?react";
import VoucherNone from "@/assets/icons/ic_voucher_none.svg?react";
import Close from "@/assets/icons/ic_close.svg?react";
import Back from "@/assets/icons/ic_back.svg?react";

const icons = {
  clearVoucher: ClearVoucher,
  dropdownDown: DropdownDown,
  dropdownUp: DropdownUp,
  multiUnselect: MultiUnselect,
  removeSeat: RemoveSeat,
  screenSeatmap: ScreenSeatmap,
  seatSelectedPath: SeatSelectedPath,
  selectContact: SelectContact,
  termChecked: TermChecked,
  voucherNone: VoucherNone,
  close: Close,
  back: Back,
};

export default function Icon({
  name,
  className,
  style,
  onClick,
}: Readonly<{
  name: IconName;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}>) {
  const IconComponent = icons[name];
  return <IconComponent className={className} style={style} onClick={onClick} />;
}
