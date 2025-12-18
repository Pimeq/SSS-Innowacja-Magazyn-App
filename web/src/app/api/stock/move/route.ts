import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/__nextauth/authOptions";
import { processStockMovement } from "@/lib/db";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { type, productId, quantity, fromLocationId, toLocationId } = body;

    if (!type || !productId || !quantity) {
      return NextResponse.json({ message: "Brak wymaganych danych" }, { status: 400 });
    }

    const result = await processStockMovement(
      parseInt(session.user.id),
      type,
      parseInt(productId),
      parseInt(quantity),
      fromLocationId ? parseInt(fromLocationId) : null,
      toLocationId ? parseInt(toLocationId) : null
    );

    if (!result.success) {
      return NextResponse.json({ message: result.message }, { status: 400 });
    }

    return NextResponse.json({ message: result.message }, { status: 200 });

  } catch (error) {
    console.error("API Stock Move Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}