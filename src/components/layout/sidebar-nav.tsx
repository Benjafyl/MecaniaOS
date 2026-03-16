"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const links = [
  { href: "/dashboard", label: "Panel" },
  { href: "/clients", label: "Clientes" },
  { href: "/vehicles", label: "Vehiculos" },
  { href: "/work-orders", label: "Ordenes" },
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
              "flex items-center rounded-2xl px-4 py-3 text-sm font-medium transition",
              active
                ? "bg-[color:var(--accent)] text-white shadow-[0_14px_30px_rgba(200,92,42,0.28)]"
                : "text-[color:var(--muted-strong)] hover:bg-white/80 hover:text-[color:var(--foreground)]",
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
