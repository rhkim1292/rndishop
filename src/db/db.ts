import { PrismaClient } from "@prisma/client";

/**
 * Creates and returns a singleton instance of the PrismaClient.
 *
 * @return {PrismaClient} The PrismaClient instance.
 */
const prismaClientSingleton = () => {
	return new PrismaClient();
};

declare const globalThis: {
	prisma: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const db = globalThis.prisma ?? prismaClientSingleton();

export default db;

if (process.env.NODE_ENV !== "production") globalThis.prisma = db;
