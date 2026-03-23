"use client";

import { useState, useTransition } from "react";
import { adjustPartStock } from "./parts.actions";

type Part = {
  id: string;
  code: string;
  name: string;
  stock: number;
  minStock: number;
  description: string | null;
  price: number | null;
};

export function InventoryTable({ parts }: { parts: Part[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm bg-white">
      <table className="w-full text-sm text-left text-gray-600">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
          <tr>
            <th scope="col" className="px-6 py-4 font-semibold">Código</th>
            <th scope="col" className="px-6 py-4 font-semibold">Repuesto</th>
            <th scope="col" className="px-6 py-4 font-semibold text-center">Stock Mín.</th>
            <th scope="col" className="px-6 py-4 font-semibold text-center">Stock Actual</th>
            <th scope="col" className="px-6 py-4 font-semibold text-center">Ajuste Manual</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {parts.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-6 py-10 text-center text-gray-400">
                <div className="flex flex-col items-center justify-center gap-2">
                  <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                  <p>No hay repuestos registrados en el inventario.</p>
                </div>
              </td>
            </tr>
          ) : (
            parts.map((part) => (
              <InventoryRow key={part.id} part={part} />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function InventoryRow({ part }: { part: Part }) {
  const isLowStock = part.stock <= part.minStock;
  const [isPending, startTransition] = useTransition();
  const [amount, setAmount] = useState<number | "">("");

  const handleAdjust = (type: "add" | "remove") => {
    if (amount === "" || Number(amount) <= 0) return;
    
    // Add or remove quantity based on button pressed
    const quantity = type === "add" ? Number(amount) : -Number(amount);
    
    startTransition(async () => {
      const res = await adjustPartStock({ partId: part.id, quantity });
      if (res.success) {
        setAmount(""); // reset input on success
      } else {
        alert(res.error || "Upps, error al actualizar el stock");
      }
    });
  };

  return (
    <tr className={`hover:bg-gray-50/70 transition-colors ${isLowStock ? "bg-red-50/20" : "bg-white"}`}>
      <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
        <span className="bg-gray-100 text-gray-700 py-1 px-2 rounded font-mono text-xs">{part.code}</span>
      </td>
      <td className="px-6 py-4">
        <div>
          <p className="font-semibold text-gray-800">{part.name}</p>
          {part.description && <p className="text-xs text-gray-500 mt-0.5">{part.description}</p>}
        </div>
      </td>
      <td className="px-6 py-4 text-center">
        <span className="text-gray-500">{part.minStock}</span>
      </td>
      <td className="px-6 py-4 text-center">
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${isLowStock ? "bg-red-100 text-red-800 border-red-200" : "bg-emerald-100 text-emerald-800 border-emerald-200"}`}>
          {isLowStock && (
            <svg className="w-3.5 h-3.5 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          )}
          {part.stock} unid.
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center justify-center gap-2">
          <input
            type="number"
            min="1"
            value={amount}
            onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : "")}
            disabled={isPending}
            placeholder="Cant."
            className="w-16 px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all disabled:opacity-50 disabled:bg-gray-100"
          />
          <button
            onClick={() => handleAdjust("remove")}
            disabled={isPending || amount === ""}
            className="p-1.5 rounded bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 transition-colors border border-gray-200"
            title="Descontar stock"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" /></svg>
          </button>
          <button
            onClick={() => handleAdjust("add")}
            disabled={isPending || amount === ""}
            className="p-1.5 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 disabled:opacity-50 transition-colors border border-blue-200"
            title="Añadir stock"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
          </button>
        </div>
      </td>
    </tr>
  );
}
