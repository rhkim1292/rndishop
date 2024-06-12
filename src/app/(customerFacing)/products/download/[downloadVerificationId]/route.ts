import db from "@/db/db";
import { NextRequest, NextResponse } from "next/server";
import { head } from "@vercel/blob";

export async function GET(
	req: NextRequest,
	{
		params: { downloadVerificationId },
	}: { params: { downloadVerificationId: string } }
) {
	const data = await db.downloadVerification.findUnique({
		where: { id: downloadVerificationId, expiresAt: { gt: new Date() } },
		select: { product: { select: { filePath: true, name: true } } },
	});

	if (data == null) {
		return NextResponse.redirect(
			new URL("/products/download/expired", req.url)
		);
	}

	const extension = data.product.filePath.split(".").pop();
	const blobDetails = await head(data.product.filePath);
	const { downloadUrl } = blobDetails;
	const res = await fetch(downloadUrl);
	const blob = await res.blob();
	const { size, type } = blob;
	const file = await blob.arrayBuffer();

	return new NextResponse(file, {
		headers: {
			"Content-Disposition": `attachment; filename="${data.product.name}.${extension}"`,
			"Content-Length": size.toString(),
		},
	});
}
