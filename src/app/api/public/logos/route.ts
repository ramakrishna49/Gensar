import { db } from "@/lib/db";
import { clientLogos } from "@/lib/db/schema";
import { NextResponse } from "next/server";
import { desc, eq, and } from "drizzle-orm";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const section = searchParams.get("section");

  const conditions = [eq(clientLogos.isActive, true)];
  if (section) conditions.push(eq(clientLogos.section, section));

  const result = await db
    .select()
    .from(clientLogos)
    .where(and(...conditions))
    .orderBy(desc(clientLogos.displayOrder), desc(clientLogos.createdAt));

  return NextResponse.json(result, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
    },
  });
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  } });
}
