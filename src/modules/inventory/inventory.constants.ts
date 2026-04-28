import { StockMovementType } from "@prisma/client";

export const STOCK_MOVEMENT_TYPE_LABELS: Record<StockMovementType, string> = {
  [StockMovementType.INITIAL]: "Stock inicial",
  [StockMovementType.ENTRY]: "Ingreso",
  [StockMovementType.OUT]: "Consumo",
  [StockMovementType.ADJUSTMENT]: "Ajuste",
};
