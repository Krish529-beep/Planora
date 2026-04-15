"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("../generated/prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = require("pg");
require("dotenv/config");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const pool = new pg_1.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new client_1.PrismaClient({ adapter });
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
        }
        catch (error) {
            console.error(`Error clearing ${table}:`, error.message);
        }
    }
}
async function main() {
    const dataDirectory = path_1.default.join(__dirname, "seedData");
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
        const filePath = path_1.default.join(dataDirectory, fileName);
        if (!fs_1.default.existsSync(filePath)) {
            console.warn(`File not found: ${filePath}, skipping.`);
            continue;
        }
        const jsonData = JSON.parse(fs_1.default.readFileSync(filePath, "utf-8"));
        const modelName = path_1.default.basename(fileName, path_1.default.extname(fileName));
        const model = prisma[modelName];
        if (!model || typeof model.create !== "function") {
            console.warn(`Model ${modelName} not found on prisma client, skipping seed.`);
            continue;
        }
        try {
            for (const data of jsonData) {
                await model.create({ data });
            }
            console.log(`Seeded ${modelName} with ${jsonData.length} records from ${fileName}`);
        }
        catch (error) {
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
//# sourceMappingURL=seed.js.map