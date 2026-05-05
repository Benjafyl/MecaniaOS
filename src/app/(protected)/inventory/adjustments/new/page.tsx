import { redirect } from "next/navigation";

export default function NewInventoryAdjustmentRedirectPage() {
  redirect("/inventory/stock/new");
}
