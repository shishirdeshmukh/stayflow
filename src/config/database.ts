import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import logger from "../utils/logger";

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

const createPrismaClient = () => {
    const adapter = new PrismaPg({
        connectionString: process.env.DATABASE_URL as string,
    });

    const client = new PrismaClient({
        adapter,
        log: [
            { emit: "event", level: "query" },
            { emit: "event", level: "error" },
            { emit: "event", level: "warn" },
        ],
    });

    // Development mein queries log karo
    if (process.env.NODE_ENV === "development") {
        client.$on("query", (e: { query: string; duration: number }) => {
            logger.debug(`Query: ${e.query}`);
            logger.debug(`Duration: ${e.duration}ms`);
        });
    }

    client.$on("error", (e: any) => {
        logger.error(`Prisma Error: ${e.message}`);
    });

    return client;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}

export default prisma;
