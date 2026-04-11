import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import "dotenv/config";
import fs from "fs";
import path from "path";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function deleteAllData() {
    // Use TRUNCATE with RESTART IDENTITY to reset autoincrement counters
    // This ensures IDs start from 1 again, matching the seed data FK references
    const tableNames = [
        '"TaskAssignment"',
        '"Attachment"',
        '"Comment"',
        '"Task"',
        '"ProjectTeam"',
        '"User"',
        '"Project"',
        '"Team"',
    ];

    for (const table of tableNames) {
        try {
            await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${table} RESTART IDENTITY CASCADE`);
            console.log(`Cleared data from ${table}`);
        } catch (error: any) {
            console.error(`Error clearing ${table}:`, error.message);
        }
    }
}

async function main() {
    const dataDirectory = path.join(__dirname, "seedData");

    // Seed order: respect FK dependencies
    // 1. Team (no FKs)
    // 2. Project (no FKs)
    // 3. ProjectTeam (depends on Team, Project)
    // 4. User (depends on Team)
    // 5. Task (depends on Project, User)
    // 6. Attachment (depends on Task, User)
    // 7. Comment (depends on Task, User)
    // 8. TaskAssignment (depends on Task, User)
    const orderedFileNames = [
        "team.json",
        "project.json",
        "projectTeam.json",
        "user.json",
        "task.json",
        "attachment.json",
        "comment.json",
        "taskAssignment.json",
    ];

    console.log("Deleting existing data...");
    await deleteAllData();

    console.log("\nSeeding data...");
    for (const fileName of orderedFileNames) {
        const filePath = path.join(dataDirectory, fileName);
        if (!fs.existsSync(filePath)) {
            console.warn(`File not found: ${filePath}, skipping.`);
            continue;
        }
        const jsonData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
        const modelName = path.basename(fileName, path.extname(fileName));
        const model: any = prisma[modelName as keyof typeof prisma];

        if (!model || typeof model.create !== "function") {
            console.warn(`Model ${modelName} not found on prisma client, skipping seed.`);
            continue;
        }

        try {
            for (const data of jsonData) {
                await model.create({ data });
            }
            console.log(`Seeded ${modelName} with ${jsonData.length} records from ${fileName}`);
        } catch (error: any) {
            console.error(`Error seeding data for ${modelName}:`, error.message);
        }
    }
    console.log("\nSeeding complete!");
}

main()
    .catch((e) => console.error("Fatal error:", e))
    .finally(async () => {
        await prisma.$disconnect();
        await pool.end();
    });