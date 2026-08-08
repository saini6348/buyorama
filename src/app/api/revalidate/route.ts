import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

/**
 * On-demand ISR webhook — target for a future headless-CMS publish hook.
 * Protected by REVALIDATE_SECRET so it isn't an open cache-buster.
 */
export async function POST(request: Request) {
  const url = new URL(request.url);
  const secret = request.headers.get("x-revalidate-secret") ?? url.searchParams.get("secret");

  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ revalidated: false, message: "Invalid or missing secret." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const path = body?.path;

  if (!path || typeof path !== "string") {
    return NextResponse.json({ revalidated: false, message: "Missing 'path' in request body." }, { status: 400 });
  }

  revalidatePath(path);
  return NextResponse.json({ revalidated: true, path });
}
