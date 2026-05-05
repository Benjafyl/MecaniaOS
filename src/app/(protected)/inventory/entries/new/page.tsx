import { redirect } from "next/navigation";

export default function NewInventoryEntryRedirectPage() {
  redirect("/inventory/stock/new");
}
