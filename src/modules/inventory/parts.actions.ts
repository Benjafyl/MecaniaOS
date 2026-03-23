"use server";

import { revalidatePath } from "next/cache";
import { PrismaClient } from "@prisma/client";
import { adjustStockSchema, createPartSchema, type AdjustStockInput, type CreatePartInput } from "./part.schema";

const prisma = new PrismaClient();

export async function getParts() {
  try {
    const parts = await prisma.part.findMany({
      orderBy: { name: "asc" },
    });
    return { success: true, data: parts };
  } catch (error) {
    console.error("Error al obtener repuestos:", error);
    return { success: false, error: "Error al obtener repuestos" };
  }
}

export async function adjustPartStock(input: AdjustStockInput) {
  try {
    const parsed = adjustStockSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: "Datos de ajuste inválidos" };
    }

    const { partId, quantity } = parsed.data;

    // Utilize Prisma's native increment functionality
    let updated = await prisma.part.update({
      where: { id: partId },
      data: {
        stock: {
          increment: quantity,
        },
      },
    });

    // Guard against negative stock values
    if (updated.stock < 0) {
      updated = await prisma.part.update({
        where: { id: partId },
        data: { stock: 0 },
      });
    }

    // Revalidate paths where inventory is displayed
    revalidatePath("/inventory"); 
    return { success: true, data: updated };
  } catch (error) {
    console.error("Error al ajustar el stock:", error);
    return { success: false, error: "No se pudo actualizar el inventario" };
  }
}

export async function createPart(input: CreatePartInput) {
  try {
    const parsed = createPartSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: "Datos del repuesto inválidos" };
    }

    const newPart = await prisma.part.create({
      data: parsed.data,
    });

    revalidatePath("/inventory");
    return { success: true, data: newPart };
  } catch (error) {
    console.error("Error al crear repuesto:", error);
    return { success: false, error: "No se pudo crear el repuesto" };
  }
}
