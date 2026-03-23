import { InventoryTable } from "@/modules/inventory/InventoryTable";
import { getParts, createPart } from "@/modules/inventory/parts.actions";
import { revalidatePath } from "next/cache";

export const metadata = {
  title: "Inventario de Repuestos | MecaniaOS",
};

export default async function InventoryPage() {
  const { data: parts = [] } = await getParts();

  async function handleAddPart(formData: FormData) {
    "use server";
    const code = formData.get("code") as string;
    const name = formData.get("name") as string;
    const minStock = Number(formData.get("minStock") || 0);

    // Simple create for demonstration
    await createPart({ 
      code, 
      name, 
      minStock, 
      stock: 0 
    });
    revalidatePath("/inventory");
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Inventario de Repuestos</h1>
          <p className="text-gray-500">Gestiona las existencias y recibe alertas tempranas de stock.</p>
        </div>
        
        {/* Simple inline form for the MVP */}
        <form action={handleAddPart} className="flex flex-wrap gap-2 items-end bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
          <div>
            <label className="block text-xs text-gray-500 mb-1 font-medium">Código</label>
            <input name="code" required placeholder="Ej. FIL-01" className="w-24 px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1 font-medium">Repuesto</label>
            <input name="name" required placeholder="Filtro de Aceite" className="w-40 px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1 font-medium">Mínimo</label>
            <input name="minStock" type="number" required defaultValue="5" min="0" className="w-20 px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <button type="submit" className="px-4 py-1.5 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors shadow-sm">
            Nuevo
          </button>
        </form>
      </div>

      <InventoryTable parts={parts || []} />
    </div>
  );
}
