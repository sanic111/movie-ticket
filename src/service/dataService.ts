import promotionRaw from "@/data/promotion.json";
import seatmapRaw from "@/data/seatmap.json";

export async function loadPromotions() {
  const promotions = promotionRaw.data.json.data.promotions;
  return promotions;
}

export async function loadSeatMap() {
  const seatMap = seatmapRaw;
  return seatMap;
}
