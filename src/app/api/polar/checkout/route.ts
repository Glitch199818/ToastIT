import { NextRequest, NextResponse } from "next/server";
import { polar, PRODUCTS } from "@/lib/polar";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { plan } = await req.json();
  const productId = plan === "lifetime" ? PRODUCTS.lifetime : PRODUCTS.monthly;

  const checkout = await polar.checkouts.create({
    products: [productId],
    successUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/create?upgraded=true`,
    customerEmail: user.email,
    metadata: {
      supabase_user_id: user.id,
    },
  });

  return NextResponse.json({ url: checkout.url });
}
