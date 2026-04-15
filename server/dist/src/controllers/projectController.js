"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProject = exports.getProjects = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const getProjects = async (req, res) => {
    try {
        const projects = await prisma_1.default.project.findMany();
        res.json(projects);
    }
    catch (error) {
        res.status(500).json({ message: `error retriving projects ${error.message}` });
    }
};
exports.getProjects = getProjects;
const createProject = async (req, res) => {
    const { name, description, startDate, endDate } = req.body;
    try {
        const newProject = await prisma_1.default.project.create({
            data: {
                name,
                description,
                startDate,
                endDate
            }
        });
        res.status(201).json(newProject);
    }
    catch (error) {
        res.status(500).json({ message: `Error creating project ${error.message}` });
    }
};
exports.createProject = createProject;
//# sourceMappingURL=projectController.js.map