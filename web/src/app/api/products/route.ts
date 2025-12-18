import { NextResponse } from "next/server";
import { getAllProducts } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/__nextauth/authOptions";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const products = await getAllProducts();
  return NextResponse.json(products);
}