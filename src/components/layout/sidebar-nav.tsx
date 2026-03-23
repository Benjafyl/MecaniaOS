"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const links = [
  { href: "/dashboard", label: "Panel" },
  { href: "/clients", label: "Clientes" },
  { href: "/vehicles", label: "Vehiculos" },
  { href: "/self-inspections", label: "Autoinspecciones" },
  { href: "/work-orders", label: "Ordenes" },
  { href: "/inventory", label: "Inventario" },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="space-y-2">
      {links.map((link) => {
        const active = pathname.startsWith(link.href);

        return (
          <Link
            className={cn(
              "flex w-full items-center rounded-xl border px-4 py-3 text-sm font-medium transition-colors",
              active
                ? "border-[#4d6d99] bg-[#27466f] !text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
                : "border-transparent !text-[#d7e5fb] hover:border-[#35567f] hover:bg-[#183557] hover:!text-white",
            )}
            href={link.href}
            key={link.href}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
