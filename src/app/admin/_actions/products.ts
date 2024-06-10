"use server";

import db from "@/db/db";
import { z } from "zod";
import { put, del } from "@vercel/blob";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

const fileSchema = z.instanceof(File, { message: "Required" });
const imageSchema = fileSchema.refine(
	(file) => file.size === 0 || file.type.startsWith("image/")
);

const addSchema = z.object({
	name: z.string().min(1),
	description: z.string().min(1),
	priceInCents: z.coerce.number().int().min(1),
	file: fileSchema.refine((file) => file.size > 0, "Required"),
	image: imageSchema.refine((file) => file.size > 0, "Required"),
});

export async function addProduct(prevState: unknown, formData: FormData) {
	const result = addSchema.safeParse(Object.fromEntries(formData.entries()));
	if (result.success === false) {
		return result.error.formErrors.fieldErrors;
	}

	const data = result.data;

	const filePath = `products/${data.file.name}`;
	const fileBlob = await put(
		filePath,
		Buffer.from(await data.file.arrayBuffer()),
		{
			access: "public",
		}
	);
	const fileURL = fileBlob.url;

	const imagePath = `/products/${data.image.name}`;
	const imageBlob = await put(
		`public${imagePath}`,
		Buffer.from(await data.image.arrayBuffer()),
		{
			access: "public",
		}
	);
	const imageURL = imageBlob.url;

	await db.product.create({
		data: {
			isAvailableForPurchase: false,
			name: data.name,
			description: data.description,
			priceInCents: data.priceInCents,
			filePath: fileURL,
			imagePath: imageURL,
		},
	});

	revalidatePath("/");
	revalidatePath("/products");
	redirect("/admin/products");
}

const editSchema = addSchema.extend({
	file: fileSchema.optional(),
	image: imageSchema.optional(),
});

export async function updateProduct(
	id: string,
	prevState: unknown,
	formData: FormData
) {
	const result = editSchema.safeParse(Object.fromEntries(formData.entries()));
	if (result.success === false) {
		return result.error.formErrors.fieldErrors;
	}

	const data = result.data;
	const product = await db.product.findUnique({ where: { id } });

	if (product === null) return notFound();

	let fileURL, imageURL;

	if (data.file != null && data.file.size > 0) {
		await del(product.filePath);
		const fileBlob = await put(
			`products/${data.file.name}`,
			Buffer.from(await data.file.arrayBuffer()),
			{
				access: "public",
			}
		);

		fileURL = fileBlob.url;
	}

	if (data.image != null && data.image.size > 0) {
		await del(product.imagePath);
		const imageBlob = await put(
			`public/products/${data.image.name}`,
			Buffer.from(await data.image.arrayBuffer()),
			{
				access: "public",
			}
		);

		imageURL = imageBlob.url;
	}

	await db.product.update({
		where: { id },
		data: {
			name: data.name,
			description: data.description,
			priceInCents: data.priceInCents,
			filePath: fileURL,
			imagePath: imageURL,
		},
	});

	revalidatePath("/");
	revalidatePath("/products");
	redirect("/admin/products");
}

export async function toggleProductAvailability(
	id: string,
	isAvailableForPurchase: boolean
) {
	await db.product.update({ where: { id }, data: { isAvailableForPurchase } });
	revalidatePath("/");
	revalidatePath("/products");
}

export async function deleteProduct(id: string) {
	const product = await db.product.delete({ where: { id } });

	if (product === null) return notFound();

	await del(product.filePath);
	await del(product.imagePath);

	revalidatePath("/");
	revalidatePath("/products");
}
