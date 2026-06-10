import { NextRequest, NextResponse } from "next/server";
import { auth } from "~/server/auth";
import { headers } from "next/headers";
import { getPresignedUrl, type UploadCategory } from "~/lib/r2";

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { category, fileType } = body as {
      category: UploadCategory;
      fileType: string;
    };

    if (!category || !fileType) {
      return NextResponse.json(
        { error: "Missing category or fileType" },
        { status: 400 },
      );
    }

    const { uploadUrl, publicUrl, key } = await getPresignedUrl(category, fileType);

    return NextResponse.json({ uploadUrl, publicUrl, key });
  } catch (error) {
    console.error("POST /api/upload error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
