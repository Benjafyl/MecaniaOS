"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

type InventoryFiltersProps = {
  q?: string;
  lowStock?: string;
};

export function InventoryFilters({ q, lowStock }: InventoryFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState(q ?? "");
  const [stockFilter, setStockFilter] = useState(lowStock ?? "");

  useEffect(() => {
    setQuery(q ?? "");
  }, [q]);

  useEffect(() => {
    setStockFilter(lowStock ?? "");
  }, [lowStock]);

  function navigate(nextQuery: string, nextLowStock: string) {
    const params = new URLSearchParams();

    if (nextQuery.trim()) {
      params.set("q", nextQuery.trim());
    }

    if (nextLowStock) {
      params.set("lowStock", nextLowStock);
    }

    const href = params.size > 0 ? `${pathname}?${params.toString()}` : pathname;

    startTransition(() => {
      router.replace(href);
    });
  }

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      if (query === (q ?? "")) {
        return;
      }

      navigate(query, stockFilter);
    }, 250);

    return () => window.clearTimeout(timeoutId);
  }, [q, query, stockFilter]);

  return (
    <div
      aria-busy={isPending}
      className="flex flex-col gap-3 md:flex-row xl:flex-nowrap"
    >
      <Input
        className="xl:min-w-[260px]"
        name="q"
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Buscar por nombre o codigo"
        value={query}
      />
      <Select
        className="xl:min-w-[200px]"
        name="lowStock"
        onChange={(event) => {
          const nextLowStock = event.target.value;
          setStockFilter(nextLowStock);
          navigate(query, nextLowStock);
        }}
        value={stockFilter}
      >
        <option value="">Todo el inventario</option>
        <option value="1">Solo stock bajo</option>
      </Select>
    </div>
  );
}
